import { Mina, PrivateKey, PublicKey, Poseidon, Field } from 'o1js';
import { ZkTorusDataVault } from './Add';

describe('ZkTorusDataVault', () => {
  let zkApp: ZkTorusDataVault;
  let zkAppPrivateKey: PrivateKey;
  let feePayer: { publicKey: PublicKey; key: PrivateKey };

  beforeAll(async () => {
    // ✅ Compile the contract once before all tests
    await ZkTorusDataVault.compile();
  });

  beforeEach(async () => {
    // ✅ Initialize Mina Local Blockchain
    const localBlockchain = await Mina.LocalBlockchain();
    Mina.setActiveInstance(localBlockchain);

    // ✅ Use test account as fee payer
    feePayer = localBlockchain.testAccounts[0];

    zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new ZkTorusDataVault(zkAppAddress);

    // ✅ Deploy zkApp within a transaction
    const tx = await Mina.transaction(feePayer.publicKey, async () => {
      await zkApp.deploy({ verificationKey: undefined });
    });

    await tx.prove();
    await tx.sign([feePayer.key]); // ✅ Properly signing with fee payer's private key
    await tx.send();
  });

  test('should upload data hash to the blockchain', async () => {
    const data = "My super secret data";
    const dataHash = Poseidon.hash(
      data.split('').map((char) => Field(char.charCodeAt(0)))
    );

    // ✅ Wrap upload in a Mina transaction
    const tx = await Mina.transaction(feePayer.publicKey, async () => {
      await zkApp.uploadData(dataHash);
    });

    await tx.prove();
    await tx.sign([feePayer.key]); // ✅ Properly signing
    await tx.send();

    // ✅ Assert stored hash
    const storedHash = zkApp.storedDataHash.get();
    expect(storedHash).toEqual(dataHash);
  });

  test('should verify zkProof against stored hash', async () => {
    const data = "My super secret data";
    const dataHash = Poseidon.hash(
      data.split('').map((char) => Field(char.charCodeAt(0)))
    );

    // ✅ First, upload data within a transaction
    const txUpload = await Mina.transaction(feePayer.publicKey, async () => {
      await zkApp.uploadData(dataHash);
    });

    await txUpload.prove();
    await txUpload.sign([feePayer.key]);
    await txUpload.send();

    // ✅ Then, verify proof within a transaction
    const txVerify = await Mina.transaction(feePayer.publicKey, async () => {
      await zkApp.verifyProof(dataHash);
    });

    await txVerify.prove();
    await txVerify.sign([feePayer.key]);
    await txVerify.send();

    console.log("✅ Proof verified successfully!");
  });
});
