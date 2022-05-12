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
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //attack box
    if (this.isAttacking) {
      c.fillStyle = 'green'
      c.fillRect(
        this.attackBox.position.x, 
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

function animate() {
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
    player.attackBox.position.x + player.attackBox.width >= enemy.position.x 
    && 
    player.attackBox.position.x <= enemy.position.x + enemy.width
    &&
    player.attackBox.position.y + player.attackBox.height >= enemy.position.y
    &&
    player.attackBox.position.x <= enemy.position.y + enemy.height
    &&
    player.isAttacking
  ) {
    player.isAttacking = false
    console.log('mata');
  }
}



animate()

window.addEventListener('keydown', (event) => {
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
    case ' ':
      player.attack()
    break

    case 'ArrowRight':
      keys.ArrowRight.pressed = true
    break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
    break
    case 'ArrowUp':
      if (enemy.jump) {
        enemy.velocity.y = -10
      }
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