// Renders the PNG icons from favicon.svg and the 1200x630 social card from the
// title screen. Run after `npm run build` with `npx vite preview` on port 4173.
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const svg = readFileSync('assets/favicon.svg', 'utf8')
const browser = await chromium.launch()

for (const [file, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(`<style>*{margin:0}svg{width:${size}px;height:${size}px;display:block}</style>${svg}`)
  await page.screenshot({ path: `assets/${file}`, omitBackground: true })
  await page.close()
}

const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.goto('http://localhost:4173/')
await page.waitForFunction(() => window.game?.state.current === 'Splash')
await page.evaluate(() => {
  // The "press the spacebar" prompt sits at the bottom edge and gets cut off at 630px tall
  window.game.world.children.filter((child) => child instanceof window.Phaser.Text).forEach((text) => { text.visible = false })
})
await page.waitForTimeout(1500)
await page.screenshot({ path: 'assets/og-image.jpg', type: 'jpeg', quality: 85 })
await browser.close()
