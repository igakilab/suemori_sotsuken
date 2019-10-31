//canvasの設定（せってい）
var canvas = document.getElementById('canvas');
canvas.width = 1200;		//canvasの横幅（よこはば）
canvas.height = 800;	//canvasの縦幅（たてはば）

//コンテキストを取得（しゅとく）
var ctx = canvas.getContext('2d');

//Player1
var tree = new Object();
tree.img = new Image();
tree.img.src = 'img/tree.png';
tree.x1 = 96;
tree.y1 = 0;

//player2
var ball = new Object();
ball.img = new Image();
ball.img.src = 'img/ball.png';
ball.x1 = 704;
ball.y1 = 0;


var cnt = 0; //方向キーを押した回数
var max_cnt = 5; //方向キーを押せる回数
var cnt_log = new Array();//Player1のどの方向キーを押したかを記録る配列
var cnt_log2 = new Array();//Player2のどの方向キーを押したかを記録る配列
var aaa = new Array();

//ボタン画像
var up = new Object();
var down = new Object();
var left = new Object();
var right = new Object();
var des = new Object();

up.img = new Image();
down.img = new Image();
left.img = new Image();
right.img = new Image();
des.img = new Image();

up.img.src = 'img/up.png';
down.img.src = 'img/down.png';
left.img.src = 'img/left.png';
right.img.src = 'img/right.png';
des.img.src = 'img/black.png';

//マップチップのImageオブジェクトを作る
var mapchip = new Image();
mapchip.src = 'img/wb.png';

//ゴールスタートの赤表示
var red = new Image();
red.src = 'img/red.png';

//矢印画像のを削除するための画像
var white = new Object();
white.img = new Image();
white.img.src = 'img/white.png';

