module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Keep this as 'node' unless testing UI
  setupFiles: ["<rootDir>/jest.setup.js"], // Ensures JSDOM is loaded for all tests

  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },

  transformIgnorePatterns: ['/node_modules/(?!(o1js|@toruslabs)/)'],

  // ✅ Add this to ensure Jest handles ES modules properly
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true, // Ensures ES module support in Jest
    },
  },
};
