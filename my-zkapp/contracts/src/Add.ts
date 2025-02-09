import { SmartContract, state, State, method, Field, PrivateKey, PublicKey } from 'o1js';

/**
 * ZkTorusDataVault Smart Contract
 * This contract stores a zk-SNARK proof of encrypted data and verifies ownership.
 */
export default class Add extends SmartContract {
  @state(Field) storedDataHash = State<Field>();

  /**
   * Upload encrypted data hash to the Mina blockchain.
   * @param dataHash - The Poseidon-hashed representation of encrypted data.
   */
  @method
  async uploadData(dataHash: Field): Promise<void> {
    this.storedDataHash.set(dataHash);
  }

  /**
   * Verify a zkProof against the stored hash.
   * @param proof - The zkProof of the encrypted data.
   */
  @method
  async verifyProof(proof: Field): Promise<void> {
    const storedHash = this.storedDataHash.get();

    // 🔥 Fix: Ensure storedHash is linked to the on-chain state
    this.storedDataHash.requireEquals(storedHash);

    storedHash.assertEquals(proof, 'Proof does not match the stored data hash');
  }

  /**
   * 🔥 Helper function to compile and deploy the contract
   */
  static async compileAndDeploy(): Promise<Add> {
    console.log("🔹 Compiling Add contract...");
    const { verificationKey } = await Add.compile(); // ✅ Get verification key from compile()

    console.log("🔹 Generating keys...");
    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey(); // ✅ Get a valid address

    console.log("🔹 Deploying Add contract to address:", zkAppAddress.toBase58());
    const zkApp = new Add(zkAppAddress); // ✅ Create instance with generated address

    await zkApp.deploy({
      verificationKey, // ✅ Correct way to pass verification key
    });

    console.log("✅ Deployment complete!");
    return zkApp;
  }
}
