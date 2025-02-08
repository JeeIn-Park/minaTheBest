"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const o1js_1 = require("o1js");
const Add_js_1 = require("./Add.js");
async function main() {
    console.log("Starting Mina zkApp interaction...");
    // 🔥 Fix: Await Mina Local Blockchain Initialization
    const Local = await o1js_1.Mina.LocalBlockchain();
    o1js_1.Mina.setActiveInstance(Local);
    // Generate keys
    const userKey = o1js_1.PrivateKey.random();
    const zkAppPrivateKey = o1js_1.PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();
    const zkApp = new Add_js_1.ZkTorusDataVault(zkAppAddress);
    // 🔥 Fix: **Compile the contract before deploying**
    console.log("Compiling zkApp...");
    await Add_js_1.ZkTorusDataVault.compile(); // ✅ This caches the verification key
    // Deploy the contract
    console.log("Deploying zkApp...");
    await zkApp.deploy({
        verificationKey: undefined, // Now the key is cached and used internally
    });
    // Encrypt and hash data
    const data = "My secret file content";
    const dataHash = o1js_1.Poseidon.hash(data.split('').map((char) => (0, o1js_1.Field)(char.charCodeAt(0))));
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
