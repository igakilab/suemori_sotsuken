<template>
  <div style="margin-right: 20px;">
    <div
      v-for="(m, index) in command"
      :key="index"
      style="float:right;"
      :class="
        [
          MOVE.RANDOM_UP,
          MOVE.RANDOM_LEFT,
          MOVE.RANDOM_RIGHT,
          MOVE.RANDOM_DOWN
        ].includes(m)
          ? 'triangle'
          : 'frame_stroke_rect'
      "
    >
      <font-awesome-icon
        v-if="m === MOVE.UP || m === MOVE.RANDOM_UP"
        icon="arrow-alt-circle-up"
      />
      <font-awesome-icon
        v-else-if="m === MOVE.LEFT || m === MOVE.RANDOM_LEFT"
        icon="arrow-alt-circle-left"
      />
      <font-awesome-icon
        v-else-if="m === MOVE.RIGHT || m === MOVE.RANDOM_RIGHT"
        icon="arrow-alt-circle-right"
      />
      <font-awesome-icon
        v-else-if="m === MOVE.DOWN || m === MOVE.RANDOM_DOWN"
        icon="arrow-alt-circle-down"
      />
      <font-awesome-icon v-else-if="m === MOVE.BOMB" icon="bomb" />
      <font-awesome-icon
        v-else-if="m === MOVE.NULL && unknownMode"
        icon="question-circle"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { MOVE } from "@/components/Game.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Command extends Vue {
  @Prop() command!: symbol[];

  get MOVE() {
    return MOVE;
  }
}
</script>

<style scoped>
.frame_stroke_rect {
  background: #fafafa;
  border: #eee 1px solid;
  width: 25px;
  height: 25px;
  text-align: center;
  vertical-align: middle;
}

.btn-square {
  display: inline-block;
  padding: 0.5em 1.5em;
  text-decoration: none;
  color: #fff;
  border-radius: 3px;
}

.player1 {
  background: #668ad8;
  border-bottom: solid 4px #627295;
}

.player2 {
  background: #d86695;
  border-bottom: solid 4px #956286;
}

.player {
  background: #d1c3c9;
  border-bottom: solid 4px #979296;
}

.bomb {
  color: red;
  font-size: 28px;
}

/* 商品に見立てた枠 */
.triangle {
  background: #fafafa;
  width: 25px;
  height: 25px;
  border: #eee 1px solid;
  margin: 0 auto;
  position: relative;
  vertical-align: middle;
}

.triangle * {
  margin-top: 3px;
}

/* ラベル部分 左上に表示 */
.triangle::before {
  content: "";
  top: 0;
  left: 0;
  border-bottom: 1em solid transparent;
  border-left: 1em solid #c12748; /* ラベルの色はここで変更 */
  position: absolute;
  z-index: 100;
}
.triangle::after {
  display: block;
  top: -2px;
  transform: rotate(-45deg);
  color: #fff; /* 文字色はここで変更 */
  left: 5px;
  position: absolute;
  z-index: 101;
}
</style>
