import { Mina, PrivateKey, Poseidon, Field, PublicKey } from 'o1js';
import { ZkTorusDataVault } from './Add.js';

describe('ZkTorusDataVault', () => {
  let zkApp: ZkTorusDataVault;
  let zkAppPrivateKey: PrivateKey;
  let zkAppAddress: PublicKey;  // ✅ Ensure this is declared

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new ZkTorusDataVault(zkAppAddress);

    await ZkTorusDataVault.compile();
    await zkApp.deploy({ verificationKey: undefined });
  });

  test('should upload data hash to the blockchain', async () => {
    const data = "My super secret data";
    const dataHash = Poseidon.hash(
      data.split('').map((char) => Field(char.charCodeAt(0)))
    );

    await Mina.transaction(zkAppPrivateKey.toPublicKey(), async () => {
      await zkApp.uploadData(dataHash);
    }).send();

    const txn = await Mina.transaction(zkAppPrivateKey.toPublicKey(), async () => {
      zkApp.storedDataHash.get();  // ✅ No `return` inside transaction
    });
    await txn.send();  // ✅ Send transaction after creating it

    const storedHash = zkApp.storedDataHash.get(); // ✅ Retrieve state after transaction


    expect(storedHash).toEqual(dataHash);
  });


  test('should verify zkProof against stored hash', async () => {
    const data = "My super secret data";
    const dataHash = Poseidon.hash(
      data.split('').map((char) => Field(char.charCodeAt(0)))
    );

    await zkApp.uploadData(dataHash);

    await zkApp.verifyProof(dataHash);
    console.log("Proof verified successfully!");
  });
});
