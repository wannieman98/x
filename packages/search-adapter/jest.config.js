module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./src/__tests__/tests.setup.ts'],
  testMatch: ['<rootDir>/**/*.spec.ts'],
  modulePaths: ['node_modules'],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
