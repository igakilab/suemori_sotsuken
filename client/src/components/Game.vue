<template>
  <div id="game">
    <Select
      :player1="true"
      :turn="player1Turn"
      :select="player1select"
      :bomb="player1bomb"
      style="float: left;"
    />
    <Board :board="board" ref="ref_board" />
    <div style="float: left;">
      <Select
        :player1="false"
        :turn="!player1Turn"
        :select="player2select"
        :bomb="player2bomb"
        style="float: left;"
      />
      <Controller
        @click="move"
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
import { Component, Vue, Prop } from "vue-property-decorator";
import Select from "@/components/Select.vue";
import Board from "@/components/Board.vue";
import Controller from "@/components/Controller.vue";

const SELECT_SIZE: number = 5;
export const BOARD = {
  NONE: 0,
  PLAYER1: 100,
  PLAYER2: 101,
  WALL: 1,
  BOMB: 2,
  BOMB_ON_PLAYER1: 1001,
  BOMB_ON_PLAYER2: 1002,
  EXPLOSION: 9999,
  BLAST: 9998
};
export const MOVE = {
  UP: Symbol("UP"),
  LEFT: Symbol("LEFT"),
  RIGHT: Symbol("RIGHT"),
  DOWN: Symbol("DOWN"),
  BOMB: Symbol("BOMB"),
  REDO: Symbol("REDO"),
  END: Symbol("END")
};

@Component({
  components: {
    Select,
    Board,
    Controller
  }
})
export default class Game extends Vue {
  private player1Turn: boolean = true;
  private board: number[][] = board;
  private disabledUp: boolean = false;
  private disabledLeft: boolean = false;
  private disabledRight: boolean = false;
  private disabledDown: boolean = false;
  private disabledBomb: boolean = false;
  private disabledRedo: boolean = false;
  private disabledEnd: boolean = false;
  private player1select: Symbol[] = new Array(SELECT_SIZE).fill(null);
  private player2select: Symbol[] = new Array(SELECT_SIZE).fill(null);
  private player1bomb: number = 5;
  private player2bomb: number = 5;
  private log: { player: number; select: Symbol[] }[] = [];

  public created() {
    this.disabledLeft = true;
    this.setDisabledMove();
    this.board[0][0] = BOARD.PLAYER1;
    this.board[this.board.length - 1][
      this.board[this.board.length - 1].length - 1
    ] = BOARD.PLAYER2;
    firebase
      .database()
      .ref("ballx")
      .child("ballx1")
      .set(Math.random() * 100000);
    firebase
      .database()
      .ref("ballx")
      .child("ballx1")
      .on("value", (snapshot: any) => {
        const msg = snapshot.val();
        console.log(msg);
      });
  }

  private getPlayerIndex() {
    let index: { x: number; y: number } = { x: -1, y: -1 };
    const playerCell: number[] = this.player1Turn
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
    const unMovingList = [
      BOARD.WALL,
      BOARD.PLAYER1,
      BOARD.PLAYER2,
      BOARD.BOMB_ON_PLAYER1,
      BOARD.BOMB_ON_PLAYER2,
      BOARD.BOMB
    ];
    const { x: x, y: y }: { x: number; y: number } = this.getPlayerIndex();
    if (x < 0 || y < 0) return;
    this.disabledUp = y <= 0 || unMovingList.includes(this.board[y - 1][x]);
    this.disabledLeft = x <= 0 || unMovingList.includes(this.board[y][x - 1]);
    this.disabledRight =
      x >= this.board[0].length - 1 ||
      unMovingList.includes(this.board[y][x + 1]);
    this.disabledDown =
      y >= this.board.length - 1 || unMovingList.includes(this.board[y + 1][x]);
    this.disabledBomb =
      (this.player1Turn ? this.player1bomb : this.player2bomb) <= 0 ||
      [BOARD.BOMB_ON_PLAYER1, BOARD.BOMB_ON_PLAYER2].includes(this.board[y][x]);
    this.disabledRedo =
      (this.player1Turn ? this.player1select : this.player2select).filter(
        v => v
      ).length === 0;
    this.disabledEnd =
      (this.player1Turn ? this.player1select : this.player2select).filter(
        v => v
      ).length < SELECT_SIZE;
    if (!this.disabledEnd) {
      this.disabledUp = this.disabledLeft = this.disabledRight = this.disabledDown = this.disabledBomb = true;
    }
  }

