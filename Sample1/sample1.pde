int size_x = 1280;  //水平方向の画面サイズ
int size_y = 720;  //垂直方向の画面サイズ
int x = 5;  //原点のx座標からゲーム画面のx座標の差
int y = 5;  //原点のy座標からゲーム画面のy座標の差
int pos_x = 0;  //オブジェクトの現在地のx座標
int pos_y = 0;  //オブジェクトの現在地のy座標
int dif = 30; //マスの大きさと円の直径の差
int cnt = 0; //ボタンを押した回数
int max_cnt_button = 5; //ボタンを押す最大回数
int[] log_button = new int[max_cnt_button]; //どのボタンを押したか記録する配列 上=1 右=2 下=3 左=4
int[][] board = new int[6][6]; //ゲームボードの状態を記述した2次元配列
int flag = 0; //プログラム実行可能かどうかを判定するフラグ 0=不可能 1=可能
int exit_flag = 1; //ゲームを終了するかどうか判断するフラグ 0=続行 1=終了
int area_flag = 0; //現在コマンド,関数,分岐のうちどの領域が選択されているかを示すフラグ 0=コマンド, 1=関数, 2=分岐



void setup(){
  size(1300, 800);  //ユーザーフォームのサイズ
  
  for(int i = 0; i < 6; i++){
    for(int j = 0; j < 6; j++){
      board[i][j] = 0; //0=白，1=赤，2=緑，3=青
    }
  }

  board[int(pos_x/(size_y/6))][int(pos_y/(size_y/6))] = 1;
  
}

  
void draw(){
  
  for(int i = 0; i < 6; i++){ //マスが全部埋まっているか判定
    for(int j = 0; j < 6; j++){
      if(board[i][j] == 0){
        exit_flag = 0;
        break;
      }
    }
  }
  
  if(exit_flag == 1){ //フラグが立っていれば強制終了
    exit(); //完成時にはメッセージとボタンを表示させ、終了かリトライか選択できるようにする(仮)
  }
  exit_flag = 1;
  
  smooth();
  background(255);
  stroke(0);
  strokeWeight(2);
  rect(0+x, 0+y, size_x, size_y);
  
  for(int i = 1; i < 6; i++){  //マスの横線を引く処理
    line(0+x, (size_y/6)*i+y, size_y+x, (size_y/6)*i+y);
  }
  
  for(int i = 1; i < 6; i++){  //マスの縦線を引く処理
    line((size_y/6)*i+x, 0+y, (size_y/6)*i+x, size_y+y);
  }
  
  line(size_y+x, 0+y, size_y+x, size_y+y);
  line(size_y+x, (size_y/6)+y, size_x+x, (size_y/6)+y); //コマンド確認領域区切り線
  
  line(size_y+x, (size_y/6*2)+y, size_x+x, (size_y/6*2)+y); //関数入力領域区切り線
  rect(size_y+((size_x-size_y)/5)*4+x, (size_y/6)+y, (size_x-size_y)/5, size_y/6); //関数ボタンの描画
  fill(0);
  textSize(100);
  textAlign(CENTER, BOTTOM);
  text("■", size_y+((size_x-size_y)/5)*4+((size_x-size_y)/10)+x, (size_y/6)*2+y);
  fill(255);
  line(size_y+x, (size_y/6*3)+y, size_x+x, (size_y/6*3)+y); //分岐処理領域区切り線
  
  //line(size_y+(size_x-size_y)/2+x, 0+y, size_y+(size_x-size_y)/2+x, size_y+y);
  
  for(int i = 0; i < 3; i++){  //上,決定,下ボタンの描画
    rect(size_y+((size_x-size_y)/2)-(size_y/6)/2+x, (size_y/2)+(size_y/6)*i+y, size_y/6, size_y/6);
  }
  rect(size_y+((size_x-size_y)/2)-(size_y/6)/2-(size_y/6)+x, (size_y/2)+(size_y/6)+y, size_y/6, size_y/6); //左ボタンの描画
  rect(size_y+((size_x-size_y)/2)-(size_y/6)/2+(size_y/6)+x, (size_y/2)+(size_y/6)+y, size_y/6, size_y/6); //右ボタンの描画
  
  fill(0);
  textSize(150);
  textAlign(CENTER);
  text("↑", (size_y+((size_x-size_y)/2)+x),((size_y/2)+size_y/6+y)); //1
  text("→", (size_y+((size_x-size_y)/2)+size_y/6), ((size_y/2)+(size_y/6)*2-y*1.5)); //2
  text("↓", (size_y+((size_x-size_y)/2)+x),((size_y/2)+(size_y/6)*3-y)); //3
  text("←", (size_y+((size_x-size_y)/2)-size_y/6+x*2), ((size_y/2)+(size_y/6)*2-y*1.5)); //4
  text(cnt, (size_y)+((size_x-size_y)/max_cnt_button)*2+x, (size_y/4)*2+y); //ボタンを押した回数を表示(完成版では削除)
  fill(255);
  
  stroke(0);
  strokeWeight(5);
  ellipse((size_y+((size_x-size_y)/2)+x), ((size_y/2)+(size_y/6)+(size_y/12)+y), size_y/6, size_y/6); //◎
  ellipse((size_y+((size_x-size_y)/2)+x), ((size_y/2)+(size_y/6)+(size_y/12)+y), (size_y/6)-dif, (size_y/6)-dif);
  
  strokeWeight(2);
  for(int i = 0; i < 6; i++){
    for(int j = 0; j < 6; j++){
      if(board[i][j] == 1){
        fill(255, 0, 0);  //円の色を赤に変更
        rect((size_y/6)*i+x, (size_y/6)*j+y, size_y/6, size_y/6);
        fill(255);
      }
    }
  }
  
  if((frameCount / 10) % 2 == 0){
    fill(255, 0, 0); //赤
  }else{
    fill(255); //白
  }
  rect(pos_x+x, pos_y+y, size_y/6, size_y/6);
  fill(255);
  
  String str;
  stroke(0);
  if(cnt >= 1){ //押されたボタンの回数だけ上に四角形を描画し，押したボタンの矢印を表示する
    if(log_button[0] == 1){
      str = "↑";
    }else if(log_button[0] == 2){
      str = "→";
    }else if(log_button[0] == 3){
      str = "↓";
    }else if(log_button[0] == 4){
      str = "←";
    }else{
      str = "E";
    }
    rect((size_y)+((size_x-size_y)/max_cnt_button)*0+x, 0+y, (size_x-size_y)/max_cnt_button, size_y/6);
    fill(0);
    text(str, (size_y)+((size_x-size_y)/max_cnt_button)/2+x, size_y/6+y);
    fill(255);
    if(cnt >= 2){
      if(log_button[1] == 1){
        str = "↑";
      }else if(log_button[1] == 2){
        str = "→";
      }else if(log_button[1] == 3){
        str = "↓";
      }else if(log_button[1] == 4){
        str = "←";
      }else{
        str = "E";
      }
      rect((size_y)+((size_x-size_y)/max_cnt_button)*1+x, 0+y, (size_x-size_y)/max_cnt_button, size_y/6);
      fill(0);
      text(str, (size_y)+((size_x-size_y)/max_cnt_button)+((size_x-size_y)/max_cnt_button)/2+x, size_y/6+y);
      fill(255);
      if(cnt >= 3){
        if(log_button[2] == 1){
          str = "↑";
        }else if(log_button[2] == 2){
          str = "→";
        }else if(log_button[2] == 3){
          str = "↓";
        }else if(log_button[2] == 4){
          str = "←";
        }else{
          str = "E";
        }
        rect((size_y)+((size_x-size_y)/max_cnt_button)*2+x, 0+y, (size_x-size_y)/max_cnt_button, size_y/6);
        fill(0);
        text(str, (size_y)+((size_x-size_y)/max_cnt_button)*2+((size_x-size_y)/max_cnt_button)/2+x, size_y/6+y);
        fill(255);
        if(cnt >= 4){
          if(log_button[3] == 1){
            str = "↑";
          }else if(log_button[3] == 2){
            str = "→";
          }else if(log_button[3] == 3){
            str = "↓";
          }else if(log_button[3] == 4){
            str = "←";
          }else{
            str = "E";
          }
          rect((size_y)+((size_x-size_y)/max_cnt_button)*3+x, 0+y, (size_x-size_y)/max_cnt_button, size_y/6);
          fill(0);
          text(str, (size_y)+((size_x-size_y)/max_cnt_button)*3+((size_x-size_y)/max_cnt_button)/2+x, size_y/6+y);
          fill(255);
          if(cnt >= 5){
            if(log_button[4] == 1){
              str = "↑";
            }else if(log_button[4] == 2){
              str = "→";
            }else if(log_button[4] == 3){
              str = "↓";
            }else if(log_button[4] == 4){
              str = "←";
            }else{
              str = "E";
            }
            rect((size_y)+((size_x-size_y)/max_cnt_button)*4+x, 0+y, (size_x-size_y)/max_cnt_button, size_y/6);
            fill(0);
            text(str, (size_y)+((size_x-size_y)/max_cnt_button)*4+((size_x-size_y)/max_cnt_button)/2+x, size_y/6+y);
            fill(255);
          }
        }
      }
    }
  }
  str = "";
  
  if(flag == 1){
    for(int i = 0; i < max_cnt_button; i++){
      if(log_button[i] == 1){
        if(pos_y-size_y/6 >= 0){
          pos_y-=size_y/6;
        }
      }else if(log_button[i] == 2){
        if(pos_x+size_y/6 < size_y){
          pos_x+=size_y/6;
        }
      }else if(log_button[i] == 3){
        if(pos_y+size_y/6 < size_y){
          pos_y+=size_y/6;
        }
      }else if(log_button[i] == 4){
        if(pos_x-size_y/6 >= 0){
          pos_x-=size_y/6;
        } 
      }
      board[int(pos_x/(size_y/6))][int(pos_y/(size_y/6))] = 1;
      log_button[i] = 0;
    }
    flag = 0;
    cnt = 0;
  }
  
  
  
}

