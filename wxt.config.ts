import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: 'src',
	modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
	manifest: {
		name: 'Amazon Desponsor',
		short_name: 'Desponsor',
		permissions: ['storage']
	},
	autoIcons: {
		baseIconPath: 'assets/icon.png'
	},
	vite: () => ({
		plugins: [tailwindcss()]
	})
});
