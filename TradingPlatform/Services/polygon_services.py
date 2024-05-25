from typing import List
from polygon import RESTClient
from datetime import datetime, timedelta
from Config.config import POLYGON_API_KEY
from functools import lru_cache
import pandas as pd
import redis


# Create a single instance of RESTClient
client = RESTClient(POLYGON_API_KEY)

# Create a Redis client
redis_client = redis.Redis(host='localhost', port=6379, db=0)


# List of stock market holidays
stock_market_holidays = [
    "2023-01-02",  # New Year's Day's
    "2023-01-16",  # Martin Luther King, Jr. Day
    "2023-02-20",  # Washington's Birthday
    "2023-04-07",  # Good Friday
    "2023-05-29",  # Memorial Day
    "2023-06-19",  # Juneteenth
    "2023-07-04",  # Independence Day
    "2023-09-04",  # Labor Day
    "2023-11-23",  # Thanksgiving Day
    "2023-12-25",  # Christmas Day
]

DAYS_AGO = 1


@lru_cache(maxsize=100)
def get_dividends_from_polygon(ticker: str):
    """Get dividends for a specific ticker."""
    dividends = list(client.list_dividends(ticker, limit=100))
    return dividends


@lru_cache(maxsize=100)
def get_financials_from_polygon(ticker: str):
    """Get financials for a specific ticker."""
    financials = list(client.vx.list_stock_financials(
        ticker, filing_date_gt="2023-01-01"))
    return financials


def polygon_analyze_ticker_trend(ticker: str, financial: dict):
    filing_date = pd.to_datetime(financial['filing_date'])
    # Calculate the date range (10 days before and after the filing date)
    from_date = (filing_date - pd.Timedelta(days=10)).strftime('%Y-%m-%d')
    to_date = (filing_date + pd.Timedelta(days=10)).strftime('%Y-%m-%d')
    # Get price and trading volume for the specific ticker within the date range
    price_and_volume = client.get_aggs(
        ticker, 1, "day", from_date, to_date, adjusted=True)
    return [{'date': datetime.fromtimestamp(bar.timestamp / 1000).strftime('%Y-%m-%d'), 'volume': bar.volume, 'close': bar.close} for bar in price_and_volume]


def polygon_analyze_ticker(ticker: str):
    """Analyze a specific ticker."""
    # Get financials
    financials = get_financials_from_polygon(ticker)

    # Sort the financials by filing date
    financials.sort(key=lambda x: x.filing_date)

    # Get the last financial report
    last_financial = financials[-1]

    # Get the filing date of the last financial report
    filing_date = last_financial.filing_date

    # Calculate the date range (10 days before and after the filing date)
    from_date = (datetime.strptime(filing_date, '%Y-%m-%d') -
                 timedelta(days=10)).strftime('%Y-%m-%d')
    to_date = (datetime.strptime(filing_date, '%Y-%m-%d') +
               timedelta(days=10)).strftime('%Y-%m-%d')

    # Get price and trading volume for the specific ticker within the date range
    price_and_volume = client.get_aggs(
        ticker, 1, "day", from_date, to_date, adjusted=True)
    return price_and_volume
