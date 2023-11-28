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
            }else{
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
            }else{
                showDialog('Financial data not available for this ticker', 'Error');
            }
        }
    };

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Ticker Symbol</th>
                        <th scope="col">Ticker Analysis</th>
                    </tr>
                </thead>
                <tbody>
                    {tickers.map((ticker, index) => (
                        <tr key={index}>
                            <td>{ticker}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleDividendsClick(ticker)}>Dividends</button>
                                <button className="btn btn-secondary ml-2" onClick={() => handleFinancialsClick(ticker)}>Financials</button>
                            </td>
                        </tr>
                    ))}
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