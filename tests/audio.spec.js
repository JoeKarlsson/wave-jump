import { test, expect } from '@playwright/test'

// On a real first visit Chrome keeps audio suspended until the player does
// something, and Phaser only resumes it on a canvas click. Headless Chrome
// doesn't apply that policy, so the test suspends audio itself.
test('audio resumes when the first thing a player does is press the spacebar', async ({ page, isMobile, browserName }) => {
  test.skip(isMobile, 'phones start with a tap, which Phaser already handles')
  test.skip(browserName === 'webkit', 'headless WebKit has no audio device, so its audio is always "interrupted"')
  await page.goto('/')
  await page.waitForFunction(() => window.game?.state.current === 'Splash', null, { timeout: 15000 })
  await page.evaluate(() => window.game.sound.context.suspend())
  await page.keyboard.press('Space')
  await expect.poll(() => page.evaluate(() => window.game.sound.context.state)).toBe('running')
})
