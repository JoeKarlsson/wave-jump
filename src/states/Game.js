/* globals __DEV__ */
import Phaser from 'phaser'
import DevLeagueLogo from '../sprites/DevLeagueLogo'
import Player from '../sprites/Player'

export default class GameState extends Phaser.State {
  init () {}
  preload () {
  }

  create () {
    const bannerText = 'DevLeague Phaser + Webpack Starter Kit'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)

    this.devLeagueLogo = new DevLeagueLogo({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'devLeagueLogo'
    })

    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player'
    })

    this.game.add.existing(this.devLeagueLogo)
    this.game.add.existing(this.player)

    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)

    // create gravity (player objecto only currently)
    this.initGravity()
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.devLeagueLogo, 32, 32)
    }

    this.player.body.velocity.x = 0

    if (this.upKey.isDown && this.player.body.onFloor()) {
      // this.devLeagueLogo.y--
      this.player.body.velocity.y = -100
    } else if (this.downKey.isDown) {
      // this.devLeagueLogo.y++
      this.player.body.velocity.y = 100
    }

    if (this.leftKey.isDown) {
      // this.devLeagueLogo.x--
      this.player.body.velocity.x = -100
    } else if (this.rightKey.isDown) {
      // this.devLeagueLogo.x++
      this.player.body.velocity.x = 100
    }

    // if(this.rightKey.)
  }

  initGravity () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    //  Set the world (global) gravity
    this.game.physics.arcade.gravity.y = 200

    // Enable physics on those sprites
    this.game.physics.enable([this.player], Phaser.Physics.ARCADE)

    this.player.body.collideWorldBounds = true
    this.player.body.bounce.y = 0.1
  }
}
