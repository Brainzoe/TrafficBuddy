from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Replace "YOUR_GOOGLE_MAPS_API_KEY" with your actual API key
API_KEY = "AIzaSyC7k0RRYBR6yibz20y4kOeIpIbn9O8wsfA"

@app.route('/get_traffic_data', methods=['POST'])
def get_traffic_data():
    data = request.get_json()
    origin = data['origin']
    destination = data['destination']

    # Make a request to Google Maps API for traffic data
    base_url = "https://maps.googleapis.com/maps/api/directions/json?"
    params = {
        "origin": origin,
        "destination": destination,
        "key": API_KEY,
        "departure_time": "now",
        "traffic_model": "best_guess"
    }
    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        data = response.json()
        return jsonify(data)
    else:
        return jsonify({'error': 'Unable to fetch traffic data'}), 500

if __name__ == '__main__':
    app.run(debug=True)
