import sqlite3
import DBfunc
import backFunc

# if __name__ == "main":

#item_name, storage_quantity, num_sold, serving_weight, serving_amount, max_weight, max_amount

itemPurr = 'stik'

itemQuantity = 1

stuID = 1234567

itemAdd = ["rock", "10", "1", "1.1", "1", "5", "1"]

#backFunc.purchase(itemPurr, itemQuantity, stuID)


#backFunc.removeItem('coke')

backFunc.addItem(itemAdd)
thing = backFunc.retrieve()


print(thing)    




"""
    #setting up database file
    currStock = "currStock.db" #current stock database
    stuPurchase = "stuPurchase.db" #purchase database tracking dupe db + analytic 
    #establishing conn as none
    conn = None
    conn1 = None

    conn = DBfunc.test_connection(conn, currStock)
    #conn1 = DBfunc.test_connection(conn1, stuPurchase)


    #able to succcessfully connect
    if conn:
        cursor = conn.cursor()
        DBfunc.createCurrentDatabase(cursor)
        #query = ["rock", "10", "1", "1.1", "1", "5", "1"]
        #DBfunc.add(conn, cursor, query)
        DBfunc.printTable(cursor)
        DBfunc.checkLowStock(cursor, 10)


    if conn1:
        cursor = conn1.cursor()
        DBfunc.createPurchaseDatabase(cursor)
        DBfunc.purchaseItem(conn1, cursor, "beans", 2, "000000")


        DBfunc.printTable(cursor)
"""
