import { Mina, PrivateKey, Poseidon, Field, fetchAccount } from 'o1js';
import ZkTorusDataVault from './Add.js';

async function main() {
  console.log("Starting Mina zkApp interaction...");

  // 🔥 Setup Mina Local Blockchain
  const Local = await Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  // Generate keys
  const userKey = PrivateKey.random();
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  const zkApp = new ZkTorusDataVault(zkAppAddress);

  // 🔥 Compile the contract
  console.log("Compiling zkApp...");
  await ZkTorusDataVault.compile();  

  // 🔥 Deploy the contract
  console.log("Deploying zkApp...");
  await zkApp.deploy({ verificationKey: undefined });

  // 🔥 Fetch account after deployment
  console.log("Fetching zkApp account...");
  await fetchAccount({ publicKey: zkAppAddress });

  // Encrypt and hash data
  const data = "My secret file content";
  const dataHash = Poseidon.hash(
    data.split('').map((char) => Field(char.charCodeAt(0)))
  );

  // Upload data hash to Mina
  console.log("Uploading data hash to Mina...");
  await zkApp.uploadData(dataHash);
  console.log("Data uploaded!");

  // 🔥 Fetch account again before verifying proof
  console.log("Fetching zkApp account before verifying proof...");
  await fetchAccount({ publicKey: zkAppAddress });

  // Verify proof against stored hash
  console.log("Verifying zkProof...");
  const proof = dataHash; // Example proof
  await zkApp.verifyProof(proof);
  console.log("Proof verified!");
}

main().catch((err) => console.error("Error:", err));
