import backFunc
import random

# Define a list of items available for purchase
items = [
    "Apples", "Bananas", "Carrots", "Tomatoes", "Potatoes", "Onions", "Milk", "Eggs",
    "Cheese", "Bread", "Rice", "Beans", "Chicken", "Beef", "Fish", "Pasta",
    "Cereal", "Juice", "Soda", "Water"
]

# Define 8 students
students = ["student1", "student2", "student3", "student4", "student5", "student6", "student7", "student8"]

# Generate a randomized list of purchases
purchases = []
for _ in range(40):  # Generate 40 purchases
    item_name = random.choice(items)  # Randomly select an item
    quantity = random.randint(1, 5)  # Randomly select a quantity between 1 and 5
    student_id = random.choice(students)  # Randomly assign a student
    purchases.append({"item_name": item_name, "quantity": quantity, "student_id": student_id})

# Shuffle the purchases to randomize the order
random.shuffle(purchases)

# Add each purchase to the stuPurchase database
for purchase in purchases:
    backFunc.purchase(purchase["item_name"], purchase["quantity"], purchase["student_id"])

# Print the updated purchase database
print("40 randomized purchases added successfully!")