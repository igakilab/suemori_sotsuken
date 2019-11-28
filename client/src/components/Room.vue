<template>
  <div id="room">
    <div>
      <b-button v-b-modal.createRoomModal style="margin-bottom: 10px;"
        >ルーム作成</b-button
      ><span style="margin-left: 10px;">ユーザーID：{{ uid }}</span>
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
          <b-button size="sm" @click="enterRoom(row.item.id)" class="mr-2">
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
import UserModule from "@/store/user.ts";

@Component
export default class Room extends Vue {
  private fields: { key: string; label: string }[] = [
    { key: "id", label: "ルームID" },
    { key: "mode", label: "ゲームモード" },
    { key: "player1", label: "プレイヤー1ID" },
    { key: "actions", label: "" }
  ];
  private rooms: {}[] = [];
  private mode: number = 1;
  private bomb: number = 5;

  get uid() {
    return UserModule.uid;
  }

  private infoModal = {
    id: "info-modal",
    title: "",
    content: ""
  };

  private enterRoom(id: number) {
    firebase
      .database()
      .ref("room")
      .child(String(id))
      .child("player2")
      .child("uid")
      .set(UserModule.uid);

    firebase
      .database()
      .ref("user")
      .child(UserModule.uid)
      .child("roomID")
      .set(id);

    this.$router.push("/");
  }

  private resetInfoModal() {
    this.infoModal.title = "";
    this.infoModal.content = "";
  }

  private async genRoom() {
    const roomRef = firebase.database().ref("room");
    const roomCount = String(
      (
        await firebase
          .database()
          .ref("roomCount")
          .once("value")
      ).val() | 0
    );
    const room: {
      id: number;
      mode: number;
      board: number[][];
      playing: boolean;
      end: boolean;
      player1: {
        uid: string;
        logs: { player: number; command: string[] }[];
        bomb: number;
      };
      player2: {
        uid: string | null;
        logs: { player: number; command: string[] }[];
        bomb: number;
      };
      turn: boolean;
    } = {
      id: Number(roomCount) + 1,
      mode: this.mode,
      board: board,
      playing: false,
      end: false,
      player1: {
        uid: UserModule.uid,
        logs: [],
        bomb: this.bomb
      },
      player2: {
        uid: null,
        logs: [],
        bomb: this.bomb
      },
      turn: true
    };

    roomRef.child(String(Number(roomCount) + 1)).set(room);

    firebase
      .database()
      .ref("user")
      .child(UserModule.uid)
      .child("roomID")
      .set(Number(roomCount) + 1);

    firebase
      .database()
      .ref("roomCount")
      .set(Number(roomCount) + 1);

    this.$router.push("/");
  }

  public async created() {
    const user = firebase.auth().currentUser;
    if (!user) {
      this.$router.push("/signin");
      return;
    }
    UserModule.setUID(user.uid);

    const userRef = firebase
      .database()
      .ref("user")
      .child(UserModule.uid);
    const roomRef = firebase.database().ref("room");
    const userSnapshot = await userRef.once("value");

    if (!userSnapshot.exists()) {
      userRef.child("win").set(0);
      userRef.child("lose").set(0);
      userRef.child("draw").set(0);
      userRef.child("roomID").set(0);
    } else {
      const roomID: number = userSnapshot.child("roomID").val();

      if (roomID > 0) {
        roomRef
          .child(String(roomID))
          .child("end")
          .set(true);
        userRef
          .child("lose")
          .set((await userRef.child("lose").once("value")).val() + 1);
      }
    }

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
        number: {
          id: number;
          mode: number;
          board: number[][];
          playing: boolean;
          end: boolean;
          player1: {
            uid: string;
            logs: { player: number; command: string[] }[];
            bomb: number;
          };
          player2: {
            uid: string | null;
            logs: { player: number; command: string[] }[];
            bomb: number;
          };
          turn: boolean;
        };
      } | null = snapshot.val();

      if (rooms) {
        this.rooms = Object.values(rooms)
          .filter(
            room =>
              !room.playing && !room.end && room.player1.uid !== UserModule.uid
          )
          .map(room => {
            return {
              id: room.id,
              mode: room.mode,
              player1: room.player1.uid
            };
          });
      }
    });
  }
}
</script>

<style>
#room {
  margin: 10px;
}
</style>
