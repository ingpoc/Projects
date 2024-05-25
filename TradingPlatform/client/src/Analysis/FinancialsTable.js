import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useDialog } from '../Common/useDialog';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';

function formatMoney(amount) {
    return `$${(amount / 1e9).toFixed(2)}B`;
}

function FinancialsTable() {
    const navigate = useNavigate();
    const location = useLocation();
    const { ticker } = useParams();  // Retrieve the ticker value from the URL
    const [financials, setFinancials] = useState(location.state ? location.state.financials : []);
    const { modalIsOpen, modalMessage, showDialog, closeModal, modalTitle } = useDialog();

    useEffect(() => {
        if (!financials) {
            showDialog('Financial result not available');
        }
    }, [financials, showDialog]); // Add showDialog to the dependency array

    const analyzeTrend = async (financial) => {
        try {
            console.log(ticker);  // Log the ticker value retrieved from the URL
            const response = await axios.post('/quarterly_analysis', {
                ticker: ticker,  // Replace 'financial.ticker' with the actual ticker symbol property
                financial: financial,
            });
             
            if (response && response.data && response.data.length > 0) {
                console.log('Navigating to TrendAnalysis');
                navigate(`/financials/trend/${ticker}`, { state: { financials: response.data } }); // Pass financials data as state
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
                        <th scope="col">CIK</th>
                        <th scope="col">Company Name</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Filing Date</th>
                        <th scope="col">Fiscal Period</th>
                        <th scope="col">Fiscal Year</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">Total Assets</th>
                        <th scope="col">Total Liabilities</th>
                        <th scope="col">Total Equity</th>
                        <th scope="col">Revenues</th>
                        <th scope="col">Cost of Revenue</th>
                        <th scope="col">Gross Profit</th>
                        <th scope="col">Operating Expenses</th>
                        <th scope="col">Analysis</th>
                    </tr>
                </thead>
                <tbody>

                    {financials.map((item, index) => (
                        <tr key={index}>
                            <td>{item.cik}</td>
                            <td>{item.company_name}</td>
                            <td>{item.end_date}</td>
                            <td>{item.filing_date}</td>
                            <td>{item.fiscal_period}</td>
                            <td>{item.fiscal_year}</td>
                            <td>{item.start_date}</td>
                            <td>{formatMoney(item.financials?.balance_sheet?.assets?.value)}</td>
                            <td>{formatMoney(item.financials?.balance_sheet?.liabilities?.value)}</td>
                            <td>{formatMoney(item.financials?.balance_sheet?.equity?.value)}</td>
                            <td>{formatMoney(item.financials?.income_statement?.revenues?.value)}</td>
                            <td>{formatMoney(item.financials?.income_statement?.cost_of_revenue?.value)}</td>
                            <td>{formatMoney(item.financials?.income_statement?.gross_profit?.value)}</td>
                            <td>{formatMoney(item.financials?.income_statement?.operating_expenses?.value)}</td>
                            <td><button className="btn btn-primary" onClick={() => analyzeTrend(item)}>Analyze Trend</button></td>
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

export default FinancialsTable;
