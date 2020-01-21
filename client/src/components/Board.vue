<template>
  <div style="float: left; margin-right: 20px;">
    <table style="border-collapse: collapse; border:1px solid #333;">
      <tr v-for="(row, index) in board" :key="`row${index}`">
        <td
          v-for="(cell, index) in row"
          :key="`cell$${index}`"
          style="border:1px dotted #333; width: 50px; height: 50px; text-align: center; vertical-align: middle;"
        >
          <div
            v-if="cell.content === BOARD.WALL"
            style="width: 100%; height: 100%; background: black;"
          ></div>
          <div v-if="cell.content === BOARD.BOMB" style="line-height: 0;">
            <font-awesome-icon icon="bomb" size="2x" />
            <span
              style="font-weight: bold; color: white; position: absolute; margin-left: -23px; margin-top: 20px;"
              >{{ cell.rest }}</span
            >
          </div>
          <div
            v-else-if="cell.content === BOARD.PLAYER1"
            style="line-height: 0;"
          >
            <font-awesome-icon icon="male" size="2x" style="color: blue;" />
          </div>
          <div
            v-else-if="cell.content === BOARD.BLOCK_PLAYER1"
            style="line-height: 0;"
          >
            <div class="spinner">
              <div class="double-bounce"></div>
              <font-awesome-icon
                icon="male"
                size="2x"
                style="color: blue; margin-top: 4px; margin-left:4px;"
              />
            </div>
          </div>
          <div
            v-else-if="cell.content === BOARD.BOMB_ON_PLAYER1"
            style="line-height: 0;"
          >
            <font-awesome-icon icon="male" size="2x" style="color: blue;" />
            <font-awesome-icon
              icon="bomb"
              size="2x"
              style="position: absolute; margin-left: -20px; z-index: -1;"
            />
          </div>
          <div
            v-else-if="cell.content === BOARD.BLOCK_BOMB_ON_PLAYER1"
            style="line-height: 0;"
          >
            <div class="spinner">
              <div class="double-bounce"></div>
              <font-awesome-icon
                icon="male"
                size="2x"
                style="color: blue; margin-top: 4px; margin-left:4px;"
              />
              <font-awesome-icon
                icon="bomb"
                size="2x"
                style="position: absolute; margin-left: -20px; z-index: -1;"
              />
            </div>
          </div>
          <div
            v-else-if="cell.content === BOARD.PLAYER2"
            style="line-height: 0;"
          >
            <font-awesome-icon icon="male" size="2x" style="color: red;" />
          </div>
          <div
            v-else-if="cell.content === BOARD.BLOCK_PLAYER2"
            style="line-height: 0;"
          >
            <div class="spinner">
              <div class="double-bounce"></div>
              <font-awesome-icon
                icon="male"
                size="2x"
                style="color: red; margin-top: 4px; margin-left:4px;"
              />
            </div>
          </div>
          <div
            v-else-if="cell.content === BOARD.BOMB_ON_PLAYER2"
            style="line-height: 0;"
          >
            <font-awesome-icon icon="male" size="2x" style="color: red;" />
            <font-awesome-icon
              icon="bomb"
              size="2x"
              style="position: absolute; margin-left: -20px; z-index: -1;"
            />
          </div>
          <div
            v-else-if="cell.content === BOARD.BLOCK_BOMB_ON_PLAYER2"
            style="line-height: 0;"
          >
            <div class="spinner">
              <div class="double-bounce"></div>
              <font-awesome-icon
                icon="male"
                size="2x"
                style="color: red; margin-top: 4px; margin-left:4px;"
              />
              <font-awesome-icon
                icon="bomb"
                size="2x"
                style="position: absolute; margin-left: -20px; z-index: -1;"
              />
            </div>
          </div>
          <div v-else-if="cell.content === BOARD.EXPLOSION">
            <svg
              class="likeButton"
              width="32px"
              height="32px"
              viewBox="0 0 500 500"
            >
              <circle class="explosion" r="150" cx="250" cy="250"></circle>
              <g class="particleLayer">
                <circle fill="#8CE8C3" cx="130" cy="126.5" r="12.5" />
                <circle fill="#8CE8C3" cx="411" cy="313.5" r="12.5" />
                <circle fill="#91D2FA" cx="279" cy="86.5" r="12.5" />
                <circle fill="#91D2FA" cx="155" cy="390.5" r="12.5" />
                <circle fill="#CC8EF5" cx="89" cy="292.5" r="10.5" />
                <circle fill="#9BDFBA" cx="414" cy="282.5" r="10.5" />
                <circle fill="#9BDFBA" cx="115" cy="149.5" r="10.5" />
                <circle fill="#9FC7FA" cx="250" cy="80.5" r="10.5" />
                <circle fill="#9FC7FA" cx="78" cy="261.5" r="10.5" />
                <circle fill="#96D8E9" cx="182" cy="402.5" r="10.5" />
                <circle fill="#CC8EF5" cx="401.5" cy="166" r="13" />
                <circle fill="#DB92D0" cx="379" cy="141.5" r="10.5" />
                <circle fill="#DB92D0" cx="327" cy="397.5" r="10.5" />
                <circle fill="#DD99B8" cx="296" cy="392.5" r="10.5" />
              </g>
            </svg>
          </div>
          <div
            v-else-if="cell.content === BOARD.BLAST"
            style="width: 100%; height: 100%;"
            class="blinking"
          ></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { BOARD } from "@/components/Game.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { faResolving } from "@fortawesome/free-brands-svg-icons";

