import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.player2Wins = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player2Wins')
    this.player2Wins.scale.setTo(this.game.scaleRatio, this.game.scaleRatio)
    let text = this.add.text(this.world.centerX, this.world.centerY, 'Press the spacebar to continue', {
      font: '16px Arial',
      fill: '#dddddd',
      align: 'center'
    })
    centerGameObjects([this.player1Wins, text])
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
