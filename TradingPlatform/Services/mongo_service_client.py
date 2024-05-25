from typing import List
from pymongo import MongoClient, UpdateOne

# Create a MongoClient when your application starts
mongo_client = MongoClient('localhost', 27017)
db = mongo_client['ticker_database']
symbols_collection = db['symbols_collection']

def get_symbols_from_mongoclient():
    """Get a list of symbols from MongoDB."""
    try:
        documents = symbols_collection.find({}, {'_id': 0, 'symbol': 1, 'name': 1, 'earningsData': 1}).limit(100)
        symbols = [{'symbol': document['symbol'], 'name': document['name'], 'earningsData': document.get('earningsData', [])}
                   for document in documents]
        return symbols if symbols else None  # Return None if no symbols found
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def insert_symbols_into_mongoclient(symbols: List[dict]):
    """Insert symbols into MongoDB."""
    try:
        symbols_collection.insert_many(symbols, ordered=False)
    except Exception as e:
        print(f"An error occurred while inserting symbols: {e}")

def insert_earnings_surprise_into_mongoclient(data):
    """Insert earnings surprise data into MongoDB."""
    data_by_symbol = {}
    for entry in data:
        if entry['symbol'] not in data_by_symbol:
            data_by_symbol[entry['symbol']] = []
        data_by_symbol[entry['symbol']].append({
            'date': entry['date'],
            'actualEarningResult': entry['actualEarningResult'],
            'estimatedEarning': entry['estimatedEarning']
        })

    operations = [
        UpdateOne(
            {'symbol': symbol},
            {'$set': {'earningsData': earnings_data}},
            upsert=True
        )
        for symbol, earnings_data in data_by_symbol.items()
    ]

    try:
        symbols_collection.bulk_write(operations)
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

    return True
