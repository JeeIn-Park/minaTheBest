import { Mina, PrivateKey, Poseidon, Field } from 'o1js';
import { ZkTorusDataVault } from './Add.js';

async function main() {
  console.log("Starting Mina zkApp interaction...");

  // Setup Mina Local Blockchain
  Mina.LocalBlockchain();
  const userKey = PrivateKey.random();
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  const zkApp = new ZkTorusDataVault(zkAppAddress);

  // Deploy the contract
  console.log("Deploying zkApp...");
  await zkApp.deploy({
    verificationKey: undefined, // Update this as per your setup
  });

  // Encrypt and hash data
  const data = "My secret file content";
  const dataHash = Poseidon.hash(
    data.split('').map((char) => Field(char.charCodeAt(0)))
  );

  // Upload data hash to Mina
  console.log("Uploading data hash to Mina...");
  await zkApp.uploadData(dataHash);
  console.log("Data uploaded!");

  // Verify proof against stored hash
  console.log("Verifying zkProof...");
  const proof = dataHash; // Example proof
  await zkApp.verifyProof(proof);
  console.log("Proof verified!");
}

main().catch((err) => console.error("Error:", err));
