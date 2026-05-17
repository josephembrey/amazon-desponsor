import path from 'node:path';
import type { Config } from 'prettier';

const config: Config = {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
	tailwindStylesheet: path.resolve(import.meta.dirname, '..', 'src/entrypoints/popup/app.css'),
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }]
};

export default config;
