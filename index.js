const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 0.4
const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  },
  ArrowDown: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

let timer = 60
let timerId
let gameOver = false
let paused = false

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './assets/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './assets/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  imageSrc: './assets/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './assets/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './assets/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './assets/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './assets/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './assets/samuraiMack/Attack1.png',
      framesMax: 6
    }
  }
})
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'red',
  imageSrc: './assets/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 172
  }
})

function animate() {
  if (!paused) {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    enemy.update()
    player.update()  

    // move player
    player.velocity.x = 0
    if (keys.a.pressed) {
      player.velocity.x = -5
      player.switchSprite('run')
    } else if (keys.d.pressed) {
      player.velocity.x = 5
      player.switchSprite('run')
    } else {      
      player.switchSprite('idle')
    }
    if (player.velocity.y < 0) {
      player.switchSprite('jump')      
    } else if (player.velocity.y > 0) {
      player.switchSprite('fall')      
    }
    // end move player

    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed) {
      enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed ) {
      enemy.velocity.x = 5
    }

    //collision
    if (
      setCollision({
        retangle1: player,
        retangle2: enemy
      }) && player.isAttacking
    ) {
      player.isAttacking = false
      enemy.health -= 10
      document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
      setCollision({
        retangle1: enemy,
        retangle2: player
      }) && enemy.isAttacking
    ) {
      enemy.isAttacking = false
      player.health -= 10
      document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //end game on health
    if (enemy.health <= 0 || player.health <= 0) {
      setWinner({ player, enemy, timerId })
    }
  }
}

setTimer()
animate()

window.addEventListener('keydown', (event) => {
  if (!gameOver) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.revert = false
      break
      case 'a':
        keys.a.pressed = true
        player.revert = true
      break
      case 'w':
        if (player.jump) {
          player.velocity.y = -12
        }
      break
      case ' ':
        player.attack()
      break
  
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.revert = false
      break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.revert = true
      break
      case 'ArrowUp':
        if (enemy.jump) {
          enemy.velocity.y = -12
        }
      break
      case 'ArrowDown':
        enemy.attack()
      break
      case 'Escape':
        if (paused) {
          paused = false
          animate()
          setTimer()
        }else {
          paused = true
        }
      break
    }
  }
})

window.addEventListener('keyup', (event) => {
  if (!gameOver) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = false
      break
      case 'a':
        keys.a.pressed = false
      break
  
      case 'ArrowRight':
        keys.ArrowRight.pressed = false
      break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
      break
    }
  }
})