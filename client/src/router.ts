import Vue from "vue";
import Router from "vue-router";
import Game from "./components/Game.vue";
import SignIn from "./components/SignIn.vue";
import SignUp from "./components/SignUp.vue";
import firebase from "@/firebase/rdb.ts";

Vue.use(Router);

const router: Router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "game",
      component: Game,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/signin",
      name: "signIn",
      component: SignIn
    },
    {
      path: "/signup",
      name: "signUp",
      component: SignUp
    }
  ]
});

router.beforeEach((to, from, next) => {
  const requiresAuth: boolean = to.matched.some(
    record => record.meta.requiresAuth
  );
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        next();
      } else {
        next({
          path: "/signin",
          query: { redirect: to.fullPath }
        });
      }
    });
  } else {
    next(); // next() を常に呼び出すようにしてください!
  }
});

export default router;
