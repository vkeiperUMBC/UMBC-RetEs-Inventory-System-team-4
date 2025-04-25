import sqlite3
from datetime import date
import pandas as pd  # Ensure pandas is installed for reading Excel files

# checks if able to connect to database
# if successful, establish cursor object to interact with db
# otherwise it will throw an error
def test_connection(conn, db_file):
    try:
        conn = sqlite3.connect(db_file)
        print("Connection successful!")
        return conn
    # error message stored within variable e
    except sqlite3.Error as e:
        print("Connection failed: {e}")
        return None

# states if table exists/creates one if necessary
def createCurrentDatabase(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS current_database (
            item_name TEXT PRIMARY KEY,
            storage_quantity INTEGER,
            serving_weight REAL,
            serving_amount INTEGER,
            max_weight REAL,
            max_amount INTEGER
        )
    ''')

# interprets an excel file and populates the table with the data
def createExcelDatabase(cursor, excel_file):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS current_database (
            item_name TEXT PRIMARY KEY,
            storage_quantity INTEGER,
            num_sold INTEGER,
            serving_weight REAL,
            serving_amount INTEGER,
            max_weight REAL,
            max_amount INTEGER
        )
    ''')
    
    # Read data from the Excel file and insert it into the database
    try:
        data = pd.read_excel(excel_file)
        for _, row in data.iterrows():
            cursor.execute('''
                INSERT OR IGNORE INTO current_database 
                (item_name, storage_quantity, serving_weight, serving_amount, max_weight, max_amount) 
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (row['item_name'], row['storage_quantity'], row['serving_weight'], 
                  row['serving_amount'], row['max_weight'], row['max_amount']))
        print("Data from Excel file has been added to 'current_database'.")
    except Exception as e:
        print(f"Failed to process Excel file, make sure it's in the correct format: {e}")

# interprets an excel file and adds the quantities to the current database, adds items that do not exist, and updates other values with the new values
def updateExcelDatabase(cursor, excel_file):
    # Read data from the Excel file and insert it into the database
    try:
        data = pd.read_excel(excel_file)
        for _, row in data.iterrows():
            cursor.execute('''
                INSERT INTO current_database 
                (item_name, storage_quantity, serving_weight, serving_amount, max_weight, max_amount) 
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(item_name) DO UPDATE SET
                    storage_quantity = storage_quantity + excluded.storage_quantity,
                    serving_weight = excluded.serving_weight,
                    serving_amount = excluded.serving_amount,
                    max_weight = excluded.max_weight,
                    max_amount = excluded.max_amount
            ''', (row['item_name'], row['storage_quantity'], row['serving_weight'], 
                  row['serving_amount'], row['max_weight'], row['max_amount']))
        print("Data from Excel file has been updated in 'current_database'.")
    except Exception as e:
        print(f"Failed to process Excel file, make sure it's in the correct format: {e}")

# creates a new student purchase database if one does not exist, columns should be student ID, date, day of the week, item name and quantity sold
def createPurchaseDatabase(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS purchase_database (
            student_id TEXT,
            item_name TEXT,
            purchase_date DATE,
            day_of_week TEXT,
            purchase_quantity INTEGER,
            FOREIGN KEY (item_name) REFERENCES current_database (item_name)
        )
    ''')
    print("Table 'purchase_database' created (or already exists).")

# sets up query parameters to add to table (helper function)
def setAddQuery():
    query = "INSERT INTO current_database (item_name, storage_quantity, serving_weight, serving_amount, max_weight, max_amount) VALUES (?, ?, ?, ?, ?, ?)"
    return query

# helper function
# checks if values list passed via parameter match query input amount
# if valid returns a tuple to add to database
def setValues(valuesList):
    verif = len(valuesList)
    if (verif < 7) or (verif > 7): 
        return None
    else:
        return tuple(valuesList)
        
# setAddQuery and setAddValues are helper functions
# adds new item to database
def add(conn, cursor, valuesList):
    query = setAddQuery()
    values = setValues(valuesList)

    # checks to see if legitmate values were added
    # if so, can add to database
    if values:
        cursor.execute(query, values)
        conn.commit()

# prints table
def printTable(cursor):
    cursor.execute("SELECT * FROM current_database")
    rows = cursor.fetchall()
    for rows in rows:
        print(rows)

