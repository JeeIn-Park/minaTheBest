import { DataOwnershipContract } from '../DataOwnershipContract.js';
import { Mina, PrivateKey, Field, Proof, AccountUpdate } from 'snarkyjs';

async function deployAndTest() {
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  const deployerKey = Local.testAccounts[0].privateKey;
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppPublicKey = zkAppPrivateKey.toPublicKey();

  const zkApp = new DataOwnershipContract(zkAppPublicKey);
  const deployTx = await Mina.transaction(deployerKey, () => {
    AccountUpdate.fundNewAccount(deployerKey);
    zkApp.deploy();
  });
  await deployTx.sign([deployerKey, zkAppPrivateKey]).send();

  console.log('Contract deployed at:', zkAppPublicKey.toBase58());

  const exampleHash = Field(12345);
  const proof = new Proof<Field, Field>({
    proof: { /* Proof data */ },
    publicInput: exampleHash,
    publicOutput: exampleHash,
    maxProofsVerified: 0,
  });

  const initTx = await Mina.transaction(deployerKey, () => {
    zkApp.initialize(exampleHash);
  });
  await initTx.sign([deployerKey]).send();

  console.log('Contract initialized with hash:', exampleHash.toString());

  const verifyTx = await Mina.transaction(deployerKey, () => {
    zkApp.verifyProof(exampleHash, proof);
  });
  await verifyTx.sign([deployerKey]).send();

  console.log('Proof verified successfully.');
}

deployAndTest().catch((err) => console.error(err));