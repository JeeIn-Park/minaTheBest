export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }]
  },
  transformIgnorePatterns: ["/node_modules/(?!(o1js|@toruslabs|jsdom)/)"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/src/**/*.test.ts"],  // ✅ Ensures Jest only runs tests in `src/`
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],  // ✅ Exclude `dist/` from tests
};
