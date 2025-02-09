import { SmartContract, Field, state, State, method, PublicKey, Proof, Poseidon } from 'snarkyjs';

// Function to convert a string into a Field element using Poseidon hash
function stringToField(data: string): Field {
  return Poseidon.hash(data.split("").map(char => Field(char.charCodeAt(0))));
}

// Generate zk-SNARK proof of storage
export function generateStorageProof(encryptedData: string, iv: string): Field {
  return Poseidon.hash([stringToField(encryptedData), stringToField(iv)]);
}

// Define zkApp Contract for Data Ownership Verification
export class DataOwnershipContract extends SmartContract {
  @state(Field) storedHash = State<Field>();

  @method storeDataHash(dataHash: Field) {
    this.storedHash.set(dataHash);
  }

  @method verifyProof(dataHash: Field, proof: Proof) {
    proof.verify();
    this.storedHash.assertEquals(dataHash);
  }
}
