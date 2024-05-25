import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDialog } from '../Common/useDialog'; // Update the path if necessary
import { Modal, Button } from 'react-bootstrap';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TrendAnalysis = () => {
  const location = useLocation();
  const { state } = location;
  const { financials } = state || {};
  const { modalIsOpen, modalMessage, showDialog, closeModal, modalTitle } = useDialog();

  useEffect(() => {
    if (!financials) {
      showDialog('Trend Analysis result not available', 'Error');
    }
  }, [financials]);

  return (
    <div>
      <h1>Trend Analysis</h1>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={financials}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="volume" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="close" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>

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
};
export default TrendAnalysis;
