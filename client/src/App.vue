<template>
  <v-app
    id="inspire"
    dark
  >
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
      disable-resize-watcher
    >
      <v-list dense>
        <v-list-tile to="/">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group
          prepend-icon="language"
          value="true"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>Rooms</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-tile @click="dialog = true">
            <v-list-tile-action>
              <v-icon>add_circle</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Create New Room</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="room in roomList"
            :key="room.name"
            :to="`/room/${room.name}`"
          >
            <v-list-tile-action>
              <v-icon>keyboard_arrow_right</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ room.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile to="/settings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      fixed
      clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>FFXIV Hunt Tracker</v-toolbar-title>
      <v-spacer />
      <v-tooltip
        v-if="!profile.discordId"
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn
            medium
            fab
            dark
            v-on="on"
            @click="discordAuth()"
          >
            <v-avatar>
              <img
                src="https://cdn.discordapp.com/embed/avatars/1.png"
                alt="avatar"
              >
            </v-avatar>
          </v-btn>
        </template>
        <span>Login with Discord</span>
      </v-tooltip>
      <v-tooltip
        v-if="profile.discordId"
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn
            medium
            fab
            dark
            v-on="on"
            @click="doNothing()"
          >
            <v-avatar>
              <img
                :src="avatarUrl()"
                alt="avatar"
              >
            </v-avatar>
          </v-btn>
        </template>
        <span>User Profile</span>
      </v-tooltip>
    </v-toolbar>
    <v-content>
      <v-snackbar
        v-model="alert"
        :timeout="5000"
        color="error"
        top
      >
        Alert! Testing 123
        <v-btn
          color="white"
          flat
          @click="alert = false"
        >
          Close
        </v-btn>
      </v-snackbar>
      <router-view :profile="profile" />
    </v-content>
    <v-footer app>
      <v-layout justify-center>
        <span>&copy; Ses Goe 2019</span>
      </v-layout>
    </v-footer>

    <v-dialog
      v-model="dialog"
      width="360"
      persistent
    >
      <v-card style="padding: 10px;">
        <v-layout
          justify-center
          column
          align-center
        >
          <v-flex xs12>
            <v-card-title
              class="headline"
            >
              Create New Hunt Room
            </v-card-title>
          </v-flex>
          <v-flex
            xs12
            grow
          >
            <v-text-field
              v-model="roomName"
              label="Room Name"
              required
            />
          </v-flex>
          <v-flex xs12>
            <v-alert
              :value="createRoomAlert"
              color="error"
              outline
            >
              {{ createRoomError }}
            </v-alert>
          </v-flex>
          <v-flex xs12>
            <v-btn
              small
              color="green"
              round
              @click="createNewRoom(roomName)"
            >
              Create
            </v-btn>
            <v-btn
              small
              color="red"
              round
              @click="dialog = false"
            >
              Cancel
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  const validator = require('validator')

  export default {
    name: 'App',
    data: () => ({
      alert: true,
      drawer: false,
      profile: { discordUserName: 'zzz' },
      roomList: null,
      dialog: false,
      roomName: '',
      createRoomAlert: false,
      createRoomError: ''
    }),
    mounted: async function () {
      let profileJson = await fetch('/api/discord/profile')
      let result = await profileJson.json()
      this.profile = result.user

      if (this.profile) {
        let roomsJson = await fetch(`/api/user/${this.profile.discordUsername}~${this.profile.discordDiscriminator}/rooms/`)
        let jsonResponse = await roomsJson.json()
        this.roomList = jsonResponse.result
        if (this.roomList) {
          this.roomList = this.roomList.sort(this.compare)
        }
      }
    },
    methods: {
      avatarUrl: function () {
        return `https://cdn.discordapp.com/avatars/${this.profile.discordId}/${this.profile.discordAvatar}.png`
      },
      compare: function (a, b) {
        let nameA = a.name.toUpperCase()
        let nameB = b.name.toUpperCase()
        if (nameA > nameB) {
          return 1
        } else {
          return -1
        }
      },
      discordAuth: function () {
        window.location.href = `${window.location.protocol}//${window.location.host}/api/discord/auth`
      },
      createNewRoom: async function (roomName) {
        if (validator.isEmpty(roomName)) {
          this.createRoomAlert = true
          this.createRoomError = 'Room name may not be left blank.'
          return
        }

        if (!validator.isAlphanumeric(roomName)) {
          this.createRoomAlert = true
          this.createRoomError = 'Only alphanumeric characters are allowed.'
          return
        }

        await fetch(`/api/room/${roomName}`, {
          method: 'POST'
        })

        if (this.roomList) {
          this.roomList.push({
            name: this.roomName,
            _id: 'something will go here eventually'
          })
        }

        this.roomName = ''
        this.dialog = false
      }
    }
  }
</script>

<style scoped>
.mousePointer {
  cursor: pointer;
}

.snack {
  margin-top: 10%;
}
</style>
