import { Mina, PrivateKey, AccountUpdate } from 'o1js';
import { Add } from '../src/Add';

async function deploy() {
  console.log("Compiling Add contract...");
  await Add.compile(); // Ensures contract is compiled before deployment

  console.log("Deploying Add contract...");
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  const zkApp = new Add(zkAppAddress);
  await zkApp.deploy({
    verificationKey: Add.verificationKey, // Required for deployment
  });

  console.log("Contract deployed at:", zkAppAddress.toBase58());
}

deploy().catch(console.error);
