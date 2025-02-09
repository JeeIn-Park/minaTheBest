import { JSDOM } from "jsdom";
import { Mina } from "o1js";

// Create a simulated DOM environment
const dom = new JSDOM();

// Assign global browser-like objects safely
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document
});

// Set up Mina local blockchain before tests (ensure async setup)
beforeAll(async () => {
  const localBlockchain = await Mina.LocalBlockchain();
  Mina.setActiveInstance(localBlockchain);
});
