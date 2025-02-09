module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ["<rootDir>/jest.setup.mjs"],

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
      useESM: true,
    },
  },
};
