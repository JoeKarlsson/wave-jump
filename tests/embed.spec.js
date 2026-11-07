import { test, expect } from '@playwright/test'

// A stand-in for the project page on joekarlsson.com: a 16:9 box holding the game
// in a 1280x720 iframe scaled down to fit (src/scripts/scale-to-fit-embed.ts there),
// served from another origin, with enough page around it to scroll
const embeddingPage = `<!doctype html>
<style>body { margin: 0; } .spacer { height: 600px; } .box { width: 800px; aspect-ratio: 16 / 9; overflow: hidden; }
iframe { width: 1280px; height: 720px; border: 0; transform: scale(0.625); transform-origin: 0 0; }</style>
<div class="spacer"></div>
<div class="box"><iframe src="http://localhost:4173/" allow="fullscreen; gamepad; autoplay" allowfullscreen></iframe></div>
<div class="spacer" style="height: 3000px"></div>`

test.skip(({ isMobile }) => isMobile, 'joekarlsson.com only embeds games on wider screens')

async function openEmbed(page) {
  await page.route('http://127.0.0.1:4173/embedding-page', (route) => route.fulfill({ contentType: 'text/html', body: embeddingPage }))
  await page.goto('http://127.0.0.1:4173/embedding-page')
  await page.locator('iframe').scrollIntoViewIfNeeded()
  const frame = page.frameLocator('iframe')
  const findGameFrame = () => page.frames().find((candidate) => candidate.url().startsWith('http://localhost:4173'))
  await expect.poll(() => Boolean(findGameFrame())).toBe(true)
  const gameFrame = findGameFrame()
  await gameFrame.waitForFunction(() => window.game?.state.current === 'Splash', null, { timeout: 15000 })
  return { frame, gameFrame }
}

test('fits the embed box, starts on a click, and game keys never scroll the page', async ({ page }) => {
  const { frame, gameFrame } = await openEmbed(page)
  // Visible only once Phaser has scaled it to fit
  await expect(frame.locator('#content canvas')).toBeVisible()
  const box = await frame.locator('#content canvas').boundingBox()
  const container = await page.locator('.box').boundingBox()
  expect(box.x).toBeGreaterThanOrEqual(container.x - 1)
  expect(box.x + box.width).toBeLessThanOrEqual(container.x + container.width + 1)
  expect(box.y + box.height).toBeLessThanOrEqual(container.y + container.height + 1)

  await frame.locator('#content canvas').click()
  await gameFrame.waitForFunction(() => window.game.state.current === 'Game')
  const scrollBefore = await page.evaluate(() => window.scrollY)
  for (const key of ['Space', 'ArrowDown', 'ArrowRight']) {
    await page.keyboard.press(key)
  }
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore)
})

test('pauses while scrolled out of view and picks up again when back', async ({ page }) => {
  const { gameFrame } = await openEmbed(page)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(() => gameFrame.evaluate(() => window.game.paused)).toBe(true)
  await page.locator('iframe').scrollIntoViewIfNeeded()
  await expect.poll(() => gameFrame.evaluate(() => window.game.paused)).toBe(false)
})

test('goes full screen from inside the embed and fills the screen', async ({ page }) => {
  const { frame, gameFrame } = await openEmbed(page)
  const button = frame.getByRole('button', { name: 'Full screen' })
  await expect(button).toBeVisible()
  await button.click()
  await expect.poll(() => gameFrame.evaluate(() => !!document.fullscreenElement)).toBe(true)
  await expect(frame.getByRole('button', { name: 'Exit full screen' })).toBeVisible()
  // The scaled-down canvas grows to the full window once Phaser rescales
  const viewport = page.viewportSize()
  await expect.poll(async () => {
    const canvas = await gameFrame.locator('#content canvas').boundingBox()
    return Math.max(canvas.width / viewport.width, canvas.height / viewport.height)
  }).toBeGreaterThan(0.95)
  expect(await gameFrame.evaluate(() => document.activeElement?.className)).not.toBe('fullscreen-toggle')
})
