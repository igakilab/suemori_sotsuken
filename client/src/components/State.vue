<template>
  <div style="margin-right: 20px;">
    <div v-for="m in select" :key="m" class="frame_stroke_rect">
      <font-awesome-icon
        v-if="m === 'up'"
        icon="arrow-alt-circle-up"
        size="4x"
      />
      <font-awesome-icon
        v-else-if="m === 'left'"
        icon="arrow-alt-circle-left"
        size="4x"
      />
      <font-awesome-icon
        v-else-if="m === 'right'"
        icon="arrow-alt-circle-right"
        size="4x"
      />
      <font-awesome-icon
        v-else-if="m === 'down'"
        icon="arrow-alt-circle-down"
        size="4x"
      />
      <font-awesome-icon v-else-if="m === 'bomb'" icon="bomb" size="4x" />
    </div>
    <div
      id="player1button"
      style="margin-top: 20px;"
      class="btn-square"
      :class="hasPlayer1 ? 'player1' : 'player2'"
    >
      {{ hasPlayer1 ? 1 : 2 }}P
    </div>
    <div style="margin-top: 20px;">
      <font-awesome-icon
        icon="bomb"
        size="2x"
        style="cursor: pointer; position: relative; float:left;"
      />
      <div style="float: left; margin-top: 8px;">x</div>
      <div class="bomb">{{ bomb }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class State extends Vue {
  @Prop({ default: 5 }) private size!: number;
  @Prop({ default: true }) private hasPlayer1!: boolean;
  @Prop({ default: 5 }) private bomb!: number;

  select: string[] = Array(this.size).fill(null);
}
</script>

<style scoped>
.frame_stroke_rect {
  border: solid 1px #000;
  width: 64px;
  height: 64px;
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

.bomb {
  color: red;
  font-size: 28px;
}
</style>
