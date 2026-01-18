module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../common/$1'
  }
};
