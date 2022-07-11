/* eslint-env node */
module.exports = {
	root: true,
	overrides: [
		{
			files: [ 'src/**' ],
			excludedFiles: [ 'src/**/*.test.[jt]s' ],
			extends: [
				'wikimedia/client-common',
				'wikimedia/vue3-es6'
			]
		},
		{
			files: [ '**/*.ts', '**/*.vue' ],
			plugins: [ '@typescript-eslint/eslint-plugin' ],
			parserOptions: {
				parser: '@typescript-eslint/parser',
				sourceType: 'module',
				tsConfigRootDir: __dirname,
				project: [ './tsconfig.json' ],
				extraFileExtensions: [ '.vue' ]
			},
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking'
			],
			rules: {
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': 'error',
				'jsdoc/require-param-type': 'off',
				'jsdoc/require-returns-type': 'off'
			}
		},
		{
			files: '**/*.vue',
			parser: 'vue-eslint-parser',
			extends: [
				'wikimedia/client-common',
				'wikimedia/vue3-es6'
			]
		},
		{
			files: [ '**/*.ts', '**/*.js' ],
			excludedFiles: 'src/**',
			extends: [
				'wikimedia/server'
			],
			rules: {
				strict: 'off'
			}
		}
	]
};
