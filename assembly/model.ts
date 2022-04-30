import { context, u128, PersistentVector, PersistentMap} from "near-sdk-as";

/** 
 * Exporting a new class Donor so it can be used outside of this file.
 */
@nearBindgen
export class Donor {
  premium: boolean;
  sender: string;
  donated: u128;
  constructor(public text: string) {
    this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
    this.sender = context.sender;
    this.donated= context.attachedDeposit;
  }
}
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const messages = new PersistentVector<Donor>("m");

export const raised = new PersistentMap<string, u128>("pmap");