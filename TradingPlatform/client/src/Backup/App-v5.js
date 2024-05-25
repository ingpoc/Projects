import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Content from './Content';
import React, { useState } from 'react';



function App() {
   const [tab, setTab] = useState('tickers');
  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <a className="navbar-brand" onClick={() => setTab('tickers')}>Ticker</a>
          <a className="navbar-brand" href="#">Social</a>
        </nav>
      </header>
      
      <Content className="Content" tab={tab} setTab={setTab} /> {/* Pass tab and setTab as props */}
    </div>

  );
}

export default App;