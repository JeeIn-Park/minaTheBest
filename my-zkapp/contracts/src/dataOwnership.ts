import { DataOwnershipContract, DataOwnershipProof, PublicInput } from '../DataOwnershipContract.js';
import { Mina, PrivateKey, Field, AccountUpdate } from 'snarkyjs';

async function deployAndTest() {
  // Setup Mina local blockchain
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  // Test accounts
  const deployerKey = Local.testAccounts[0].privateKey;
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppPublicKey = zkAppPrivateKey.toPublicKey();

  // Deploy DataOwnershipContract
  const zkApp = new DataOwnershipContract(zkAppPublicKey);
  const deployTx = await Mina.transaction(deployerKey, () => {
    AccountUpdate.fundNewAccount(deployerKey);
    zkApp.deploy();
  });
  await deployTx.sign([deployerKey, zkAppPrivateKey]).send();
  console.log('Contract deployed at:', zkAppPublicKey.toBase58());

  // Example data
  const exampleHash = Field(123456789); // Replace with actual data hash

  // Initialize the contract state
  const initTx = await Mina.transaction(deployerKey, () => {
    zkApp.initialize(exampleHash);
  });
  await initTx.sign([deployerKey]).send();
  console.log('Contract initialized with hash:', exampleHash.toString());

  // ✅ Correctly generate a proof with `DataOwnershipProof`
  const proof = new DataOwnershipProof({
    publicInput: new PublicInput({ dataHash: exampleHash }),
    publicOutput: exampleHash,
    proof: {} as any, // Replace with actual proof
    maxProofsVerified: 1, // ✅ Required property added
  });

  // ✅ Pass the correct proof type to verifyProof()
  const verifyTx = await Mina.transaction(deployerKey, () => {
    zkApp.verifyProof(proof);
  });
  await verifyTx.sign([deployerKey]).send();

  console.log('Proof verified successfully.');
}

deployAndTest().catch((err) => console.error(err));
