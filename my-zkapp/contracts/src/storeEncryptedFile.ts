import { Web3Storage, File } from 'web3.storage';

// 🔹 Replace with your Web3.Storage API Token
const WEB3_STORAGE_TOKEN = "your-api-key-here"; 

const client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });

export async function storeEncryptedFile(encryptedData: string) {
  try {
    // 🔹 Convert encrypted string into a File object
    const encryptedFile = new File([encryptedData], "encryptedData.txt", { type: "text/plain" });

    // 🔹 Upload to IPFS via Web3.Storage
    const cid = await client.put([encryptedFile]);
    console.log(`Stored in IPFS with CID: ${cid}`);

    return cid; // Returns the content identifier (CID)
  } catch (error) {
    console.error("IPFS Storage Error:", error);
    throw error;
  }
}
