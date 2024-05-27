import json
from urllib.request import urlopen
import certifi
from Config.config import ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_BASE_URL
from Services.mongo_service_client import insert_symbols_into_mongoclient, clear_symbols_collection

def alpha_vantage_fetch_data(url):
    try:
        response = urlopen(url, cafile=certifi.where())
        data = response.read().decode("utf-8")
        if not data:
            raise ValueError("Received empty response from Alpha Vantage API")
        return json.loads(data)
    except Exception as e:
        print(f"Error fetching data from {url}: {e}")
        return None

def read_tickers_from_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def fetch_and_store_ticker_data():
    tickers = read_tickers_from_file('Config/ticker.json')
    symbols = []
    api_limit_reached = False
    for ticker, name in tickers.items():
        if api_limit_reached:
            print(f"Skipping fetching for {ticker} due to API rate limit reached")
            continue
        url = f"{ALPHA_VANTAGE_BASE_URL}query?function=TIME_SERIES_DAILY&symbol={ticker}&outputsize=compact&apikey={ALPHA_VANTAGE_API_KEY}"
        data = alpha_vantage_fetch_data(url)
        if data and "Time Series (Daily)" in data:
            symbol_data = {
                'symbol': ticker,
                'name': name,
                'time_series': data['Time Series (Daily)']
            }
            symbols.append(symbol_data)
        elif 'Note' in data or 'Information' in data:
            api_limit_reached = True
            print(f"API limit reached: {data}")

    if symbols:
        clear_symbols_collection()
        insert_symbols_into_mongoclient(symbols)
    else:
        print("No symbols to insert into MongoDB")
