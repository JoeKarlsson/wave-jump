import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
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

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', {
      font: '16px Arial',
      fill: '#dddddd',
      align: 'center'
    })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
    this.load.image('tempWave', './assets/images/waveTemp.png')
    this.load.image('raceGate', './assets/images/1 cropped.png')
    //
    // load your assets
    //
    this.load.image('snake', 'assets/images/snake.png')
    this.load.image('player', 'assets/images/Player.png')
    this.load.image('player1Wins', 'assets/images/player 1 wins.png')
    this.load.image('player2Wins', 'assets/images/player 2 wins.png')
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
