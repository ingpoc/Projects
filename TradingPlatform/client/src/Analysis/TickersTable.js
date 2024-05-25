import React from 'react';
import PropTypes from 'prop-types';
import './TickersTable.css';

function TickersTable({ tickers }) {
  return (
    <table className="tickers-table">
      <thead>
        <tr>
          <th>Ticker Name</th>
          <th>Ticker Symbol</th>
          <th>Last Refreshed</th>
        </tr>
      </thead>
      <tbody>
        {tickers.map((ticker, index) => (
          <tr key={index}>
            <td>{ticker.name}</td>
            <td>{ticker.symbol}</td>
            <td>{ticker.last_refreshed}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

TickersTable.propTypes = {
  tickers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      last_refreshed: PropTypes.string.isRequired
    })
  ).isRequired
};

export default TickersTable;
