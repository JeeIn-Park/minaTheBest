import { Mina, PrivateKey, PublicKey, Poseidon, Field } from 'o1js';
import Torus from "@toruslabs/torus-embed";  // ✅ Import Torus
import { ZkTorusDataVault } from './Add';

describe('ZkTorusDataVault', () => {
  let zkApp: ZkTorusDataVault;
  let zkAppPrivateKey: PrivateKey;
  let feePayer: { publicKey: PublicKey; key: PrivateKey };
  let torus: Torus; // ✅ Add Torus instance

  beforeAll(async () => {
    console.log("🚀 Initializing Torus...");
    torus = new Torus();
    await torus.init();
    console.log("✅ Torus initialized.");

    console.log("🔧 Compiling zk-SNARK contract...");
    await ZkTorusDataVault.compile();
    console.log("✅ Compilation complete.");
  });

  beforeEach(async () => {
    console.log("🌐 Initializing Mina Local Blockchain...");
    const localBlockchain = await Mina.LocalBlockchain();
    Mina.setActiveInstance(localBlockchain);
    console.log("✅ Mina Local Blockchain initialized.");

    console.log("🔑 Setting up fee payer...");
    feePayer = localBlockchain.testAccounts[0];
    console.log(`✅ Fee payer: ${feePayer.publicKey.toBase58()}`);

    zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new ZkTorusDataVault(zkAppAddress);

    console.log("🚀 Deploying zkApp...");
    const tx = await Mina.transaction(feePayer.publicKey, async () => {
      await zkApp.deploy({ verificationKey: ZkTorusDataVault._verificationKey });
    });

    await tx.prove();
    console.log("✅ Transaction proof generated.");
    
    await tx.sign([feePayer.key]);
    console.log("✅ Transaction signed.");
    
    await tx.send();
    console.log("✅ zkApp deployed successfully.");
  });

  test('should upload data hash to the blockchain', async () => {
    console.log("📤 Uploading data hash to zkApp...");
    const data = "My super secret data";
    const dataHash = Poseidon.hash(
      data.split('').map((char) => Field(char.charCodeAt(0)))
    );

    const tx = await Mina.transaction(feePayer.publicKey, async () => {
      await zkApp.uploadData(dataHash);
    });

    await tx.prove();
    console.log("✅ Transaction proof generated.");

    await tx.sign([feePayer.key]);
    console.log("✅ Transaction signed.");

    await tx.send();
    console.log("✅ Data hash uploaded successfully.");

    const storedHash = zkApp.storedDataHash.get();
    console.log(`🔍 Stored hash: ${storedHash.toString()}`);
    expect(storedHash).toEqual(dataHash);
  });

  test('should verify zkProof against stored hash', async () => {
    console.log("📤 Uploading data hash for verification...");
    const data = "My super secret data";
    const dataHash = Poseidon.hash(
      data.split('').map((char) => Field(char.charCodeAt(0)))
    );

    // ✅ First, upload data within a transaction
    const txUpload = await Mina.transaction(feePayer.publicKey, async () => {
      await zkApp.uploadData(dataHash);
    });

    await txUpload.prove();
    console.log("✅ Upload proof generated.");
    
    await txUpload.sign([feePayer.key]);
    console.log("✅ Upload transaction signed.");
    
    await txUpload.send();
    console.log("✅ Data hash uploaded.");

    // ✅ Then, verify proof within a transaction
    console.log("🔍 Verifying zkProof...");
    const txVerify = await Mina.transaction(feePayer.publicKey, async () => {
      await zkApp.verifyProof(dataHash);
    });

    await txVerify.prove();
    console.log("✅ Verification proof generated.");
    
    await txVerify.sign([feePayer.key]);
    console.log("✅ Verification transaction signed.");
    
    await txVerify.send();
    console.log("✅ Proof verified successfully!");
  });
});
