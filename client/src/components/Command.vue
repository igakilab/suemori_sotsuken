<template>
  <div style="margin-right: 20px;">
    <div v-if="player1">
      <div>
        <table>
          <tr>
            <td
              style="text-align: center; padding-right: 20px; vertical-align: bottom;"
            >
              next
            </td>
            <td style="text-align: center; padding-right: 20px;">now</td>
          </tr>
          <tr>
            <td>
              <PreCommand
                :command="preCommand"
                :unknownMode="unknownMode"
              ></PreCommand>
            </td>
            <td>
              <NextCommand
                :command="command"
                :unknownMode="unknownMode"
              ></NextCommand>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-else>
      <table>
        <tr>
          <td
            style="text-align: center; padding-right: 20px; vertical-align: bottom;"
          >
            now
          </td>
          <td style="text-align: center; padding-right: 20px;">next</td>
        </tr>
        <tr>
          <td>
            <NextCommand
              :command="command"
              :unknownMode="unknownMode"
            ></NextCommand>
          </td>
          <td>
            <PreCommand
              :command="preCommand"
              :unknownMode="unknownMode"
            ></PreCommand>
          </td>
        </tr>
      </table>
    </div>
    <div
      id="player1button"
      style="margin-top: 20px;"
      class="btn-square"
      :class="turn ? (player1 ? 'player1' : 'player2') : 'player'"
    >
      {{ player1 ? 1 : 2 }}P
    </div>
    <div style="margin-top: 20px;">
      <font-awesome-icon
        icon="bomb"
        size="2x"
        style="cursor: pointer; position: display: inline-block;"
      />
      <div
        style="margin-top: 0px; display: inline-block; margin-left: 10px; margin-right: 10px;"
      >
        x
      </div>
      <div class="bomb" style="display: inline-block;">
        {{ bomb >= 0 ? bomb : "-" }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MOVE } from "@/components/Game.vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import PreCommand from "@/components/PreCommand.vue";
import NextCommand from "@/components/NextCommand.vue";

@Component({
  components: {
    PreCommand,
    NextCommand
  }
})
export default class Command extends Vue {
  @Prop({ default: true }) private player1!: boolean;
  @Prop({ default: 5 }) private bomb!: number;
  @Prop({ default: true }) private turn!: boolean;
  @Prop() command!: symbol[];
  @Prop() preCommand!: symbol[];
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