void mousePressed(){
  if(mouseX > (size_y+((size_x-size_y)/2)-(size_y/6)/2-(size_y/6)+x) && mouseX <(size_y+((size_x-size_y)/2)-(size_y/6)/2-(size_y/6)+x+size_y/6)){  //左ボタンの操作
    if(mouseY > ((size_y/2)+(size_y/6)+y) && mouseY < ((size_y/2)+(size_y/6)+y+size_y/6)){
      fill(0, 0, 255);
      rect((size_y+((size_x-size_y)/2)-(size_y/6)/2-(size_y/6)+x), ((size_y/2)+(size_y/6)+y), size_y/6, size_y/6);
      fill(255);
    }
  }
  
  if(mouseX > (size_y+((size_x-size_y)/2)-(size_y/6)/2+x) && mouseX < (size_y+((size_x-size_y)/2)-(size_y/6)/2+x+size_y/6)){
    if(mouseY > ((size_y/2)+y) && mouseY < ((size_y/2)+y+size_y/6)){  //上ボタンの操作
      fill(0, 0, 255);
      rect((size_y+((size_x-size_y)/2)-(size_y/6)/2+x), (size_y/2)+y, size_y/6, size_y/6);
      fill(255);
    }else if(mouseY > ((size_y/2)+y+(size_y/6)*2) && mouseY < ((size_y/2)+y+(size_y/6)*2+size_y/6)){    //下ボタンの操作
      fill(0, 0, 255);
      rect((size_y+((size_x-size_y)/2)-(size_y/6)/2+x), ((size_y/2)+y+(size_y/6)*2), size_y/6, size_y/6);
      fill(255);
    }else if(mouseY > ((size_y/2)+y+size_y/6) && mouseY < ((size_y/2)+y+(size_y/6)*2)){ //決定ボタンの操作
      fill(0, 0, 255);
      rect((size_y+((size_x-size_y)/2)-(size_y/6)/2+x), ((size_y/2)+y+size_y/6), size_y/6, size_y/6);
      fill(255);
    }
      
  }
  
  if(mouseX > (size_y+((size_x-size_y)/2)-(size_y/6)/2+(size_y/6)+x) && mouseX <(size_y+((size_x-size_y)/2)-(size_y/6)/2+(size_y/6)+x+size_y/6)){  //右ボタンの操作
    if(mouseY >((size_y/2)+(size_y/6)+y) && mouseY <((size_y/2)+(size_y/6)+y+size_y/6)){
      fill(0, 0, 255);
      rect((size_y+((size_x-size_y)/2)-(size_y/6)/2+(size_y/6)+x), ((size_y/2)+(size_y/6)+y), size_y/6, size_y/6);
      fill(255);
    }
  }
}


