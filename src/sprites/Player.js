import Phaser from 'phaser'

export default class Player extends Phaser.Sprite {
  constructor ({ game, x, y, asset, name }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.name = name
  }

  update () {
  }
}
