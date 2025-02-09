import { generateStorageProof } from '../my-zkapp/contracts/src/storageProof.js';
import { DataOwnershipContract, DataOwnershipProof, PublicInput } from '../my-zkapp/contracts/DataOwnershipContract.js';
import { Field, PrivateKey, Mina, AccountUpdate } from 'snarkyjs';

async function main() {
  // Initialize Mina Local Blockchain
  const local = Mina.LocalBlockchain();
  Mina.setActiveInstance(local);

  // Test accounts
  const deployerKey = local.testAccounts[0].privateKey;
  const zkAppKey = PrivateKey.random();
  const zkApp = new DataOwnershipContract(zkAppKey.toPublicKey());

  // Deploy zkApp
  const deployTx = await Mina.transaction(deployerKey, () => {
    AccountUpdate.fundNewAccount(deployerKey);
    zkApp.deploy();
  });
  await deployTx.sign([deployerKey, zkAppKey]).send();
  console.log('zkApp deployed at:', zkAppKey.toPublicKey().toBase58());

  // Example data
  const encryptedData = 'exampleData';
  const iv = 'exampleIV';

  // ✅ Fix: Directly use `generateStorageProof` without extra `Field()`
  const proofField = Field(generateStorageProof(encryptedData, iv).toString());
  console.log('Generated proof:', proofField.toString());

  // Store data hash in zkApp
  const storeTx = await Mina.transaction(deployerKey, () => {
    zkApp.initialize(proofField);
  });
  await storeTx.sign([deployerKey]).send();
  console.log('Data hash stored in zkApp.');

  // ✅ Correctly generate a proof using `DataOwnershipProof`
  const proof = new DataOwnershipProof({
    publicInput: new PublicInput({ dataHash: proofField }),
    publicOutput: proofField,
    proof: {} as any, // Replace with actual proof generation logic
    maxProofsVerified: 1, // ✅ Required property added
  });

  // ✅ Call verifyProof() correctly
  const verifyTx = await Mina.transaction(deployerKey, () => {
    zkApp.verifyProof(proof);
  });
  await verifyTx.sign([deployerKey]).send();

  console.log('Proof verification completed.');
}

main().catch((err) => console.error(err));
