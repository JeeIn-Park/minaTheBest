const { JSDOM } = require("jsdom");

// ✅ Set up a global window object for browser-like environment
const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

console.log("✅ JSDOM initialized for Jest tests.");
