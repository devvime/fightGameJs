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

class Sprite {
  constructor({ position, velocity, color, offset }) {
    this.position = position
    this.velocity = velocity
    this.color = color
    this.width = 50
    this.height = 150
    this.jump = false
    this.attackBox = {
      position: this.position,
      offset,
      width: 100,
      height: 50
    }
    this.isAttacking = false
    this.health = 100
    this.revert = false
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //attack box
    if (this.isAttacking) {
      c.fillStyle = 'green'
      c.fillRect(
        this.revert ? this.attackBox.position.x - this.width: this.attackBox.position.x, 
        this.attackBox.position.y, 
        this.attackBox.width, 
        this.attackBox.height
      )
    }    
  }

  update() {
     this.draw() 
        
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
      this.jump = true
    } else {
      this.velocity.y += gravity
      this.jump = false
    }
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100);
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue'
})
const enemy = new Sprite({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'red'
})

function setCollision({ retangle1, retangle2 }) {
  if (!retangle1.revert) {
    return (
      retangle1.attackBox.position.x + retangle1.attackBox.width >= retangle2.position.x 
      && 
      retangle1.attackBox.position.x <= retangle2.position.x + retangle2.width
      &&
      retangle1.attackBox.position.y + retangle1.attackBox.height >= retangle2.position.y
      &&
      retangle1.attackBox.position.x <= retangle2.position.y + retangle2.height
    )
  } else {
    return (
      retangle1.attackBox.position.x - retangle1.attackBox.width <= retangle2.position.x 
      && 
      retangle1.attackBox.position.x >= retangle2.position.x - retangle2.width
      &&
      retangle1.attackBox.position.y - retangle1.attackBox.height <= retangle2.position.y
      &&
      retangle1.attackBox.position.x >= retangle2.position.y - retangle2.height
    )
  }
}

function setWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  document.querySelector('#displayMessage').style.visibility = 'visible'
  gameOver = true
  if (player.health === enemy.health) {
    document.querySelector('#displayMessage').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayMessage').innerHTML = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayMessage').innerHTML = 'Player 2 Wins'
  }
}

function setTimer() {  
  if (!paused) {
    if (timer > 0) {
      timerId = setTimeout(setTimer, 1000)
      timer--
      document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0) {    
      setWinner({ player, enemy, timerId })
    }
  }
}

function animate() {
  if (!paused) {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    enemy.update()
    player.update()  

    player.velocity.x = 0
    if (keys.a.pressed) {
      player.velocity.x = -5
    } else if (keys.d.pressed) {
      player.velocity.x = 5
    }

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