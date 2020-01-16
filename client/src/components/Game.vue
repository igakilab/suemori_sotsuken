<template>
  <div id="game">
    <b-modal id="resultModal" @ok="redoRoom" ok-only
      ><div v-if="judge === JUDGE.DRAW">DRAW!!</div>
      <div
        v-else-if="
          (judge === JUDGE.P1_WIN && isPlayer1) ||
            (judge === JUDGE.P2_WIN && !isPlayer1)
        "
      >
        You are WIN!!
      </div>
      <div
        v-else-if="
          (judge === JUDGE.P2_WIN && isPlayer1) ||
            (judge === JUDGE.P1_WIN && !isPlayer1)
        "
      >
        You are Lose...
      </div></b-modal
    >
    <!-- <b-modal id="waitTurn" hide-header hide-footer no-close-on-backdrop>
      <template v-slot:modal-title>
        Using <code>$bvModal</code> Methods
      </template>
      <div class="d-block text-center">
        <h3>相手プレイヤーが行動中です</h3>
        <b-spinner label="Spinning" style="margin-left: 15px;"></b-spinner>
      </div>
    </b-modal> -->
    <b-alert show variant="primary" v-if="!playing"
      >プレイヤーを待機しています…<b-spinner
        style="margin-left: 10px;"
        variant="primary"
        label="Spinning"
      ></b-spinner
    ></b-alert>
    <b-alert v-else show variant="success"
      >ゲームスタート！ 次の動作まで残り{{
        10 - (elapsedTime % 11)
      }}秒<b-spinner
        variant="success"
        label="Spinning"
        style="margin-left: 15px;"
      ></b-spinner
    ></b-alert>
    <div id="game1">
      <Command
        :player1="true"
        :turn="isPlayer1"
        :command="player1command"
        :preCommand="prePlayer1command"
        :bomb="player1bomb"
        :unknownMode="elapsedTime > 10 && !player1turn"
        style="float: left;"
      />
      <div style="float: left;">
        <Board :board="board" ref="ref_board" style="margin-bottom: 10px;" />
        <Logs :logs="logs" style="clear:both; margin-right: 20px;" />
        <p style="width: 350px; padding-top: 10px; float: left;">
          ※コマンドを全て埋めない場合、ターン終了時自動的に移動コマンドが挿入されます。
        </p>
      </div>
      <div style="float: left;">
        <Command
          :player1="false"
          :turn="!isPlayer1"
          :command="player2command"
          :preCommand="prePlayer2command"
          :bomb="player2bomb"
          :unknownMode="elapsedTime > 10 && player1turn"
          style="float: left;"
        />
        <Controller
          @click="setCommand"
          :disabledUp="disabledUp"
          :disabledLeft="disabledLeft"
          :disabledRight="disabledRight"
          :disabledDown="disabledDown"
          :disabledBomb="disabledBomb"
          :disabledRedo="disabledRedo"
          :disabledEnd="disabledEnd"
          style="clear: both; margin-top: 540px; margin-left: 50px;"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import board from "@/game/board.ts";
import firebase from "@/firebase/rdb.ts";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Command from "@/components/Command.vue";
import Board from "@/components/Board.vue";
import Controller from "@/components/Controller.vue";
import UserModule from "@/store/user.ts";
import undefined from "firebase/empty-import";
import Logs from "@/components/Logs.vue";

export const COMMAND_SIZE: number = 5;
const sleep = (ms: number) => new Promise(f => setTimeout(f, ms));
export enum BOARD {
  NONE,
  WALL,
  PLAYER1,
  PLAYER2,
  BOMB,
  BOMB_ON_PLAYER1,
  BOMB_ON_PLAYER2,
  EXPLOSION,
  BLAST
}
export enum MOVE {
  NULL,
  UP,
  LEFT,
  RIGHT,
  DOWN,
  BOMB,
  REDO,
  END,
  RANDOM_LEFT,
  RANDOM_RIGHT,
  RANDOM_UP,
  RANDOM_DOWN
}

enum JUDGE {
  P1_WIN,
  P2_WIN,
  DRAW,
  CONTINUE
}

