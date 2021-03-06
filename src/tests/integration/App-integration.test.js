// these are made available by near-cli/test_environment
// note: do not remove the line below as it is needed for these tests
/* global nearlib, nearConfig */

import 'regenerator-runtime/runtime';

let near;
let contract;
let accountId;

beforeAll(async function() {
  near = await nearlib.connect(nearConfig);
  accountId = nearConfig.contractName;
  contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ['getDonors'],
    changeMethods: ['addDonor'],
    sender: accountId
  });
});

it('send one message and retrieve it', async() => {
  await contract.addDonor({ text: 'aloha' });
  const msgs = await contract.getDonors();
  const expectedMessagesResult = [{
    premium: false,
    sender: accountId,
    text: 'aloha'
  }];
  expect(msgs).toEqual(expectedMessagesResult);
});

it('send two more messages and expect three total', async() => {
  await contract.addDonor({ text: 'foo' });
  await contract.addDonor({ text: 'bar' });
  const msgs = await contract.getDonors();
  expect(msgs.length).toEqual(3);
});
