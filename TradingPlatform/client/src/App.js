import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AppRouter from './AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';  // Ensure this matches

function App() {
  const clearCache = async () => {
    try {
      await axios.post('/api/clear_cache');  // Correct endpoint
      alert('Cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('Failed to clear cache');
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <Link className="navbar-brand" to="/tickers">Ticker</Link>
            <Link className="navbar-brand" to="/social">Social</Link>
            <button className="btn btn-warning" onClick={clearCache}>Clear Cache</button>
          </nav>
        </header>
        
        <AppRouter />
      </div>
    </Router>
  );
}

export default App;