export function fromCommand(commands: string[]): MOVE[] {
  return commands.map(command => {
    switch (command) {
      case "UP":
        return MOVE.UP;
      case "LEFT":
        return MOVE.LEFT;
      case "RIGHT":
        return MOVE.RIGHT;
      case "DOWN":
        return MOVE.DOWN;
      case "RANDOM_UP":
        return MOVE.RANDOM_UP;
      case "RANDOM_LEFT":
        return MOVE.RANDOM_LEFT;
      case "RANDOM_RIGHT":
        return MOVE.RANDOM_RIGHT;
      case "RANDOM_DOWN":
        return MOVE.RANDOM_DOWN;
      case "BOMB":
        return MOVE.BOMB;
      default:
        return MOVE.NULL;
    }
  });
}

export function toCommandString(commands: MOVE[]) {
  return commands.map(command => {
    switch (command) {
      case MOVE.UP:
        return "UP";
      case MOVE.LEFT:
        return "LEFT";
      case MOVE.RIGHT:
        return "RIGHT";
      case MOVE.DOWN:
        return "DOWN";
      case MOVE.RANDOM_UP:
        return "RANDOM_UP";
      case MOVE.RANDOM_LEFT:
        return "RANDOM_LEFT";
      case MOVE.RANDOM_RIGHT:
        return "RANDOM_RIGHT";
      case MOVE.RANDOM_DOWN:
        return "RANDOM_DOWN";
      case MOVE.BOMB:
        return "BOMB";
      default:
        return "NULL";
    }
  });
}

export function fromBoard(board: number[][]) {
  return board.map(row => row.map(cell => ({ rest: 0, content: cell })));
}

@Component({
  components: {
    Command,
    Board,
    Controller,
    Logs
  }
})
export default class Game extends Vue {
  private board: { rest: number; content: BOARD }[][] = fromBoard(board);
  private disabledUp: boolean = true;
  private disabledLeft: boolean = true;
  private disabledRight: boolean = true;
  private disabledDown: boolean = true;
  private disabledBomb: boolean = true;
  private disabledRedo: boolean = true;
  private disabledEnd: boolean = true;
  private player1command: MOVE[] = new Array(COMMAND_SIZE).fill(MOVE.NULL);
  private prePlayer1command: MOVE[] = new Array(COMMAND_SIZE).fill(MOVE.NULL);
  private player2command: MOVE[] = new Array(COMMAND_SIZE).fill(MOVE.NULL);
  private prePlayer2command: MOVE[] = new Array(COMMAND_SIZE).fill(MOVE.NULL);
  private player1bomb: number = 5;
  private player2bomb: number = 5;
  private logs: string[] = [];
  private room: firebase.database.Reference = firebase.database().ref();
  private isPlayer1: boolean = true;
  private playing: boolean = false;
  private elapsedTime: number = 0;
  private judge: JUDGE = JUDGE.CONTINUE;
  private player1turn: boolean = true;

  get JUDGE() {
    return JUDGE;
  }

  private async *makeRangeIterator(start = 0, end = Infinity, step = 1) {
    for (let i = start; i < end; i += step) {
      this.elapsedTime++;
      await sleep(1000);
      yield i;
    }
  }

  private async redoRoom() {
    if (this.isPlayer1) {
      this.room.child("end").set(true);
    }

    const result = (() => {
      if (this.isPlayer1) {
        if (this.judge === JUDGE.P1_WIN) {
          return "WIN";
        }
        if (this.judge === JUDGE.P2_WIN) {
          return "LOSE";
        }
      } else {
        if (this.judge === JUDGE.P1_WIN) {
          return "LOSE";
        }
        if (this.judge === JUDGE.P2_WIN) {
          return "WIN";
        }
      }
      if (this.judge === JUDGE.DRAW) {
        return "DRAW";
      }
      return "EXCEPTION";
    })();

    const user = firebase.database().ref(UserModule.uid);
    const value: number = Number(
      (await user.child(result).once("value")).val()
    );
    user.child(result).set(value + 1);
    this.$router.push("/room");
  }

  @Watch("player1command")
  public player1commandChanged() {
    if (this.isPlayer1) {
      const player = this.room.child("player1");
      player.child("bomb").set(this.player1bomb);
      player
        .child("commands")
        .child("now")
        .set(toCommandString(this.player1command));
    }
  }

  @Watch("player2command")
  public player2commandChanged() {
    if (!this.isPlayer1) {
      const player = this.room.child("player2");
      player.child("bomb").set(this.player2bomb);
      player
        .child("commands")
        .child("now")
        .set(toCommandString(this.player2command));
    }
  }

