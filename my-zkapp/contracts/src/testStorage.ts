import { encryptData } from './encryptData';
import { generateStorageProof } from './storageProof';
import { storeEncryptedFile } from './storeEncryptedFile';
import crypto from 'crypto';

async function testStorage() {
  const key = crypto.randomBytes(32);
  const fileContent = "My super secret data";

  // 1️⃣ Encrypt data
  const { encrypted, iv } = encryptData(fileContent, key);
  console.log("Encrypted Data:", encrypted);

  // 2️⃣ Generate zkProof
  const proof = generateStorageProof(encrypted, iv);
  console.log("zk-SNARK Proof:", proof.toString());

  // 3️⃣ Store on Torus
  const storageProof = await storeEncryptedFile(encrypted);
  console.log("Storage Proof from Torus:", storageProof);
}

testStorage();