  private move(action: symbol) {
    const { x: x, y: y }: { x: number; y: number } = this.getPlayerIndex();

    if (
      [MOVE.UP, MOVE.LEFT, MOVE.RIGHT, MOVE.DOWN, MOVE.BOMB].includes(action)
    ) {
      if (this.player1Turn) {
        if (this.player1select.filter(v => v).length < SELECT_SIZE) {
          this.$set(
            this.player1select,
            this.player1select.filter(v => v).length,
            action
          );
          if (action === MOVE.BOMB) {
            this.$set(this.board[y], x, BOARD.BOMB_ON_PLAYER1);
            this.player1bomb--;
          } else {
            if (this.board[y][x] === BOARD.BOMB_ON_PLAYER1) {
              this.$set(this.board[y], x, BOARD.BOMB);
            } else {
              this.$set(this.board[y], x, BOARD.NONE);
            }
            switch (action) {
              case MOVE.UP:
                this.$set(this.board[y - 1], x, BOARD.PLAYER1);
                break;
              case MOVE.LEFT:
                this.$set(this.board[y], x - 1, BOARD.PLAYER1);
                break;
              case MOVE.RIGHT:
                this.$set(this.board[y], x + 1, BOARD.PLAYER1);
                break;
              case MOVE.DOWN:
                this.$set(this.board[y + 1], x, BOARD.PLAYER1);
                break;
              default:
                break;
            }
          }
        }
      } else {
        if (this.player2select.filter(v => v).length < SELECT_SIZE) {
          this.$set(
            this.player2select,
            this.player2select.filter(v => v).length,
            action
          );
          if (action === MOVE.BOMB) {
            this.$set(this.board[y], x, BOARD.BOMB_ON_PLAYER2);
            this.player2bomb--;
          } else {
            if (this.board[y][x] === BOARD.BOMB_ON_PLAYER2) {
              this.$set(this.board[y], x, BOARD.BOMB);
            } else {
              this.$set(this.board[y], x, BOARD.NONE);
            }
            switch (action) {
              case MOVE.UP:
                this.$set(this.board[y - 1], x, BOARD.PLAYER2);
                break;
              case MOVE.LEFT:
                this.$set(this.board[y], x - 1, BOARD.PLAYER2);
                break;
              case MOVE.RIGHT:
                this.$set(this.board[y], x + 1, BOARD.PLAYER2);
                break;
              case MOVE.DOWN:
                this.$set(this.board[y + 1], x, BOARD.PLAYER2);
                break;
              default:
                break;
            }
          }
        }
      }
    }
    if (action === MOVE.REDO) {
      if (this.player1Turn) {
        if (this.player1select.filter(v => v).length > 0) {
          const preMove = this.player1select[
            this.player1select.filter(v => v).length - 1
          ];
          this.$set(
            this.player1select,
            this.player1select.filter(v => v).length - 1,
            null
          );
          if (preMove === MOVE.BOMB) {
            this.$set(this.board[y], x, BOARD.PLAYER1);
            this.player1bomb++;
          } else {
            this.$set(this.board[y], x, BOARD.NONE);
            switch (preMove) {
              case MOVE.UP:
                if (this.board[y + 1][x] === BOARD.BOMB) {
                  this.$set(this.board[y + 1], x, BOARD.BOMB_ON_PLAYER1);
                } else {
                  this.$set(this.board[y + 1], x, BOARD.PLAYER1);
                }
                break;
              case MOVE.LEFT:
                if (this.board[y][x + 1] === BOARD.BOMB) {
                  this.$set(this.board[y], x + 1, BOARD.BOMB_ON_PLAYER1);
                } else {
                  this.$set(this.board[y], x + 1, BOARD.PLAYER1);
                }
                break;
              case MOVE.RIGHT:
                if (this.board[y][x - 1] === BOARD.BOMB) {
                  this.$set(this.board[y], x - 1, BOARD.BOMB_ON_PLAYER1);
                } else {
                  this.$set(this.board[y], x - 1, BOARD.PLAYER1);
                }
                break;
              case MOVE.DOWN:
                if (this.board[y - 1][x] === BOARD.BOMB) {
                  this.$set(this.board[y - 1], x, BOARD.BOMB_ON_PLAYER1);
                } else {
                  this.$set(this.board[y - 1], x, BOARD.PLAYER1);
                }
                break;
              default:
                break;
            }
          }
        }
      } else {
        if (this.player2select.filter(v => v).length > 0) {
          const preMove = this.player2select[
            this.player2select.filter(v => v).length - 1
          ];
          this.$set(
            this.player2select,
            this.player2select.filter(v => v).length - 1,
            null
          );
          if (preMove === MOVE.BOMB) {
            this.$set(this.board[y], x, BOARD.PLAYER2);
            this.player2bomb++;
          } else {
            this.$set(this.board[y], x, BOARD.NONE);
            switch (preMove) {
              case MOVE.UP:
                if (this.board[y + 1][x] === BOARD.BOMB) {
                  this.$set(this.board[y + 1], x, BOARD.BOMB_ON_PLAYER2);
                } else {
                  this.$set(this.board[y + 1], x, BOARD.PLAYER2);
                }
                break;
              case MOVE.LEFT:
                if (this.board[y][x + 1] === BOARD.BOMB) {
                  this.$set(this.board[y], x + 1, BOARD.BOMB_ON_PLAYER2);
                } else {
                  this.$set(this.board[y], x + 1, BOARD.PLAYER2);
                }
                break;
              case MOVE.RIGHT:
                if (this.board[y][x - 1] === BOARD.BOMB) {
                  this.$set(this.board[y], x - 1, BOARD.BOMB_ON_PLAYER2);
                } else {
                  this.$set(this.board[y], x - 1, BOARD.PLAYER2);
                }
                break;
              case MOVE.DOWN:
                if (this.board[y - 1][x] === BOARD.BOMB) {
                  this.$set(this.board[y - 1], x, BOARD.BOMB_ON_PLAYER2);
                } else {
                  this.$set(this.board[y - 1], x, BOARD.PLAYER2);
                }
                break;
              default:
                break;
            }
          }
        }
      }
    }
    if (action === MOVE.END) {
      // tableDatabase.set({
      //   field: [this.player1bomb, this.player2bomb]
      // });
      if (this.log.length % 2 === 1) {
        if (!this.judge()) {
          console.log("GAME END");
          // return;
        }
      }
      if (this.player1Turn) {
        this.log.push({ player: 1, select: this.player1select });
        this.player2select = new Array(5).fill(null);
      } else {
        this.log.push({ player: 2, select: this.player2select });
        this.player1select = new Array(5).fill(null);
      }
      this.player1Turn = !this.player1Turn;
    }
    this.setDisabledMove();
  }

  get refs(): any {
    return this.$refs;
  }

  private judge() {
    this.refs.ref_board.explosion();
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
