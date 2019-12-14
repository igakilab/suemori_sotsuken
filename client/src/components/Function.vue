<template>
  <div>
    <div v-for="(m, index) in command" :key="index" class="frame_stroke_rect">
      <font-awesome-icon
        v-if="m === MOVE.UP"
        icon="arrow-alt-circle-up"
        size="5x"
      />
      <font-awesome-icon
        v-else-if="m === MOVE.LEFT"
        icon="arrow-alt-circle-left"
        size="5x"
      />
      <font-awesome-icon
        v-else-if="m === MOVE.RIGHT"
        icon="arrow-alt-circle-right"
        size="5x"
      />
      <font-awesome-icon
        v-else-if="m === MOVE.DOWN"
        icon="arrow-alt-circle-down"
        size="5x"
      />
      <font-awesome-icon v-else-if="m === MOVE.BOMB" icon="bomb" size="5x" />
    </div>
  </div>
</template>

<script lang="ts">
import { MOVE } from "@/components/Game.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Function extends Vue {
  @Prop({ default: true }) private player1!: boolean;
  @Prop({ default: 5 }) private bomb!: number;
  @Prop({ default: true }) private turn!: boolean;
  @Prop() command!: symbol[];
  @Prop({ default: false }) private unknownMode!: boolean;

  get MOVE() {
    return MOVE;
  }
}
</script>

<style scoped>
.frame_stroke_rect {
  border: solid 1px #000;
  width: 80px;
  height: 80px;
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
</style>
