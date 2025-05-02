import DBfunc
import string
import sqlite3

#connects to database of stock items: CurrStock
def connectCurrStock():
    # setting up database file
    currStock = "currStock.db" #current stock database
    
    # establishing conn as none
    connCurr = None

    connCurr = DBfunc.test_connection(connCurr, currStock)
    
    if connCurr:
        cursor = connCurr.cursor()
        DBfunc.createCurrentDatabase(cursor)
        return connCurr

    
#connects to database of student purchases: stuPurchase
def connectStuPurchase():
    stuPurchase = "stuPurchase.db" # purchase database tracking dupe db + analytic 

    connStu = None
    connStu = DBfunc.test_connection(connStu, stuPurchase)
    if connStu:
        cursor = connStu.cursor()
        DBfunc.createPurchaseDatabase(cursor)
        return connStu

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

    removeItem(item_name)
    DBfunc.printTable(cursorCurr)
    DBfunc.printStuTable(cursorStu)

    connCurr.close()
    connStu.close()
    




