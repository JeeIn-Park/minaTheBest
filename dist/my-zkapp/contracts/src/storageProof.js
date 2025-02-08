"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStorageProof = generateStorageProof;
const o1js_1 = require("o1js");
function stringToField(data) {
    return o1js_1.Poseidon.hash(data.split("").map(char => (0, o1js_1.Field)(char.charCodeAt(0))));
}
// Generate zk-SNARK proof of storage
function generateStorageProof(encryptedData, iv) {
    return o1js_1.Poseidon.hash([stringToField(encryptedData), stringToField(iv)]);
}
