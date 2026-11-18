import { test, expect } from '@playwright/test'

test.skip(({ isMobile }) => isMobile, 'keyboard game')

test('sends Game Start once, one Round Won per round, and Replay from round two', async ({ page }) => {
  // Test browsers are skipped by assets/analytics.js, so record the calls directly
  await page.addInitScript(() => {
    window.events = []
    window.plausible = (name, options) => window.events.push([name, options?.props])
  })
  await page.goto('/')
  const canvas = page.locator('#content canvas')
  await page.waitForFunction(() => window.game?.state.current === 'Splash')
  await canvas.click()
  await page.waitForFunction(() => window.game.state.current === 'Game')

  // Player 1 and player 2's clone reach the gate in the same frame: only one wins
  await page.evaluate(() => {
    const round = window.game.state.states.Game
    round.endGameCollisionHandler(round.player1)
    round.endGameCollisionHandler(round.player2Clone1)
  })
  await page.waitForFunction(() => window.game.state.current === 'Player1Win')
  expect(await page.evaluate(() => [window.game.scoreP1, window.game.scoreP2])).toEqual([1, 0])

  await canvas.click()
  await page.waitForFunction(() => window.game.state.current === 'Game')
  expect(await page.evaluate(() => window.events)).toEqual([
    ['Game Start', { embedded: false }],
    ['Round Won', { winner: 'p1', round: 1 }],
    ['Replay', undefined]
  ])
})
