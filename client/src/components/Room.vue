<template>
  <div id="room">
    <div>
      <b-button v-b-modal.createRoomModal>ルーム作成</b-button>
      <b-modal id="createRoomModal" title="ルーム作成" @ok="genRoom">
        <b-form-group label="ゲームモード" style="cursor: pointer;">
          <b-form-radio-group
            id="btn-radios-2"
            v-model="mode"
            :options="[1, 2]"
            buttons
            button-variant="outline-primary"
            name="radio-btn-outline"
          ></b-form-radio-group>
        </b-form-group>
        爆弾数
        <b-form-input v-model="bomb" type="number"></b-form-input>
      </b-modal>
    </div>
    <div>ルーム一覧</div>
    <div>
      <b-table striped hover :items="rooms" :fields="fields">
        <template v-slot:cell(actions)="row">
          <b-button
            size="sm"
            @click="info(row.item, row.index, $event.target)"
            class="mr-2"
          >
            入室
          </b-button>
          <b-button size="sm" class="mr-2" :disabled="true">
            観戦
          </b-button>
          <b-modal
            :id="infoModal.id"
            :title="infoModal.title"
            ok-only
            @hide="resetInfoModal"
          >
            <pre>{{ infoModal.content }}</pre>
          </b-modal>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import firebase from "@/firebase/rdb.ts";
import { Component, Vue, Prop } from "vue-property-decorator";
import board from "@/game/board.ts";

@Component
export default class Room extends Vue {
  // private log: { player: number; select: Symbol[] }[] = [];
  private fields: { key: string; label: string }[] = [
    { key: "id", label: "ルームID" },
    { key: "mode", label: "ゲームモード" },
    { key: "player1", label: "プレイヤー1ID" },
    { key: "actions", label: "" }
  ];
  private rooms: {}[] = [];
  private uid: string = "";
  private mode: number = 1;
  private bomb: number = 5;

  private infoModal = {
    id: "info-modal",
    title: "",
    content: ""
  };

  private info(item: {}, index: number, button: any) {
    this.infoModal.title = `Row index: ${index}`;
    this.infoModal.content = JSON.stringify(item, null, 2);
    this.$root.$emit("bv::show::modal", this.infoModal.id, button);
  }
  private resetInfoModal() {
    this.infoModal.title = "";
    this.infoModal.content = "";
  }

  private genRoom() {
    console.log("test");
  }

  public async created() {
    const user = firebase.auth().currentUser;
    if (!user) {
      this.$router.push("/signin");
      return;
    }
    this.uid = user.uid;

    const userRef = firebase
      .database()
      .ref("user")
      .child(this.uid);

    const userSnapshot = await userRef.once("value");
    if (!userSnapshot.exists()) {
      userRef.child("win").set(0);
      userRef.child("lose").set(0);
      userRef.child("draw").set(0);
      userRef.child("roomID").set(0);
    } else {
      const roomID = userSnapshot.child("roomID").val();
      if (roomID > 0) {
        // 移動
      }
    }

    const roomRef = firebase.database().ref("room");
    const roomCount = String(
      (
        await firebase
          .database()
          .ref("roomCount")
          .once("value")
      ).val()
    );

    roomRef.on("value", snapshot => {
      const rooms: {
        id: number;
        mode: number;
        board: number[][];
        end: boolean;
        player1: {
          uid: string;
          logs: { player: number; command: string[] }[];
          bomb: number;
        };
        player2: {
          uid: string;
          logs: { player: number; command: string[] }[];
          bomb: number;
        };
        turn: boolean;
      }[] = snapshot.val();
      // if (!rooms) {
      //   // 初期設定(データなし)
      //   console.log(roomCount);
      //   const room = roomRef.child(roomCount);
      //   room.child("mode").set(1);
      //   room.child("board").set(board);
      //   room.child("end").set(false);
      //   room.child("turn").set(true);
      //   const player1 = room.child("player1");
      //   player1.child("uid").set(this.uid);
      //   player1.child("command").set(Array(5).fill(null));
      //   player1.child("bomb").set(5);
      // }
      this.rooms = rooms
        .filter(room => !room.end)
        .map(room => {
          return {
            id: room.id,
            mode: room.mode,
            player1: room.player1.uid
          };
        });
    });
  }
}
</script>

<style></style>
