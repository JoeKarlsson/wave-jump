import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/wave-jump/' : '/',

    publicDir: 'assets',

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            phaser: ['phaser-ce'],
          }
        }
      }
    },

    server: {
      port: 3000,
      open: true
    },

    // No aliases needed - Phaser is loaded globally via script tag

    define: {
      __DEV__: command === 'serve'
    }
  }
})
