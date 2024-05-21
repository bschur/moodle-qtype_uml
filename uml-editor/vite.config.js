import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'main.js',
        assetFileNames: 'styles.css',
      },
      input: 'build.js',
    },
    outDir: './dist/build',
  },
})
