<template>
  <div class="signUp">
    <h2>Sign up</h2>
    <input
      type="text"
      placeholder="Username"
      v-model="username"
      @keydown.enter="signUp"
    />
    <input
      type="password"
      placeholder="Password"
      v-model="password"
      @keydown.enter="signUp"
    />
    <b-button @click="signUp">Register</b-button>
    <vue-loading
      v-if="loading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
    <p>
      Do you have an account?
      <router-link to="/signin">sign in now!!</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { VueLoading } from "vue-loading-template";
import firebase from "@/firebase/rdb.ts";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    VueLoading
  }
})
export default class SignUp extends Vue {
  private items: { age: number; first_name: string; last_name: string }[] = [];
  private username: string = "";
  private password: string = "";
  private loading: boolean = false;

  private signUp() {
    this.loading = true;
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.username, this.password)
      .then((user: any) => {
        alert("アカウントが作成されました。");
        this.$router.push("/room");
      })
      .catch(error => {
        alert(error.message);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.signUp {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
input {
  margin: 10px 0;
  padding: 10px;
}
</style>
