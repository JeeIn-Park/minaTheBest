import { JSDOM } from "jsdom";
import { Mina } from 'o1js';

// Set up a global window object (needed for browser APIs in Node.js)
const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;

// Set up Mina local blockchain before tests
beforeAll(async () => {
  const localBlockchain = Mina.LocalBlockchain();
  Mina.setActiveInstance(localBlockchain);
});
