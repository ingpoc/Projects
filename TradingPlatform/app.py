# app.py (Flask server)
from flask import Flask, jsonify
from Services.fmp_services import fetch_and_store_ticker_data
from Services.mongo_service_client import get_symbols_from_mongoclient, clear_symbols_collection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/tickers', methods=['GET'])
def get_nyse_tickers():
    tickers = get_symbols_from_mongoclient()
    return jsonify(tickers)

@app.route('/api/refresh_data', methods=['POST'])
def refresh_data():
    clear_symbols_collection()  # Clear existing data
    fetch_and_store_ticker_data()  # Fetch and store new data
    return jsonify({"message": "Data refreshed"}), 200

if __name__ == '__main__':
    app.run(port=5000)
