README for Stock Dashboard Project
Overview
The Stock Dashboard project is a web application designed to fetch, store, and display stock data similar to TradingView. Given the rate limit of 25 requests per day imposed by the Alpha Vantage API, the application uses MongoDB for persistent storage and Redis for caching. The backend is powered by Flask, while the frontend is built with React, providing an interactive and user-friendly interface for displaying stock data.

Project Structure
Backend
app.py: Flask server that handles API requests.
fmp_services.py: Fetches stock data from Alpha Vantage API and stores it in MongoDB.
mongo_service_client.py: Manages MongoDB operations (fetching, inserting, clearing ticker data).
redis_service_client.py: Manages Redis operations for caching.
Config: Contains configuration files (config.py) and ticker list (ticker.json).
Frontend
client: Contains the React application.
src: Source folder for the React components and styles.
Analysis: Contains components related to data analysis (e.g., TickersTable.js).
Common: Contains common components (e.g., LoadingSpinner.js).
App.js: Main React component that sets up routing.
AppRouter.js: Defines routes for the application.
Content.js: Fetches and displays ticker data using TickersTable.
index.js: Entry point for the React application.
index.css: Global styles.
TickersTable.css: Styles for the TickersTable component.
Content.css: Styles for the Content component.
Installation
Backend
Set up Python environment:

sh
Copy code
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
Set up MongoDB and Redis:

Ensure MongoDB and Redis are installed and running locally.
Update connection details in mongo_service_client.py and redis_service_client.py if needed.
Configure API keys:

Create a config.py file in the Config directory with your Alpha Vantage API key:
python
Copy code
ALPHA_VANTAGE_API_KEY = 'your_alpha_vantage_api_key'
ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/'
Run the Flask server:

sh
Copy code
python app.py
Frontend
Install Node.js dependencies:

sh
Copy code
cd client
npm install
Start the React application:

sh
Copy code
npm start
Usage
Backend Endpoints
GET /api/tickers: Fetches ticker data from MongoDB. Uses Redis for caching to minimize database load.
POST /api/refresh_data: Refreshes ticker data by fetching from Alpha Vantage and storing in MongoDB. Clears existing data to ensure only fresh data is stored.
Frontend Components
App.js: Main application component with routing.
Content.js: Fetches and displays ticker data. Includes a refresh button to update data.
TickersTable.js: Displays ticker data in a table format.
LoadingSpinner.js: Displays a loading spinner during data fetch operations.
Workflow
Data Flow
Data Fetching:

When the "Refresh Data" button is clicked, a POST request is sent to /api/refresh_data.
fmp_services.py reads tickers from ticker.json, fetches data from Alpha Vantage API, and stores it in MongoDB.
If the API rate limit is reached, the process stops to avoid further API calls.
Data Storage:

The fetched data is stored in MongoDB for persistent storage.
Each ticker's data includes the symbol, name, and time series data.
Data Retrieval:

When the frontend loads, a GET request is sent to /api/tickers to fetch ticker data.
mongo_service_client.py retrieves data from MongoDB.
Redis is used to cache data to reduce load on MongoDB and improve response times.
Rate Limiting
API Rate Limit: The Alpha Vantage API allows up to 25 requests per day.
Caching: Redis is used to cache API responses to minimize redundant API calls and reduce load on MongoDB.
Example Configuration File (Config/config.py)
python
Copy code
ALPHA_VANTAGE_API_KEY = 'your_alpha_vantage_api_key'
ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/'
Example Ticker File (Config/ticker.json)
json
Copy code
{
  "RELIANCE": "Reliance Industries Limited",
  "TCS": "Tata Consultancy Services Limited"
}
Troubleshooting
Common Issues
CORS errors: Ensure Flask-CORS is properly configured in app.py.
API limits: Handle Alpha Vantage API limits gracefully in fmp_services.py.
Data display issues: Verify data structure and prop passing in React components.
Logs
Check console logs in the browser for frontend issues.
Check terminal output for backend issues.
Future Improvements
Add more visualization tools (e.g., charts).
Integrate additional data sources.
Implement user authentication and personalized dashboards.
