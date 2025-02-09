module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Keep this as 'node' since it's for contracts
  setupFiles: ["<rootDir>/jest.setup.js"], // Ensures JSDOM is loaded for all tests

  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },

  transformIgnorePatterns: ['/node_modules/(?!(o1js|@toruslabs)/)'],

  // ✅ Ensure Jest handles ES modules correctly
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true, // Ensures ES module support in Jest for Mina contracts
    },
  },
};
