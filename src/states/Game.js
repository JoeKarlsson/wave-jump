import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class GameState extends Phaser.State {
  init () {
    this.pressed
    this.rope = null
    this.WAVE_LENGTH = 2
    this.count = 0
    this.numWaves = (window.innerWidth * window.devicePixelRatio / this.WAVE_LENGTH) // Screen is only 800px wide, 6*160 = 960 pixels of coverage.
    this.waveTotalLength = this.WAVE_LENGTH * this.numWaves
    this.waves = null
    this.game.scaleRatio = 0.1
    this.goingUp = true
    this.startTime = this.game.time.time
    this.defaultVelocity = 450
    this.defaultGravity = 3500
  }

  preload () {
    this.bmd1 = this.game.add.bitmapData(5, 5)
    this.bmd1.fill(255, 0, 0, 1)

    this.bmd2 = this.game.add.bitmapData(5, 5)
    this.bmd2.fill(0, 0, 255, 1)
  }

  initWaves () {
    this.waves = this.game.add.group()
    this.waves.x = -this.WAVE_LENGTH * 2
    this.waves.y = this.game.world.height / 2 // + this.game.rnd.between(-100, 100) randomizes the inital wave position
    this.waves.enableBody = true
    this.waves.physicsBodyType = Phaser.Physics.ARCADE
    this.waves.collideWorldBounds = true

    for (let i = 0; i < this.numWaves; i++) {
      let x = i * this.WAVE_LENGTH
      let y = 0
      let wave = this.game.add.sprite(x, y, 'tempWave', this.game.rnd.between(0, 1))
      wave.anchor.set(0.5, 0.5)
      this.physics.enable(wave, Phaser.Physics.ARCADE)
      wave.body.setSize(7, 7, 0, 0)
      this.waves.add(wave)
      wave.collideWorldBounds = true
      wave.body.immovable = true
      wave.body.allowGravity = false
    }
  }

  newWave () {
    this.initWaves()
    this.waves.destroy()
  }

  initRaceGate () {
    this.raceGate = this.add.sprite(this.game.rnd.between(this.world.width / 3, this.world.width / 1.5), this.game.height - this.game.rnd.between(this.game.height - 400, this.game.height - 600), 'raceGate')
    this.raceGate.scale.setTo(this.game.scaleRatio, this.game.scaleRatio)
    this.raceGate.y += this.raceGate.height
    this.raceGate.anchor.set(0.5, 0.5)
    this.game.physics.enable(this.raceGate, Phaser.Physics.ARCADE)
    this.raceGate.body.allowGravity = false
    this.raceGate.body.immovable = true
  }

  initScoreBoard () {
    const scoreTextP1 = 'Player 1'
    let scoreTitleP1 = this.add.text((this.world.width / 12), this.game.height - 150, scoreTextP1)
    scoreTitleP1.font = 'Bangers'
    scoreTitleP1.padding.set(10, 16)
    scoreTitleP1.fontSize = 40
    scoreTitleP1.fill = '#FFFFFF'
    scoreTitleP1.smoothed = false
    scoreTitleP1.anchor.setTo(0.5)

    let scoreP1 = this.add.text((this.world.width / 12), this.game.height - 100, this.game.scoreP1)
    scoreP1.font = 'Bangers'
    scoreP1.padding.set(10, 16)
    scoreP1.fontSize = 120
    scoreP1.fill = '#FFF500'
    scoreP1.smoothed = false
    scoreP1.anchor.setTo(0.5)

    const scoreTextP2 = 'Player 2'
    let scoreTitleP2 = this.add.text((this.world.width / 1.09), this.game.height - 150, scoreTextP2)
    scoreTitleP2.font = 'Bangers'
    scoreTitleP2.padding.set(10, 16)
    scoreTitleP2.fontSize = 40
    scoreTitleP2.fill = '#FFFFFF'
    scoreTitleP2.smoothed = false
    scoreTitleP2.anchor.setTo(0.5)

    let scoreP2 = this.add.text((this.world.width / 1.09), this.game.height - 100, this.game.scoreP2)
    scoreP2.font = 'Bangers'
    scoreP2.padding.set(10, 16)
    scoreP2.fontSize = 120
    scoreP2.fill = '#FFF500'
    scoreP2.smoothed = false
    scoreP2.anchor.setTo(0.5)
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
      x: this.world.centerX - 500,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player1'
    })

    this.player1Clone1 = new Player({
      game: this.game,
      x: this.world.centerX - 505,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player1Clone1'
    })

    this.player1Clone2 = new Player({
      game: this.game,
      x: this.world.centerX - 510,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player1Clone2'
    })

    this.player2 = new Player({
      game: this.game,
      x: this.world.centerX + 500,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player2'
    })

    this.player2Clone1 = new Player({
      game: this.game,
      x: this.world.centerX + 505,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player2Clone1'
    })

    this.player2Clone2 = new Player({
      game: this.game,
      x: this.world.centerX + 510,
      y: (3 / 4) * this.world.centerY - 100,
      asset: 'player',
      name: 'Player2Clone2'
    })

    this.emitter1 = this.game.add.emitter(this.player1.x, this.player1.y, 3000)
    this.emitter1.gravity = 0
    this.emitter1.frequency = 50
    this.emitter1.maxParticleSpeed = 0
    this.emitter1.minRotation = 0
    this.emitter1.maxRotation = 0
    this.emitter1.autoScale = false
    this.emitter1.setAlpha(1, 0, 2500)
    this.emitter1.makeParticles(this.bmd1)
    this.emitter1.start(false, 3000, 0)

    this.emitter2 = this.game.add.emitter(this.player2.x, this.player2.y, 3000)
    this.emitter2.gravity = 0
    this.emitter2.frequency = 50
    this.emitter2.maxParticleSpeed = 0
    this.emitter2.minRotation = 0
    this.emitter2.maxRotation = 0
    this.emitter2.autoScale = false
    this.emitter2.setAlpha(1, 0, 2500)
    this.emitter2.makeParticles(this.bmd2)
    this.emitter2.start(false, 3000, 0)
  }

  create () {
    const background = this.game.add.image(0, 0, 'background')
    background.width = this.game.width
    background.height = this.game.height

    this.initScoreBoard()
    this.initPlayers()
    this.initWaves()
    this.initRaceGate()

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

    // adds randomized waves

    // this.game.time.events.repeat(Phaser.Timer.SECOND * 5, 10, this.newWave, this)
  }

  render () {
    this.player1.body.velocity.x = 0
    this.player2.body.velocity.x = 0

    // PLAYER1 KEYBOARD MAPPING
    if (this.wKey.isDown && (this.player1.body.touching.down || this.player1.body.onFloor())) {
      this.player1.body.velocity.y = -this.defaultVelocity * 4
      this.player1Clone1.body.velocity.y = -this.defaultVelocity * 4
      this.player1Clone2.body.velocity.y = -this.defaultVelocity * 4
      this.emitter1.on = true
      this.pressed = true
    }
    if (this.sKey.isDown) {
      this.player1.body.velocity.y = this.defaultGravity
      this.player1Clone1.body.velocity.y = this.defaultGravity
      this.player1Clone2.body.velocity.y = this.defaultGravity
    }

    if (this.aKey.isDown) {
      this.player1.body.velocity.x -= 1600
      this.emitter1.on = true
      this.pressed = true
    }
    if (this.dKey.isDown) {
      this.player1.body.velocity.x += 1600
      this.emitter1.on = true
      this.pressed = true
    }

    // PLAYER2 KEYBOARD MAPPING
    if (this.upKey.isDown && (this.player2.body.touching.down || this.player2.body.onFloor())) {
      this.player2.body.velocity.y = -this.defaultVelocity * 4
      this.player2Clone1.body.velocity.y = -this.defaultVelocity * 4
      this.player2Clone2.body.velocity.y = -this.defaultVelocity * 4
      this.emitter2.on = true
      this.pressed = true
    }

    if (this.leftKey.isDown) {
      this.player2.body.velocity.x -= 1600
      this.emitter2.on = true
      this.pressed = true
    }

    if (this.rightKey.isDown) {
      this.player2.body.velocity.x += 1600
      this.emitter2.on = true
      this.pressed = true
    }
    if (this.downKey.isDown) {
      this.player2.body.velocity.y = this.defaultGravity
      this.player2Clone1.body.velocity.y = this.defaultGravity
      this.player2Clone2.body.velocity.y = this.defaultGravity
    }

    this.player1Clone1.x = this.player1.x - 5
    this.player1Clone2.x = this.player1.x + 5
    this.player2Clone1.x = this.player2.x - 5
    this.player2Clone2.x = this.player2.x + 5

    this.emitter1.x = this.player1.x
    this.emitter1.y = this.player1.y

    this.emitter2.x = this.player2.x
    this.emitter2.y = this.player2.y

    if (!this.pressed) {
      this.emitter1.on = false
      this.emitter2.on = false
    }
  }

  animateWaves () {
    this.count += 1
    var i = 0
    var amp = this.game.rnd.between(100, 200)
    this.waves.forEach(function (currentWave) {
      if (this.goingUp) {
        var x = i * 0.1 + this.count
        var y = Math.sin(0.3 * x) * amp
        currentWave.body.velocity.y = y * 2

        if (amp > 300) {
          this.goingUp = false
        }
      } else {
        x = i * 0.1 + this.count
        y = Math.sin(0.3 * x) * amp
        currentWave.body.velocity.y = y * 2

        if (amp < 10) {
          this.goingUp = true
        }
      }
      i++
    }, this)
  }

  // Players do not move. I think that they are locked onto the waves that
  // they collided with
  collisionHandler (obj1, obj2) {}

  dummyCollisionHandler (obj1, obj2) {}

  endGameCollisionHandler (obj1, obj2) {
    switch (obj1.name) {
      case (this.player1.name):
        this.game.scoreP1 = this.game.scoreP1 + 1
        this.state.start('Player1Win')
        break
      case (this.player1Clone1.name):
        this.game.scoreP1 = this.game.scoreP1 + 1
        this.state.start('Player1Win')
        break
      case (this.player1Clone2.name):
        this.game.scoreP1 = this.game.scoreP1 + 1
        this.state.start('Player1Win')
        break
      case (this.player2.name):
        this.game.scoreP2 = this.game.scoreP2 + 1
        this.state.start('Player2Win')
        break
      case (this.player2Clone1.name):
        this.game.scoreP2 = this.game.scoreP2 + 1
        this.state.start('Player2Win')
        break
      case (this.player2Clone2.name):
        this.game.scoreP2 = this.game.scoreP2 + 1
        this.state.start('Player2Win')
        break
    }
  }

  update () {
    this.game.physics.arcade.collide(this.player1, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player1, this.raceGate, this.endGameCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2, this.raceGate, this.endGameCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player1Clone1, this.raceGate, this.endGameCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2Clone1, this.raceGate, this.endGamecollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player1Clone2, this.raceGate, this.endGameCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2Clone2, this.raceGate, this.endGamecollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player1Clone1, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player1Clone2, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2Clone1, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.player2Clone2, this.waves, this.dummyCollisionHandler, null, this)
    this.game.physics.arcade.collide(this.waves)

    this.player1.body.gravity.x *= 0.5
    this.player2.body.gravity.x *= 0.5
    setInterval(this.animateWaves(), 60)
  }
}
