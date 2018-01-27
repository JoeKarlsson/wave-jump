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

  // initSnake () {
  //   let count = 0
  //   let length = 918 / 20
  //   let points = []
  //
  //   for (var i = 0; i < 20; i++) {
  //     const point = new Phaser.Point(i * length, 0);
  //     points.push(point)
  //   }
  //   this.rope = this.game.add.rope(32, this.game.world.centerY, 'snake', null, points)
  //
  //   this.rope.updateAnimation = function () {
  //     count += 0.1
  //
  //     for (var i = 0; i < this.points.length; i++) {
  //       this.points[i].y = Math.sin(i * 0.5 + count) * 20
  //     }
  //   }
  //   this.rope.scale.set(0.8)
  //   this.rope.enableBody = true;
  //   this.rope.physicsBodyType = Phaser.Physics.ARCADE;
  // }

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
      x: this.world.centerX,
      y: this.world.centerY - 95,
      asset: 'player'
    })

    this.initGravity()

    this.game.add.existing(this.player)

    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function
    this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }

    if (this.upKey.isDown) {
      this.player.y--
    } else if (this.downKey.isDown) {
      this.player.y++
    }

    if (this.leftKey.isDown) {
      this.player.x--
    } else if (this.rightKey.isDown) {
      this.player.x++
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
  }
}
