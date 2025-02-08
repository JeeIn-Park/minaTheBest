"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTorus = initializeTorus;
exports.storeEncryptedFile = storeEncryptedFile;
const openlogin_1 = __importDefault(require("@toruslabs/openlogin"));
const openLogin = new openlogin_1.default({
    clientId: "BIBkmxEkPvb3RriKPd5DPqOLLc-RGZzpAK5go1N1KrFsvD2wqgyV7cENytbUj14Xd3Qlin0sJUERRRlEzU3m6Sg", // Replace with your actual Torus Client ID
    network: "testnet", // Change to 'mainnet' for production
});
async function initializeTorus() {
    await openLogin.init(); // Ensure initialization
    await openLogin.login({
        loginProvider: "google", // Use 'facebook', 'twitter', etc., if needed
    });
    console.log("Torus Login Successful. User private key:", openLogin.privKey);
}
async function storeEncryptedFile(encryptedData) {
    console.log("Simulating storing data in Torus: ", encryptedData);
    return `simulated-proof-${Date.now()}`;
}
