/** マスの大きさ */
const SIZE = 32

class Player {
  constructor(x, y) {
    this.x = x
    this.y = y
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

  $('#arrowUp').click(() => {
    // 描画部分
    const point = movePoint()
    const x = (turn ? player1 : player2).x + point.x
    const y = (turn ? player1 : player2).y + point.y
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
    // ここまで
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-arrow-alt-circle-up fa-4x"></i>')
    select.push('up')
    postMove()
  })

  $('#arrowLeft').click(() => {
    // 描画部分
    const point = movePoint()
    const x = (turn ? player1 : player2).x + point.x
    const y = (turn ? player1 : player2).y + point.y
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
    // ここまで
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-arrow-alt-circle-left fa-4x"></i>')
    select.push('left')
    postMove()
  })

  $('#arrowRight').click(() => {
    // 描画部分
    const point = movePoint()
    const x = (turn ? player1 : player2).x + point.x
    const y = (turn ? player1 : player2).y + point.y
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
    // ここまで
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-arrow-alt-circle-right fa-4x"></i>')
    select.push('right')
    postMove()
  })

  $('#arrowDown').click(() => {
    // 描画部分
    const point = movePoint()
    const x = (turn ? player1 : player2).x + point.x
    const y = (turn ? player1 : player2).y + point.y
    const canvas = $('#canvas')[0]
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
    // ここまで
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-arrow-alt-circle-down fa-4x"></i>')
    select.push('down')
    postMove()
  })

  $('.bomb').click(() => {
    $(`#player${turn ? 1 : 2}select${select.length + 1}`).html('<i class="fas fa-bomb fa-4x"></i>')
    select.push('down')
    postMove()
  })

  // 描画部分
  const image = new Image()
  image.src = 'img/ball.png'
  image.onload = () => {
    ctx.drawImage(image, 0, 0)
  }
  // ここまで

  postMove()
})

function postMove() {
  if (select.length === 5) {
    $('#arrowUp').prop('disabled', true)
    $('#arrowLeft').prop('disabled', true)
    $('#arrowRight').prop('disabled', true)
    $('#arrowDown').prop('disabled', true)
    $('#selectCheck').prop('disabled', false)
  }

  const point = movePoint()
  const x = (turn ? player1 : player2).x + point.x
  const y = (turn ? player1 : player2).y + point.y

  $('#arrowUp').prop('disabled', y === 0 || map[y - 1][x] === 1)
  $('#arrowLeft').prop('disabled', x === 0 || map[y][x - 1] === 1)
  $('#arrowRight').prop('disabled', x === map[0].length - 1 || map[y][x + 1] === 1)
  $('#arrowDown').prop('disabled', y === map.length - 1 || map[y + 1][x] === 1)
  $('.bomb').prop('disabled', map[y][x] === 3)

  // 描画部分
  const canvas = $('#canvas')[0]
  const ctx = canvas.getContext('2d')
  const image = new Image()
  image.src = 'img/ball.png'
  image.onload = () => {
    ctx.drawImage(image, x * SIZE, y * SIZE)
  }
  // ここまで
}

function movePoint() {
  let x = 0
  let y = 0

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
    }
  })
  return { x: x, y: y }
}

/**
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} width
 * @param {Number} height
 */
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

  // 描画部分
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      ctx.fillStyle = (['#fff', '#000', '#f00'])[map[y][x]]
      ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
    }
  }
}
