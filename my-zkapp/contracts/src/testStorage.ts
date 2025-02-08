import * as crypto from 'crypto';
import { encryptData } from "./encryptData";
import { generateStorageProof } from './storageProof';
import { storeEncryptedFile } from './storeEncryptedFile';
import { Mina, PrivateKey, Poseidon, Field } from 'o1js';
import { ZkTorusDataVault } from './Add.js';

async function testStorage() {
  // Setup Mina Local Blockchain
  Mina.LocalBlockchain();
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const zkApp = new ZkTorusDataVault(zkAppAddress);

  console.log("Deploying zkApp...");
  await zkApp.deploy();

  // 1️⃣ Encrypt data
  const key = crypto.randomBytes(32);
  const fileContent = "My super secret data";
  const { encrypted, iv } = encryptData(fileContent, key);
  console.log("Encrypted Data:", encrypted);

  // 2️⃣ Generate zkProof
  const proof = generateStorageProof(encrypted, iv);
  console.log("zk-SNARK Proof:", proof.toString());

  // 3️⃣ Store on Torus
  const storageProof = await storeEncryptedFile(encrypted);
  console.log("Storage Proof from Torus:", storageProof);

  // 4️⃣ Store proof hash in Mina
  const dataHash = Poseidon.hash(
    Array.from(Buffer.from(encrypted)).map(byte => Field(byte))
  );
  console.log("Uploading data hash to Mina...");
  await zkApp.uploadData(dataHash);
  console.log("Data hash uploaded!");

  // 5️⃣ Verify proof in Mina
  console.log("Verifying zkProof...");
  await zkApp.verifyProof(dataHash);
  console.log("zkProof verified!");
}

testStorage().catch((err) => console.error("Error:", err));
