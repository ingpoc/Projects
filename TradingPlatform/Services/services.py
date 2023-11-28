from typing import List
from polygon import RESTClient
from datetime import datetime, timedelta
from Config.config import API_KEY


# Create a single instance of RESTClient
client = RESTClient(API_KEY)

DAYS_AGO = 4

def get_dividends_from_polygon(ticker: str):
    """Get dividends for a specific ticker."""
    dividends = list(client.list_dividends(ticker, limit=100))
    return dividends

def get_financials_from_polygon(ticker: str):
    """Get financials for a specific ticker."""
    financials = list(client.vx.list_stock_financials(ticker, filing_date_gt="2023-01-01"))
    return financials

def list_tickers(exchange: str) -> List[str]:
    """List tickers for a specific exchange."""
    date = (datetime.now() - timedelta(days=DAYS_AGO)).strftime('%Y-%m-%d')
    tickers = client.get_grouped_daily_aggs(date=date, adjusted=True, params={'exchange': exchange}, raw=False, locale='us', market_type='stocks', include_otc=False)
    return [agg.ticker for agg in tickers[:50]]

def list_nyse_tickers() -> List[str]:
    """List NYSE tickers."""
    return list_tickers('NYSE')

def list_nasdaq_tickers() -> List[str]:
    """List NASDAQ tickers."""
    return list_tickers('NASDAQ')

def get_price_and_volume(ticker: str, from_date: str, to_date: str) -> dict:
    """Get price and trading volume for a specific ticker within a date range."""
    bars = client.get_bars(ticker, from_date, to_date)
    return [{'date': bar.date, 'volume': bar.volume, 'close': bar.close} for bar in bars]


def analyze_quarter(ticker: str, financial: dict):
    """Analyze a specific quarter."""
    # Get the filing date of the financial report
    filing_date = financial['filing_date']

    # Calculate the date range (10 days before and after the filing date)
    from_date = (datetime.strptime(filing_date, '%Y-%m-%d') - timedelta(days=10)).strftime('%Y-%m-%d')
    to_date = (datetime.strptime(filing_date, '%Y-%m-%d') + timedelta(days=10)).strftime('%Y-%m-%d')

    # Get price and trading volume for the specific ticker within the date range
    price_and_volume = get_price_and_volume(ticker, from_date, to_date)

    return price_and_volume

def analyze_ticker(ticker: str):
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
    from_date = (datetime.strptime(filing_date, '%Y-%m-%d') - timedelta(days=10)).strftime('%Y-%m-%d')
    to_date = (datetime.strptime(filing_date, '%Y-%m-%d') + timedelta(days=10)).strftime('%Y-%m-%d')

    # Get price and trading volume for the specific ticker within the date range
    price_and_volume = get_price_and_volume(ticker, from_date, to_date)

    return price_and_volume
