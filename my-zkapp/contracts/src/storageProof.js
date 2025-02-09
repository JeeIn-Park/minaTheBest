import { Field, Poseidon } from 'o1js';
function stringToField(data) {
    return Poseidon.hash(data.split("").map(char => Field(char.charCodeAt(0))));
}
// Generate zk-SNARK proof of storage
export function generateStorageProof(encryptedData, iv) {
    return Poseidon.hash([stringToField(encryptedData), stringToField(iv)]);
}
