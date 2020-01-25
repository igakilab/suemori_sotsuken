## 準備
### Visual Studio Code(vscode)のダウンロード
・以下のサイトからvscodeをダウンロードする.  
  このゲームではバージョン1.41.1を使用している.  
  ダウンロードしたら任意の場所に解凍する.  
  https://azure.microsoft.com/ja-jp/products/visual-studio-code/  

・vscodeを解凍して，開いた後，画面左にあるアイコンでExtensionsをクリックし，下記の拡張機能をインストールする
  検索窓に拡張機能名を入力し，対象の拡張機能を選択して，Installをクリックする．　　
  ・EsLint - Integrates ESLint JavaScript into VS Code.
  ・Prettier - Code formatter using prettier.
  ・Vetur - Vue tooling for VS Code.
  ・vue - Syntax Highlight for Vue.js.

### Node.jsのダウンロード
　・まずNode.jsが自身のパソコンにダウンロードされているか確認する．
　　コマンドプロンプトを開き，node –version　と入力する．
　　ここで「v12.13.0」のような，バージョン情報が出てくれば，自分のパソコンに入っていることがわかる．
　　逆に「‘node’は，…　認識されていません」と表示が出ればダウンロードされていないので
    以下のリンクからダウンロードする．このゲームではバージョン12.13.0を使用している．
    ダウンロードしたら任意の場所に解凍する．
    https://nodejs.org/ja/

    解凍が終われば上記の方法で，もう一度node.jsが自分のパソコンにダウンロードされているか確認する，

### Firebaseの登録
　・今回データベースはFirebaseのRealtime Databaseを使用した．
　　まず以下のサイトに入ってアカウントを作る．
　　https://firebase.google.com/
　　画面右上の「コンソールへ移動」をクリックする．ここでログインするためにGoogleアカウントが必要．
  　ログインして，プロジェクトを作成をクリックする．まずプロジェクト名を入力する(例えばbomberなど)．
 　 そして次に進み，Googleアナリティクスの有効はどちらでもよい．有効にした場合は個別に入力が必要である．
　  プロジェクトの作成ができたら，</>のマークで表しているウェブアプリをクリックして，アプリ名を入力する．
 　 ここでFirebase Hostingの設定はどちらでもよい．登録をするとスクリプトをコピーしてくださいと表示されるので
 　 各自でメモ帳などにスクリプトをすべてコピーしておく．次に進んだら，画面左側の開発をクリックして，
　  Databaseを選択し，その中からRealtime Databaseを選択する．テストモードで開始を押すと，使用できるようになる．
　
・ログイン機能を有効にするために，開発のAuthenticationをクリックする．
　そしてログイン方法のなかのメール/アドレスをクリックし，
 　有効にする（2つあるうちの上のほう）．これでログイン機能を使うことができる．

## ゲームの導入
・まずこのリポジトリをgitcloneし，zipファイルを任意の場所に解凍する．
・vscodeを起動し，解凍したファイルを開く．開いたファイルの.envと書かれたファイルをクリックする．
　そこの「VUE_APP_〇〇_〇〇=」とあるので，＝の後の部分を，一つずつ先ほどメモ帳にコピーした自分データに置き換え，保存する．
・エクスプローラーで先ほど解凍したファイルを開き，ロケーションバー（PC > 〇〇 …>clientの部分）をクリックし，
　そこでcmdと入力し，コマンドプロ   ンプトを開く.
・「npm i 」と入力しパッケージをダウンロードする．
・そのあと，「npm run serve」と入力し，エラーがなければサーバーが立ち上がる．
・NetWorkのIPアドレスををコピーし，webブラウザ（Google Chrome推奨）に入力することでログイン画面に移行できる．

## 遊び方
１．	まず，上記で立ち上げたIPアドレスをもう一人のプレイヤーにSlackなどで送ってあげる．

２．	お互いにログインアカウントを作成し，ルーム画面まで進める．ここでログインアカウントを作るときの注意点として，ログインＩDは，
      sample@gmail.comのような形で作成する．パスワードは6文字以上の英数字である．
　
３．	ルーム画面で，片方がルーム作成を行い，もう片方のプレイヤーは入室ボタンから作成されたルームに入る．

４．	上下左右の矢印コマンドを上手く使って相手に近づき，爆弾で相手を倒したプレイヤーの勝利である．
      詳しい遊び方は卒業論文を参照していただきたい．
