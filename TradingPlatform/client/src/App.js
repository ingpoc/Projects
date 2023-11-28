import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AppRouter from './AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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
        
        <AppRouter />
      </div>
    </Router>
  );
}

export default App;