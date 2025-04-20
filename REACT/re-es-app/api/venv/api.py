from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Store the latest data in memory
latest_data = {"text": ""}

@app.route('/api/data', methods=['POST'])
def post_data():
    global latest_data
    latest_data['text'] = request.data.decode('utf-8')
    print(f"Received data: {latest_data['text']}")
    return jsonify({"message": "Data received successfully"}), 200

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify(latest_data), 200

if __name__ == '__main__':
    app.run(debug=True)