module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Keep this as 'node' unless testing UI
  setupFiles: ["<rootDir>/jest.setup.js"], // Ensures JSDOM is loaded for all tests

  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(o1js|@toruslabs)/)', 
    '<rootDir>/dist/', // ✅ Ignore compiled test files in dist/
  ],

  testPathIgnorePatterns: [
    "<rootDir>/dist/", // ✅ Ensure Jest does not run tests in dist/
    "<rootDir>/my-zkapp/contracts/dist/", // ✅ Ignore contract dist tests
    "<rootDir>/my-zkapp/contracts/src/Add.test.js" // ✅ Prevent duplicate test runs
  ],

  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true, // Ensures ES module support in Jest
    },
  },
};