# used to delete item from database
def deleteItem(conn, cursor, item_name):
    query = "DELETE FROM current_database WHERE item_name = ?"

    try:
        cursor.execute(query, (item_name,))
        conn.commit()
        print(item_name + " was deleted.")
        return True
    except sqlite3.Error as e:
        print("Failed to delete")
        # cancel procedure since failed to delete
        conn.rollback()
        return False
    
# used to check for low stock items
def checkLowStock(cursor, threshold):
    query = "SELECT item_name, storage_quantity FROM current_database WHERE storage_quantity < ?"
    
    try: 
        cursor.execute(query, (threshold,))
        low_stock_items = cursor.fetchall()
        
        if low_stock_items:
            print("Low stock items:")
            for item in low_stock_items:
                print(f"Item: {item[0]}, Quantity: {item[1]}")
        else:
            print("No low stock items found.")
    except sqlite3.Error as e:
        print("Failed to check low stock items")
        return False
    
# used to decrement quantity of item sold and add the student ID, date, day of the week, item name and quantity sold to the purchase database
def purchaseItem(conn, cursor, item_name, quantity, student_id):
    check_query = "SELECT * FROM purchase_database WHERE student_id = ? AND item_name = ? AND purchase_date = ?"
    update_query = "UPDATE current_database SET storage_quantity = storage_quantity - ?, WHERE item_name = ?"
    insert_query = "INSERT INTO purchase_database (student_id, item_name, purchase_date, day_of_week, purchase_quantity) VALUES (?, ?, ?, ?, ?)"
    
    try:
        today = date.today()
        day_of_week = today.strftime("%A")  # Get the day of the week
        
        # Check if the purchase already exists
        cursor.execute(check_query, (student_id, item_name, today))
        existing_purchase = cursor.fetchone()
        
        if existing_purchase:
            print(f"Duplicate purchase detected: {student_id} already purchased {item_name} today.")
            return
        
        # Proceed with the purchase
        cursor.execute(update_query, (quantity, quantity, item_name))
        cursor.execute(insert_query, (student_id, item_name, today, day_of_week, quantity))
        conn.commit()
        print(f"Purchased {quantity} of {item_name}.")
    except sqlite3.Error as e:
        print("Failed to purchase item")
        conn.rollback()

# Track popular items by checking student purchase history database and sort based on parameter (week, month, all-time) (backend)
def trackPopularItems(cursor, time_period):
    if time_period == "week":
        query = """
            SELECT item_name, SUM(purchase_quantity) as total_quantity
            FROM purchase_database
            WHERE purchase_date >= date('now', '-7 days')
            GROUP BY item_name
            ORDER BY total_quantity DESC
        """
    elif time_period == "month":
        query = """
            SELECT item_name, SUM(purchase_quantity) as total_quantity
            FROM purchase_database
            WHERE purchase_date >= date('now', '-30 days')
            GROUP BY item_name
            ORDER BY total_quantity DESC
        """
    elif time_period == "all-time":
        query = """
            SELECT item_name, SUM(purchase_quantity) as total_quantity
            FROM purchase_database
            GROUP BY item_name
            ORDER BY total_quantity DESC
        """
    else:
        print("Invalid time period specified.")
        return
    
    cursor.execute(query)
    popular_items = cursor.fetchall()
    
    if popular_items:
        print(f"Popular items for {time_period}:")
        for item in popular_items:
            print(f"Item: {item[0]}, Total Quantity Sold: {item[1]}")
    else:
        print(f"No purchases found for the specified time period: {time_period}.")

# Track daily visit to analyze peak days by checking student purchase database based on weekdays and returning relevant data based on the past three months (backend)
# It should rank the most popular days of the week based on the number of purchases made on that day
# Should take into account the last 90 days of purchases
def trackDailyVisits(cursor):
    query = """
        SELECT strftime('%w', purchase_date) as day_of_week, COUNT(*) as total_purchases
        FROM purchase_database
        WHERE purchase_date >= date('now', '-90 days')
        GROUP BY day_of_week
        ORDER BY total_purchases DESC
    """
    
    cursor.execute(query)
    daily_visits = cursor.fetchall()
    
    days_of_week = {
        '0': 'Sunday',
        '1': 'Monday',
        '2': 'Tuesday',
        '3': 'Wednesday',
        '4': 'Thursday',
        '5': 'Friday',
        '6': 'Saturday'
    }
    
    if daily_visits:
        print("Peak days of the week based on purchases:")
        for visit in daily_visits:
            day_name = days_of_week[visit[0]]
            print(f"Day: {day_name}, Total Purchases: {visit[1]}")
    else:
        print("No purchases found in the last 90 days.")