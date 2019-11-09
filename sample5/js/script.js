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

//どちらのターンかを指す旗
var flag = new Object();
flag.img = new Image();
flag.img.src = 'img/flag.png'

//爆弾の画像
var bom = new Object();
bom.img = new Image();
bom.img.src = 'img/bom.png'

var bomcnt = 0;
var bom2cnt = 0;
var bomcnt_max = 5;


var cnt = 0; //方向キーを押した回数
var max_cnt = 5; //方向キーを押せる回数
var cnt_log = new Array();//Player1のどの方向キーを押したかを記録る配列
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

//マップのImageオブジェクトを作る

var mapwhite = new Image();
mapwhite.src = 'img/mass-white.png';

var mapblack = new Image();
mapblack.src = 'img/mass-black.png';

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
key.bom = false;
key.bom2 = false;
key.player1 = true;
key.player2 = false;

//0,1判定の最小値、最大値の数字を格納する変数
var min1 = 0;
var max1 = 19;




//マップの作成（さくせい）
var map = [
  [2, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
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
      if (map[y][x] === 0) ctx.drawImage(mapwhite, 0, 0, 32, 32, 32 * (x + 3), 32 * y, 32, 32);
      if (map[y][x] === 1) ctx.drawImage(mapblack, 0, 0, 32, 32, 32 * (x + 3), 32 * y, 32, 32);
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

  addEventListener("mousedown", mousedownfunc1, false);
  addEventListener("mouseup", mouseupfunc1, false);

  //旗画像の表示
  if (key.player1 === true) {
    ctx.drawImage(flag.img, 40, 328);
  }
  if (key.player2 === true) {
    ctx.drawImage(flag.img, 744, 328);
  }

  //爆弾画像の表示
  ctx.drawImage(bom.img, 25, 378);//player1
  ctx.drawImage(bom.img, 750, 378);//player2


  //爆弾の残り回数の表示
  var bomtext = "残り回数";
  ctx.font = "20px serif";
  //player1bom
  ctx.fillText(bomtext, 10, 450);
  ctx.fillText(bomcnt_max - bomcnt, 40, 470);
  for(var i = bomcnt; i <= bomcnt_max; i++){
  if (bomcnt === i) {
    ctx.drawImage(white.img, 20, 450);
    ctx.fillText(bomcnt_max - bomcnt, 40, 470);
  }
}
  //player2bom
  ctx.fillText(bomtext, 738, 450);
  ctx.fillText(bomcnt_max - bom2cnt, 765, 470);
  for(var i = bom2cnt; i <= bomcnt_max; i++){
  if (bom2cnt === i) {
    ctx.drawImage(white.img, 745, 450);
    ctx.fillText(bomcnt_max - bom2cnt, 765, 470);
  }
}





  //方向キーが押されたら、配列cnt_logに記録する
  if (cnt < max_cnt) {
    key.enter = false;
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

      if (key.bom === true) {
        if (cnt < max_cnt) {
          if (bomcnt < bomcnt_max) {
            cnt_log.push('bom');
            console.log(cnt_log);
            cnt++;
            bomcnt++;
            aaa.push(cnt);
            console.log(aaa);
            key.bom = false;
          }
        }
      }

      if (key.bom2 === true) {
        if (cnt < max_cnt) {
          if (bom2cnt < bomcnt_max) {
            cnt_log.push('bom2');
            console.log(cnt_log);
            cnt++;
            bom2cnt++;
            aaa.push(cnt);
            console.log(aaa);
            key.bom2 = false;
          }
        }
      }
    }
  }


  //キーボードを押した矢印を表示
  if (key.player1 === true) {
    var res1x = 40;
    var resy = (cnt - 1) * 64 + 8;
    for (var i = 0; i < 5; i++) {
      if (cnt === i + 1) {
        if (cnt_log[i] === 'up') {
          ctx.drawImage(up.img, res1x, resy);
        }
        if (cnt_log[i] === 'left') {
          ctx.drawImage(left.img, res1x, resy);
        }
        if (cnt_log[i] === 'right') {
          ctx.drawImage(right.img, res1x, resy);
        }
        if (cnt_log[i] === 'down') {
          ctx.drawImage(down.img, res1x, resy);
        }
        if (cnt_log[i] === 'bom') {
          ctx.drawImage(bom.img, res1x, resy);
        }
      }
    }

  }

  if (key.player2 === true) {
    var res2x = 744;
    var resy = (cnt - 1) * 64 + 8;
    for (var i = 0; i < 5; i++) {
      if (cnt === i + 1) {
        if (cnt_log[i] === 'up') {
          ctx.drawImage(up.img, res2x, resy);
        }
        if (cnt_log[i] === 'left') {
          ctx.drawImage(left.img, res2x, resy);
        }
        if (cnt_log[i] === 'right') {
          ctx.drawImage(right.img, res2x, resy);
        }
        if (cnt_log[i] === 'down') {
          ctx.drawImage(down.img, res2x, resy);
        }
        if (cnt_log[i] === 'bom2') {
          ctx.drawImage(bom.img, res2x, resy);
        }
      }
    }
  }

  
  //cnt_logに格納された矢印の方向に進む
  if (cnt === max_cnt) {
    if (key.enter === true) {
      for (var i = 0; i < 5; i++) {
        if (cnt_log[i] === 'left') 
           goLeft();
        else if (cnt_log[i] === 'up') 
           goUp();
        else if (cnt_log[i] === 'right') 
           goRight();
        else if (cnt_log[i] === 'down') 
           goDown();
        else if (cnt_log[i] === 'bom') 
           goBom();
        else if (cnt_log[i] === 'bom2') 
           goBom();
    }
      cnt_log = [];
      key.enter = false;
      cnt = 0;
      clear();
      if (tree.x1 === 704 && tree.y1 === 608) {
        document.write('Player1のゴールです。')
      }
      if (ball.x1 === 704 && ball.y1 === 608) {
        document.write('Player2のゴールです。')
      }

      hanten();

    }
  }

  requestAnimationFrame(main);

}

