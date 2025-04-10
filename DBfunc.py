import sqlite3

#checks if able to connect to database
#if successful, establish cursor object to interact with db
#otherwise it will throw an error
def test_connection(conn, db_file):
    try:
        conn = sqlite3.connect(db_file)
        print("Connection successful!")
        return conn
    #error message stored within variable e
    except sqlite3.Error as e:
        print("Connection failed: {e}")
        return None


#states if table exists/creates one if necessary
def createTable(cursor):

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
    print("Table 'current_database' created (or already exists).") 


#sets up query parameters to add to table (helper function)
def setAddQuery():
    query = "INSERT INTO current_database (item_name, storage_quantity, num_sold, serving_weight, serving_amount, max_weight, max_amount) VALUES (?, ?, ?, ?, ?, ?, ?)"
    return query

#helper function
#checks if values list passed via parameter match query input amount
#if valid returns a tuple to add to database
def setAddValues(valuesList):
    verif = len(valuesList)
    if (verif < 7) or (verif > 7): 
        return None
    else:
        return tuple(valuesList)
        
#setAddQuery and setAddValues are helper functions
#adds new item to database
def add(cursor, valuesList):
    query = setAddQuery()
    values = setAddValues(valuesList)

    #checks to see if legitmate values were added
    #if so, can add to database
    if values:
        cursor.execute(conn, query, values)
        conn.commit()

#prints table
def printTable(cursor):
    cursor.execute("SELECT * FROM current_database")
    rows = cursor.fetchall()
    for rows in rows:
        print(rows)

#used to delete item from database
def deleteItem(conn, cursor, item_name):
    query = "DELETE FROM current_database WHERE item_name = ?"

    try:
        cursor.execute(query, (item_name,))
        conn.commit()
        print(item_name + " was deleted.")
        return True
    except sqlite3.Error as e:
        print("Failed to delete")
        #cancel procedure since failed to delete
        conn.rollback()
        return False