from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store the latest data in memory
latest_data = {"text": ""}

# Mock user database for demonstration purposes
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

if __name__ == '__main__':
    app.run(debug=True)