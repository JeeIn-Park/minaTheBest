import { Mina, PrivateKey, Poseidon, Field } from 'o1js';
import { ZkTorusDataVault } from './Add';
describe('ZkTorusDataVault', () => {
    let zkApp;
    let zkAppPrivateKey;
    beforeEach(async () => {
        // Set up Mina Local Blockchain
        Mina.LocalBlockchain();
        zkAppPrivateKey = PrivateKey.random();
        const zkAppAddress = zkAppPrivateKey.toPublicKey();
        zkApp = new ZkTorusDataVault(zkAppAddress);
        // Deploy zkApp
        await zkApp.deploy({
            verificationKey: undefined,
        });
    });
    test('should upload data hash to the blockchain', async () => {
        const data = "My super secret data";
        const dataHash = Poseidon.hash(data.split('').map((char) => Field(char.charCodeAt(0))));
        await zkApp.uploadData(dataHash);
        const storedHash = zkApp.storedDataHash.get();
        expect(storedHash).toEqual(dataHash);
    });
    test('should verify zkProof against stored hash', async () => {
        const data = "My super secret data";
        const dataHash = Poseidon.hash(data.split('').map((char) => Field(char.charCodeAt(0))));
        await zkApp.uploadData(dataHash);
        await zkApp.verifyProof(dataHash);
        console.log("Proof verified successfully!");
    });
});
