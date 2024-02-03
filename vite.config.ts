import { defineConfig } from "vite";
import webExtension from "vite-plugin-web-extension";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	root: 'src',
	plugins: [
		webExtension({
			additionalInputs: [
				'error.html'
			]
		}),
		nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
	],
	build: {
    commonjsOptions: {
      transformMixedEsModules: true
    },
    outDir: '../dist'
  },
});