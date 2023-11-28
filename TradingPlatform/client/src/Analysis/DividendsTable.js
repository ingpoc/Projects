import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Modal, Button, ModalTitle } from 'react-bootstrap';
import { useDialog } from '../Common/useDialog';

axios.defaults.baseURL = 'http://localhost:5000/api';

function DividendsTable() {
    const location = useLocation();
    const [dividends, setDividends] = useState(location.state ? location.state.dividends : []);
    const { modalIsOpen, modalMessage, showDialog, closeModal, modalTitle } = useDialog();

    useEffect(() => {
        if (!dividends) {
            showDialog('Dividends result not available', 'Error');
        }
    }, [dividends]);

    const postTweet = async (cash_amount, declaration_date) => {
        const data = { text: `Cash Amount: ${cash_amount}, Declaration Date: ${declaration_date}` };
        try {
            await axios.post('/tweet', data);

            showDialog('Tweet posted successfully!', 'Tweet Tweet');

        } catch (error) {
            showDialog('Failed to post tweet', 'Error');
        }
    };


    return (
        <div>
            <table className="table">
            <thead>
                <tr>
                <th scope="col" >Cash Amount</th>
                    <th scope="col">Currency</th>
                    <th scope="col">Declaration Date</th>
                    <th scope="col">Dividend Type</th>
                    <th scope="col">Ex Dividend Date</th>
                    <th scope="col">Frequency</th>
                    <th scope="col">Pay Date</th>
                    <th scope="col">Record Date</th>
                    <th scope="col">Ticker</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {dividends.map((dividend, index) => (
                      <tr key={index}>
                      <td>{dividend.cash_amount}</td>
                      <td>{dividend.currency}</td>
                      <td>{dividend.declaration_date}</td>
                      <td>{dividend.dividend_type}</td>
                      <td>{dividend.ex_dividend_date}</td>
                      <td>{dividend.frequency}</td>
                      <td>{dividend.pay_date}</td>
                      <td>{dividend.record_date}</td>
                      <td>{dividend.ticker}</td>
                      <td><button className="btn btn-primary" onClick={() => postTweet(dividend.cash_amount, dividend.declaration_date)}>Post</button></td>
                  
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

export default DividendsTable;