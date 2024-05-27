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
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">Stock Dashboard</Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        <div className="container mt-5">
          <AppRouter />
        </div>
      </div>
    </Router>
  );
}

export default App;
