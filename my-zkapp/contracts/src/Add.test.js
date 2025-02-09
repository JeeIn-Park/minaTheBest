import { AccountUpdate, Field, Mina, PrivateKey } from 'o1js';
import { Add } from './Add.js';

const proofsEnabled = false;

describe('Add', () => {
    let deployerAccount, deployerKey, senderAccount, senderKey;
    let zkAppAddress, zkAppPrivateKey, zkApp;
    let localBlockchain;

    beforeAll(async () => {
        console.log("🔄 Compiling zkApp...");
        await Add.compile();
    });

    beforeEach(async () => {
        console.log("🔄 Setting up Mina LocalBlockchain...");
        localBlockchain = await Mina.LocalBlockchain({ proofsEnabled }); // ✅ Now awaited
        Mina.setActiveInstance(localBlockchain);

        deployerAccount = localBlockchain.testAccounts[0];
        senderAccount = localBlockchain.testAccounts[1];

        deployerKey = deployerAccount.privateKey;
        senderKey = senderAccount.privateKey;

        zkAppPrivateKey = PrivateKey.random();
        zkAppAddress = zkAppPrivateKey.toPublicKey();
        zkApp = new Add(zkAppAddress);
    });

    async function localDeploy() {
        const txn = await Mina.transaction(deployerAccount, async () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            await zkApp.deploy(); // ✅ Awaiting deploy for stability
        });

        await txn.prove();
        await txn.sign([deployerKey, zkAppPrivateKey]).send();
    }

    it('generates and deploys the `Add` smart contract', async () => {
        await localDeploy();
        
        // ✅ Fetch latest state before getting value
        await zkApp.num.fetch();
        const num = zkApp.num.get();
        expect(num).toEqual(new Field(1));
    });

    it('correctly updates the num state on the `Add` smart contract', async () => {
        await localDeploy();

        const txn = await Mina.transaction(senderAccount, async () => {
            zkApp.update();
        });

        await txn.prove();
        await txn.sign([senderKey]).send();

        // ✅ Fetch latest state before assertion
        await zkApp.num.fetch();
        const updatedNum = zkApp.num.get();
        expect(updatedNum).toEqual(new Field(3));
    });
});
