/** @type {import('jest').Config} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    "ts-jest": {
      useESM: true, // Allows Jest to properly handle ES Modules
    },
  },
  transformIgnorePatterns: ["/node_modules/"],
};
