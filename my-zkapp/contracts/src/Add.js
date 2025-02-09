import { SmartContract, state, State, method, Field } from 'o1js';
/**
 * ZkTorusDataVault Smart Contract
 * This contract stores a zk-SNARK proof of encrypted data and verifies ownership.
 */
export class ZkTorusDataVault extends SmartContract {
    @state(Field)
    storedDataHash = State();
    /**
     * Upload encrypted data hash to the Mina blockchain.
     * @param dataHash - The Poseidon-hashed representation of encrypted data.
     * @returns {Promise<void>} - Ensures compatibility with Mina's `method` decorator.
     */
    @method
    uploadData(dataHash) {
        this.storedDataHash.set(dataHash);
        return Promise.resolve(); // Required for Mina's method signature
    }
    /**
     * Verify a zkProof against the stored hash.
     * @param proof - The zkProof of the encrypted data.
     * @returns {Promise<void>} - Ensures compatibility with Mina's `method` decorator.
     */
    @method
    verifyProof(proof) {
        const storedHash = this.storedDataHash.get();
        // 🔥 Fix: Ensure storedHash is linked to the on-chain state
        this.storedDataHash.requireEquals(storedHash);
        storedHash.assertEquals(proof, 'Proof does not match the stored data hash');
        return Promise.resolve();
    }
}