  @Watch("elapsedTime")
  public elapsedTimeChanged() {
    if (this.isPlayer1) {
      this.room.child("elapsedTime").set(this.elapsedTime);
    }
  }

  private async start() {
    if (!this.room) {
      alert("ルーム情報を失いました。ルーム選択画面に戻ります。");
      this.$router.push("/room");
      return;
    }

    this.setDisabledMove();

    const opponent = `player${!this.isPlayer1 ? 1 : 2}`;

    this.room
      .child(opponent)
      .child("bomb")
      .on("value", data => {
        if (!this.isPlayer1) {
          this.player1bomb = data.val();
        } else {
          this.player2bomb = data.val();
        }
      });

    this.room
      .child(opponent)
      .child("commands")
      .child("now")
      .on("value", data => {
        if (!this.isPlayer1) {
          this.player1command = fromCommand(data.val());
        } else {
          this.player2command = fromCommand(data.val());
        }
      });

    // プレイヤー1を親として動かし、プレイヤー2は操作だけを送信
    if (this.isPlayer1) {
      for await (const value of this.makeRangeIterator()) {
        if (this.elapsedTime % 11 === 0 && this.elapsedTime > 0) {
          // 爆弾カウントダウン
          const bombPoint = [];
          this.board.forEach((row, i) =>
            row.forEach((cell, j) => {
              switch (cell.content) {
                case BOARD.BOMB:
                  this.$set(
                    this.board[i][j],
                    "rest",
                    this.board[i][j].rest - 1
                  );
                  bombPoint.push({ x: j, y: i });
              }
            })
          );
          // 移動処理
          if (this.elapsedTime > 10) {
            if (this.elapsedTime > 20) {
              this.move(true);
              this.move(false);
            }
            this.prePlayer1command = this.player1command.map(command => {
              if (command === MOVE.NULL) {
                return this.randomCommand();
              }
              return command;
            });
            this.player1command = Array(COMMAND_SIZE).fill(MOVE.NULL);
            this.prePlayer2command = this.player2command.map(command => {
              if (command === MOVE.NULL) {
                return this.randomCommand();
              }
              return command;
            });
            this.player2command = Array(COMMAND_SIZE).fill(MOVE.NULL);
            const c1 = toCommandString(this.prePlayer1command);
            const c2 = toCommandString(this.prePlayer2command);
            this.room
              .child("player1")
              .child("commands")
              .child("previous")
              .set(c1);
            this.room
              .child("player2")
              .child("commands")
              .child("previous")
              .set(c2);
            this.room
              .child("player2")
              .child("commands")
              .child("now")
              .set(toCommandString(this.player1command));
            this.room
              .child("player2")
              .child("commands")
              .child("now")
              .set(toCommandString(this.player2command));
            this.logs.unshift(`プレイヤー2:${c2.join("/")}`);
            this.logs.unshift(`プレイヤー1:${c1.join("/")}`);
            this.logs.unshift(
              `ターン${Math.ceil(this.elapsedTime / 11)} コマンド設定`
            );
            this.room.child("logs").set(this.logs);
          }
          // 爆発処理
          const explosionPoints = this.explosion();
          // 盤面データ送信
          this.room.child("board").set(this.board);
          // 盤面クリア
          sleep(1000).then(() => this.clearBoard(explosionPoints));
          if (this.elapsedTime % 11 === 0 && this.elapsedTime > 0) {
            // 動かせなくする
            this.setDisabledMove();
          }
          // ゲーム終了判定(後で変える)
          if (this.gameJudge()) {
            break;
          }
        }
      }
    } else {
      this.room.child("board").on("value", data => {
        this.board = data.val();
        // ゲーム終了判定(後で変える)
        this.gameJudge();
        sleep(1000).then(() => this.clearBoard());
      });

      this.room
        .child("player1")
        .child("commands")
        .child("previous")
        .on("value", data => {
          this.prePlayer1command = fromCommand(data.val());
        });

      this.room
        .child("player2")
        .child("commands")
        .child("previous")
        .on("value", data => {
          this.prePlayer2command = fromCommand(data.val());
        });

      this.room
        .child("player2")
        .child("commands")
        .child("now")
        .on("value", data => {
          this.player2command = fromCommand(data.val());
          this.setDisabledMove();
        });

      this.room.child("logs").on("value", data => {
        this.logs = data.val();
      });

      this.room.child("elapsedTime").on("value", data => {
        this.elapsedTime = Number(data.val());
        if (this.elapsedTime % 11 === 0 && this.elapsedTime > 0) {
          // 動かせなくする
          this.setDisabledMove();
        }
      });
    }
  }

