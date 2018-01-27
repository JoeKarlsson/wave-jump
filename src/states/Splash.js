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
    //
    // load your assets
    //
    this.load.image('snake', 'assets/images/snake.png')
    this.load.image('player', 'assets/images/Player.png')
  }

  create () {
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
  }

  render () {
    if (this.spaceBar.isDown) {
      this.state.start('Game')
    }
  }
}
