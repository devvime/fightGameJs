const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const gravity = 0.2

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.jump = false
  }

  draw() {
    c.fillStyle = 'red'
    c.fillRect(this.position.x, this.position.y, 50, 150)
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
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  }
})

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  }
})

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

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
}

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

animate()

window.addEventListener('keydown', (event) => {
  console.log(event.key);
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
    break
    case 'a':
      keys.a.pressed = true
    break
    case 'w':
      if (player.jump) {
        player.velocity.y = -10
      }
    break

    case 'ArrowRight':
      keys.ArrowRight.pressed = true
    break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
    break
    case 'ArrowUp':
      enemy.velocity.y = -10
    break
  }
})

window.addEventListener('keyup', (event) => {
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
})