import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useDialog } from '../Common/useDialog';


function formatMoney(amount) {
    return `$${(amount / 1e9).toFixed(2)}B`;
}

function FinancialsTable() {
    const location = useLocation();
    const [financials, setFinancials] = useState(location.state ? location.state.financials : []);
    const { modalIsOpen, modalMessage, showDialog, closeModal, modalTitle } = useDialog();


    useEffect(() => {
        if (!financials) {
            showDialog('Financial result not available');
        }
    }, [financials]);


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
                </tr>
            </thead>
            <tbody>
                {/* Map over the financials data and create a table row for each item */}
                {/* Map over the financials data and create a table row for each item */}
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