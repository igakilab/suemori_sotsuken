//canvasの設定（せってい）
var canvas = document.getElementById('canvas');
canvas.width = 1200;		//canvasの横幅（よこはば）
canvas.height = 800;	//canvasの縦幅（たてはば）

//コンテキストを取得（しゅとく）
var ctx = canvas.getContext('2d');

//オブジェクトを作成
var tree = new Object();
tree.img = new Image();
tree.img.src = 'img/tree.png';
tree.x = 0;
tree.y = 0;
tree.move = 0;

var cnt = 0; //方向キーを押した回数
var max_cnt = 5; //方向キーを押せる回数
var cnt_log = new Array(max_cnt);//どの方向キーを押したかを記録する配列

//ボタン画像
var up = new Object();
var down = new Object();
var left = new Object();
var right = new Object();
up.img = new Image();
down.img = new Image();
left.img = new Image();
right.img = new Image();
up.img.src = 'img/up.png';
down.img.src = 'img/down.png';
left.img.src = 'img/left.png';
right.img.src = 'img/right.png';

//マップチップのImageオブジェクトを作る
var mapchip = new Image();
mapchip.src = 'img/wb.png';

//ゴールスタートの赤表示
var red = new Image();
red.src = 'img/red.png';

//キーボードのオブジェクトを作成
var key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';

//マップの作成（さくせい）
var map = [
  [2, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0],
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
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
  [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2]
]

//メインループ
function main() {
  //塗（ぬ）りつぶす色を指定（してい）
  ctx.fillStyle = "rgb( 0, 0, 0 )";
  //塗（ぬ）りつぶす
  ctx.fillRect(0, 0, 640, 640);
  //迷路の下枠
  ctx.beginPath();
  ctx.moveTo(0, 640);
  ctx.lineTo(640, 640);
  ctx.stroke();
  //迷路の右枠
  ctx.beginPath();
  ctx.moveTo(640, 0);
  ctx.lineTo(640, 640);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(640, 0);
  ctx.stroke();
  //コマンド確認枠右側
  ctx.beginPath();
  ctx.moveTo(704, 0);
  ctx.lineTo(704, 320);
  ctx.stroke();
  //コマンド確認枠内側
  for (var x = 0; x < 6; x++) {
    ctx.beginPath();
    ctx.moveTo(640, 0 + x * 64);
    ctx.lineTo(704, 0 + x * 64);
    ctx.stroke();
  }

  //cnt確認のための表示



  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) ctx.drawImage(mapchip, 0, 0, 32, 32, 32 * x, 32 * y, 32, 32);
      if (map[y][x] === 1) ctx.drawImage(mapchip, 32, 0, 32, 32, 32 * x, 32 * y, 32, 32);
      if (map[y][x] === 2) ctx.drawImage(red, 0, 0, 32, 32, 32 * x, 32 * y, 32, 32);
    }
  }

  //画像を表示
  ctx.drawImage(tree.img, tree.x, tree.y);
  ctx.drawImage(up.img, 800, 500);
  ctx.drawImage(down.img, 800, 600);
  ctx.drawImage(left.img, 750, 550);
  ctx.drawImage(right.img, 850, 550);
  addEventListener("keydown", keydownfunc, false);
  addEventListener("keyup", keyupfunc, false);

  //方向キーが押されている場合（ばあい）は、移動する
  if (tree.move === 0) {
    if (key.left === true) {
      var x = tree.x / 32;
      var y = tree.y / 32;
      x--;
      if (map[y][x] === 0 || map[y][x] === 2) {
        tree.move = 32;
        key.push = 'left';

      }
    }
    if (key.up === true) {
      var x = tree.x / 32;
      var y = tree.y / 32;
      if (y > 0) {
        y--;
        if (map[y][x] === 0 || map[y][x] === 2) {
          tree.move = 32;
          key.push = 'up';

        }
      }
    }
    if (key.right === true) {
      var x = tree.x / 32;
      var y = tree.y / 32;
      x++;
      if (map[y][x] === 0 || map[y][x] === 2) {
        tree.move = 32;
        key.push = 'right';

      }
    }
    if (key.down === true) {
      var x = tree.x / 32;
      var y = tree.y / 32;
      if (y < 19) {
        y++;
        if (map[y][x] === 0 || map[y][x] === 2) {
          tree.move = 32;
          key.push = 'down';

        }
      }
    }
  }

  //0より大きい場合は、4pxずつ移動（いどう）を続ける
  if (tree.move > 0) {
    tree.move -= 4;
    if (key.push === 'left') tree.x -= 4;
    if (key.push === 'up') tree.y -= 4;
    if (key.push === 'right') tree.x += 4;
    if (key.push === 'down') {
      tree.y += 4;
      cnt++;
    }
  }

  requestAnimationFrame(main);
}
//ページと依存（いぞん）している全てのデータが読み込まれたら、メインループ開始
addEventListener('load', main(), false);

//キーボードが押されたときに呼び出される関数（かんすう）
function keydownfunc(event) {
  var key_code = event.keyCode;
  if (key_code === 37) key.left = true;
  if (key_code === 38) key.up = true;
  if (key_code === 39) key.right = true;
  if (key_code === 40) key.down = true;
  event.preventDefault();		//方向キーでブラウザがスクロールしないようにする
}

//キーボードが放（はな）されたときに呼び出される関数
function keyupfunc(event) {
  var key_code = event.keyCode;
  if (key_code === 37) key.left = false;
  if (key_code === 38) key.up = false;
  if (key_code === 39) key.right = false;
  if (key_code === 40) key.down = false;
}
