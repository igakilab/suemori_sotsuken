<template>
  <div id="game">
    <b-alert show variant="primary" v-if="!playing"
      >プレイヤーを待機しています…<b-spinner
        style="margin-left: 10px;"
        variant="primary"
        label="Spinning"
      ></b-spinner
    ></b-alert>
    <b-alert v-else show variant="success"
      >ゲームスタート！ 次の動作まで残り{{ 5 - (second % 6) }}秒<b-spinner
        variant="success"
        label="Spinning"
        style="margin-left: 15px;"
      ></b-spinner
    ></b-alert>
    <Command
      :player1="true"
      :turn="isPlayer1"
      :command="player1command"
      :bomb="player1bomb"
      style="float: left;"
    />
    <Board :board="board" ref="ref_board" />
    <div style="float: left;">
      <Command
        :player1="false"
        :turn="!isPlayer1"
        :command="player2command"
        :bomb="player2bomb"
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
        style="clear: both; margin-top: 480px;"
      />
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

export const COMMAND_SIZE: number = 5;
const sleep = (ms: number) => new Promise(f => setTimeout(f, ms));
export enum BOARD {
  NONE,
  PLAYER1,
  PLAYER2,
  WALL,
  BOMB,
  BOMB_ON_PLAYER1,
  BOMB_ON_PLAYER2,
  EXPLOSION,
  BLAST
}
export enum MOVE {
  UP,
  LEFT,
  RIGHT,
  DOWN,
  BOMB,
  REDO,
  END,
  NULL
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
      case MOVE.BOMB:
        return "BOMB";
      default:
        return "NULL";
    }
  });
}

export function fromBoard(board: (number | string)[][]) {
  return board.map(row =>
    row.map(cell => {
      switch (cell) {
        case 0:
        case "　":
          return BOARD.NONE;
        case 1:
        case "■":
          return BOARD.WALL;
        case "１":
          return BOARD.PLAYER1;
        case "２":
          return BOARD.PLAYER2;
        case "◎":
          return BOARD.BOMB;
        case "①":
          return BOARD.BOMB_ON_PLAYER1;
        case "②":
          return BOARD.BOMB_ON_PLAYER2;
        case "Ｘ":
          return BOARD.EXPLOSION;
        case "＋":
          return BOARD.BLAST;
        default:
          return BOARD.NONE;
      }
    })
  );
}

export function toBoardString(board: BOARD[][]) {
  return board.map(row =>
    row.map(cell => {
      switch (cell) {
        case BOARD.NONE:
          return "　";
        case BOARD.WALL:
          return "■";
        case BOARD.PLAYER1:
          return "１";
        case BOARD.PLAYER2:
          return "２";
        case BOARD.BOMB:
          return "◎";
        case BOARD.BOMB_ON_PLAYER1:
          return "①";
        case BOARD.BOMB_ON_PLAYER2:
          return "②";
        case BOARD.EXPLOSION:
          return "Ｘ";
        case BOARD.BLAST:
          return "＋";
        default:
          return "　";
      }
    })
  );
}

@Component({
  components: {
    Command,
    Board,
    Controller
  }
})
export default class Game extends Vue {
  private board: BOARD[][] = fromBoard(board);
  private disabledUp: boolean = true;
  private disabledLeft: boolean = true;
  private disabledRight: boolean = true;
  private disabledDown: boolean = true;
  private disabledBomb: boolean = true;
  private disabledRedo: boolean = true;
  private disabledEnd: boolean = true;
  private player1command: MOVE[] = new Array(COMMAND_SIZE).fill(MOVE.NULL);
  private player2command: MOVE[] = new Array(COMMAND_SIZE).fill(MOVE.NULL);
  private player1bomb: number = 5;
  private player2bomb: number = 5;
  private log: MOVE[][] = [];
  private room: firebase.database.Reference = firebase.database().ref();
  private isPlayer1: boolean = true;
  private playing: boolean = false;
  private second: number = 0;

