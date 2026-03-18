import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import pkg from '../../package.json';

export default defineConfig({
  define: {
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false,
    '__VUE_PROD_DEVTOOLS__': false,
  },
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [vue()],
  base: './',
  build: {
    sourcemap: true,
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    minify: true,
    chunkSizeWarningLimit: 5000,
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') atRule.remove();
            },
          },
        },
        {
          postcssPlugin: 'remove-source-map-url',
          Once(css) {
            css.walkComments((comment) => {
              if (comment.text.includes('sourceMappingURL')) comment.remove();
            });
          },
        },
      ],
    },
  },
  server: {
    host: '127.0.0.1',
    port: pkg.env?.PORT ?? 3001,
  },
});
