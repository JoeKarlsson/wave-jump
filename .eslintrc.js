module.exports = {
	extends: ['airbnb-base', 'prettier'],
	rules: {
		'import/no-named-as-default': 0,
		'no-underscore-dangle': 'off',
		'space-in-parens': 0,
		'no-plusplus': 0,
		'no-use-before-define': 0,
		'padded-blocks': 0,
		'no-param-reassign': 0,
		'consistent-return': 0,
		'no-bitwise': 0,
		'no-shadow': 0,
		'arrow-body-style': 0,
		'no-tabs': 0,
		'function-paren-newline': ['error', 'consistent'],
	},
	env: {
		node: true,
	},
	env: {
		browser: true,
		node: true,
	},
	plugins: ['prettier'],
};
