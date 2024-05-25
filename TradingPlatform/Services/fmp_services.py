import json
from typing import List
from urllib.request import urlopen
import certifi
from Config.config import FMP_API_KEY, FMP_API_BASE_URL
from Services.redis_service_client import get_from_redis_client, save_to_redis_client
from Services.mongo_service_client import get_symbols_from_mongoclient, insert_symbols_into_mongoclient

def fmp_fetch_data(url):
    try:
        response = urlopen(url, cafile=certifi.where())
        data = response.read().decode("utf-8")
        return json.loads(data)
    except Exception as e:
        print(f"Error fetching data from {url}: {e}")
        return None

def fmp_list_tickers(exchange: str) -> List[dict]:
    """List tickers for a specific exchange."""
    key = f'tickers:{exchange}'
    try:
        symbols = get_from_redis_client(key)
        if symbols:
            return symbols

        symbols = get_symbols_from_mongoclient()
        if symbols:
            save_to_redis_client(key, symbols)  # Save to Redis for future requests
            return symbols

        # If not in Redis or MongoDB, fetch from API
        url = f"{FMP_API_BASE_URL}/v3/stock/list?apikey={FMP_API_KEY}&exchange={exchange}"
        symbols = fmp_fetch_data(url)
        if symbols:
            insert_symbols_into_mongoclient(symbols)  # Save to MongoDB
            save_to_redis_client(key, symbols)  # Save to Redis
            return symbols

    except Exception as e:
        print(f"Error listing tickers for {exchange}: {e}")
        return []

    return []

def fmp_construct_url(endpoint: str, params: dict = None) -> str:
    """Constructs the full URL for a given FMP API endpoint."""
    url = FMP_API_BASE_URL + endpoint

    query_params = {'apikey': FMP_API_KEY}

    if params is not None:
        query_params.update(params)

    query_string = '&'.join(f'{key}={value}' for key, value in query_params.items())

    return url + '?' + query_string
