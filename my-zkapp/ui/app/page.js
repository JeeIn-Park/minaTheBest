'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';
import heroMinaLogo from '../public/assets/hero-mina-logo.svg';
import arrowRightSmall from '../public/assets/arrow-right-small.svg';
import { fetchAccount, Mina, PublicKey } from "o1js";
import { Add } from "../../contracts";
// We've already deployed the Add contract on testnet at this address
// https://minascan.io/devnet/account/B62qnTDEeYtBHBePA4yhCt4TCgDtA4L2CGvK7PirbJyX4pKH8bmtWe5
const zkAppAddress = "B62qnTDEeYtBHBePA4yhCt4TCgDtA4L2CGvK7PirbJyX4pKH8bmtWe5";
import './reactCOIServiceWorker';
export default function Home() {
    const zkApp = useRef(new Add(PublicKey.fromBase58(zkAppAddress)));
    const [transactionLink, setTransactionLink] = useState(null);
    const [contractState, setContractState] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    // fetch the zkapp state when the page loads
    useEffect(() => {
        (async () => {
            Mina.setActiveInstance(Mina.Network('https://api.minascan.io/node/devnet/v1/graphql'));
            await fetchAccount({ publicKey: zkAppAddress });
            const num = zkApp.current.num.get();
            setContractState(num.toString());
            // Compile the contract so that o1js has the proving key required to execute contract calls
            console.log("Compiling Add contract to generate proving and verification keys");
            await Add.compile();
            setLoading(false);
        })();
    }, []);
    const updateZkApp = useCallback(async () => {
        setTransactionLink(null);
        setLoading(true);
        try {
            // Retrieve Mina provider injected by browser extension wallet
            const mina = window.mina;
            const walletKey = (await mina.requestAccounts())[0];
            console.log("Connected wallet address: " + walletKey);
            await fetchAccount({ publicKey: PublicKey.fromBase58(walletKey) });
            // Execute a transaction locally on the browser
            const transaction = await Mina.transaction(async () => {
                console.log("Executing Add.update() locally");
                await zkApp.current.update();
            });
            // Prove execution of the contract using the proving key
            console.log("Proving execution of Add.update()");
            await transaction.prove();
            // Broadcast the transaction to the Mina network
            console.log("Broadcasting proof of execution to the Mina network");
            const { hash } = await mina.sendTransaction({ transaction: transaction.toJSON() });
            // display the link to the transaction
            const transactionLink = "https://minascan.io/devnet/tx/" + hash;
            setTransactionLink(transactionLink);
        }
        catch (e) {
            console.error(e.message);
            let errorMessage = "";
            if (e.message.includes("Cannot read properties of undefined (reading 'requestAccounts')")) {
                errorMessage = "Is Auro installed?";
            }
            else if (e.message.includes("Please create or restore wallet first.")) {
                errorMessage = "Have you created a wallet?";
            }
            else if (e.message.includes("User rejected the request.")) {
                errorMessage = "Did you grant the app permission to connect?";
            }
            else {
                errorMessage = "An unknown error occurred.";
            }
            setError(errorMessage);
        }
        finally {
            setLoading(false);
        }
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs(Head, { children: [_jsx("title", { children: "Mina zkApp UI" }), _jsx("meta", { name: "description", content: "built with o1js" }), _jsx("link", { rel: "icon", href: "/assets/favicon.ico" })] }), _jsx(GradientBG, { children: _jsxs("main", { className: styles.main, children: [_jsxs("div", { className: styles.center, children: [_jsx("a", { href: "https://minaprotocol.com/", target: "_blank", rel: "noopener noreferrer", children: _jsx(Image, { className: styles.logo, src: heroMinaLogo, alt: "Mina Logo", width: "191", height: "174", priority: true }) }), _jsxs("p", { className: styles.tagline, children: ["built with", _jsx("code", { className: styles.code, children: " o1js" })] })] }), _jsxs("p", { className: styles.start, children: ["Get started by editing", _jsx("code", { className: styles.code, children: " app/page.tsx" })] }), _jsx("div", { className: styles.state, children: _jsxs("div", { children: [_jsxs("div", { children: ["Contract State: ", _jsx("span", { className: styles.bold, children: contractState })] }), error ? (_jsxs("span", { className: styles.error, children: ["Error: ", error] })) : (loading ?
                                        _jsx("div", { children: "Loading..." }) :
                                        (transactionLink ?
                                            _jsx("a", { href: transactionLink, className: styles.bold, target: "_blank", rel: "noopener noreferrer", children: "View Transaction on MinaScan" }) :
                                            _jsx("button", { onClick: updateZkApp, className: styles.button, children: "Call Add.update()" })))] }) }), _jsxs("div", { className: styles.grid, children: [_jsxs("a", { href: "https://docs.minaprotocol.com/zkapps", className: styles.card, target: "_blank", rel: "noopener noreferrer", children: [_jsxs("h2", { children: [_jsx("span", { children: "DOCS" }), _jsx("div", { children: _jsx(Image, { src: arrowRightSmall, alt: "Mina Logo", width: 16, height: 16, priority: true }) })] }), _jsx("p", { children: "Explore zkApps, how to build one, and in-depth references" })] }), _jsxs("a", { href: "https://docs.minaprotocol.com/zkapps/tutorials/hello-world", className: styles.card, target: "_blank", rel: "noopener noreferrer", children: [_jsxs("h2", { children: [_jsx("span", { children: "TUTORIALS" }), _jsx("div", { children: _jsx(Image, { src: arrowRightSmall, alt: "Mina Logo", width: 16, height: 16, priority: true }) })] }), _jsx("p", { children: "Learn with step-by-step o1js tutorials" })] }), _jsxs("a", { href: "https://discord.gg/minaprotocol", className: styles.card, target: "_blank", rel: "noopener noreferrer", children: [_jsxs("h2", { children: [_jsx("span", { children: "QUESTIONS" }), _jsx("div", { children: _jsx(Image, { src: arrowRightSmall, alt: "Mina Logo", width: 16, height: 16, priority: true }) })] }), _jsx("p", { children: "Ask questions on our Discord server" })] }), _jsxs("a", { href: "https://docs.minaprotocol.com/zkapps/how-to-deploy-a-zkapp", className: styles.card, target: "_blank", rel: "noopener noreferrer", children: [_jsxs("h2", { children: [_jsx("span", { children: "DEPLOY" }), _jsx("div", { children: _jsx(Image, { src: arrowRightSmall, alt: "Mina Logo", width: 16, height: 16, priority: true }) })] }), _jsx("p", { children: "Deploy a zkApp to Testnet" })] })] })] }) })] }));
}
