module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  testPathIgnorePatterns: ["/node_modules/"],
  collectCoverageFrom: ["src/**/*.js", "!src/tests/**", "!src/config/**"],
  testTimeout: 10000,
  verbose: true,
};
