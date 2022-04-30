import { Donor, messages, raised } from './model';
import { u128 } from "near-sdk-as";

// --- contract code goes below

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;
// const raised = new PersistentMap<string, u128>("pmap");
// raised.set('raised', u128.from(0));

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */


export function addDonor(text: string): void {
  // Creating a new message and populating fields with our data
  const message = new Donor(text);
  // Adding the message to end of the persistent collection
  messages.push(message);

  if (raised.contains('raised'))
    raised.set('raised', u128.add(raised.getSome('raised'), message.donated));
  else
    raised.set('raised', u128.add(u128.from('0'), message.donated));

}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getDonors(): Donor[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<Donor>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}

export function getAmountRaised(): u128 {
  if (raised.contains('raised'))
    return raised.getSome('raised');
  else
    return u128.from('0');

}
