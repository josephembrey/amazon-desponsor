import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: 'src',
	modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
	autoIcons: {
		baseIconPath: 'assets/icon.svg'
	},
	vite: () => ({
		plugins: [tailwindcss()]
	})
});
