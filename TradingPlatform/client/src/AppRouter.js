import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Content from './Common/Content';
import TrendAnalysis from './Analysis/TrendAnalysis'; // Update the path if necessary

function RedirectToTickers() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/tickers');
  }, [navigate]); // Add navigate to the dependency array

  return null;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RedirectToTickers />} />
      <Route path="/financials/trend/:ticker" element={<TrendAnalysis />} />
      <Route path="/:tab/*" element={<Content />} />
    </Routes>
  );
}

export default AppRouter;