  private gameJudge() {
    const player1 = this.board.some(row =>
      row.some(
        cell =>
          cell.content === BOARD.PLAYER1 ||
          cell.content === BOARD.BOMB_ON_PLAYER1
      )
    );
    const player2 = this.board.some(row =>
      row.some(
        cell =>
          cell.content === BOARD.PLAYER2 ||
          cell.content === BOARD.BOMB_ON_PLAYER2
      )
    );

    if (!player1 && !player2) {
      this.judge = JUDGE.DRAW;
      this.$bvModal.show("resultModal");
      return true;
    }
    if (!player2) {
      this.judge = JUDGE.P1_WIN;
      this.$bvModal.show("resultModal");
      return true;
    }
    if (!player1) {
      this.judge = JUDGE.P2_WIN;
      this.$bvModal.show("resultModal");
      return true;
    }
    return false;
  }

  private clearBoard(explosionPoints?: { x: number; y: number }[]) {
    if (explosionPoints) {
      explosionPoints.forEach(point => {
        this.$set(this.board[point.y], point.x, {
          content: BOARD.NONE,
          rest: 0
        });
      });
    } else {
      this.board.forEach((row, i) =>
        row.forEach((cell, j) => {
          if ([BOARD.BLAST, BOARD.EXPLOSION].includes(cell.content)) {
            this.$set(this.board[i], j, { content: BOARD.NONE, rest: 0 });
          }
        })
      );
    }
  }

