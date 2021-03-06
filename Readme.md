## 準備
<!--
無くても動くので省く
### Visual Studio Code(vscode)のダウンロード
* 以下のサイトからvscodeをダウンロードする.
このゲームではバージョン1.41.1を使用している.
ダウンロードしたら任意の場所に解凍する.
https://azure.microsoft.com/ja-jp/products/visual-studio-code/

* vscodeを解凍して，開いた後，画面左にあるアイコンでExtensionsをクリックし，
下記の拡張機能をインストールする.
検索窓に拡張機能名を入力し，対象の拡張機能を選択して，Installをクリックする.
 * EsLint - Integrates ESLint JavaScript into VS Code.
 * Prettier - Code formatter using prettier.
 * Vetur - Vue tooling for VS Code.
 * vue - Syntax Highlight for Vue.js. -->
### Node.jsのダウンロード
* まずNode.jsが自身のパソコンにダウンロードされているか確認する．<br>
コマンドプロンプトを開き，node –version　と入力する．<br>
ここで「v12.13.0」のような，バージョン情報が出てくれば，自分のパソコンに入っていることがわかる．<br>
逆に「‘node’は，…　認識されていません」と表示が出ればダウンロードされていないので,<br>
以下のリンクからダウンロードする．このゲームではバージョン12.13.0を使用している．<br>
ダウンロードしたら任意の場所に解凍する．<br>
https://nodejs.org/ja/

解凍が終われば上記の方法で，もう一度node.jsが自分のパソコンにダウンロードされているか確認する．

### Firebaseの登録
* 今回データベースはFirebaseのRealtime Databaseを使用した．<br>
まず以下のサイトに入ってアカウントを作る．<br>
https://firebase.google.com/<br>
画面右上の「コンソールへ移動」をクリックする．ここでログインするためにGoogleアカウントが必要．<br>
ログインして，プロジェクトを作成をクリックする．まずプロジェクト名を入力する(例えばbomberなど)．<br>
そして次に進み，Googleアナリティクスの有効はどちらでもよい．<br>
有効にした場合は個別に入力が必要である．プロジェクトの作成ができたら，<br>
</>のマークで表しているウェブアプリをクリックして，アプリ名を入力する．<br>
ここでFirebase Hostingの設定はどちらでもよい．登録をするとスクリプトをコピーしてくださいと<br>
表示されるので，各自でメモ帳などにスクリプトをすべてコピーしておく．<br>
次に進んだら，画面左側の開発をクリックして，Databaseを選択し，<br>
その中からRealtime Databaseを選択する．テストモードで開始を押すと，使用できるようになる．<br>
　<br>
* ログイン機能を有効にするために，開発のAuthenticationをクリックする．<br>
そしてログイン方法のなかのメール/アドレスをクリックし，<br>
有効にする（2つあるうちの上のほう）．これでログイン機能を使うことができる．

## ゲームの導入
* まずこのリポジトリをgitcloneし，zipファイルを任意の場所に解凍する．<br>
* vscodeを起動し，解凍したファイルを開く．開いたファイルの.envと書かれたファイルをクリックする．<br>
そこの「VUE_APP_〇〇_〇〇=」とあるので，＝の後の部分を，一つずつ先ほどメモ帳にコピーした<br>
自分のデータに置き換え，保存する．<br>
* エクスプローラーで先ほど解凍したファイルを開き，ロケーションバー（PC > 〇〇 …>clientの部分）を<br>
クリックし，そこでcmdと入力し，コマンドプロンプトを開く.<br>
* 「npm i」と入力しパッケージをダウンロードする．<br>
* そのあと，「npm run serve」と入力し，エラーがなければサーバーが立ち上がる.<br>
* NetWorkのIPアドレスをコピーし，webブラウザ（Google Chrome推奨）に入力することでログイン画面に移行できる．

## 遊び方
1. 1台のPCで遊ぶ場合はPC内で2つの違うブラウザを立ち上げる．(もし，別々のPCで行いたい場合は下のExtension参照)

2. お互いにログインアカウントを作成し，ルーム画面まで進める．ここでログインアカウントを作るときの<br>
注意点として，ログインＩDは，sample@gmail.comのような形で作成する．<br>
パスワードは6文字以上の英数字である．<br>
(FirebaseのFirebase Authenticationをそのままデフォルトで用いているので，詳細はWebで検索してください．)
　
3. ルーム設定画面で，片方がルーム作成を行い，もう片方のプレイヤーは入室ボタンから作成されたルームに入る．

4. 上下左右の矢印コマンドを上手く使って相手に近づき，爆弾で相手を倒したプレイヤーの勝利である．

## Extension
* まずコマンドプロンプト上にて，「npm run build」を入力し実行．
  * これを行うと，distディレクトリにサーバで動作する用のHTML，JS，CSSファイルが生成される．
* client/distディレクトリ内に出来た全てのファイルをサーバ上にアップロードする．
  * サーバ上にアップロードする方法は各自調べてください．
    * FirebaseのHosting機能でも可能です．(例:https://bomber-3f3fd.firebaseapp.com)
* ファイルをアップロードしたら，そのファイルを参照できるURLを開いて，ログイン画面に行くことを確認する．
* 次に各PCのブラウザでそのURLを開く．
* 遊び方の2.に戻る．

## 注意
ゲーム画面中にリロードを行うと，アラートがいっぱい出てきて挙動がおかしくなるので注意．<br>
(アラートのOKを押し続けるとルーム画面に戻ります．戻ったら，ルーム画面でもう一度リロードしてください．)
