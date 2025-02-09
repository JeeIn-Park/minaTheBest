import { generateStorageProof } from '../my-zkapp/contracts/src/storageProof.js';
import { DataOwnershipContract } from '../my-zkapp/contracts/DataOwnershipContract.js';
import { Field, PrivateKey, Mina, AccountUpdate, Bool, Proof } from 'snarkyjs';

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

    // Generate storage proof
    const proofField = generateStorageProof(encryptedData, iv) as unknown as Field;
    console.log('Generated proof:', proofField.toString());

    // Store data hash in zkApp
    const storeTx = await Mina.transaction(deployerKey, () => {
        zkApp.storeDataHash(proofField);
    });
    await storeTx.sign([deployerKey]).send();
    console.log('Data hash stored in zkApp.');

    // Verify the proof
    const isValid = await zkApp.verifyProof(proofField, proofField as unknown as Proof<Field, Field>) as unknown as Bool;
    console.log('Is the proof valid?', isValid.toBoolean());
}

main().catch((err) => console.error(err));