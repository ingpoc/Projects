import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Content.css';
import TickersTable from '../Analysis/TickersTable';
import LoadingSpinner from '../Common/LoadingSpinner';

axios.defaults.baseURL = 'http://localhost:5000/api';

function Content() {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTickers = useCallback(async () => {
    try {
      const response = await axios.get('/tickers');
      if (response.data.length > 0) {
        const formattedTickers = response.data.map(ticker => ({
          ...ticker,
          last_refreshed: Object.keys(ticker.time_series)[0] || 'N/A'
        }));
        setTickers(formattedTickers);
      }
    } catch (error) {
      console.error('Failed to fetch Ticker Data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      await axios.post('/refresh_data');
      await getTickers();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  useEffect(() => {
    getTickers();
  }, [getTickers]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="content">
      <button onClick={refreshData}>Refresh Data</button>
      <TickersTable tickers={tickers} />
    </div>
  );
}

export default Content;
