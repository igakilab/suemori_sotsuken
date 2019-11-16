/** マスの大きさ */
const SIZE = 32

const MASS = {
  /** 何もなし */
  NONE: 0,
  /** 壁 */
  WALL: 1,
  /** 1P爆弾 */
  P1BOMB: 2,
  /** 2P爆弾 */
  P2BOMB: 3,
  /** 1P自身 */
  PLAYER1: 100,
  /** 2P自身 */
  PLAYER2: 101,
}

class Player {
  constructor(x, y, bomb = 5) {
    this.x = x
    this.y = y
    this.bomb = bomb
  }
}

let map
let player1
let player2
let turn = true
const log = []
let select = []

$(() => {
  const canvas = $('#canvas')[0]
  canvas.width = canvas.height = 640
  const ctx = canvas.getContext('2d')
  genMap(ctx)
  player1 = new Player(0, 0)
  player2 = new Player(19, 19)

  $('#player2button').removeClass('player2')
  $('#player2button').addClass('player')
  $('#player1button').addClass('player1')

  $('#arrowUp').click(() => {
    preMove()
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-arrow-alt-circle-up fa-4x"></i>')
    select.push('up')
    postMove()
  })

  $('#arrowLeft').click(() => {
    preMove()
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-arrow-alt-circle-left fa-4x"></i>')
    select.push('left')
    postMove()
  })

  $('#arrowRight').click(() => {
    preMove()
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-arrow-alt-circle-right fa-4x"></i>')
    select.push('right')
    postMove()
  })

  $('#arrowDown').click(() => {
    preMove()
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-arrow-alt-circle-down fa-4x"></i>')
    select.push('down')
    postMove()
  })

  $('#bomb').click(() => {
    const point = movePoint()
    const x = (turn ? player1 : player2).x + point.x
    const y = (turn ? player1 : player2).y + point.y
    $(`#player${turn ? 1 : 2}bomb`).text((turn ? player1 : player2).bomb - point.bomb.length - 1)
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')
    ctx.fillText('◎', x * SIZE - 1, y * SIZE + 30)
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-bomb fa-4x"></i>')
    select.push('bomb')
    postMove()
  })

  $('#selectCheck').click(() => {
    const point = movePoint()
    if (turn) {
      map[player1.y][player1.x] = MASS.NONE
      player1.bomb -= point.bomb.length
      $('#player1bomb').text(player1.bomb)
      point.bomb.forEach(bombPoint => {
        const x = player1.x + bombPoint.x
        const y = player1.y + bombPoint.y
        map[y][x] = MASS.P1BOMB
      })
      player1.x += point.x
      player1.y += point.y
      map[player1.y][player1.x] = MASS.PLAYER1
      $('#player1button').removeClass('player1')
      $('#player1button').addClass('player')
      $('#player2button').removeClass('player')
      $('#player2button').addClass('player2')
    } else {
      map[player2.y][player2.x] = MASS.NONE
      player2.bomb -= point.bomb.length
      $('#player2bomb').text(player2.bomb)
      point.bomb.forEach(bombPoint => {
        const x = player2.x + bombPoint.x
        const y = player2.y + bombPoint.y
        map[y][x] = MASS.P2BOMB
      })
      player2.x += point.x
      player2.y += point.y
      map[player2.y][player2.x] = MASS.PLAYER2
      $('#player2button').removeClass('player2')
      $('#player2button').addClass('player')
      $('#player1button').removeClass('player')
      $('#player1button').addClass('player1')
    }
    log.push([`${turn ? 1 : 2}P`, select.concat()])
    select = []
    for (let i = 1; i <= 5; i++) {
      $(`#player${turn ? 1 : 2}select${i}`).html('')
    }
    turn = !turn
    postMove()

    if (!(log.length % 2)) {
      const result = explosion()
      if (result !== 'NONE') {
        alert(result)
      }
    }
  })

  $('#redo').click(() => {
    preMove(true)
    if(select.pop() === 'bomb') {
      const point = movePoint()
      $(`#player${turn ? 1 : 2}bomb`).text((turn ? player1 : player2).bomb - point.bomb.length)
    }
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('')
    postMove()
  })

  ctx.font = '36px serif'
  ctx.fillStyle = 'black'
  ctx.fillText('1', 5 + player1.x * SIZE, 30 + player1.y * SIZE)
  ctx.fillText('2', 5 + player2.x * SIZE, 30 + player2.y * SIZE)
  postMove()
})

function preMove(redo = false) {
  const point = movePoint()
  const x = (turn ? player1 : player2).x + point.x
  const y = (turn ? player1 : player2).y + point.y
  const canvas = $('#canvas')[0]
  const ctx = canvas.getContext('2d')
  ctx.clearRect(x * SIZE, y * SIZE, SIZE, SIZE)
  ctx.font = '36px serif'
  ctx.fillStyle = 'black'
  if (select[select.length - 1] === 'bomb' && !redo) {
    ctx.fillText('◎', x * SIZE - 3, y * SIZE + 30)
  }
  return { x: x, y: y }
}

