import React from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';

export default function Form({ onSubmit, currentUser, amountRaised}) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
      <p><img style={{"width":"65%"}} src={require('../../assets/syrian-child.png')}></img></p>
        <p>Provide food and clean water to families, { currentUser.accountId }!</p>
        {/* <p className="highlight">
          <label htmlFor="message">Message:</label>
          <input
            autoComplete="off"
            autoFocus
            id="message"
            required
          />
        </p> */}
        {
          amountRaised ? <p>{amountRaised} Ⓝ raised of 100 Ⓝ goal</p>: <p>--- Ⓝ raised of 100 Ⓝ goal</p>
        }
        <p>
          <label htmlFor="donation">Donate:</label>
          <input
            autoComplete="off"
            defaultValue={'1'}
            id="donation"
            max={Big(currentUser.balance).div(10 ** 24)}
            min="1"
            step="1"
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <button type="submit">
          Donate
        </button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
