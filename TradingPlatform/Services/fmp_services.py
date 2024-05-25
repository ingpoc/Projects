import json
from typing import List
from urllib.request import urlopen
import certifi
from Config.config import ALPHA_VANTAGE_API_KEY, ALPHA_VANTAGE_BASE_URL
from Services.redis_service_client import get_from_redis_client, save_to_redis_client
from Services.mongo_service_client import get_symbols_from_mongoclient, insert_symbols_into_mongoclient

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

def fmp_list_tickers(exchange: str, refresh: bool = False) -> List[dict]:
    """List tickers for a specific exchange."""
    key = f'tickers:{exchange}'
    try:
        if refresh:
            raise ValueError("Forcing refresh to fetch new data")
        
        symbols = get_from_redis_client(key)
        if not symbols:
            symbols = get_symbols_from_mongoclient()
            if not symbols:
                raise ValueError("No data in MongoDB, fetching new data")
            save_to_redis_client(key, symbols)
        return symbols
    except Exception as e:
        print(f"Fetching new data due to error: {e}")
        # Read tickers from ticker.json file
        tickers = read_tickers_from_file('Config/ticker.json')
        symbols = []
        for ticker, name in tickers.items():
            url = f"{ALPHA_VANTAGE_BASE_URL}query?function=TIME_SERIES_DAILY&symbol={ticker}.BSE&outputsize=compact&apikey={ALPHA_VANTAGE_API_KEY}"
            data = alpha_vantage_fetch_data(url)
            if data and "Meta Data" in data:
                symbol = {
                    'symbol': ticker,
                    'name': name
                }
                symbols.append(symbol)
        
        if symbols:
            insert_symbols_into_mongoclient(symbols)
            save_to_redis_client(key, symbols)
        return symbols or []

# Continue with other functions as needed

def fmp_fetch_data(symbol: str) -> dict:
    """Fetch market data for a specific NSE ticker."""
    key = f"data:{symbol}"
    try:
        data = get_from_redis_client(key)
        if data:
            print(f"Fetched data for {symbol} from Redis")
            return data

        data = get_symbols_from_mongoclient()
        if data:
            print(f"Fetched data for {symbol} from MongoDB")
            save_to_redis_client(key, data)  # Save to Redis for future requests
            return data

        print(f"Fetching data for {symbol} from Alpha Vantage API")
        data = alpha_vantage_fetch_data("TIME_SERIES_DAILY_ADJUSTED", symbol)
        if data:
            save_to_redis_client(key, data)  # Save to Redis
            return data

    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return {}

    return {}
