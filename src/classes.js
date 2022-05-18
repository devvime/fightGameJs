class Sprite {
  constructor({ 
    position, 
    imageSrc, 
    scale = 1, 
    framesMax = 1,
    offset = { 
      x:0, 
      y: 0 
    }
  }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset
  }
  draw() {
    c.drawImage(
      this.image, 
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x, 
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }
  animateFrames() {
    this.framesElapsed++
    if(this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }
  update() {
    this.draw()
    this.animateFrames()    
  }
}

class Fighter extends Sprite {
  constructor({ 
    position, 
    velocity, 
    color,     
    imageSrc, 
    scale = 1, 
    framesMax = 1,
    offset = { 
      x:0, 
      y: 0 
    },
    sprites
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    })
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
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.sprites = sprites
    this.revert = false

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }
  }
  // draw() {
  //   c.fillStyle = this.color
  //   c.fillRect(this.position.x, this.position.y, this.width, this.height)

  //   //attack box
  //   if (this.isAttacking) {
  //     c.fillStyle = 'green'
  //     c.fillRect(
  //       this.revert ? this.attackBox.position.x - this.width : this.attackBox.position.x,
  //       this.attackBox.position.y,
  //       this.attackBox.width,
  //       this.attackBox.height
  //     )
  //   }
  // }
  update() {
    this.draw()
    this.animateFrames()

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height -96) {
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