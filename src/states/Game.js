/* globals __DEV__ */
import Phaser from 'phaser'
import DevLeagueLogo from '../sprites/DevLeagueLogo'

export default class GameState extends Phaser.State {
  init () {}
  preload () {}

  initSnake () {
    let count = 0
    let length = 918 / 20
    let points = []
    let rope

    for (var i = 0; i < 20; i++) {
      points.push(new Phaser.Point(i * length, 0))
    }
    rope = this.game.add.rope(32, this.game.world.centerY, 'snake', null, points)
    rope.scale.set(0.8)

    rope.updateAnimation = function () {
      count += 0.1

      for (var i = 0; i < this.points.length; i++) {
        this.points[i].y = Math.sin(i * 0.5 + count) * 20
      }
    }
  }

  initBanner () {
    const bannerText = 'DevLeague Phaser + Webpack Starter Kit'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)
  }

  create () {
    this.initBanner()
    this.initSnake()

    this.devLeagueLogo = new DevLeagueLogo({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'devLeagueLogo'
    })

    this.game.add.existing(this.devLeagueLogo)

    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.devLeagueLogo, 32, 32)
    }

    if (this.upKey.isDown) {
      this.devLeagueLogo.y--
    } else if (this.downKey.isDown) {
      this.devLeagueLogo.y++
    }

    if (this.leftKey.isDown) {
      this.devLeagueLogo.x--
    } else if (this.rightKey.isDown) {
      this.devLeagueLogo.x++
    }
  }
}
