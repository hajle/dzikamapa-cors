import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		environment: 'happy-dom',
		setupFiles: ['src/test/setup.ts'],
		globals: true,
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['node_modules', 'dist', '.svelte-kit']
	},
	assetsInclude: ['**/*.geojson']
});