//ページと依存（いぞん）している全てのデータが読み込まれたら、メインループ開始
addEventListener('load', main(), false);

//クリックしたときに呼び出される関数（かんすう）
function mousedownfunc1(event) {
  var x = event.pageX;
  var y = event.pageY;
  if (x >= 750 && x <= 814 && y >= 550 && y <= 614) key.left = true;
  if (x >= 800 && x <= 864 && y >= 500 && y <= 564) key.up = true;
  if (x >= 850 && x <= 914 && y >= 550 && y <= 614) key.right = true;
  if (x >= 800 && x <= 864 && y >= 600 && y <= 664) key.down = true;
  if (x >= 800 && x <= 850 && y >= 550 && y <= 600) key.enter = true;
  if (key.player1 ===true){
  if (x >= 25 && x <= 75 && y >= 378 && y <= 428) key.bom = true;
  }
  if (key.player2 ===true){
  if (x >= 750 && x <= 800 && y >= 378 && y <= 428) key.bom2 = true;
  }
}

//クリックが終わった後にに呼び出される関数
function mouseupfunc1(event) {
  var x = event.pageX;
  var y = event.pageY;
  if (x >= 750 && x <= 814 && y >= 550 && y <= 614) key.left = false;
  if (x >= 800 && x <= 864 && y >= 500 && y <= 564) key.up = false;
  if (x >= 850 && x <= 914 && y >= 550 && y <= 614) key.right = false;
  if (x >= 800 && x <= 864 && y >= 600 && y <= 664) key.down = false;
  if (key.player1 ===true){
  if (x >= 25 && x <= 75 && y >= 378 && y <= 428) key.bom = false;
  }
  if (key.player2 ===true){
  if (x >= 750 && x <= 800 && y >= 378 && y <= 428) key.bom2 = false;
  }
}

function hanten() {
  if (key.player1 === true) {
    key.player1 = false;
    key.player2 = true;
    return;

  }
  if (key.player2 === true) {
    key.player1 = true;
    key.player2 = false;
    return;

  }
}

function clear(){
  if (key.player1 === true) {
    ctx.clearRect(40, 8, 50, 50);
    ctx.clearRect(40, 72, 50, 50);
    ctx.clearRect(40, 136, 50, 50);
    ctx.clearRect(40, 200, 50, 50);
    ctx.clearRect(40, 264, 50, 50);
    ctx.clearRect(40, 328, 50, 50);
    return;
  }
  else if (key.player2 === true) {
     ctx.clearRect(744, 8, 50, 50);
     ctx.clearRect(744, 72, 50, 50);
     ctx.clearRect(744, 136, 50, 50);
     ctx.clearRect(744, 200, 50, 50);
     ctx.clearRect(744, 264, 50, 50);
     ctx.clearRect(744, 328, 50, 50);
    return;
  }
}

function goLeft(){
  if(key.player1===true){
  var x = tree.x1 / 32 - 3;
  var y = tree.y1 / 32;
  }
  if(key.player2 ===true){
  var x = ball.x1 / 32 - 3;
  var y = ball.y1 / 32;
  }
  if (x > min1 && x <= max1) {
    x--;
    if (map[y][x] === 0 || map[y][x] === 2) {
      if(key.player1===true)
      tree.x1 -= 32;
      if(key.player2 ===true)
      ball.x1 -= 32;
    }
  }
}

function goUp(){
  if(key.player1===true){
    var x = tree.x1 / 32 - 3;
    var y = tree.y1 / 32;
    }
    if(key.player2 ===true){
    var x = ball.x1 / 32 - 3;
    var y = ball.y1 / 32;
    }
  if (y > min1 && y <= max1) {
    y--;
    if (map[y][x] === 0 || map[y][x] === 2) {
      if(key.player1===true)
      tree.y1 -= 32;
      if(key.player2 ===true)
      ball.y1 -= 32;
    }
  }
}

function goRight(){
  if(key.player1===true){
    var x = tree.x1 / 32 - 3;
    var y = tree.y1 / 32;
    }
    if(key.player2 ===true){
    var x = ball.x1 / 32 - 3;
    var y = ball.y1 / 32;
    }
  if (x >= min1 && x < max1) {
    x++;
    if (map[y][x] === 0 || map[y][x] === 2) {
      if(key.player1===true)
      tree.x1 += 32;
      if(key.player2 ===true)
      ball.x1 += 32;
    }
  }
}

function goDown(){
  if(key.player1===true){
    var x = tree.x1 / 32 - 3;
    var y = tree.y1 / 32;
    }
    if(key.player2 ===true){
    var x = ball.x1 / 32 - 3;
    var y = ball.y1 / 32;
    }
  if (y >= min1 && y < max1) {
     y++;
    if (map[y][x] === 0 || map[y][x] === 2) {
      if(key.player1===true)
        tree.y1 += 32;
      if(key.player2 ===true)
        ball.y1 += 32;
    }
  }
}

function goBom(){
  if(key.player1===true){
    var x = tree.x1 / 32 - 3;
    var y = tree.y1 / 32;
    }
    if(key.player2 ===true){
    var x = ball.x1 / 32 - 3;
    var y = ball.y1 / 32;
    }
  if (y >= min1 && y <= max1 && x >= min1 && x <= max1) {
    if (map[y][x - 1] === 1) {
      map[y][x - 1] = 0;
    }
    if (map[y][x + 1] === 1) {
      map[y][x + 1] = 0;

   }
  }
  return;
 }  
