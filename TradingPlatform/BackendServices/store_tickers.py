import json
from pymongo import MongoClient

try:
    # Load the JSON file
    with open('../Config/ticker.json') as f:
        data = json.load(f)

    # Convert each ticker to a document
    documents = [{'symbol': symbol, 'name': name}
                 for symbol, name in data.items()]

    # Connect to MongoDB
    with MongoClient('localhost', 27017) as client:
        db = client['ticker_database']  # Use your database name

        # Insert the documents into a collection
        collection = db['symbols_collection']  # Use your collection name
        collection.insert_many(documents)

except FileNotFoundError:
    print("The JSON file was not found.")
except json.JSONDecodeError:
    print("The JSON file is not valid JSON.")
except Exception as e:
    print(f"An error occurred: {e}")
