import { SmartContract, method, Field, State, state, PublicKey, Proof } from 'snarkyjs';

export class DataOwnershipContract extends SmartContract {
  @state(Field) storedHash = State<Field>();

  constructor(address: PublicKey) {
    super(address);
  }

  @method initialize(dataHash: Field) {
    this.storedHash.set(dataHash);
  }

  @method verifyProof(dataHash: Field, proof: Proof<Field, Field>) {
    proof.verify();
    const currentHash = this.storedHash.get();
    this.storedHash.assertEquals(currentHash);
    currentHash.assertEquals(dataHash);
  }
}