  private explosion(causeExplosion = false) {
    const explosionPoints: { x: number; y: number }[] = [];
    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.content === BOARD.BOMB && cell.rest === 0) {
          const unbrastList: BOARD[] = [BOARD.WALL];
          if (
            j > 0 &&
            i > 0 &&
            !unbrastList.includes(this.board[i - 1][j - 1].content)
          ) {
            this.$set(this.board[i - 1], j - 1, {
              content: BOARD.BLAST,
              rest: 0
            });
            explosionPoints.push({ x: j - 1, y: i - 1 });
          }
          if (j > 0 && !unbrastList.includes(this.board[i][j - 1].content)) {
            this.$set(this.board[i], j - 1, { content: BOARD.BLAST, rest: 0 });
            explosionPoints.push({ x: j - 1, y: i });
          }
          if (
            j > 0 &&
            i < this.board[0].length - 1 &&
            !unbrastList.includes(this.board[i + 1][j - 1].content)
          ) {
            this.$set(this.board[i + 1], j - 1, {
              content: BOARD.BLAST,
              rest: 0
            });
            explosionPoints.push({ x: j - 1, y: i + 1 });
          }
          if (i > 0 && !unbrastList.includes(this.board[i - 1][j].content)) {
            this.$set(this.board[i - 1], j, { content: BOARD.BLAST, rest: 0 });
            explosionPoints.push({ x: j, y: i - 1 });
          }
          if (
            i < this.board[0].length - 1 &&
            !unbrastList.includes(this.board[i + 1][j].content)
          ) {
            this.$set(this.board[i + 1], j, { content: BOARD.BLAST, rest: 0 });
            explosionPoints.push({ x: j, y: i + 1 });
          }
          if (
            j < this.board.length - 1 &&
            i > 0 &&
            !unbrastList.includes(this.board[i - 1][j + 1].content)
          ) {
            this.$set(this.board[i - 1], j + 1, {
              content: BOARD.BLAST,
              rest: 0
            });
            explosionPoints.push({ x: j + 1, y: i - 1 });
          }
          if (
            j < this.board.length - 1 &&
            !unbrastList.includes(this.board[i][j + 1].content)
          ) {
            this.$set(this.board[i], j + 1, { content: BOARD.BLAST, rest: 0 });
            explosionPoints.push({ x: j + 1, y: i });
          }
          if (
            j < this.board.length - 1 &&
            i < this.board[0].length - 1 &&
            !unbrastList.includes(this.board[i + 1][j + 1].content)
          ) {
            this.$set(this.board[i + 1], j + 1, {
              content: BOARD.BLAST,
              rest: 0
            });
            explosionPoints.push({ x: j + 1, y: i + 1 });
          }
          this.$set(this.board[i], j, { content: BOARD.EXPLOSION, rest: 0 });
          explosionPoints.push({ x: j, y: i });
        }
      });
    });

    return explosionPoints;
  }

  public async created() {
    if (UserModule.uid === "") {
      alert("ユーザー情報を失いました。ルーム選択画面に戻ります。");
      this.$router.push("/room");
    }

    const roomID: number = (
      await firebase
        .database()
        .ref("user")
        .child(UserModule.uid)
        .child("roomID")
        .once("value")
    ).val();

    this.room = firebase
      .database()
      .ref("room")
      .child(String(roomID));

    const playing: boolean = (
      await this.room.child("playing").once("value")
    ).val();
    const end: boolean = (await this.room.child("end").once("value")).val();

    if (end) {
      alert("既にゲームが終了しています。ルーム選択画面に戻ります。");
      this.$router.push("/room");
    }

    if (playing) {
      firebase
        .database()
        .ref("user")
        .child(UserModule.uid)
        .child("roomID")
        .set(0);
      alert("既にゲームが行われています。ルーム選択画面に戻ります。");
      this.$router.push("/room");
    }

    const player1uid: string = (
      await this.room
        .child("player1")
        .child("uid")
        .once("value")
    ).val();

    if (UserModule.uid === player1uid) {
      this.isPlayer1 = true;
    } else {
      const player2uid: string = (
        await this.room
          .child("player2")
          .child("uid")
          .once("value")
      ).val();

      if (UserModule.uid === player2uid) {
        this.isPlayer1 = false;
        this.room.child("playing").set(true);
      } else {
        // 例外
        firebase
          .database()
          .ref("user")
          .child(UserModule.uid)
          .child("roomID")
          .set(0);
        alert("エラーが発生しました。ルーム選択画面に戻ります。");
        this.$router.push("/room");
      }
    }

    // 初期設定
    this.$set(this.board[0], 0, { content: BOARD.PLAYER1, rest: 0 });
    this.$set(
      this.board[this.board.length - 1],
      this.board[this.board.length - 1].length - 1,
      { content: BOARD.PLAYER2, rest: 0 }
    );
    this.room.child("board").set(this.board);

    // プレイヤー2が席に付いた
    this.room.child("playing").on("value", data => {
      if (data.val()) {
        this.playing = true;
        this.start();
      }
    });
  }

  private getPlayerIndex(isPlayer1: boolean = true) {
    let index: { x: number; y: number } = { x: -1, y: -1 };
    const playerCell: BOARD[] = isPlayer1
      ? [BOARD.PLAYER1, BOARD.BOMB_ON_PLAYER1]
      : [BOARD.PLAYER2, BOARD.BOMB_ON_PLAYER2];
    this.board.some((row, i) => {
      return row.some((cell, j) => {
        if (playerCell.includes(cell.content)) {
          index = { x: j, y: i };
          return true;
        }
        return false;
      });
    });
    return index;
  }

  private setDisabledMove() {
    const playerCommand = this.isPlayer1
      ? this.player1command
      : this.player2command;
    const playerBomb = this.isPlayer1 ? this.player1bomb : this.player2bomb;
    this.disabledUp = this.disabledLeft = this.disabledRight = this.disabledDown =
      playerCommand.filter(c => c !== MOVE.NULL).length === COMMAND_SIZE;
    this.disabledBomb =
      playerBomb <= 0 ||
      playerCommand.filter(c => c !== MOVE.NULL).length === COMMAND_SIZE;
    this.disabledRedo = playerCommand.filter(c => c !== MOVE.NULL).length === 0;
  }

  private setCommand(action: MOVE) {
    if (
      [MOVE.UP, MOVE.LEFT, MOVE.RIGHT, MOVE.DOWN, MOVE.BOMB].includes(action)
    ) {
      if (this.isPlayer1) {
        if (
          this.player1command.filter(c => c !== MOVE.NULL).length < COMMAND_SIZE
        ) {
          this.$set(
            this.player1command,
            this.player1command.filter(c => c !== MOVE.NULL).length,
            action
          );
          if (action === MOVE.BOMB) {
            this.player1bomb--;
          }
        }
      } else {
        if (
          this.player2command.filter(c => c !== MOVE.NULL).length < COMMAND_SIZE
        ) {
          this.$set(
            this.player2command,
            this.player2command.filter(c => c !== MOVE.NULL).length,
            action
          );
          if (action === MOVE.BOMB) {
            this.player2bomb--;
          }
        }
      }
    }
    if (action === MOVE.REDO) {
      if (this.isPlayer1) {
        if (this.player1command.filter(c => c !== MOVE.NULL).length > 0) {
          const preMove = this.player1command[
            this.player1command.filter(c => c !== MOVE.NULL).length - 1
          ];
          this.$set(
            this.player1command,
            this.player1command.filter(c => c !== MOVE.NULL).length - 1,
            MOVE.NULL
          );
          if (preMove === MOVE.BOMB) {
            this.player1bomb++;
          }
        }
      } else {
        if (this.player2command.filter(c => c !== MOVE.NULL).length > 0) {
          const preMove = this.player2command[
            this.player2command.filter(c => c !== MOVE.NULL).length - 1
          ];
          this.$set(
            this.player2command,
            this.player2command.filter(c => c !== MOVE.NULL).length - 1,
            MOVE.NULL
          );
          if (preMove === MOVE.BOMB) {
            this.player2bomb++;
          }
        }
      }
    }
    this.setDisabledMove();
  }

  private randomCommand() {
    const c = [
      MOVE.RANDOM_UP,
      MOVE.RANDOM_LEFT,
      MOVE.RANDOM_RIGHT,
      MOVE.RANDOM_DOWN
    ];
    return c[Math.floor(Math.random() * c.length)];
  }

  private async move(isPlayer1: boolean) {
    const unMovingList = [
      BOARD.PLAYER1,
      BOARD.PLAYER2,
      BOARD.WALL,
      BOARD.BOMB,
      BOARD.BOMB_ON_PLAYER1,
      BOARD.BOMB_ON_PLAYER2
    ];
    const commands = isPlayer1
      ? this.prePlayer1command
      : this.prePlayer2command;
    const boardPlayer = isPlayer1 ? BOARD.PLAYER1 : BOARD.PLAYER2;
    const boardBombOnPlayer = isPlayer1
      ? BOARD.BOMB_ON_PLAYER1
      : BOARD.BOMB_ON_PLAYER2;

    commands.forEach(command => {
      const { x: x, y: y }: { x: number; y: number } = this.getPlayerIndex(
        isPlayer1
      );
      // const action = command ? command : this.randomCommand();
      const action = command;
      if (
        [MOVE.UP, MOVE.LEFT, MOVE.RIGHT, MOVE.DOWN, MOVE.BOMB].includes(action)
      ) {
        if (action === MOVE.BOMB) {
          this.$set(this.board[y], x, { content: boardBombOnPlayer, rest: 0 });
        } else {
          let moving = false;
          switch (action) {
            case MOVE.UP:
              if (
                y > 0 &&
                !unMovingList.includes(this.board[y - 1][x].content)
              ) {
                this.$set(this.board[y - 1], x, {
                  content: boardPlayer,
                  rest: 0
                });
                moving = true;
              }
              break;
            case MOVE.LEFT:
              if (
                x > 0 &&
                !unMovingList.includes(this.board[y][x - 1].content)
              ) {
                this.$set(this.board[y], x - 1, {
                  content: boardPlayer,
                  rest: 0
                });
                moving = true;
              }
              break;
            case MOVE.RIGHT:
              if (
                x < this.board[y].length - 1 &&
                !unMovingList.includes(this.board[y][x + 1].content)
              ) {
                this.$set(this.board[y], x + 1, {
                  content: boardPlayer,
                  rest: 0
                });
                moving = true;
              }
              break;
            case MOVE.DOWN:
              if (
                y < this.board.length - 1 &&
                !unMovingList.includes(this.board[y + 1][x].content)
              ) {
                this.$set(this.board[y + 1], x, {
                  content: boardPlayer,
                  rest: 0
                });
                moving = true;
              }
              break;
            default:
              break;
          }
          if (moving) {
            if (this.board[y][x].content === boardBombOnPlayer) {
              this.$set(this.board[y], x, {
                content: BOARD.BOMB,
                rest: 3
              });
            } else {
              this.$set(this.board[y], x, {
                content: BOARD.NONE,
                rest: 0
              });
            }
          }
        }
      }
    });
  }

  get refs(): any {
    return this.$refs;
  }
}
</script>

<style>
#game {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
#game1 {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  display: inline-block;
}
</style>
