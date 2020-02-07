<template>
  <div id="logs">
    <b-form-textarea
      plaintext
      :value="logs ? logs.join('\n') : ''"
      rows="3"
    ></b-form-textarea>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Logs extends Vue {
  @Prop()
  private logs!: string[];
}
</script>
