module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/jest.setup.mjs"],

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
    "<rootDir>/my-zkapp/contracts/src/.*\\.js$" // ✅ Fixed regex pattern
  ],

  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
