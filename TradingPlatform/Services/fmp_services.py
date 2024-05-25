import json
from typing import List
from urllib.request import urlopen
import certifi
from Config.config import FMP_API_KEY, FMP_API_BASE_URL
from Services.redis_service_client import get_from_redis_client, save_to_redis_client
from Services.mongo_service_client import get_symbols_from_mongoclient


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
      
        if not symbols:
            # Data is not in Redis, fetch the first 100 symbols from symbols_collection in MongoDB
            symbols = get_symbols_from_mongoclient()
            # Save the results to Redis and set the data to expire after 1 hour
            save_to_redis_client(key, symbols)
        return symbols
    except Exception as e:
        print(f"Error listing tickers for {exchange}: {e}")
        return []


def fmp_construct_url(endpoint: str, params: dict = None) -> str:
    """Constructs the full URL for a given FMP API endpoint."""
    url = FMP_API_BASE_URL + endpoint

    # Start with the API key in the query parameters
    query_params = {'apikey': FMP_API_KEY}

    # Add any additional parameters
    if params is not None:
        query_params.update(params)

    # Convert the query parameters to a string
    query_string = '&'.join(f'{key}={value}' for key,
                            value in query_params.items())

    return url + '?' + query_string
