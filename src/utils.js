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