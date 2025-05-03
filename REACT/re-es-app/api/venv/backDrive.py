import sqlite3
import DBfunc
import backFunc

# Define 20 grocery items to add to the database
grocery_items = [
    ["Apples", "50", "5", "0.2", "1", "10", "2"],
    ["Bananas", "100", "10", "0.3", "2", "20", "4"],
    ["Carrots", "200", "15", "0.1", "1", "15", "3"],
    ["Tomatoes", "150", "12", "0.25", "1.5", "12", "3"],
    ["Potatoes", "300", "20", "0.5", "2.5", "25", "5"],
    ["Onions", "250", "18", "0.4", "2", "18", "4"],
    ["Milk", "100", "10", "1", "5", "10", "2"],
    ["Eggs", "200", "20", "0.05", "1", "20", "4"],
    ["Cheese", "50", "5", "0.5", "2", "5", "1"],
    ["Bread", "150", "15", "0.3", "1.5", "15", "3"],
    ["Rice", "500", "50", "1", "10", "50", "10"],
    ["Beans", "400", "40", "0.8", "8", "40", "8"],
    ["Chicken", "100", "10", "1.5", "5", "10", "2"],
    ["Beef", "80", "8", "2", "6", "8", "2"],
    ["Fish", "60", "6", "1.2", "4", "6", "1"],
    ["Pasta", "300", "30", "0.4", "2", "30", "6"],
    ["Cereal", "200", "20", "0.5", "2.5", "20", "4"],
    ["Juice", "150", "15", "1", "5", "15", "3"],
    ["Soda", "250", "25", "0.5", "2", "25", "5"],
    ["Water", "500", "50", "1", "10", "50", "10"],
]

# Add each grocery item to the database
for item in grocery_items:
    backFunc.addItem(item)

# Retrieve and print the updated inventory
updated_inventory = backFunc.retrieve()
print(updated_inventory)
