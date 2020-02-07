import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store/store.ts";

export interface IUserState {
  uid: string;
}

@Module({ dynamic: true, store: store, name: "user", namespaced: true })
class User extends VuexModule implements IUserState {
  uid: string = "";

  @Mutation
  getUID() {
    return this.uid;
  }

  @Mutation
  setUID(uid: string) {
    this.uid = uid;
  }
}

export default getModule(User);
