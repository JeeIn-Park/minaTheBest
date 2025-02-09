import { SmartContract, method, Field, State, state, PublicKey, Proof } from 'snarkyjs';

export class DataOwnershipContract extends SmartContract {
  @state(Field) storedHash = State<Field>();

  constructor(address: PublicKey) {
    super(address);
  }

  // Initialize the contract state with the data hash
  @method init(dataHash: Field) {
    this.storedHash.set(dataHash);
  }

  // Verify the proof and match it against the stored hash
  @method verifyProof(dataHash: Field, proof: Proof<Field, Field>) {
    proof.verify(); // Verify the proof
    const currentHash = this.storedHash.get(); // Retrieve the stored hash
    this.storedHash.assertEquals(currentHash); // Ensure state matches
    currentHash.assertEquals(dataHash); // Validate the input hash
  }
}