function postMove() {
  const point = movePoint()
  const x = (turn ? player1 : player2).x + point.x
  const y = (turn ? player1 : player2).y + point.y
  const bomb = (turn ? player1 : player2).bomb - point.bomb.length

  if (select.length === 5) {
    $('#arrowUp').prop('disabled', true)
    $('#arrowLeft').prop('disabled', true)
    $('#arrowRight').prop('disabled', true)
    $('#arrowDown').prop('disabled', true)
    $('#bomb').prop('disabled', true)
    $('#selectCheck').prop('disabled', false)
  } else {
    $('#redo').prop('disabled', select.length === 0)

    const myself = turn ? MASS.PLAYER1 : MASS.PLAYER2
    $('#arrowUp').prop('disabled',
      y === 0 ||
      point.bomb.some(point => point.x === x && point.y === y - 1) ||
      map[y - 1][x] !== MASS.NONE && !(map[y - 1][x] === myself)
    )
    $('#arrowLeft').prop('disabled',
      x === 0 ||
      point.bomb.some(point => point.x === x - 1 && point.y === y) ||
      map[y][x - 1] !== MASS.NONE && !(map[y][x - 1] === myself)
    )
    $('#arrowRight').prop('disabled',
      x === map[0].length - 1 ||
      point.bomb.some(point => point.x === x + 1 && point.y === y) ||
      map[y][x + 1] !== MASS.NONE && !(map[y][x + 1] === myself)
    )
    $('#arrowDown').prop('disabled',
      y === map.length - 1 ||
      point.bomb.some(point => point.x === x && point.y === y + 1) ||
      map[y + 1][x] !== MASS.NONE && !(map[y + 1][x] === myself)
    )
    $('#bomb').prop('disabled', bomb === 0 || select[select.length - 1] === 'bomb')
  }
  $('#selectCheck').prop('disabled', select.length < 5)

  const canvas = $('#canvas')[0]
  const ctx = canvas.getContext('2d')
  ctx.font = '36px serif'
  ctx.fillStyle = 'black'
  ctx.fillText(turn ? '1' : '2', 5 + x * SIZE, 30 + y * SIZE)
}

function explosion() {
  const canvas = $('#canvas')[0]
  const ctx = canvas.getContext('2d')
  let player1 = false
  let player2 = false
  let animationPoint = []
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if ([MASS.P1BOMB, MASS.P2BOMB].includes(map[y][x])) {
        ctx.clearRect(x * SIZE, y * SIZE, SIZE, SIZE)
        const explosionPoint = [{ x: x, y: y }]
        if (y > 0) {
          explosionPoint.push({ x: x, y: y - 1 })
        }
        if (x > 0) {
          explosionPoint.push({ x: x - 1, y: y })
        }
        if (x < map[y].length - 1) {
          explosionPoint.push({ x: x + 1, y: y })
        }
        if (y < map.length - 1) {
          explosionPoint.push({ x: x, y: y + 1 })
        }
        if (y > 0 && x > 0) {
          explosionPoint.push({ x: x - 1, y: y - 1 })
        }
        if (y > 0 && x < map[y].length - 1) {
          explosionPoint.push({ x: x + 1, y: y - 1 })
        }
        if (y < map.length - 1 && x > 0) {
          explosionPoint.push({ x: x - 1, y: y + 1 })
        }
        if (y < map.length - 1 && x < map[y].length - 1) {
          explosionPoint.push({ x: x + 1, y: y + 1 })
        }

        animationPoint = animationPoint.concat(...explosionPoint)

        player1 = player1 || explosionPoint.some(point => map[point.y][point.x] === MASS.PLAYER1)
        player2 = player2 || explosionPoint.some(point => map[point.y][point.x] === MASS.PLAYER2)

        map[y][x] = MASS.NONE
      }
    }
  }

  if (player1 && player2) {
    return 'DRAW'
  }
  if (player1) {
    return 'WIN PLAYER2'
  }
  if (player2) {
    return 'WIN PLAYER1'
  }
  return 'NONE'
}

function movePoint() {
  let x = 0
  let y = 0
  let bomb = []

  select.forEach(value => {
    switch (value) {
      case 'up':
        y--
        break
      case 'left':
        x--
        break
      case 'right':
        x++
        break
      case 'down':
        y++
        break
      case 'bomb':
        bomb.push({ x: x, y: y })
        break
    }
  })
  return { x: x, y: y, bomb: bomb }
}

function genMap(ctx, width = 20, height = 20) {
  ctx.fillStyle = '#000'
  ctx.strokeRect(0, 0, SIZE * width, SIZE * height)

  // 後で改良
  map = [
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0],
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0],
    [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1],
    [0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0]
  ]

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      ctx.fillStyle = (['white', 'black', 'red'])[map[y][x]]
      ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
    }
  }
}
