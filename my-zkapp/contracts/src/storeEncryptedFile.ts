import OpenLogin from "@toruslabs/openlogin";

const openLogin = new OpenLogin({
  clientId: "BIBkmxEkPvb3RriKPd5DPqOLLc-RGZzpAK5go1N1KrFsvD2wqgyV7cENytbUj14Xd3Qlin0sJUERRRlEzU3m6Sg", // Replace with your actual Torus Client ID
  network: "testnet", // Change to 'mainnet' for production
});

export async function initializeTorus() {
  await openLogin.init(); // Ensure initialization
  await openLogin.login({
    loginProvider: "google", // Use 'facebook', 'twitter', etc., if needed
  });
  console.log("Torus Login Successful. User private key:", openLogin.privKey);
}

export async function storeEncryptedFile(encryptedData: string) {
  console.log("Simulating storing data in Torus: ", encryptedData);
  return `simulated-proof-${Date.now()}`;
}
