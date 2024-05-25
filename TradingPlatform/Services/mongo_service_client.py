from pymongo import MongoClient, UpdateOne

# Create a MongoClient when your application starts
mongo_client = MongoClient('localhost', 27017)
db = mongo_client['ticker_database']
symbols_collection = db['symbols_collection']

def get_symbols_from_mongoclient():
    """Get a list of symbols from MongoDB."""
    try:
        documents = symbols_collection.find({}, {'_id': 0, 'symbol': 1, 'name': 1, 'time_series': 1}).limit(100)
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

    symbols = [{'symbol': document['symbol'], 'name': document['name'], 'time_series': document.get('time_series', {})}
               for document in documents]
    return symbols

def insert_symbols_into_mongoclient(data):
    """Insert symbols into MongoDB."""
    operations = [UpdateOne({'symbol': symbol['symbol']}, {'$set': symbol}, upsert=True) for symbol in data]
    try:
        symbols_collection.bulk_write(operations)
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    return True

def clear_symbols_collection():
    """Clear the symbols collection in MongoDB."""
    try:
        symbols_collection.delete_many({})
    except Exception as e:
        print(f"An error occurred: {e}")
