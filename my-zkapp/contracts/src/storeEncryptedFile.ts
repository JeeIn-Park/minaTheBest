import { Field } from 'snarkyjs';

/**
 * Simulates storing an encrypted file and returning its hash.
 * @param encryptedData The encrypted data string.
 * @param iv The initialization vector used for encryption.
 * @returns A Field representing the hash of the stored file.
 */
export function storeEncryptedFile(encryptedData: string, iv: string): Field {
  // Combine data and IV to create a unique identifier
  const combinedData = encryptedData + iv;

  // Hash the combined data
  const hash = Field.fromJSON(combinedData); // Ensure you use an appropriate hashing mechanism

  // Simulate storage process (e.g., storing hash on-chain)
  console.log('Encrypted file stored with hash:', hash.toString());

  return hash;
}
