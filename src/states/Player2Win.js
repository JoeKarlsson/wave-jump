import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    const player2Wins = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player2Wins')
    player2Wins.width = this.game.width
    player2Wins.height = this.game.height

    let text = this.add.text(this.world.centerX, this.world.centerY + 350, 'Press the spacebar to continue', {
      font: '16px Arial',
      fill: '#dddddd',
      align: 'center'
    })
    centerGameObjects([player2Wins, text])
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
