import { SmartContract, State, Field } from 'o1js';
/**
 * ZkTorusDataVault Smart Contract
 * This contract stores a zk-SNARK proof of encrypted data and verifies ownership.
 */
export declare class ZkTorusDataVault extends SmartContract {
    storedDataHash: State<import("o1js/dist/node/lib/provable/field").Field>;
    /**
     * Upload encrypted data hash to the Mina blockchain.
     * @param dataHash - The Poseidon-hashed representation of encrypted data.
     * @returns {Promise<void>} - Ensures compatibility with Mina's `method` decorator.
     */
    uploadData(dataHash: Field): Promise<void>;
    /**
     * Verify a zkProof against the stored hash.
     * @param proof - The zkProof of the encrypted data.
     * @returns {Promise<void>} - Ensures compatibility with Mina's `method` decorator.
     */
    verifyProof(proof: Field): Promise<void>;
}
