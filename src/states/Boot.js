const Phaser = window.Phaser

export default class extends Phaser.State {
  init () {
    this.game.scoreP1 = 0
    this.game.scoreP2 = 0
    this.stage.backgroundColor = '#EDEEC9'
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.pageAlignHorizontally = true
    this.scale.pageAlignVertically = true
    this.fontsReady = false
  }

  preload () {
    // Bangers is self-hosted and declared in index.html; Phaser draws text to a
    // canvas, so it has to finish loading before the first text is drawn.
    document.fonts.load('40px Bangers').then(() => {
      this.fontsReady = true
    })

    this.game.text = this.add.text(this.world.centerX, this.world.centerY, 'loading', {
      font: '50px Arial',
      fill: '#000000',
      align: 'center'
    })
    this.game.text.anchor.setTo(0.5, 0.5)

    this.load.image('titleBg', 'images/title-background.webp')
    this.load.image('title', 'images/title.webp')
    this.load.image('player', 'images/player.webp')
    this.load.image('player1', 'images/player-1-wins.webp')
    this.load.image('player2', 'images/player-2-wins.webp')
    this.load.image('background', 'images/gameplay-background.webp')
    this.load.image('tempWave', 'images/wave.webp')
    this.load.image('raceGate', 'images/race-gate.webp')
    this.load.audio('Ferrari', 'audio/ferrari.mp3')
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }
}
