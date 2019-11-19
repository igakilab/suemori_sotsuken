<template>
  <div>
    <table style="table-layout: fixed;">
      <tr>
        <td></td>
        <td>
          <b-button @click="onUpClick" :disabled="disabledUp"
            ><font-awesome-icon icon="arrow-up" size="2x"
          /></b-button>
        </td>
        <td>
          <b-button @click="onBombClick" :disabled="disabledBomb"
            ><font-awesome-icon icon="bomb" size="2x"
          /></b-button>
        </td>
      </tr>
      <tr>
        <td>
          <b-button @click="onLeftClick" :disabled="disabledLeft"
            ><font-awesome-icon icon="arrow-left" size="2x"
          /></b-button>
        </td>
        <td>
          <b-button @click="onEndClick" :disabled="disabledEnd"
            ><font-awesome-icon icon="check-square" size="2x"
          /></b-button>
        </td>
        <td>
          <b-button @click="onRightClick" :disabled="disabledRight"
            ><font-awesome-icon icon="arrow-right" size="2x"
          /></b-button>
        </td>
      </tr>
      <tr>
        <td></td>
        <td>
          <b-button @click="onDownClick" :disabled="disabledDown"
            ><font-awesome-icon icon="arrow-down" size="2x"
          /></b-button>
        </td>
        <td>
          <b-button @click="onRedoClick" :disabled="disabledRedo"
            ><font-awesome-icon icon="redo" size="2x"
          /></b-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { MOVE } from "../App.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Controller extends Vue {
  @Prop() disabledUp!: boolean;
  @Prop() disabledLeft!: boolean;
  @Prop() disabledRight!: boolean;
  @Prop() disabledDown!: boolean;
  @Prop() disabledRedo!: boolean;
  @Prop() disabledBomb!: boolean;
  @Prop() disabledEnd!: boolean;
  private onUpClick() {
    this.$emit("click", MOVE.UP);
  }

  private onLeftClick() {
    this.$emit("click", MOVE.LEFT);
  }

  private onRightClick() {
    this.$emit("click", MOVE.RIGHT);
  }

  private onDownClick() {
    this.$emit("click", MOVE.DOWN);
  }

  private onRedoClick() {
    this.$emit("click", MOVE.REDO);
  }

  private onBombClick() {
    this.$emit("click", MOVE.BOMB);
  }

  private onEndClick() {
    this.$emit("click", MOVE.END);
  }
}
</script>

<style scoped></style>
