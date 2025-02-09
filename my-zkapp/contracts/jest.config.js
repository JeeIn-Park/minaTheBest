/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm', // Use the ESM preset
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Treat .ts files as ESM
  moduleNameMapper: {
    '^(\\.{1,2}/.+)\\.js$': '$1', // Map .js imports to their source files
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }], // Transform TypeScript files with ESM support
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(tslib|o1js/node_modules/tslib))', // Ensure dependencies like `o1js` are transformed
  ],
};
