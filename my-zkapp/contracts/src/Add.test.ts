import { Mina, PrivateKey, Poseidon, Field } from 'o1js';
import ZkTorusDataVault from './Add';

jest.setTimeout(60000); // ✅ Extend timeout for Mina zk-SNARK proof generation

describe('ZkTorusDataVault', () => {
  let zkApp: ZkTorusDataVault;
  let zkAppPrivateKey: PrivateKey;

  beforeAll(async () => {
    console.log("Compiling contract...");
    const { verificationKey } = await ZkTorusDataVault.compile();  // ✅ Ensures contract is compiled before deployment
  
    console.log("Setting up Mina Local Blockchain...");
    const localBlockchain = await Mina.LocalBlockchain(); // ✅ Add `await` here
    Mina.setActiveInstance(localBlockchain);
  });

  beforeEach(async () => {
    zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new ZkTorusDataVault(zkAppAddress);

    console.log("Deploying zkApp...");
    await zkApp.deploy({
      verificationKey: (await ZkTorusDataVault.compile()).verificationKey, // ✅ Get verification key
    });
  });

  test('should upload data hash to the blockchain', async () => {
    const data = "My super secret data";
    const dataHash = Poseidon.hash(
      data.split('').map((char) => Field(char.charCodeAt(0)))
    );

    console.log("Uploading data hash...");
    await zkApp.uploadData(dataHash);

    const storedHash = await zkApp.storedDataHash.get(); // ✅ Await this!
    expect(storedHash).toEqual(dataHash);
  });

  test('should verify zkProof against stored hash', async () => {
    const data = "My super secret data";
    const dataHash = Poseidon.hash(
      data.split('').map((char) => Field(char.charCodeAt(0)))
    );

    console.log("Uploading data hash...");
    await zkApp.uploadData(dataHash);

    console.log("Verifying zkProof...");
    await zkApp.verifyProof(dataHash);

    console.log("Proof verified successfully!");
  });
});
