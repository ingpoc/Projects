import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Content.css';
import TickersTable from '../Analysis/TickersTable';
import DividendsTable from '../Analysis/DividendsTable';
import FinancialsTable from '../Analysis/FinancialsTable';
import { useNavigate, useRoutes } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { useDialog } from '../Common/useDialog';
import LoadingSpinner from '../Common/LoadingSpinner';

axios.defaults.baseURL = 'http://localhost:5000/api';

function Content() {
  const navigate = useNavigate();
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { modalIsOpen, modalMessage, showDialog, closeModal } = useDialog();

  let element = useRoutes([
    { path: 'dividends/:ticker', element: <DividendsTable /> },
    { path: 'financials/:ticker', element: <FinancialsTable /> },
    { path: '/', element: <TickersTable tickers={tickers} /> },
  ]);

  const getTickers = useCallback(async () => {
    if (tickers.length === 0) { // Ensure fetching only if tickers are empty
      setLoading(true);
      try {
        const response = await axios.get(`/tickers`);
        if (response && response.data && response.data.length > 0) {
          setTickers(response.data);
          navigate('/tickers');
        } else {
          showDialog('Tickers not available');
        }
      } catch (error) {
        console.error('Failed to fetch Ticker Data:', error);
        showDialog('Tickers not available');
      } finally {
        setLoading(false);
      }
    }
  }, [navigate, showDialog, tickers.length]);

  useEffect(() => {
    getTickers();
  }, [getTickers]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="content">
      {element}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Error Modal"
      >
        <h2>Error</h2>
        <p>{modalMessage}</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}

export default Content;