void mouseClicked(){
  if(mouseX > (size_y+((size_x-size_y)/2)-(size_y/6)/2-(size_y/6)+x) && mouseX <(size_y+((size_x-size_y)/2)-(size_y/6)/2-(size_y/6)+x+size_y/6)){  //左ボタンの操作
    if(mouseY > ((size_y/2)+(size_y/6)+y) && mouseY < ((size_y/2)+(size_y/6)+y+size_y/6)){
      if(cnt < max_cnt_button){
       log_button[cnt] = 4;
        cnt++;
      }
    }
  }
  
  if(mouseX > (size_y+((size_x-size_y)/2)-(size_y/6)/2+x) && mouseX < (size_y+((size_x-size_y)/2)-(size_y/6)/2+x+size_y/6)){
    if(mouseY > ((size_y/2)+y) && mouseY < ((size_y/2)+y+size_y/6)){  //上ボタンの操作
      if(cnt < max_cnt_button){
        log_button[cnt] = 1;
        cnt++;
      }
    }else if(mouseY > ((size_y/2)+y+(size_y/6)*2) && mouseY < ((size_y/2)+y+(size_y/6)*2+size_y/6)){    //下ボタンの操作
      if(cnt < max_cnt_button){
        log_button[cnt] = 3;
        cnt++;
      }
    }else if(mouseY > ((size_y/2)+y+size_y/6) && mouseY < ((size_y/2)+y+(size_y/6)*2)){ //決定ボタンの操作
      if(cnt == max_cnt_button){
        flag = 1;
      }
    }
  }
  
  if(mouseX > (size_y+((size_x-size_y)/2)-(size_y/6)/2+(size_y/6)+x) && mouseX <(size_y+((size_x-size_y)/2)-(size_y/6)/2+(size_y/6)+x+size_y/6)){  //右ボタンの操作
    if(mouseY >((size_y/2)+(size_y/6)+y) && mouseY <((size_y/2)+(size_y/6)+y+size_y/6)){
      if(cnt < max_cnt_button){
        log_button[cnt] = 2;
        cnt++;
      }
    }
  }
  
  
  
  
}
