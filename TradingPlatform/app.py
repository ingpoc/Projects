from flask import Flask, jsonify, request
from flask_cors import CORS
from Services.services import get_dividends_from_polygon, get_financials_from_polygon, list_nyse_tickers, analyze_quarter, analyze_ticker
from Services.twitter_services import tweet_post

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/api/dividends/<ticker>', methods=['GET'])
def get_dividends(ticker):
    dividends = get_dividends_from_polygon(ticker)
    return jsonify(dividends)

@app.route('/api/financials/<ticker>', methods=['GET'])
def get_financials(ticker):
    financials = get_financials_from_polygon(ticker)
    return jsonify(financials)

@app.route('/api/tickers', methods=['GET'])
def get_nyse_tickers():
    tickers = list_nyse_tickers()
    return jsonify(tickers)

@app.route('/api/tweet', methods=['POST'])
def post_tweet():
    data = request.get_json()
    text = data.get('text')
    response = tweet_post(text)
    return jsonify(response), 201

@app.route('/api/analyze_quarter', methods=['POST'])
def analyze():
    data = request.get_json()
    ticker = data.get('ticker')
    financial = data.get('financial')
    result = analyze_quarter(ticker, financial)
    return jsonify(result), 201

@app.route('/api/analyze_ticker', methods=['POST'])
def analyze_ticker():
    data = request.get_json()
    ticker = data.get('ticker')
    result = analyze_ticker(ticker)
    return jsonify(result), 201

if __name__ == '__main__':
    app.run(port=5000)