  private async *makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let n = 0;
    for (let i = start; i < end; i += step) {
      n += 1;
      await sleep(1000);
      yield i;
    }
  }

  @Watch("player1command")
  public player1commandChanged() {
    const player = this.room.child("player1");
    player.child("bomb").set(this.player1bomb);
    player.child("command").set(toCommandString(this.player1command));
  }

  @Watch("player2command")
  public player2commandChanged(v: any, o: any) {
    const player = this.room.child("player2");
    player.child("bomb").set(this.player2bomb);
    player.child("command").set(toCommandString(this.player2command));
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
      .child("command")
      .on("value", data => {
        if (!this.isPlayer1) {
          this.player1command = fromCommand(data.val());
        } else {
          this.player2command = fromCommand(data.val());
        }
      });

    if (!this.isPlayer1) {
      this.room.child("board").on("value", data => {
        this.board = fromBoard(data.val());
      });
      this.room
        .child("player2")
        .child("command")
        .on("value", data => {
          this.player2command = fromCommand(data.val());
        });
    }

    // プレイヤー1を親として動かし、プレイヤー2は操作だけを送信
    for await (const value of this.makeRangeIterator()) {
      this.second = value;
      if (this.second > 0 && this.second % 6 === 0 && this.isPlayer1) {
        // なんか処理
        this.move();
        this.room.child("board").set(toBoardString(this.board));
        this.room
          .child("player2")
          .child("command")
          .set(toCommandString(this.player2command));
      }
      // 一秒前?に動かせなくしないとコンフリクトが発生するので要検討
      this.setDisabledMove();
    }
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
    this.$set(this.board[0], 0, BOARD.PLAYER1);
    this.$set(
      this.board[this.board.length - 1],
      this.board[this.board.length - 1].length - 1,
      BOARD.PLAYER2
    );
    this.room.child("board").set(toBoardString(this.board));

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
    const playerCell: number[] = isPlayer1
      ? [BOARD.PLAYER1, BOARD.BOMB_ON_PLAYER1]
      : [BOARD.PLAYER2, BOARD.BOMB_ON_PLAYER2];
    this.board.some((row, i) => {
      return row.some((cell, j) => {
        if (playerCell.includes(cell)) {
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
    const c = [MOVE.UP, MOVE.LEFT, MOVE.RIGHT, MOVE.DOWN];
    return c[Math.floor(Math.random() * c.length)];
  }

  private move() {
    const unMovingList = [
      BOARD.PLAYER1,
      BOARD.PLAYER2,
      BOARD.WALL,
      BOARD.BOMB,
      BOARD.BOMB_ON_PLAYER1,
      BOARD.BOMB_ON_PLAYER2
    ];
    for (const isPlayer1 of [true, false]) {
      const { x: x, y: y }: { x: number; y: number } = this.getPlayerIndex(
        isPlayer1
      );
      const command = isPlayer1 ? this.player1command : this.player2command;
      const boardPlayer = isPlayer1 ? BOARD.PLAYER1 : BOARD.PLAYER2;
      const boardBombOnPlayer = isPlayer1
        ? BOARD.BOMB_ON_PLAYER1
        : BOARD.BOMB_ON_PLAYER2;

      const action = (() => {
        const c = command.shift() || MOVE.NULL;
        return c === MOVE.NULL ? this.randomCommand() : c;
      })();
      command.push(MOVE.NULL);
      if (
        [MOVE.UP, MOVE.LEFT, MOVE.RIGHT, MOVE.DOWN, MOVE.BOMB].includes(action)
      ) {
        if (action === MOVE.BOMB) {
          this.$set(this.board[y], x, boardBombOnPlayer);
        } else {
          let moving = false;
          switch (action) {
            case MOVE.UP:
              if (y > 0 && !unMovingList.includes(this.board[y - 1][x])) {
                this.$set(this.board[y - 1], x, boardPlayer);
                moving = true;
              }
              break;
            case MOVE.LEFT:
              if (x > 0 && !unMovingList.includes(this.board[y][x - 1])) {
                this.$set(this.board[y], x - 1, boardPlayer);
                moving = true;
              }
              break;
            case MOVE.RIGHT:
              if (
                x < this.board[y].length - 1 &&
                !unMovingList.includes(this.board[y][x + 1])
              ) {
                this.$set(this.board[y], x + 1, boardPlayer);
                moving = true;
              }
              break;
            case MOVE.DOWN:
              if (
                y < this.board.length - 1 &&
                !unMovingList.includes(this.board[y + 1][x])
              ) {
                this.$set(this.board[y + 1], x, boardPlayer);
                moving = true;
              }
              break;
            default:
              break;
          }
          if (moving) {
            if (this.board[y][x] === boardBombOnPlayer) {
              this.$set(this.board[y], x, BOARD.BOMB);
            } else {
              this.$set(this.board[y], x, BOARD.NONE);
            }
          }
        }
      }
    }
  }

  get refs(): any {
    return this.$refs;
  }

  private async judge() {
    await this.refs.ref_board.explosion();
    return false;
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
  margin-left: 20px;
}
</style>
