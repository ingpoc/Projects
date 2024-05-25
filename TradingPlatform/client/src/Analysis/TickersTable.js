import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useDialog } from '../Common/useDialog';

function TickersTable({ tickers }) {
    const navigate = useNavigate();
    const { modalIsOpen, modalMessage, showDialog, closeModal, modalTitle } = useDialog();


    const handleDividendsClick = async (ticker) => {
        try {
            const response = await axios.get(`/dividends/${ticker}`);
            if (response && response.data && response.data.length > 0) {
                navigate(`dividends/${ticker}`, { state: { dividends: response.data } }); // Pass dividends data as state
            } else {
                showDialog('Dividends data not available for this ticker', 'Error');
            }
        } catch (error) {
            if (error.response && error.response.status === 500) {
                showDialog('Request timed out');
            } else {
                showDialog('Dividends data not available for this ticker', 'Error');
            }
        }
    };

    const handleFinancialsClick = async (ticker) => {
        try {
            const response = await axios.get(`/financials/${ticker}`);
            if (response && response.data && response.data.length > 0) {
                navigate(`financials/${ticker}`, { state: { financials: response.data } }); // Pass financials data as state
            } else {
                showDialog('Financial data not available for this ticker', 'Error');
            }
        } catch (error) {
            if (error.response && error.response.status === 500) {
                showDialog('Request timed out', 'Error');
            } else {
                showDialog('Financial data not available for this ticker', 'Error');
            }
        }
    };

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Ticker Name</th>
                        <th scope="col">Ticker Symbol</th>
                        <th scope="col">Surprise Earnings</th>
                        <th scope="col">Ticker Analysis</th>
                    </tr>
                </thead>
                <tbody>
                    {tickers.map((ticker, index) => {
                        // Find the earnings data for the latest date
                        let latestEarningsData = { date: '', actualEarningResult: 0, estimatedEarning: 0 };
                        if (ticker.earningsData && ticker.earningsData.length > 0) {
                            latestEarningsData = ticker.earningsData.reduce((a, b) => (new Date(a.date) > new Date(b.date) ? a : b));
                        }

                        // Determine the color of the actual earnings box
                        let actualEarningsColor = 'white';
                        if (latestEarningsData.actualEarningResult > latestEarningsData.estimatedEarning) {
                            actualEarningsColor = 'green';
                        } else if (latestEarningsData.actualEarningResult < latestEarningsData.estimatedEarning) {
                            actualEarningsColor = 'red';
                        }

                        return (
                            <tr key={index}>
                                <td>{ticker.name}</td>
                                <td>{ticker.symbol}</td>
                                <td>
                                <div className="d-flex justify-content-between">
                            <span>{latestEarningsData.date}</span>
                            <span>{latestEarningsData.estimatedEarning}</span>
                            <span style={{ backgroundColor: actualEarningsColor, color: 'white', padding: '0.25rem' }}>
                                {latestEarningsData.actualEarningResult}
                            </span>
                        </div>
                                </td>
                                <td>
                                    <button className="btn btn-primary" onClick={() => handleDividendsClick(ticker.symbol)}>Dividends</button>
                                    <button className="btn btn-secondary ml-2" onClick={() => handleFinancialsClick(ticker.symbol)}>Financials</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Modal show={modalIsOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default TickersTable;