module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/jest.setup.js"],

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // ✅ Use ts-jest for TypeScript tests
  },

  transformIgnorePatterns: [
    "/node_modules/(?!(o1js|@toruslabs)/)", 
    "<rootDir>/dist/",
  ],

  testPathIgnorePatterns: [
    "<rootDir>/dist/", 
    "<rootDir>/my-zkapp/contracts/dist/", 
    "<rootDir>/my-zkapp/contracts/src/.*\\.js$" // ✅ Corrected regex for Windows compatibility
  ],

  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
