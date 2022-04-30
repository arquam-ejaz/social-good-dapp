import 'regenerator-runtime/runtime';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import SignIn from './components/SignIn';
import Messages from './components/Messages';
import { utils } from 'near-api-js';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);
  const [amountRaised, setAmountRaised] = useState(null);

  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    contract.getDonors().then(setMessages);
    contract.getAmountRaised().then((raised)=>{
      setAmountRaised(utils.format.formatNearAmount(raised.toString()).toString());
    })
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const { fieldset, donation } = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    contract.addDonor(
      { text: 'Hey, I donated ' + donation.value + ' NEAR to save the Syrians!'},
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getDonors().then(messages => {
        setMessages(messages);
        //message.value = '';
        donation.value = SUGGESTED_DONATION;
        fieldset.disabled = false;
        //message.focus();
      });
    });
  };

  const signIn = () => {
    wallet.requestSignIn(
      {contractId: nearConfig.contractName, methodNames: [contract.addDonor.name]}, //contract requesting access
      'Syria Emergency Appeal', //optional name
      null, //optional URL to redirect to if the sign in was successful
      null //optional URL to redirect to if the sign in was NOT successful
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <h1>Syria Emergency Appeal</h1>
        { currentUser
          ? <button onClick={signOut}>Log out</button>
          : <button onClick={signIn}>Log in</button>
        }
      </header>
      { currentUser
        ? <Form onSubmit={onSubmit} currentUser={currentUser} amountRaised={amountRaised} />
        : <SignIn/>
      }
      { !!currentUser && !!messages.length && <Messages messages={messages}/> }
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    addDonor: PropTypes.func.isRequired,
    getDonors: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
