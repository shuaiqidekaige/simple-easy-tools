module.exports = {
  roots: [ "<rootDir>/components/" ],
  setupFiles: ['./tests/setup.js'],
  setupFilesAfterEnv: ['./tests/setupFilesAfterEnv.js'],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  transform: {
    "\\.[jt]sx?$": './jest.babel.js'
  },
};