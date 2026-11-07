import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

// Phaser CE is a UMD build that sets window.Phaser, so it loads as a classic
// script ahead of the game module. The arcade-physics build is all Wave Jump
// needs. In a build it's emitted with a content hash so it can be cached long.
function phaserClassicScript () {
  const phaserPath = fileURLToPath(
    new URL('./node_modules/phaser-ce/build/custom/phaser-arcade-physics.min.js', import.meta.url)
  )
  const source = readFileSync(phaserPath)
  const hash = createHash('sha256').update(source).digest('hex').slice(0, 8)
  let publicPath = '/phaser.js'

  return {
    name: 'phaser-classic-script',
    configResolved (config) {
      if (config.command === 'build') publicPath = `/assets/phaser-${hash}.js`
    },
    configureServer (server) {
      server.middlewares.use('/phaser.js', (_req, res) => {
        res.setHeader('Content-Type', 'text/javascript')
        res.end(source)
      })
    },
    buildStart () {
      if (publicPath !== '/phaser.js') {
        this.emitFile({ type: 'asset', fileName: publicPath.slice(1), source })
      }
    },
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace('src="/phaser.js"', `src="${publicPath}"`)
    }
  }
}

export default defineConfig({
  base: '/',
  publicDir: 'assets',
  plugins: [phaserClassicScript()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    port: 3000
  }
})
