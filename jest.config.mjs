import nextJest from 'next/jest.js';
const createJestConfig = nextJest({ dir: './' });
export default createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.[jt]s?(x)',
    '<rootDir>/tests/unit/**/*.test.mjs',
  ],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/$1' },
  coverageProvider: 'v8',
  collectCoverageFrom: ['app/**/*.{ts,tsx}', '!app/**/*.d.ts'],
  coverageReporters: ['text', 'json-summary', 'lcov'],
});
