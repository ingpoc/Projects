import React from 'react';
import PropTypes from 'prop-types';
import './TickersTable.css';

function TickersTable({ tickers }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Ticker Name</th>
            <th scope="col">Ticker Symbol</th>
            <th scope="col">Last Refreshed</th>
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
    </div>
  );
}

TickersTable.propTypes = {
  tickers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      last_refreshed: PropTypes.string.isRequired,
      time_series: PropTypes.object.isRequired
    })
  ).isRequired
};

export default TickersTable;
