const Phaser = window.Phaser
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.game.scoreP1 = 0
    this.game.scoreP2 = 0
    this.stage.backgroundColor = '#EDEEC9'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    // Set base URL for production GitHub Pages deployment
    // In production, assets are served from /wave-jump/ subdirectory
    // In development, they're served from root /
    const baseURL = import.meta.env.PROD ? '/wave-jump/' : '/'
    this.load.baseURL = baseURL

    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })

    this.game.text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', {
      font: '50px Arial',
      fill: '#000000',
      align: 'center'
    })
    this.game.text.anchor.setTo(0.5, 0.5)

    //
    // load your assets
    //
    this.load.image('titleBg', 'images/titleBg.png')
    this.load.image('title', 'images/title.png')
    this.load.image('player', 'images/Player.png')
    this.load.image('winback', 'images/gameplay background.png')
    this.load.image('player1', 'images/player 1 wins separate smaller.png')
    this.load.image('player2', 'images/player 2 wins separate smaller.png')
    this.load.image('loaderBg', 'images/loader-bg.png')
    this.load.image('loaderBar', 'images/loader-bar.png')
    this.load.image('background', 'images/gameplay background.png')
    this.load.image('tempWave', 'images/wave prototype.png')
    this.load.image('raceGate', 'images/raceGate.png')
    this.load.image('score', 'images/score small.png')
    this.game.load.audio('Ferrari', 'audio/Ferrari.wav')
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
