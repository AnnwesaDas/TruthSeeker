module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  passWithNoTests: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!jest.config.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};


