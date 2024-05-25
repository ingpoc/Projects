import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from Config.config import FMP_API_KEY, FMP_API_BASE_URL
from Services.fmp_services import fmp_list_tickers, fmp_fetch_data
from Services.mongo_service_client import insert_earnings_surprise_into_mongoclient


# Get the list of tickers
# Replace 'NASDAQ' with the exchange you're interested in
tickers = fmp_list_tickers('NYSE')

# For each ticker, fetch the earnings surprise data
for ticker in tickers:
    url = f"{FMP_API_BASE_URL}earnings-surpises/{ticker['symbol']}?apikey={FMP_API_KEY}"
    data = fmp_fetch_data(url)
    if data is not None:
        # Insert the data into MongoDB
        result = insert_earnings_surprise_into_mongoclient(data)
        if result:
            print(f"Inserted earnings surprise data for {ticker['symbol']}")
        else:
            print(f"Error inserting earnings surprise data for {ticker['symbol']}")


