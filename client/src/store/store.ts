import Vue from "vue";
import Vuex from "vuex";
import { IUserState } from "@/store/user.ts";

Vue.use(Vuex);

export default new Vuex.Store<IUserState>({});
