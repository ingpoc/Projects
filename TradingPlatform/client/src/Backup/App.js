import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Content from './Content';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <Link className="navbar-brand" to="/tickers">Ticker</Link>
            <Link className="navbar-brand" to="/social">Social</Link>
          </nav>
        </header>
        
        <Routes>
          <Route path="/tickers" element={<Content tab="tickers" />} />
          <Route path="/social" element={<Content tab="social" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;