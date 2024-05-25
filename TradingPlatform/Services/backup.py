def save_tickers_to_mongoclient(tickers):
    """Save tickers to MongoDB."""
    with MongoClient('localhost', 27017) as mongo_client:
        db = mongo_client['ticker_database']
        tickers_collection = db['tickers_collection']

        # Convert the objects to dictionaries
        tickers_dicts = [{attr: getattr(ticker, attr) for attr in vars(ticker)} for ticker in tickers]
        
        # Insert the tickers into the collection
        try:
            tickers_collection.insert_many(tickers_dicts)
        except Exception as e:
            print(f"An error occurred: {e}")
            
            
            
            def get_tickers_from_symbols_in_mongoclient(symbols: List[str]):
    """Get a list of tickers from MongoDB."""
    with MongoClient('localhost', 27017) as mongo_client:
        db = mongo_client['ticker_database']
        tickers_collection = db['tickers_collection']

        # Get all the documents from the collection
        try:
           documents = tickers_collection.find({'ticker': {'$in': symbols}}, {'_id': 0, 'ticker': 1})
        except Exception as e:
            print(f"An error occurred: {e}")
            return []

       # Extract the tickers with name from the documents
       # Print extracting the document
        print(f"Extracting the document:")
        tickers = [{'ticker': document['ticker']} for document in documents]
        return tickers