//canvasの設定（せってい）
var canvas = document.getElementById( 'canvas' );
canvas.width = 640;		//canvasの横幅（よこはば）
canvas.height = 640;	//canvasの縦幅（たてはば）
 
//コンテキストを取得（しゅとく）
var ctx = canvas.getContext( '2d' );
 
//りこちゃんのオブジェクトを作成
var tree = new Object();
tree.img = new Image();
tree.img.src = 'img/tree.png';
tree.x = 0;
tree.y = 0;
tree.move = 0;
 
//マップチップのImageオブジェクトを作る
var mapchip = new Image();
mapchip.src = 'img/wb.png';
 
//キーボードのオブジェクトを作成
var key = new Object();
key.up = false;
key.down = false;
key.right = false;
key.left = false;
key.push = '';
 
//マップの作成（さくせい）
var map = [
	[0, 0, 1, 0, 1, 0, 0, 0 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,1 ,0],
	[0, 1, 0, 0, 0, 1, 1, 1 ,0 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,1 ,0 ,1 ,0],
	[0, 0, 1, 1, 0, 0, 0, 1 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,0],
	[1, 0, 1, 0, 1, 1, 0, 0 ,0 ,1 ,1 ,1 ,1 ,1 ,0 ,0 ,1 ,0 ,1 ,0],
	[0, 0, 0, 0, 0, 1, 1, 1 ,0 ,1 ,0 ,0 ,0 ,0 ,1 ,1 ,0 ,1 ,1 ,0],
	[0, 1, 1, 1, 0, 0, 0, 0 ,0 ,1 ,0 ,1 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0],
	[0, 1, 1, 1, 0, 1, 1, 1 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,1 ,1 ,1 ,0],
	[0, 0, 0, 1, 0, 0, 0, 0 ,1 ,0 ,0 ,1 ,0 ,1 ,1 ,0 ,0 ,0 ,1 ,0],
	[1, 1, 0, 1, 1, 1, 1, 1 ,1 ,0 ,1 ,1 ,0 ,0 ,1 ,1 ,1 ,0 ,1 ,1],
	[1, 0, 0, 0, 0, 0, 1, 1 ,0 ,0 ,0 ,0 ,1 ,0 ,1 ,1 ,0 ,0 ,1 ,0],
	[1, 0, 1, 1, 1, 0, 0, 0 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,1 ,1 ,0 ,0],
	[1, 0, 1, 0, 1, 1, 1, 0 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,0 ,0 ,0 ,0 ,1],
	[0, 0, 1, 0, 0, 1, 0, 0 ,1 ,0 ,0 ,1 ,0 ,1 ,0 ,1 ,1 ,1 ,0 ,0],
	[0, 1, 1, 1, 0, 1, 0, 1 ,0 ,0 ,1 ,1 ,0 ,1 ,0 ,1 ,1 ,0 ,1 ,0],
	[0, 0, 0, 1, 0, 1, 0, 0 ,1 ,0 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0 ,0 ,0],
	[1, 1, 0, 1, 0, 1, 0, 1 ,1 ,0 ,0 ,1 ,0 ,1 ,1 ,0 ,1 ,1 ,1 ,0],
	[0, 0, 0, 1, 0, 1, 1, 1 ,1 ,1 ,0 ,1 ,0 ,1 ,1 ,0 ,0 ,0 ,1 ,0],
	[0, 1, 1, 1, 0, 1, 0, 0 ,0 ,0 ,0 ,1 ,0 ,0 ,0 ,1 ,1 ,0 ,1 ,1],
	[0, 1, 0, 0, 0, 1, 0, 1 ,1 ,1 ,0 ,0 ,1 ,1 ,0 ,1 ,0 ,0 ,0 ,0],
	[0, 0, 0, 1, 0, 0, 0, 1 ,1 ,1 ,1 ,0 ,0 ,0 ,1 ,1 ,1 ,1 ,1 ,1]
]
 
//メインループ
function main() {
	//塗（ぬ）りつぶす色を指定（してい）
	ctx.fillStyle = "rgb( 0, 0, 0 )";
	//塗（ぬ）りつぶす
	ctx.fillRect(0, 0, 640, 640);
 
	for (var y=0; y<map.length; y++) {
		for (var x=0; x<map[y].length; x++) {
			if ( map[y][x] === 0 ) ctx.drawImage( mapchip, 0, 0, 32, 32, 32*x, 32*y, 32, 32 );
			if ( map[y][x] === 1 ) ctx.drawImage( mapchip, 32, 0, 32, 32, 32*x, 32*y, 32, 32 );
		}
	}
 
	//画像を表示
	ctx.drawImage( tree.img, tree.x, tree.y );
 
	addEventListener("keydown", keydownfunc, false);
	addEventListener("keyup", keyupfunc, false);
 
	//方向キーが押されている場合（ばあい）は、りこちゃんが移動する
	if ( tree.move === 0 ) {
		if ( key.left === true ) {
			var x = tree.x/32;
			var y = tree.y/32;
			x--;
			if ( map[y][x] === 0 ) {
				tree.move = 32;
				key.push = 'left';
			}
		}
		if ( key.up === true ) {
			var x = tree.x/32;
			var y = tree.y/32;
			if ( y > 0) {
				y--;
				if ( map[y][x] === 0 ) {
					tree.move = 32;
					key.push = 'up';
				}
			}
		}
		if ( key.right === true ) {
			var x = tree.x/32;
			var y = tree.y/32;
			x++;
			if ( map[y][x] === 0 ) {
				tree.move = 32;
				key.push = 'right';
			}
		}
		if ( key.down === true ) {
			var x = tree.x/32;
			var y = tree.y/32;
			if ( y < 19 ) {
				y++;
				if ( map[y][x] === 0 ) {
					tree.move = 32;
					key.push = 'down';
				}
			}
		}
	}
 
	//rico.moveが0より大きい場合は、4pxずつ移動（いどう）を続ける
	if (tree.move > 0) {
		tree.move -= 4;
		if ( key.push === 'left' ) tree.x -= 4;
		if ( key.push === 'up' ) tree.y -= 4;
		if ( key.push === 'right' ) tree.x += 4;
		if ( key.push === 'down' ) tree.y += 4;
	}
 
	requestAnimationFrame( main );
}
//ページと依存（いぞん）している全てのデータが読み込まれたら、メインループ開始
addEventListener('load', main(), false);
 
//キーボードが押されたときに呼び出される関数（かんすう）
function keydownfunc( event ) {
	var key_code = event.keyCode;
	if( key_code === 37 ) key.left = true;
	if( key_code === 38 ) key.up = true;
	if( key_code === 39 ) key.right = true;
	if( key_code === 40 ) key.down = true;
	event.preventDefault();		//方向キーでブラウザがスクロールしないようにする
}
 
//キーボードが放（はな）されたときに呼び出される関数
function keyupfunc( event ) {
	var key_code = event.keyCode;
	if( key_code === 37 ) key.left = false;
	if( key_code === 38 ) key.up = false;
	if( key_code === 39 ) key.right = false;
	if( key_code === 40 ) key.down = false;
}