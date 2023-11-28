import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Content from './Common/Content';


function RedirectToTickers() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/tickers');
  }, []);

  return null;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RedirectToTickers />} />
      <Route path="/:tab/*" element={<Content />} />
    </Routes>
  );
}

export default AppRouter;