// Phaser CE is loaded as a classic script before this module (see vite.config.js)
const Phaser = window.Phaser

import BootState from './states/Boot'
import SplashState from './states/Splash'
import GameState from './states/Game'
import Player1WinState from './states/Player1Win'
import Player2WinState from './states/Player2Win'
import { setUpPageControls } from './pageControls'

export class Game extends Phaser.Game {
  constructor () {
    // A fixed 1920x1080 world, scaled to fit the window (see Boot), so the
    // spawn points, gate and text land in the same places on every screen
    super(1920, 1080, Phaser.AUTO, 'content', null)

    this.state.add('Boot', BootState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)
    this.state.add('Player1Win', Player1WinState, false)
    this.state.add('Player2Win', Player2WinState, false)

    this.state.start('Boot')
  }
}

// Phaser only resumes suspended audio on a canvas click. Players can start with
// the spacebar without clicking, so resume it on a key press too.
function resumeAudioOnKeyPress () {
  window.game.sound.resumeWebAudioIfSuspended()
  if (window.game.sound.context?.state === 'running') {
    window.removeEventListener('keydown', resumeAudioOnKeyPress)
  }
}

// Two players share one keyboard, so a touch-only device can't play
const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches
// (index.html shows them a notice instead, with the same media query)
if (!isTouchOnly) {
  window.game = new Game()
  window.addEventListener('keydown', resumeAudioOnKeyPress)
  setUpPageControls(window.game)
}
