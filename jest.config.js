module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Keep this as 'node' unless testing UI
  setupFiles: ["<rootDir>/jest.setup.js"], // This ensures JSDOM is loaded for all tests
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(o1js|@toruslabs)/)'],
};
