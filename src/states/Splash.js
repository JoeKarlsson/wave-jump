import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    let text = this.add.text(this.world.centerX, this.world.centerY, 'Press the spacebar to continue', {
      font: '16px Arial',
      fill: '#dddddd',
      align: 'center'
    })
    centerGameObjects([this.loaderBg, this.loaderBar, text])
    this.load.setPreloadSprite(this.loaderBar)
  }

  create () {
    // Game Music
    let music = this.game.add.audio('Ferrari')
    music.loopFull(0.6)
    music.play()

    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  }

  render () {
    if (this.spaceBar.isDown) {
      this.state.start('Game')
    }
  }
}
