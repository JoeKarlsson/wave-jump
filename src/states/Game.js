/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class GameState extends Phaser.State {
  init () {
    this.rope = null
    this.WAVE_LENGTH = 2.5
    this.count = 0
    this.numWaves = (window.innerWidth * window.devicePixelRatio / this.WAVE_LENGTH) // Screen is only 800px wide, 6*160 = 960 pixels of coverage.
    this.waveTotalLength = this.WAVE_LENGTH * this.numWaves
    this.waves = null
    this.game.scaleRatio = 0.1
  }
  preload () {}

  initWaves () {
    this.waves = this.game.add.group()
    this.waves.x = -this.WAVE_LENGTH * 2
    this.waves.y = this.game.world.height * (3 / 4)
    this.waves.enableBody = true
    this.waves.physicsBodyType = Phaser.Physics.ARCADE
    this.waves.collideWorldBounds = true

    for (let i = 0; i < this.numWaves; i++) {
      let x = i * this.WAVE_LENGTH
      let y = 0
      let wave = this.game.add.sprite(x, y, 'tempWave', this.game.rnd.between(0, 1))
      wave.anchor.set(0.5, 0.5)
      this.physics.enable(wave, Phaser.Physics.ARCADE)
      wave.body.setSize(10, 40, 0, 0)
      this.waves.add(wave)
      wave.collideWorldBounds = true
      wave.body.immovable = true
      wave.body.allowGravity = false
    }
  }

  initRaceGate () {
    this.raceGate = this.add.sprite(this.game.width / 2, this.game.height / 2, 'raceGate')
    this.raceGate.scale.setTo(this.game.scaleRatio, this.game.scaleRatio)
    this.raceGate.anchor.set(0.5, 0.5)
    this.game.physics.enable(this.raceGate, Phaser.Physics.ARCADE)
    this.raceGate.body.allowGravity = false
    this.raceGate.body.immovable = true
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
    this.game.physics.arcade.gravity.y = 1000
    // Enable physics on those sprites
    this.game.physics.enable([this.player, this.player2], Phaser.Physics.ARCADE)
    // this.player.body.bounce.set(1, 1);
    this.player.body.collideWorldBounds = true
    this.player.body.bounce.y = 0.2

    this.player2.body.collideWorldBounds = true
    this.player2.body.bounce.y = 0.2
  }

  initPlayers () {
    this.player = new Player({
      game: this.game,
      x: this.world.left + 50,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player1'
    })

    this.player2 = new Player({
      game: this.game,
      x: this.world.right - 50,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player2'
    })
  }

  create () {
    const floor = this.game.add.image(0, 0, 'background')
    floor.width = this.game.width
    floor.height = this.game.height

    this.initBanner()
    this.initPlayers()
    this.initWaves()
    this.initRaceGate()

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
    if (this.wKey.isDown && (this.player.body.touching.down || this.player.body.onFloor())) {
      this.player.body.velocity.y = -500
    }

    if (this.aKey.isDown) {
      this.player.body.velocity.x = -500
    } else if (this.dKey.isDown) {
      this.player.body.velocity.x = 500
    }

    // PLAYER2 KEYBOARD MAPPING
    if (this.upKey.isDown && (this.player2.body.touching.down || this.player2.body.onFloor())) {
      this.player2.body.velocity.y = -500
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
    var amp = 10

    this.waves.forEach(function (currentWave) {
      amp += this.game.rnd.between(-2, 2)
      var x = i * 0.1 + this.count
      var y = Math.sin(x + 2) * amp
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

  endGameCollisionHandler (obj1, obj2) {
    obj1.name = 'Player1'

    if (obj1.name === this.player.name) {
      this.state.start('Player1Win')
    } else {
      this.state.start('Player2Win')
    }
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.waves, this.collisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2, this.waves, this.collisionHandler, null, this)
    this.game.physics.arcade.collide(this.player, this.raceGate, this.endGameCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2, this.raceGate, this.endGameCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.waves)
    this.animateWaves()
  }
}
