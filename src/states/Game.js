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
      x: this.world.left,
      y: this.world.bottom,
      asset: 'player'
    })

    this.player2 = new Player({
      game: this.game,
      x: this.world.right,
      y: this.world.bottom,
      asset: 'player'
    })

    this.game.add.existing(this.devLeagueLogo)
    this.game.add.existing(this.player)
    this.game.add.existing(this.player2)

    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)

    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S)

    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A)

    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D)

    // create gravity (player objecto only currently)
    this.initGravity()
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.devLeagueLogo, 32, 32)
    }

    this.player.body.velocity.x = 0
    this.player2.body.velocity.x = 0

    // PLAYER1 KEYBOARD MAPPING
    if (this.wKey.isDown && this.player.body.onFloor()) {
      this.player.body.velocity.y = -500
    } else if (this.sKey.isDown) {
      this.player.body.velocity.y = 1000
    }

    if (this.aKey.isDown) {
      this.player.body.velocity.x = -500
    } else if (this.dKey.isDown) {
      this.player.body.velocity.x = 500
    }

    // PLAYER2 KEYBOARD MAPPING
    if (this.upKey.isDown && this.player2.body.onFloor()) {
      this.player2.body.velocity.y = -500
    } else if (this.downKey.isDown) {
      this.player2.body.velocity.y = 1000
    }

    if (this.leftKey.isDown) {
      this.player2.body.velocity.x = -500
    } else if (this.rightKey.isDown) {
      this.player2.body.velocity.x = 500
    }
  }

  initGravity () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    //  Set the world (global) gravity
    this.game.physics.arcade.gravity.y = 1000

    // Enable physics on those sprites
    this.game.physics.enable([this.player, this.player2], Phaser.Physics.ARCADE)

    this.player.body.collideWorldBounds = true
    this.player.body.bounce.y = 0.1

    this.player2.body.collideWorldBounds = true
    this.player.body.bounce.y = 0.1
  }
}
