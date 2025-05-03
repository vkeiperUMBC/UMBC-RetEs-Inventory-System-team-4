#defines frontend and backend protocol interaction
from flask import Flask, request, jsonify
from flask_cors import CORS
import backFunc
import os
import pandas as pd


app = Flask(__name__)
CORS(app)  #Enable CORS for all routes
UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#Store the latest data in memory
latest_data = {"text": ""}

#Mock user database for demonstration purposes
users = {
    "testuser": "password123",  # username: password
    "admin": "adminpass"
}
   
   
   
@app.route('/api/data', methods=['POST'])
def post_data():
    global latest_data
    latest_data['text'] = request.data.decode('utf-8')
    print(f"Received data: {latest_data['text']}")
    return jsonify({"message": "Data received successfully"}), 200

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(latest_data), 200

@app.route('/login', methods=['POST'])
def login():
    try:
        # Parse the JSON request body
        data = request.json
        username = data.get('username')
        password = data.get('password')

        # Validate the username and password
        if username in users and users[username] == password:
            # Determine the role of the user
            role = "admin" if username == "admin" else "user"
            return jsonify({"message": "Login successful", "role": role}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "An error occurred during login"}), 500

@app.route('/inventoryAdmin', methods =['POST'])
def addItem():
    try:
        #request contains HTTP req information
        #json parses the incoming req, and stores into data

        data = request.json
        itemName = data.get('name')
        stock = data.get('stock')
        maxDraw = data.get('maxWithdraw')
        maxWeight = data.get('maxWithdrawWeight')
        category = data.get('category')

        #the add function in database takes in item_name, storage_quantity, num_sold, serving_weight, serving_amount, max_weight, max_amount
        #no option for category
        #not yet changing until friday to double check what will be impacted
        toAdd = [itemName, stock, maxDraw, maxWeight, category]


        print(f"Adding: {itemName}, Quantity: {stock}, Maximum withdrawal: {maxDraw}, Maximum Weight: {maxWeight}, Category: {category}")

        

    except Exception as e:
        print(f"Error while adding: {e}")
        return jsonify({"error": "An error occured while adding an item"}), 500

@app.route('/api/inventory', methods=['GET'])
def getInv():
    try: 
        # jInv = [{"name": "rock", "stock": 10, "maxWithdraw": 1, "stockWeight": 1.1, "maxWithdrawWeight": 1}]
        jInv = backFunc.retrieve()
        return jsonify(jInv), 200
    except Exception as e:
        print(f"Error while loading inventory: {e}")
        return jsonify({"error": "An error occurred while loading inventory"}), 500

@app.route('/api/checkout', methods=['DELETE'])
def checkout():
    try:
        data = request.json
        i = 0
        for item in data:
            itemName = data[i]['name']
            quantity = data[i]['stock']
            backFunc.purchase(itemName, quantity, users['testuser'])
            i = i+1

    except Exception as e:
        print(f"Error while checking out: {e}")
        return jsonify({"error": "An error occurred while attempting to checkout"}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Save the file to the server
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        
        
        # Wait until the Excel file is saved and exists
        while not os.path.exists(file_path):
            pass
        
                
        backFunc.overrideExcel()

        return jsonify({"message": "File uploaded and processed successfully"}), 200
    except Exception as e:
        print(f"Error uploading file: {e}")
        return jsonify({"error": "An error occurred while uploading the file"}), 500

@app.route('/api/addItem', methods=['POST'])
def add_item():
    try:
        # Parse the JSON request body
        data = request.json

        # Extract item details
        item_name = data.get('name')
        stock = int(data.get('stock', 0))
        max_withdraw = int(data.get('maxWithdraw', 0))
        serving_weight = float(data.get('servingWeight', 0))
        serving_per_stock = int(data.get('servingAmount', 0))  # Fixed key
        max_withdraw_weight = float(data.get('maxWithdrawWeight', 0))  # Fixed key

        # Prepare the item data for the database
        to_add = [item_name, stock, 0, serving_weight, serving_per_stock, max_withdraw, max_withdraw_weight]

        # Call the backFunc.addItem function to add the item to the database
        backFunc.addItem(to_add)

        return jsonify({"message": "Item added successfully"}), 200
    except Exception as e:
        print(f"Error while adding item: {e}")
        return jsonify({"error": "An error occurred while adding the item"}), 500

@app.route('/api/removeItem', methods=['DELETE'])
def remove_item():
    try:
        # Parse the JSON request body
        data = request.json

        # Extract the item name
        item_name = data.get('name')
        if not item_name:
            return jsonify({"error": "Item name is required"}), 400

        # Call the backFunc.removeItem function to remove the item from the database
        backFunc.removeItem(item_name)

        return jsonify({"message": f"Item '{item_name}' removed successfully"}), 200
    except Exception as e:
        print(f"Error while removing item: {e}")
        return jsonify({"error": "An error occurred while removing the item"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)