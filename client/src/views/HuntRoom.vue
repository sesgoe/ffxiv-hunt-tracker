<template>
  <div style="height:100%">
    <v-container
      v-if="!loading"
      fluid
      grid-list-lg
    >
      <v-layout
        row
        wrap
        justify-center
      >
        <v-flex
          xs12
          sm12
          md6
          lg4
        >
          <v-layout
            align-center
            justify-center
            column
          >
            <v-flex>
              <h2>Room: {{ room.name }}</h2>
            </v-flex>
            <v-flex>
              <v-btn
                v-if="profile.userId === room.roles[0].members[0].userId"
                large
                color="blue"
                @click="dialog = true"
              >
                Manage Room Members
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="hunt in room.huntStatuses"
          :key="`${hunt.name}`"
          d-flex
          xs12
          sm6
          md3
          lg2
        >
          <hunt-card :hunt="hunt" />
        </v-flex>
      </v-layout>
    </v-container>
    <v-container
      v-if="loading"
      fill-height
      grid-list-md
      text-xs-center
    >
      <v-layout
        row
        wrap
        align-center
      >
        <v-flex>
          <v-progress-circular
            :size="100"
            :width="7"
            color="blue"
            indeterminate
          />
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog
      v-model="dialog"
      :width="dialogWidth"
    >
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="headline">
              Room Members
            </h3>
          </div>
        </v-card-title>
        <v-container
          fluid
          grid-list-md
        >
          <v-layout
            justify-center
            xs12
            row
            wrap
          >
            <v-flex xs4>
              <v-text-field label="Discord Username" />
            </v-flex>
            <v-flex xs6>
              <v-select
                :items="items"
                solo
                required
              />
            </v-flex>
            <v-flex xs1>
              <v-btn
                flat
                icon
                color="green"
              >
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout
            justify-center
            xs12
          >
            <v-flex>
              <h3>Hunt Train Organizers</h3>
              <div
                v-for="hto in room.roles[1].members"
                :key="`${hto.discordUsername}~${hto.discordDiscriminator}`"
              >
                <span>Test#123</span>
                <v-btn
                  flat
                  icon
                  color="red"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
          <v-layout
            justify-center
            xs12
          >
            <v-flex>
              <h3>Scouts</h3>
              <div
                v-for="hto in room.roles[2].members"
                :key="`${hto.discordUsername}~${hto.discordDiscriminator}`"
              >
                <span>Test#123</span>
                <v-btn
                  flat
                  icon
                  color="red"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
          <v-layout
            justify-center
            xs12
          >
            <v-flex>
              <h3>Members</h3>
              <div
                v-for="hto in room.roles[3].members"
                :key="`${hto.discordUsername}~${hto.discordDiscriminator}`"
              >
                <span>Test#123</span>
                <v-btn
                  flat
                  icon
                  color="red"
                >
                  <v-icon>clear</v-icon>
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import HuntCard from '../components/HuntCard.vue'

  let wrongTime = moment().add(-1, 'minute').valueOf()
  let eventSource

  export default {
    components: {
      HuntCard
    },
    props: {
      profile: {
        type: Object,
        default: function () {
          return {
            userId: 'someId'
          }
        }
      }
    },
    data: () => ({
      room: {
        name: '',
        huntStatuses: [
          {
            name: 'Erle',
            zone: 'The Fringes',
            nickName: 'Buzz',
            imageUrl: require('@/assets/hunts/erle.png'),
            mapUrl: require('@/assets/maps/erle_orcus_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Orcus',
            zone: 'The Fringes',
            nickName: 'Bug',
            imageUrl: require('@/assets/hunts/orcus.png'),
            mapUrl: require('@/assets/maps/erle_orcus_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Luminare',
            zone: 'The Lochs',
            nickName: 'Salty',
            imageUrl: require('@/assets/hunts/luminare.jpg'),
            mapUrl: require('@/assets/maps/luminare_mahisha_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Mahisha',
            zone: 'The Lochs',
            nickName: 'Cow Man',
            imageUrl: require('@/assets/hunts/mahisha.png'),
            mapUrl: require('@/assets/maps/luminare_mahisha_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Vochstein',
            zone: 'The Peaks',
            nickName: 'Bird Brain',
            imageUrl: require('@/assets/hunts/vochstein.png'),
            mapUrl: require('@/assets/maps/vochstein_aqrabuamelu_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Aqrabuamelu',
            zone: 'The Peaks',
            nickName: 'Scorpo',
            imageUrl: require('@/assets/hunts/aqrabuamelu.png'),
            mapUrl: require('@/assets/maps/vochstein_aqrabuamelu_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Funa Yurei',
            zone: 'The Ruby Sea',
            nickName: 'wtf',
            imageUrl: require('@/assets/hunts/funa.png'),
            mapUrl: require('@/assets/maps/funa_oni_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Oni Yumemi',
            zone: 'The Ruby Sea',
            nickName: 'Snail',
            imageUrl: require('@/assets/hunts/oni.png'),
            mapUrl: require('@/assets/maps/funa_oni_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Angada',
            zone: 'Yanxia',
            nickName: 'Doggo',
            imageUrl: require('@/assets/hunts/angada.png'),
            mapUrl: require('@/assets/maps/angada_gajasura_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Gajasura',
            zone: 'Yanxia',
            nickName: 'Elephant',
            imageUrl: require('@/assets/hunts/gajasura.png'),
            mapUrl: require('@/assets/maps/angada_gajasura_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Sum',
            zone: 'The Azim Steppe',
            nickName: 'Salamander',
            imageUrl: require('@/assets/hunts/sum.png'),
            mapUrl: require('@/assets/maps/sum_girimekhala_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          },
          {
            name: 'Girimekhala',
            zone: 'The Azim Steppe',
            nickName: 'Hide and Seek Champion',
            imageUrl: require('@/assets/hunts/girimekhala.png'),
            mapUrl: require('@/assets/maps/sum_girimekhala_map.png'),
            status: 'unknown',
            deathTimestamp: wrongTime
          }
        ],
        roles: [
          {
            name: 'Creator',
            members: ['z']
          },
          {
            name: 'Hunt Train Organizer',
            members: []
          },
          {
            name: 'Scout',
            members: []
          },
          {
            name: 'Member',
            members: []
          }
        ]
      },
      loading: true,
      dialog: false,
      dialogWidth: 800,
      items: [
        'Hunt Train Organizer',
        'Scout',
        'Member'
      ]
    }),
    watch: {
      '$route' (to, from) {
        this.reloadRoom(to.params.roomName)
      }
    },
    mounted: async function () {
      this.reloadRoom(this.$route.params.roomName)
    },
    beforeDestroy: function () {
      eventSource.close()
    },
    methods: {
      reloadRoom: async function (roomName) {
        this.loading = true
        let huntStatusRequest = await fetch(`/api/room/${roomName}`)
        let huntStatusJson = await huntStatusRequest.json()
        let result = huntStatusJson.result
        this.room.members = result.roles
        this.room.name = result.name

        for (let i = 0; i < 12; i++) {
          this.room.huntStatuses[i].status = result.huntStatuses[i].status
          this.room.huntStatuses[i].deathTimestamp = result.huntStatuses[i].deathTimestamp
        }
        this.loading = false
        if (eventSource) {
          eventSource.close()
        }
        let e = new EventSource(`/api/room/${roomName}/stream`)
        eventSource = e

        eventSource.onmessage = (e) => {
          let hunt = JSON.parse(e.data)

          for (let i = 0; i < this.room.huntStatuses.length; i++) {
            if (this.room.huntStatuses[i].name === hunt.name) {
              this.room.huntStatuses[i].status = hunt.status
              if (hunt.deathTimestamp) {
                this.room.huntStatuses[i].deathTimestamp = hunt.deathTimestamp
              }
            }
          }
        }
      }
    }
  }
</script>
