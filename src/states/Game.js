/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class GameState extends Phaser.State {
  init () {
    this.rope = null
    this.WAVE_LENGTH = 50
    this.count = 0
    this.numWaves = 20 // Screen is only 800px wide, 6*160 = 960 pixels of coverage.
    this.waveTotalLength = this.WAVE_LENGTH * this.numWaves
    this.waves = null
  }
  preload () {}

  initWaves () {
    this.waves = this.game.add.group()
    this.waves.x = -this.WAVE_LENGTH * 2
    this.waves.y = this.game.world.height - 50
    this.waves.enableBody = true
    this.waves.physicsBodyType = Phaser.Physics.ARCADE

    for (let i = 0; i < this.numWaves; i++) {
      let x = i * this.WAVE_LENGTH
      let y = 0
      let wave = this.game.add.sprite(x, y, 'player', this.game.rnd.between(0, 1))
      wave.anchor.set(0.5, 0.5)
      this.waves.add(wave)
      wave.body.immovable = true
    }
  }

  initBanner () {
    const bannerText = 'SynthWave'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    banner.font = 'Bangers'
    banner.padding.set(10, 16)
    banner.fontSize = 40
    banner.fill = '#77BFA3'
    banner.smoothed = false
    banner.anchor.setTo(0.5)
  }

  initGravity () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    //  Set the world (global) gravity
    this.game.physics.arcade.gravity.y = 150
    // Enable physics on those sprites
    this.game.physics.enable([this.player], Phaser.Physics.ARCADE)
    // this.player.body.bounce.set(1, 1);
    this.player.body.collideWorldBounds = true
    this.player.body.bounce.y = 0.8
  }

  create () {
    this.initBanner()
    this.initWaves()

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

    // create gravity (player objecto only currently)
    this.initGravity()

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
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
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

    this.waves.forEach(function (wave) {
      this.game.debug.body(wave)
    }, this)
  }

  animateWaves () {
    this.count += 0.2
    var i = 0

    this.waves.forEach(function (currentWave) {
      var amp = 10
      var x = i * 0.9 + this.count
      var y = Math.sin(x) * amp
      currentWave.y = y

      if (this.debug) {
        this.game.debug.text('Wave[' + i + ']: (' + currentWave.x + ',' + currentWave.y + ')', 10, 11 * i + 20)
      }
      i++
    }, this)
  }

  collisionHandler (obj1, obj2) {
    //  The two sprites are colliding
    this.game.stage.backgroundColor = '#992d2d'
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.waves, this.collisionHandler, null, this)
    this.game.physics.arcade.collide(this.waves)
    this.animateWaves()
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
