import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    sourcemap: true,
    lib: {
      entry: {
        math: './src/math.ts',
        logger: './src/logger.ts',
      },
      formats: ['es', 'cjs'],
    },
  },
})
