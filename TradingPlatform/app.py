from flask import Flask, jsonify, request
from flask_cors import CORS
from Services.polygon_services import get_dividends_from_polygon, get_financials_from_polygon, polygon_analyze_ticker_trend, polygon_analyze_ticker
from Services.fmp_services import fmp_list_tickers
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
    
    tickers = fmp_list_tickers('NYSE')
    return jsonify(tickers)


@app.route('/api/tweet', methods=['POST'])
def post_tweet():
    data = request.get_json()
    text = data.get('text')
    response = tweet_post(text)
    return jsonify(response), 201


@app.route('/api/quarterly_analysis', methods=['POST'])
def quarterly_analysis():
    data = request.get_json()
    ticker = data.get('ticker')
    financial = data.get('financial')
    result = polygon_analyze_ticker_trend(ticker, financial)
    return jsonify(result), 201


@app.route('/api/ticker_analysis', methods=['POST'])
def ticker_analysis():
    data = request.get_json()
    ticker = data.get('ticker')
    result = polygon_analyze_ticker(ticker)
    return jsonify(result), 201


if __name__ == '__main__':
    app.run(port=5000)
