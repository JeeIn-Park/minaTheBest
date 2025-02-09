import { JSDOM } from "jsdom";

// Set up a global window object for browser-like environment
const dom = new JSDOM();
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

console.log("✅ JSDOM initialized in Contracts Jest setup.");
