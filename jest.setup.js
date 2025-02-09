const { JSDOM } = require("jsdom");
const { Mina } = require("o1js");

// Set up a global window object (needed for browser APIs in Node.js)
const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;

console.log("✅ JSDOM initialized for Jest tests.");

// Set up Mina local blockchain before tests
beforeAll(async () => {
  console.log("🌐 Setting up Mina Local Blockchain...");
  const localBlockchain = Mina.LocalBlockchain();
  Mina.setActiveInstance(localBlockchain);
  console.log("✅ Mina Local Blockchain is active.");
});
