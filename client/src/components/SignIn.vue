<template>
  <div class="signIn">
    <h2>Sign in</h2>
    <input
      type="text"
      placeholder="Username"
      v-model="username"
      @keydown.enter="signIn"
    />
    <input
      type="password"
      placeholder="Password"
      v-model="password"
      @keydown.enter="signIn"
    />
    <b-button @click="signIn">Signin</b-button>
    <vue-loading
      v-if="loading"
      type="spin"
      color="#333"
      :size="{ width: '50px', height: '50px' }"
    ></vue-loading>
    <p>
      You don't have an account?
      <router-link to="/signup">create account now!!</router-link>
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
export default class SignIn extends Vue {
  private items: { age: number; first_name: string; last_name: string }[] = [];
  private username: string = "";
  private password: string = "";
  private userid: string = "";
  private loading: boolean = false;

  private signIn() {
    this.loading = true;
    firebase
      .auth()
      .signInWithEmailAndPassword(this.username, this.password)
      .then((user: any) => {
        alert("ログインしました。");
        this.$router.push("/");
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
.signIn {
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
