const Phaser = window.Phaser

export default class extends Phaser.State {
  init () {
    this.game.scoreP1 = 0
    this.game.scoreP2 = 0
    this.stage.backgroundColor = '#EDEEC9'
    // Step the game logic at a fixed 60 per second, catching up on slow frames,
    // instead of one variable-length step per frame. With variable steps a
    // 150ms frame moved players 100px+ at once, straight through the wave.
    this.game.forceSingleUpdate = false
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    this.scale.pageAlignHorizontally = true
    this.scale.pageAlignVertically = true

    // Space and the arrow keys would scroll the page around the game, which
    // matters when it's embedded
    this.input.keyboard.addKeyCapture([
      Phaser.Keyboard.SPACEBAR, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
      Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT
    ])

    // Show the canvas only once it's scaled to fit, so it doesn't jump into
    // place. A forced refresh always calls the resize callback, and Phaser lays
    // the canvas out right after it.
    this.scale.setResizeCallback(() => {
      this.scale.setResizeCallback(null)
      queueMicrotask(() => {
        this.game.canvas.style.visibility = 'visible'
      })
    })
    this.scale.refresh()
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
