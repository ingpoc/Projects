import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Content.css';
import TickersTable from './Ticker/TickersTable';
import DividendsTable from './Analysis/DividendsTable';
import FinancialsTable from './Analysis/FinancialsTable';
import { useParams, useNavigate } from 'react-router-dom';

axios.defaults.baseURL = 'http://localhost:5000/api';

function Content() {

    const { tab } = useParams();
    const navigate = useNavigate();
    const [dividends, setDividends] = useState([]);
    const [financials, setFinancials] = useState([]);
    const [tickers, setTickers] = useState([]);


    const getTickers = useCallback(async () => {

        try {
            const response = await axios.get(`/tickers`);
        

            if (response && !response.data || response.data.length === 0) {
                showDialogBox('Tickerst not available');
            } else {
                console.log('Harwinder:', response.data);
                setTickers(response.data);
                navigate('/tickers');
            }
        } catch (error) {
            console.error('Failed to fetch Ticker Data:', error);
            showDialogBox('Tickers not available');
        }
    }, [navigate, setTickers]); // Add history to the dependency array

    useEffect(() => {
        getTickers();
    }, [getTickers]);

    const getDividends = useCallback(async (ticker) => {
        try {

            const response = await axios.get(`/dividends/${ticker}`);
            // print response to console

            if (response && !response.data || response.data.length === 0) {
                showDialogBox('Dividends result not available');
            } else {
                setDividends(response.data);
                // change state to dividends
                navigate('/dividends');
            }
        } catch (error) {
            console.error('Failed to fetch dividends:', error);
            showDialogBox('Dividends result not available');
        }
    }, [navigate, setDividends]); // Add history to the dependency array


    const getFinancials = useCallback(async (ticker) => {
        try {
            const response = await axios.get(`/financials/${ticker}`);
            if (response && !response.data || response.data.length === 0) {
                showDialogBox('Financial result not available');
            } else {
                setFinancials(response.data);
                navigate('/financials');
            }
        } catch (error) {
            console.error('Failed to fetch financials:', error);
            showDialogBox('Financial result not available');
        }
    }, [navigate]); // Add history to the dependency array

    function showDialogBox(message) {
        alert(message);
    }


    return (
        <div className="content">
            {tab === 'tickers' && <TickersTable tickers={tickers} getDividends={getDividends} getFinancials={getFinancials} />}
            {tab === 'dividends' && <DividendsTable dividends={dividends} />}
            {tab === 'financials' && <FinancialsTable financials={financials} />}
        </div>
    );
}

export default Content;