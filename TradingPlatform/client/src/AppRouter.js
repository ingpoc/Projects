import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Content from './Common/Content';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Content />} />
    </Routes>
  );
}

export default AppRouter;
