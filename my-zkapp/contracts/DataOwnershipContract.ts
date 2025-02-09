import { SmartContract, method, Field, state, State, PublicKey, Proof, Struct } from 'snarkyjs';

// Define the Public Input Structure for the Proof
export class PublicInput extends Struct({
  dataHash: Field,
}) {}

// Define the Proof subclass
export class DataOwnershipProof extends Proof<PublicInput, Field> {}

export class DataOwnershipContract extends SmartContract {
  @state(Field) storedHash = State<Field>();

  constructor(address: PublicKey) {
    super(address);
  }

  @method initialize(dataHash: Field) {
    this.storedHash.set(dataHash);
  }

  @method verifyProof(proof: DataOwnershipProof) {
    proof.verify(); // Validate proof
    const storedHash = this.storedHash.get(); // Get stored hash
    storedHash.assertEquals(proof.publicInput.dataHash); // Ensure proof matches stored data
  }
}