//Player1のクリックオブジェクトを作成
var key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.enter = false;
key.player1 = true;
//Player2のクリックオブジェクトを作成
key.up2 = false;
key.down2 = false;
key.right2 = false;
key.left2 = false;
key.player2 = false;

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
  ctx.fillRect(96, 0, 640, 640);
  //迷路の下枠
  ctx.beginPath();
  ctx.moveTo(96, 640);
  ctx.lineTo(736, 640);
  ctx.stroke();
  //迷路の右枠
  ctx.beginPath();
  ctx.moveTo(736, 0);
  ctx.lineTo(736, 640);
  ctx.stroke();
  //迷路左枠
  ctx.beginPath();
  ctx.moveTo(96, 0);
  ctx.lineTo(96, 640);
  ctx.stroke();
  //コマンド確認枠右
  ctx.beginPath();
  ctx.moveTo(800, 0);
  ctx.lineTo(800, 320);
  ctx.stroke();
  //コマンド確認枠右内側
  for (var x = 0; x < 6; x++) {
    ctx.beginPath();
    ctx.moveTo(736, 0 + x * 64);
    ctx.lineTo(800, 0 + x * 64);
    ctx.stroke();
  }
  //コマンド確認枠左
  ctx.beginPath();
  ctx.moveTo(32, 0);
  ctx.lineTo(32, 320);
  ctx.stroke();
  //コマンド確認枠左内側
  for (var x = 0; x < 6; x++) {
    ctx.beginPath();
    ctx.moveTo(32, 0 + x * 64);
    ctx.lineTo(96, 0 + x * 64);
    ctx.stroke();
  }




  for (var y = 0; y < map.length; y++) {
    for (var x = 0; x < map[y].length; x++) {
      if (map[y][x] === 0) ctx.drawImage(mapchip, 0, 0, 32, 32, 32 * (x + 3), 32 * y, 32, 32);
      if (map[y][x] === 1) ctx.drawImage(mapchip, 32, 0, 32, 32, 32 * (x + 3), 32 * y, 32, 32);
      if (map[y][x] === 2) ctx.drawImage(red, 0, 0, 32, 32, 32 * (x + 3), 32 * y, 32, 32);
    }
  }

  //画像を表示
  ctx.drawImage(tree.img, tree.x1, tree.y1);
  ctx.drawImage(ball.img, ball.x1, ball.y1);
  ctx.drawImage(up.img, 800, 500);
  ctx.drawImage(down.img, 800, 600);
  ctx.drawImage(left.img, 750, 550);
  ctx.drawImage(right.img, 850, 550);
  ctx.drawImage(des.img, 800, 550);
  if (key.player1 === true) {
    addEventListener("mousedown", mousedownfunc1, false);
    addEventListener("mouseup", mouseupfunc1, false);
  }
  if (key.player2 === true) {
    addEventListener("mousedown", mousedownfunc2, false);
    addEventListener("mouseup", mouseupfunc2, false);
  }


  //方向キーが押されたら、配列cnt_logに記録する
  if (key.player1 === true) {
    if (key.enter === false) {
      if (key.left === true) {
        if (cnt < max_cnt) {
          cnt_log.push('left');
          console.log(cnt_log);
          cnt++;
          aaa.push(cnt);
          console.log(aaa);
          key.left = false;
        }
      }
      else if (key.up === true) {
        if (cnt < max_cnt) {
          cnt_log.push('up');
          console.log(cnt_log);
          cnt++;
          aaa.push(cnt);
          console.log(aaa);
          key.up = false;
        }
      }
      else if (key.right === true) {
        if (cnt < max_cnt) {
          cnt_log.push('right');
          console.log(cnt_log);
          cnt++;
          aaa.push(cnt);
          console.log(aaa);
          key.right = false;
        }
      }
      else if (key.down === true) {
        if (cnt < max_cnt) {
          cnt_log.push('down');
          console.log(cnt_log);
          cnt++;
          aaa.push(cnt);
          console.log(aaa);
          key.down = false;
        }
      }
    }
  }

  if (key.player2 === true) {
    if (key.enter2 === false) {
      if (key.left2 === true) {
        if (cnt < max_cnt) {
          cnt_log2.push('left');
          console.log(cnt_log2);
          cnt++;
          key.left2 = false;
        }
      }
      else if (key.up2 === true) {
        if (cnt < max_cnt) {
          cnt_log2.push('up');
          console.log(cnt_log2);
          cnt++;
          key.up2 = false;
        }
      }
      else if (key.right2 === true) {
        if (cnt < max_cnt) {
          cnt_log2.push('right');
          console.log(cnt_log2);
          cnt++;
          key.right2 = false;
        }
      }
      else if (key.down2 === true) {
        if (cnt < max_cnt) {
          cnt_log2.push('down');
          console.log(cnt_log2);
          cnt++;
          key.down2 = false;
        }
      }
    }
  }


  //キーボードを押した矢印を表示
  if (key.player1 === true) {
    if (cnt === 1) {
      if (cnt_log[0] === 'up') {
        ctx.drawImage(up.img, 40, 8);
      }
      if (cnt_log[0] === 'left') {
        ctx.drawImage(left.img, 40, 8);
      }
      if (cnt_log[0] === 'right') {
        ctx.drawImage(right.img, 40, 8);
      }
      if (cnt_log[0] === 'down') {
        ctx.drawImage(down.img, 40, 8);
      }
    }

    if (cnt === 2) {
      if (cnt_log[1] === 'up') {
        ctx.drawImage(up.img, 40, 72);
      }
      if (cnt_log[1] === 'left') {
        ctx.drawImage(left.img, 40, 72);
      }
      if (cnt_log[1] === 'right') {
        ctx.drawImage(right.img, 40, 72);
      }
      if (cnt_log[1] === 'down') {
        ctx.drawImage(down.img, 40, 72);
      }
    }

    if (cnt === 3) {
      if (cnt_log[2] === 'up') {
        ctx.drawImage(up.img, 40, 136);
      }
      if (cnt_log[2] === 'left') {
        ctx.drawImage(left.img, 40, 136);
      }
      if (cnt_log[2] === 'right') {
        ctx.drawImage(right.img, 40, 136);
      }
      if (cnt_log[2] === 'down') {
        ctx.drawImage(down.img, 40, 136);
      }
    }

    if (cnt === 4) {
      if (cnt_log[3] === 'up') {
        ctx.drawImage(up.img, 40, 200);
      }
      if (cnt_log[3] === 'left') {
        ctx.drawImage(left.img, 40, 200);
      }
      if (cnt_log[3] === 'right') {
        ctx.drawImage(right.img, 40, 200);
      }
      if (cnt_log[3] === 'down') {
        ctx.drawImage(down.img, 40, 200);
      }
    }

    if (cnt === 5) {
      if (cnt_log[4] === 'up') {
        ctx.drawImage(up.img, 40, 264);
      }
      if (cnt_log[4] === 'left') {
        ctx.drawImage(left.img, 40, 264);
      }
      if (cnt_log[4] === 'right') {
        ctx.drawImage(right.img, 40, 264);
      }
      if (cnt_log[4] === 'down') {
        ctx.drawImage(down.img, 40, 264);
      }
    }
  }

  //cnt_logに格納された矢印の方向に進む
  if (cnt === max_cnt) {
    if (key.enter === true) {
      for (var i = 0; i < 5; i++) {
        if (cnt_log[i] === 'left') {
          var x = tree.x1 / 32 - 3;
          var y = tree.y1 / 32;
          if (x > 0 && x <= 19) {
            x--;
            if (map[y][x] === 0 || map[y][x] === 2) {
              tree.x1 -= 32;


            }
          }
        }

        else if (cnt_log[i] === 'up') {
          var x = tree.x1 / 32 - 3;
          var y = tree.y1 / 32;
          if (y > 0 && y <= 19) {
            y--;
            if (map[y][x] === 0 || map[y][x] === 2) {
              tree.y1 -= 32;
            }
          }
        }

        else if (cnt_log[i] === 'right') {
          var x = tree.x1 / 32 - 3;
          var y = tree.y1 / 32;
          if (x >= 0 && x < 19) {
            x++;
            if (map[y][x] === 0 || map[y][x] === 2) {
              tree.x1 += 32;

            }
          }
        }
        else if (cnt_log[i] === 'down') {
          var x = tree.x1 / 32 - 3;
          var y = tree.y1 / 32;
          if (y >= 0 && y < 19) {
            y++;
            if (map[y][x] === 0 || map[y][x] === 2) {
              tree.y1 += 32;
            }
          }
        }

      }
      cnt_log = [];
      key.enter = false;
      cnt = 0;
      ctx.clearRect(40, 8, 50, 50);
      ctx.clearRect(40, 72, 50, 50);
      ctx.clearRect(40, 136, 50, 50);
      ctx.clearRect(40, 200, 50, 50);
      ctx.clearRect(40, 264, 50, 50);
      if (tree.x1 === 704 && tree.y1 === 608) {
        document.write('ゴールです。')
      }
    }
  }

  requestAnimationFrame(main);

}

