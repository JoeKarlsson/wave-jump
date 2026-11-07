// Phaser CE is loaded as a classic script before this module (see vite.config.js)
const Phaser = window.Phaser

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import Player1WinState from './states/Player1Win'
import Player2WinState from './states/Player2Win'

export class Game extends Phaser.Game {
  constructor () {
    const { clientWidth, clientHeight } = document.documentElement

    super(clientWidth, clientHeight, Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.add('Player1Win', Player1WinState, false)
    this.state.add('Player2Win', Player2WinState, false)

    this.state.start('Boot')
  }
}

// Two players share one keyboard, so a touch-only device can't play
const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches
if (isTouchOnly) {
  document.querySelector('.keyboard-notice').hidden = false
} else {
  window.game = new Game()
}
