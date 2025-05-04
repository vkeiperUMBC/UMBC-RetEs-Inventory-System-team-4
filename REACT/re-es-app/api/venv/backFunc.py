import DBfunc
import string
import sqlite3
from flask import jsonify

#connects to database of stock items: CurrStock
def connectCurrStock():
    # setting up database file
    currStock = "c:/Users/keipe/Documents/447 project/UMBC-RetEs-Inventory-System-team-4/REACT/re-es-app/api/venv/currStock.db" #current stock database
    
    # establishing conn as none
    connCurr = None

    connCurr = DBfunc.test_connection(connCurr, currStock)
    
    if connCurr:
        cursor = connCurr.cursor()
        DBfunc.createCurrentDatabase(cursor)
        return connCurr

    
#connects to database of student purchases: stuPurchase
def connectStuPurchase():
    stuPurchase = "c:/Users/keipe/Documents/447 project/UMBC-RetEs-Inventory-System-team-4/REACT/re-es-app/api/venv/stuPurchase.db" # purchase database tracking dupe db + analytic 

    connStu = None
    connStu = DBfunc.test_connection(connStu, stuPurchase)
    if connStu:
        cursor = connStu.cursor()
        DBfunc.createPurchaseDatabase(cursor)
        return connStu
    
def overrideExcel():
    excel = "c:/Users/keipe/Documents/447 project/UMBC-RetEs-Inventory-System-team-4/REACT/re-es-app/api/venv/uploads/excel.xlsx"
    #print("jsiudf")
    connExcel = None
    connExcel = connectCurrStock()
    
    if connExcel:
        cursor = connExcel.cursor()
        DBfunc.createExcelDatabase(cursor, excel)

    print("are we out of the database")
    connExcel.close()

def combineExcel():
    excel = "c:/Users/keipe/Documents/447 project/UMBC-RetEs-Inventory-System-team-4/REACT/re-es-app/api/venv/uploads/excel.xlsx/"
    connExcel = None
    connExcel = connectCurrStock()
    
    if connExcel:
        cursor = connExcel.cursor()
        DBfunc.updateExcelDatabase(cursor, excel)
    
    

"""
#connnection for 
def setCurrConn(conn):
    currConn = conn

def getCurrConn():
    return 
"""
"""
#connection for stuPurchase db
def setPurchaseCursor(conn):
    PurchaseCursor = conn.cursor()
"""         

# [itemName, stock, maxDraw, maxWeight, category]
def addItem(toAdd):
    #toAdd[0] = string(toAdd[0])
    #toAdd[1] = int(toAdd[1])
    #toAdd[2] = int(toAdd[2])
    #toAdd[3] = int(toAdd[3])
    #toAdd[4] = string(toAdd[4])

    conn = connectCurrStock()
    cursor = conn.cursor()

    #before adding we need to check if stock exists
    print(toAdd[0])
    foundFlag = DBfunc.searchItem(conn, cursor, toAdd[0])

    if foundFlag:
        print("item already exists")
    else:
        DBfunc.add(conn, cursor, toAdd)
        DBfunc.printTable(cursor)
    
    conn.close()


def removeItem(toRemove):

    conn = connectCurrStock()
    cursor = conn.cursor()

    DBfunc.printTable(cursor)

    foundFlag = DBfunc.searchItem(conn, cursor, toRemove)

    if foundFlag:
        DBfunc.deleteItem(conn, cursor, toRemove)
        DBfunc.printTable(cursor)
    else:
        print("Item does not exist")

    #DBfunc.printTable(cursor)
    
    conn.close()

#def purchaseItem(conn, cursor, item_name, quantity, student_id):
def purchase(item_name, quantity, student_id):
    connCurr = connectCurrStock()
    cursorCurr = connCurr.cursor()

    connStu = connectStuPurchase()
    cursorStu = connStu.cursor()

    #checks if stu can purchase, if so add to database of student purchases
    DBfunc.purchaseItem(connCurr, cursorCurr, connStu, cursorStu, item_name, quantity, student_id)

    # removeItem(item_name)
    DBfunc.printTable(cursorCurr)
    DBfunc.printStuTable(cursorStu)

    connCurr.close()
    connStu.close()
    
def retrieve():
    conCurr = connectCurrStock()
    cursorCurr = conCurr.cursor()
    
    # Fetch raw data from the database
    raw_data = DBfunc.getTable(cursorCurr)
    print(f"Raw data: {raw_data}")  # Debugging output

    formatted_data = []
    # Convert raw data (e.g., tuples) into a list of dictionaries
    for row in raw_data:
        stock_weight = row[1]*row[4]*row[3]
        formatted_data.append({
            "name": row[0],
            "stock": row[1],
            "maxWithdraw": row[5],
            "stockWeight": stock_weight,
            "maxWithdrawWeight": row[6]
        })
        
    print(f"Formatted data: {formatted_data}")  # Debugging output
    
    conCurr.close()
    return formatted_data