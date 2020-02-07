import Vue from "vue";
import App from "@/App.vue";
import store from "@/store/store.ts";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BooststrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "@/router.ts";

library.add(fas, far, fab);

Vue.use(BooststrapVue);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  render: h => h(App)
}).$mount("#app");
