import { DataOwnershipContract } from './DataOwnershipContract.js';
import { Mina, PrivateKey, PublicKey, Field, Proof, AccountUpdate } from 'snarkyjs';

async function deployAndInteract() {
  // Setup local Mina blockchain
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  // Test accounts
  const deployerKey = Local.testAccounts[0].privateKey;
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppPublicKey = zkAppPrivateKey.toPublicKey();

  // Deploy DataOwnershipContract
  const zkAppInstance = new DataOwnershipContract(zkAppPublicKey);
  const deployTx = await Mina.transaction(deployerKey, () => {
    AccountUpdate.fundNewAccount(deployerKey);
    zkAppInstance.deploy();
  });
  await deployTx.sign([deployerKey, zkAppPrivateKey]).send();
  console.log('Contract deployed at:', zkAppPublicKey.toBase58());

  // Example data
  const exampleHash = Field(123456789); // Replace with actual data hash
  const proof = new Proof<Field, Field>(); // Replace with your actual proof generation logic

  // Initialize the contract with data hash
  const initTx = await Mina.transaction(deployerKey, () => {
    zkAppInstance.init(exampleHash);
  });
  await initTx.sign([deployerKey]).send();
  console.log('Contract initialized with hash:', exampleHash.toString());

  // Verify proof
  const verifyTx = await Mina.transaction(deployerKey, () => {
    zkAppInstance.verifyProof(exampleHash, proof);
  });
  await verifyTx.sign([deployerKey]).send();
  console.log('Proof verified successfully.');
}

deployAndInteract().catch((err) => console.error(err));
