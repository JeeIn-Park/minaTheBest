"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const encryptData_1 = require("./encryptData");
const storageProof_1 = require("./storageProof");
const storeEncryptedFile_1 = require("./storeEncryptedFile");
const o1js_1 = require("o1js");
const Add_js_1 = require("./Add.js");
async function testStorage() {
    // Setup Mina Local Blockchain
    o1js_1.Mina.LocalBlockchain();
    const zkAppPrivateKey = o1js_1.PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();
    const zkApp = new Add_js_1.ZkTorusDataVault(zkAppAddress);
    console.log("Deploying zkApp...");
    await zkApp.deploy();
    // 1️⃣ Encrypt data
    const key = crypto.randomBytes(32);
    const fileContent = "My super secret data";
    const { encrypted, iv } = (0, encryptData_1.encryptData)(fileContent, key);
    console.log("Encrypted Data:", encrypted);
    // 2️⃣ Generate zkProof
    const proof = (0, storageProof_1.generateStorageProof)(encrypted, iv);
    console.log("zk-SNARK Proof:", proof.toString());
    // 3️⃣ Store on Torus
    const storageProof = await (0, storeEncryptedFile_1.storeEncryptedFile)(encrypted);
    console.log("Storage Proof from Torus:", storageProof);
    // 4️⃣ Store proof hash in Mina
    const dataHash = o1js_1.Poseidon.hash(Array.from(Buffer.from(encrypted)).map(byte => (0, o1js_1.Field)(byte)));
    console.log("Uploading data hash to Mina...");
    await zkApp.uploadData(dataHash);
    console.log("Data hash uploaded!");
    // 5️⃣ Verify proof in Mina
    console.log("Verifying zkProof...");
    await zkApp.verifyProof(dataHash);
    console.log("zkProof verified!");
}
testStorage().catch((err) => console.error("Error:", err));
