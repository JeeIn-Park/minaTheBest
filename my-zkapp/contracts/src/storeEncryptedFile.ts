import { Field, Poseidon } from 'snarkyjs';

export function storeEncryptedFile(encryptedData: string, iv: string): Field {
  const combinedData = encryptedData + iv;
  const hash = Poseidon.hash(combinedData.split('').map(char => Field(char.charCodeAt(0))));
  console.log('Encrypted file stored with hash:', hash.toString());
  return hash;
}