import Phaser from 'phaser'
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
    this.load.image('titleBg', 'assets/images/titleBg.png')
    this.load.image('title', 'assets/images/title.png')
    this.load.image('player', 'assets/images/Player.png')
    this.load.image('winback', 'assets/images/gameplay background.png')
    this.load.image('player1', 'assets/images/player 1 wins separate smaller.png')
    this.load.image('player2', 'assets/images/player 2 wins separate smaller.png')
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
    this.load.image('background', './assets/images/gameplay background.png')
    this.load.image('tempWave', './assets/images/wave prototype.png')
    this.load.image('raceGate', './assets/images/raceGate.png')
    this.load.image('score', 'assets/images/score small.png')
    this.game.load.audio('Ferrari', 'assets/audio/Ferrari.wav')
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
