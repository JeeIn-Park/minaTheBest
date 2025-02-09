var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SmartContract, state, State, method, Field } from 'o1js';
/**
 * ZkTorusDataVault Smart Contract
 * This contract stores a zk-SNARK proof of encrypted data and verifies ownership.
 */
export class ZkTorusDataVault extends SmartContract {
    constructor() {
        super(...arguments);
        this.storedDataHash = State();
    }
    /**
     * Upload encrypted data hash to the Mina blockchain.
     * @param dataHash - The Poseidon-hashed representation of encrypted data.
     * @returns {Promise<void>} - Ensures compatibility with Mina's `method` decorator.
     */
    uploadData(dataHash) {
        this.storedDataHash.set(dataHash);
        return Promise.resolve(); // Required for Mina's method signature
    }
    /**
     * Verify a zkProof against the stored hash.
     * @param proof - The zkProof of the encrypted data.
     * @returns {Promise<void>} - Ensures compatibility with Mina's `method` decorator.
     */
    verifyProof(proof) {
        const storedHash = this.storedDataHash.get();
        // 🔥 Fix: Ensure storedHash is linked to the on-chain state
        this.storedDataHash.requireEquals(storedHash);
        storedHash.assertEquals(proof, 'Proof does not match the stored data hash');
        return Promise.resolve();
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], ZkTorusDataVault.prototype, "storedDataHash", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", Promise)
], ZkTorusDataVault.prototype, "uploadData", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field]),
    __metadata("design:returntype", Promise)
], ZkTorusDataVault.prototype, "verifyProof", null);
