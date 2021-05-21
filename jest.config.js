module.exports = {
	verbose: true,
	reporters: ['default','<rootDir>/asma.jest.js'],
	roots: [ "<rootDir>/test-cases/__tests__/"],
	setupTestFrameworkScriptFile: "./setup.js"
};

