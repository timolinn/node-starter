module.exports = {
	env: {
		'browser': true,
		'es6': true,
		'node': true,
		'shared-node-browser': true,
        'mocha': true,
        'jest': true,
	},
	extends: ['eslint:recommended'],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
		},
		sourceType: 'module',
	},
	rules: {
		'indent': ['error', 4],
		'linebreak-style': ['error', 'unix'],
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],
		'comma-dangle': ['error', 'always-multiline'],
		'no-case-declarations': 'off',
		'eqeqeq': 'warn',
		'quote-props': ['warn', 'consistent-as-needed'],
		'no-console': 0,
		'keyword-spacing': ['error']
	},
};