//ページと依存（いぞん）している全てのデータが読み込まれたら、メインループ開始
addEventListener('load', main(), false);

//Player1がクリックしたときに呼び出される関数（かんすう）
function mousedownfunc1(event) {
  var x = event.pageX;
  var y = event.pageY;
  if (x >= 750 && x <= 814 && y >= 550 && y <= 614) key.left = true;
  if (x >= 800 && x <= 864 && y >= 500 && y <= 564) key.up = true;
  if (x >= 850 && x <= 914 && y >= 550 && y <= 614) key.right = true;
  if (x >= 800 && x <= 864 && y >= 600 && y <= 664) key.down = true;
  if (x >= 800 && x <= 850 && y >= 550 && y <= 600) key.enter = true;
}

//Player1のクリックが終わった後にに呼び出される関数
function mouseupfunc1(event) {
  var x = event.pageX;
  var y = event.pageY;
  if (x >= 750 && x <= 814 && y >= 550 && y <= 614) key.left = false;
  if (x >= 800 && x <= 864 && y >= 500 && y <= 564) key.up = false;
  if (x >= 850 && x <= 914 && y >= 550 && y <= 614) key.right = false;
  if (x >= 800 && x <= 864 && y >= 600 && y <= 664) key.down = false;

}
//Player2がクリックしたときに呼び出される関数（かんすう）
function mousedownfunc2(event) {
  var x = event.pageX;
  var y = event.pageY;
  if (x >= 750 && x <= 814 && y >= 550 && y <= 614) key2.left = true;
  if (x >= 800 && x <= 864 && y >= 500 && y <= 564) key2.up = true;
  if (x >= 850 && x <= 914 && y >= 550 && y <= 614) key2.right = true;
  if (x >= 800 && x <= 864 && y >= 600 && y <= 664) ke2y.down = true;
  if (x >= 800 && x <= 850 && y >= 550 && y <= 600) key2.enter = true;

}

///Player2のクリックが終わった後にに呼び出される関数
function mouseupfunc2(event) {
  var x = event.pageX;
  var y = event.pageY;
  if (x >= 750 && x <= 814 && y >= 550 && y <= 614) key2.left = false;
  if (x >= 800 && x <= 864 && y >= 500 && y <= 564) key2.up = false;
  if (x >= 850 && x <= 914 && y >= 550 && y <= 614) key2.right = false;
  if (x >= 800 && x <= 864 && y >= 600 && y <= 664) key2.down = false;

}
//ctx.drawImage(up.img, 800, 500);
  //ctx.drawImage(down.img, 800, 600);
  //ctx.drawImage(left.img, 750, 550);
  //ctx.drawImage(right.img, 850, 550);
