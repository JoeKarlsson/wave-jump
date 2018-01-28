/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class GameState extends Phaser.State {
  init () {
    this.rope = null
    this.WAVE_LENGTH = 2
    this.count = 0
    this.numWaves = (window.innerWidth * window.devicePixelRatio / this.WAVE_LENGTH) // Screen is only 800px wide, 6*160 = 960 pixels of coverage.
    this.waveTotalLength = this.WAVE_LENGTH * this.numWaves
    this.waves = null
    this.game.scaleRatio = 0.1
    this.goingUp = true
    this.startTime = this.game.time.time
    this.defaultVelocity = 500
    this.defaultGravity = 1000
  }
  preload () {}

  initWaves () {
    this.waves = this.game.add.group()
    this.waves.x = -this.WAVE_LENGTH * 2
    this.waves.y = this.game.world.height * (6 / 7)
    this.waves.enableBody = true
    this.waves.physicsBodyType = Phaser.Physics.ARCADE
    this.waves.collideWorldBounds = true

    for (let i = 0; i < this.numWaves; i++) {
      let x = i * this.WAVE_LENGTH
      let y = 0
      let wave = this.game.add.sprite(x, y, 'tempWave', this.game.rnd.between(0, 1))
      wave.anchor.set(0.5, 0.5)
      this.physics.enable(wave, Phaser.Physics.ARCADE)
      wave.body.setSize(5, 5, 0, 0)
      this.waves.add(wave)
      wave.collideWorldBounds = true
      wave.body.immovable = true
      wave.body.allowGravity = false
    }
  }

  initRaceGate () {
    this.raceGate = this.add.sprite(this.game.width / 2, this.game.top, 'raceGate')
    this.raceGate.scale.setTo(this.game.scaleRatio, this.game.scaleRatio)
    this.raceGate.y += this.raceGate.height
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

    // Enable physics on those sprites
    this.game.physics.enable([this.player1, this.player1Clone1, this.player1Clone2,
      this.player2, this.player2Clone1, this.player2Clone2], Phaser.Physics.ARCADE)

    // initialize players and clones
    this.player1.body.collideWorldBounds = true
    this.player1.body.checkCollision.up = false
    this.player1.body.gravity.y = this.defaultGravity

    this.player1Clone1.body.collideWorldBounds = true
    this.player1Clone1.body.checkCollision.up = false
    this.player1Clone1.body.gravity.y = this.defaultGravity

    this.player1Clone2.body.collideWorldBounds = true
    this.player1Clone2.body.checkCollision.up = false
    this.player1Clone2.body.gravity.y = this.defaultGravity

    this.player2.body.collideWorldBounds = true
    this.player2.body.checkCollision.up = false
    this.player2.body.gravity.y = this.defaultGravity

    this.player2Clone1.body.collideWorldBounds = true
    this.player2Clone1.body.checkCollision.up = false
    this.player2Clone1.body.gravity.y = this.defaultGravity

    this.player2Clone2.body.collideWorldBounds = true
    this.player2Clone2.body.checkCollision.up = false
    this.player2Clone2.body.gravity.y = this.defaultGravity
  }

  initPlayers () {
    this.player1 = new Player({
      game: this.game,
      x: this.world.centerX,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player1'
    })

    this.player1Clone1 = new Player({
      game: this.game,
      x: this.world.centerX - 5,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player1Clone1'
    })

    this.player1Clone2 = new Player({
      game: this.game,
      x: this.world.centerX + 5,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player1Clone2'
    })

    this.player2 = new Player({
      game: this.game,
      x: this.world.centerX,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player2'
    })

    this.player2Clone1 = new Player({
      game: this.game,
      x: this.world.centerX - 5,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player2Clone1'
    })

    this.player2Clone2 = new Player({
      game: this.game,
      x: this.world.centerX + 5,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player2Clone2'
    })

    /* this.player1Clone1.visible = false
    this.player1Clone2.visible = false

    this.player2Clone1.visible = false
    this.player2Clone2.visible = false */
  }

  create () {
    const floor = this.game.add.image(0, 0, 'background')
    floor.width = this.game.width
    floor.height = this.game.height

    this.initBanner()
    this.initPlayers()
    this.initWaves()
    // this.initRaceGate()

    // create gravity (player objecto only currently)
    this.initGravity()

    this.game.add.existing(this.player1)
    this.game.add.existing(this.player2)
    this.game.add.existing(this.player1Clone1)
    this.game.add.existing(this.player1Clone2)
    this.game.add.existing(this.player2Clone1)
    this.game.add.existing(this.player2Clone2)

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
      this.game.debug.spriteInfo(this.player1, 32, 32)
    }

    this.player1.body.velocity.x = 0
    this.player2.body.velocity.x = 0

    // PLAYER1 KEYBOARD MAPPING
    if (this.wKey.isDown && (this.player1.body.touching.down || this.player1.body.onFloor())) {
      this.player1.body.velocity.y = -this.defaultVelocity
      this.player1Clone1.body.velocity.y = -this.defaultVelocity
      this.player1Clone2.body.velocity.y = -this.defaultVelocity
    }

    if (this.aKey.isDown) {
      if (this.player1.body.gravity.x > 0) {
        this.player1.body.gravity.x -= 10
      }
    } else if (this.dKey.isDown) {
      if (this.player1.body.gravity.x < 0) {
        this.player1.body.gravity.x += 10
      }
    }

    // PLAYER2 KEYBOARD MAPPING
    if (this.upKey.isDown && (this.player2.body.touching.down || this.player2.body.onFloor())) {
      this.player2.body.velocity.y = -this.defaultVelocity
      this.player2Clone1.body.velocity.y = -this.defaultVelocity
      this.player2Clone2.body.velocity.y = -this.defaultVelocity
    }

    if (this.leftKey.isDown) {
      if (this.player2.body.gravity.x > 0) {
        this.player2.body.gravity.x -= 10
      }
    } else if (this.rightKey.isDown) {
      if (this.player2.body.gravity.x < 0) {
        this.player2.body.gravity.x += 10
      }
    }

    this.player1Clone1.x = this.player1.x - 5
    this.player1Clone2.x = this.player1.x + 5
    this.player2Clone1.x = this.player2.x - 5
    this.player2Clone2.x = this.player2.x + 5
  }

  animateWaves () {
    this.count += Math.random(0, 1)
    var i = 0
    var amp = 200

    this.waves.forEach(function (currentWave) {
      if (this.goingUp) {
        var x = i * 0.1 + this.count
        var y = Math.sin(0.1 * x) * amp
        currentWave.body.velocity.y = y * 2

        if (amp > 300) {
          this.goingUp = false
        }
      } else {
        x = i * 0.1 + this.count
        y = Math.sin(0.1 * x) * amp
        currentWave.body.velocity.y = y * 2

        if (amp < 10) {
          this.goingUp = true
        }
      }
      // if (this.debug) {
      // this.game.debug.text('Wave[' + i + ']: (' + currentWave.x + ',' + currentWave.y + ')', 10, 11 * i + 20)
      // }
      i++
    }, this)
  }

  collisionHandler (obj1, obj2) {
    //  The two sprites are colliding
    if (obj1.name === 'Player1') {
      /* var sumX = this.player1Clone2.x - this.player1Clone1.x

      var sumY = this.player1Clone2.y - this.player1Clone1.y

      var slope = sumY / sumX */

      var angle = Math.atan2(this.player1Clone2.y - this.player1Clone1.y, this.player1Clone2.x - this.player1Clone1.x)

      this.player1.body.velocity.x += this.defaultVelocity * Math.cos(angle)
      this.player1.body.velocity.y -= this.defaultVelocity * Math.sin(angle)

      this.player1.body.gravity.x = this.defaultGravity * Math.cos(angle)
    }
  }

  dummyCollisionHandler (obj1, obj2) {
  }

  endGameCollisionHandler (obj1, obj2) {
    if (obj1.name === this.player1.name) {
      this.state.start('Player1Win')
    } else {
      this.state.start('Player2Win')
    }
  }

  update () {
    this.game.physics.arcade.collide(this.player1, this.waves, this.collisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2, this.waves, this.collisionHandler, null, this)
    this.game.physics.arcade.collide(this.player1, this.raceGate, this.endGameCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2, this.raceGate, this.endGameCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player1Clone1, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player1Clone2, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2Clone1, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2Clone2, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.waves)

    this.player1.body.gravity.x * 0.9
    setInterval(this.animateWaves(), 33.333)
  }
}
