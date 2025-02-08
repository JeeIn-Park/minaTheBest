import { initializeTorus, storeEncryptedFile } from "./storeEncryptedFile";

async function testStorage() {
  await initializeTorus(); // First, authenticate with Torus

  const encryptedData = "This is my encrypted data"; // Replace with real encrypted data
  const storageProof = await storeEncryptedFile(encryptedData);

  console.log("Stored File Proof:", storageProof);
}

testStorage();