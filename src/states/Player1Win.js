import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    const titleBg = this.game.add.image(0, 0, 'winback')
    titleBg.width = this.game.width
    titleBg.height = this.game.height

    const effect = this.game.make.bitmapData()
    effect.load('player1')

    const image = this.game.add.image(this.game.world.centerX, this.game.world.centerY - 50, effect)
    image.anchor.set(0.5)
    image.smoothed = true

    const mask = new Phaser.Rectangle()
    mask.setTo(0, 0, this.game.cache.getImage('player1').width / 2, this.game.cache.getImage('player1').height)

    //  Tween the rasters
    this.game.add.tween(mask).to(
      {y: -(mask.height)},
      2000,
      Phaser.Easing.Sinusoidal.InOut,
      true,
      0,
      100,
      true
    )

    //  Tween the image
    this.game.add.tween(image.scale).to({ x: 2, y: 2 }, 2000, Phaser.Easing.Quartic.InOut, true, 0, 100, true)

    // Text
    let text = this.add.text(this.world.centerX, this.world.centerY + 300, 'Press the spacebar to continue', {
      font: '40px Arial',
      fill: '#dddddd',
      align: 'center'
    })
    centerGameObjects([text])
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