@Component
export default class Board extends Vue {
  @Prop()
  private board!: { rest: number; content: BOARD }[][];

  private clicked: boolean = false;

  get BOARD() {
    return BOARD;
  }
}
</script>

<style lang="scss" scoped>
/* 点滅 */
.blinking {
  animation: blink 0.5s ease-in-out 3 alternate;
}
@keyframes blink {
  0% {
    background: red;
    opacity: 1;
  }
  100% {
    background: white;
    opacity: 0;
  }
}

// アニメーションの時間
$animateTime: 800ms;
// パーティクルの数
$particleNum: 14;

@mixin centering {
  transform-origin: 250px 250px;
}

@mixin animationFill {
  animation-fill-mode: forwards;
}

.likeButton {
  cursor: pointer;

  .border {
    fill: rgb(255, 255, 255);
  }
  .explosion {
    transform-origin: 250px 250px;
    transform: scale(0.02);
    stroke: rgba(221, 70, 136, 1);
    fill: none;
    opacity: 0;
    stroke-width: 1;
    @include centering;
    animation: explosionAnime $animateTime;
    @include animationFill;
  }

  .particleLayer {
    opacity: 0;
    animation: particleLayerAnime $animateTime;
    @include animationFill;

    circle {
      opacity: 0;
      @include centering;
    }

    @for $index from 1 through $particleNum {
      circle:nth-child(#{$index}) {
        animation: particleAnimate#{$index} $animateTime;
        @include animationFill;
      }
    }
  }
}

// 爆発のアニメーション
@keyframes explosionAnime {
  0% {
    opacity: 0;
    transform: scale(0.01);
  }
  1% {
    opacity: 1;
    transform: scale(0.01);
  }

  5% {
    stroke-width: 200;
  }

  20% {
    stroke-width: 300;
  }

  50% {
    stroke: rgba(204, 142, 245, 1);
    transform: scale(1.1);
    stroke-width: 1;
  }
  50.1% {
    stroke-width: 0;
  }

  100% {
    stroke: rgba(204, 142, 245, 1);
    transform: scale(1.1);
    stroke-width: 0;
  }
}

// パーティクル全体のアニメーション
@keyframes particleLayerAnime {
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  31% {
    opacity: 1;
  }

  60% {
    transform: translate(0, 0);
  }

  70% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translate(0, -20px);
  }
}

// パーティクルの個別アニメーション

// 各点の移動位置
// 1点目のx座標, 1点目のy座標, 2点目のx座標, 2点目のy座標,...と並んでいる
$points: -16, -59, 41, 43, 50, -48, -39, 36, -39, 32, 48, 6, -69, -36, -12, -52,
  -43, -21, -10, 47, 66, -9, 40, -45, 29, 24, -10, 50;

$pointer: 1;

@for $index from 1 through $particleNum {
  @keyframes particleAnimate#{$index} {
    0% {
      transform: translate(0, 0);
    }
    30% {
      opacity: 1;
      transform: translate(0, 0);
    }
    80% {
      transform: translate(
        #{nth($points, $pointer)}px,
        #{nth($points, $pointer + 1)}px
      );
    }
    90% {
      transform: translate(
        #{nth($points, $pointer)}px,
        #{nth($points, $pointer + 1)}px
      );
    }
    100% {
      opacity: 1;
      transform: translate(
        #{nth($points, $pointer)}px,
        #{nth($points, $pointer + 1)}px
      );
    }
  }
  $pointer: $pointer + 2;
}

// ハートのアニメーション
@keyframes heartAnime {
  0% {
    transform: scale(0);
    fill: #e2264d;
  }
  39% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.2, 1.2);
  }
  70% {
    transform: scale(1, 1) translate(0%, -10%);
  }
  75% {
    transform: scale(1.1, 0.9) translate(0%, 5%);
  }
  80% {
    transform: scale(0.95, 1.05) translate(0%, -3%);
  }
  100% {
    transform: scale(1, 1) translate(0%, 0%);
    fill: #e2264d;
  }
}

.spinner {
  width: 40px;
  height: 40px;

  position: relative;
  // margin: 100px auto;
}

.double-bounce {
  width: 25px;
  height: 50px;
  border-radius: 100% 0 0 100% / 50%;
  background-color: #00ffff;
  opacity: 0.6;
  position: absolute;
  animation: sk-bounce 0.5s infinite ease-in-out;
}

@keyframes sk-bounce {
  0% {
    transform: scale(0);
  }
  99% {
    transform: scale(1);
  }
  100% {
    opacity: 0;
  }
}
</style>
