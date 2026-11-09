import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Collects console errors, page errors and failed requests so each test can assert none happened
function watchForErrors (page) {
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.url()}`))
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()}: ${response.url()}`)
  })
  return errors
}

test('head metadata is complete', async ({ page, request }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Wave Jump/)
  const description = await page.locator('meta[name="description"]').getAttribute('content')
  expect(description.length).toBeLessThanOrEqual(160)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://wavejump.joekarlsson.com/')
  await expect(page.locator('meta[name="darkreader-lock"]')).toHaveCount(1)
  await expect(page.locator('h1')).toHaveCount(1)
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
  for (const path of [new URL(ogImage).pathname, '/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png',
    '/icon-192.png', '/icon-512.png', '/site.webmanifest', '/robots.txt', '/sitemap.xml']) {
    expect((await request.get(path)).status(), path).toBe(200)
  }
})

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'keyboard game')

  test('plays from the title screen into a round without errors or runaway timers', async ({ page }) => {
    // Count every setInterval the game starts; it once started one per frame and never cleared them
    await page.addInitScript(() => {
      window.__intervalCount = 0
      const originalSetInterval = window.setInterval
      window.setInterval = (...args) => {
        window.__intervalCount++
        return originalSetInterval(...args)
      }
    })
    const errors = watchForErrors(page)
    await page.goto('/')

    await expect(page.locator('#content canvas')).toBeVisible()
    await page.waitForFunction(() => window.game?.state.current === 'Splash')
    await page.locator('#content canvas').click()
    // The game polls isDown once a frame, so hold the key like a person would
    await page.keyboard.down('Space')
    await page.waitForFunction(() => window.game.state.current === 'Game')
    await page.keyboard.up('Space')

    // Both players land on the wave instead of falling through it, and the gate is on screen
    await page.waitForTimeout(1500)
    const layout = await page.evaluate(() => {
      const round = window.game.state.states.Game
      return {
        landed: [round.player1.y, round.player2.y].every((y) => y < round.waves.y + 250),
        gateOnScreen: round.raceGate.y > 0 && round.raceGate.y < window.game.height
      }
    })
    expect(layout).toEqual({ landed: true, gateOnScreen: true })

    // Trails show while a player steers and stop when they let go
    const trails = () => page.evaluate(() => {
      const round = window.game.state.states.Game
      return [round.emitter1.on, round.emitter2.on]
    })
    // Steer both players toward the outer edges, away from the gate (it spawns in
    // the middle third), so the round can't end mid-test
    await page.keyboard.down('a')
    await page.keyboard.down('ArrowRight')
    await page.waitForTimeout(300)
    expect(await trails()).toEqual([true, true])
    await page.keyboard.up('a')
    await page.keyboard.up('ArrowRight')
    await page.waitForTimeout(100)
    expect(await page.evaluate(() => window.game.state.current)).toBe('Game')
    expect(await trails()).toEqual([false, false])

    // Keep playing a while so a leaking timer would pile up
    await page.waitForTimeout(1500)

    expect(await page.evaluate(() => window.__intervalCount)).toBeLessThan(5)
    await expect(page.locator('.keyboard-notice')).toBeHidden()
    const overflow = await page.evaluate(() => ({
      wide: document.documentElement.scrollWidth > window.innerWidth,
      tall: document.documentElement.scrollHeight > window.innerHeight
    }))
    expect(overflow).toEqual({ wide: false, tall: false })
    expect(errors).toEqual([])
  })
})

test.describe('small window', () => {
  test.skip(({ isMobile }) => isMobile, 'keyboard game')
  test.use({ viewport: { width: 960, height: 540 } })

  test('scales the 1920x1080 game down to fit, like the embed on joekarlsson.com', async ({ page }) => {
    await page.goto('/')
    await page.waitForFunction(() => window.game?.state.current === 'Splash')
    const box = await page.locator('#content canvas').boundingBox()
    expect(box.width).toBeLessThanOrEqual(960)
    expect(box.height).toBeLessThanOrEqual(540)
    expect(await page.evaluate(() => [window.game.width, window.game.height])).toEqual([1920, 1080])
  })
})

test.describe('phone', () => {
  test.skip(({ isMobile }) => !isMobile, 'touch-only device')

  test('explains it needs a keyboard instead of starting the game', async ({ page }) => {
    const errors = watchForErrors(page)
    await page.goto('/')
    await expect(page.getByText('needs two players and a keyboard')).toBeVisible()
    await expect(page.locator('#content canvas')).toHaveCount(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
})


test('has no automatically detectable accessibility problems', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(', ')}`)).toEqual([])
})

test('on its own page the game starts with sound, and the button mutes it', async ({ page, isMobile }) => {
  test.skip(isMobile && true, 'phones get the keyboard notice instead')
  await page.goto('/')
  await page.waitForFunction(() => window.game?.state.current === 'Splash', null, { timeout: 15000 })
  expect(await page.evaluate(() => window.game.sound.mute)).toBe(false)
  await page.getByRole('button', { name: 'Turn sound off' }).click()
  expect(await page.evaluate(() => window.game.sound.mute)).toBe(true)
})

test('the about page has the artist statement, links back to the game, and passes axe', async ({ page }) => {
  const errors = watchForErrors(page)
  await page.goto('/about.html')
  await expect(page.locator('h2', { hasText: 'Artist statement' })).toBeVisible()
  await expect(page.getByText('nobody gets to learn the course')).toBeVisible()
  await expect(page.locator('a[href="/"]')).toHaveText('Play Wave Jump')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(', ')}`)).toEqual([])
  expect(errors).toEqual([])
})

test('the game links to its about page', async ({ page, isMobile }) => {
  await page.goto('/')
  const link = isMobile ? page.locator('.keyboard-notice a[href="/about.html"]') : page.locator('.about-link')
  await expect(link).toBeVisible()
})
