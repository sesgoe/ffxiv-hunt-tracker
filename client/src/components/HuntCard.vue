<template>
  <v-card :class="'padded ' + hunt.status">
    <v-img
      :src="hunt.imageUrl"
      lazy-src="data:image/png;base64,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"
      aspect-ratio="1.3"
      @mouseenter="hoverImage = true"
      @mouseleave="hoverImage = false"
      @click.stop="dialog = true"
    >
      <v-layout
        v-if="hoverImage"
        justify-center
        align-center
        class="overlay"
      >
        <h1>Spawnpoints</h1>
      </v-layout>
    </v-img>

    <v-dialog
      v-model="dialog"
      v-resize="calculateAndSetDialogWidthAndSize"
      :width="dialogWidth"
    >
      <v-card style="padding: 10px;">
        <v-img
          :src="hunt.mapUrl"
          aspect-ratio="1"
        />
      </v-card>
    </v-dialog>

    <v-layout justify-center>
      <h3>[ {{ hunt.zone }} ]</h3>
    </v-layout>

    <v-layout justify-center>
      <v-card-title primary-title>
        <h3 class="headline mb-0 trebuchet">
          {{ hunt.name }}
        </h3>
      </v-card-title>
    </v-layout>

    <countdown-timer
      v-if="hunt.status !== 'found'"
      :hunt-status="hunt.status"
      :death-timestamp="hunt.deathTimestamp"
    />

    <v-layout justify-center>
      <v-card-actions v-if="hunt.status === 'respawning'">
        <v-btn
          small
          round
          @click="foundHunt()"
        >
          Found!
        </v-btn>
      </v-card-actions>

      <v-card-actions v-if="hunt.status === 'unknown'">
        <v-btn
          small
          round
          @click="foundHunt()"
        >
          Found!
        </v-btn>
      </v-card-actions>

      <v-card-actions v-if="hunt.status === 'found'">
        <v-layout
          column
          justify-center
          align-center
        >
          <v-flex>
            <v-btn
              small
              color="red"
              round
              @click="deadHunt()"
            >
              RIP
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>

      <v-card-actions
        v-if="hunt.status === 'dead'"
        class="padTop"
      />
    </v-layout>
  </v-card>
</template>

<script>
  import moment from 'moment'
  import CountdownTimer from './CountdownTimer'

  export default {
    components: {
      CountdownTimer
    },
    props: {
      hunt: {
        type: Object,
        default: function () {
          return {
            name: 'Erle',
            status: 'dead',
            zone: 'The Fringes',
            nickName: 'Buzz',
            imageUrl: require('@/assets/hunts/erle.png'),
            mapUrl: require('@/assets/maps/erle_orcus_map.png'),
            deathTimestamp: moment().valueOf()
          }
        }
      }
    },
    data: function () {
      return {
        hoverImage: false,
        dialog: false,
        dialogSize: 'small',
        dialogWidth: 400
      }
    },
    mounted () {
      this.calculateAndSetDialogWidthAndSize()
      this.tick()
    },
    methods: {
      deathTimestampPlusRespawnTime: function () {
        return moment(this.hunt.deathTimestamp).add(6, 'hours').valueOf()
      },
      tick: function () {
        setInterval(() => {
          this.duration = moment.duration(
            this.deathTimestampPlusRespawnTime() - moment().valueOf(),
            'milliseconds'
          )
          if (this.duration.hours() < 2 && (this.hunt.status === 'dead' || this.hunt.status === 'unknown')) {
            this.hunt.status = 'respawning'
          }
        }, 1000)
      },
      foundHunt: async function () {
        await fetch(`/api/room/${this.$route.params.roomName}/hunt/${this.hunt.name}/status/found`, {
          method: 'PUT'
        })
        this.hunt.status = 'found'
      },
      deadHunt: async function () {
        await fetch(`/api/room/${this.$route.params.roomName}/hunt/${this.hunt.name}/status/dead`, {
          method: 'PUT'
        })
        this.hunt.status = 'dead'
        this.hunt.deathTimestamp = moment().valueOf()
      },
      calculateAndSetDialogWidthAndSize: function () {
        if (window.innerWidth < 870) {
          this.dialogWidth = 400
          this.dialogSize = 'small'
        } else {
          this.dialogWidth = 800
          this.dialogSize = 'large'
        }
      }
    }
  }
</script>

<style scoped>
.padded {
  padding: 4px;
}

.overlay {
  height: 105%;
  background: #000;
  opacity: 0.6;
  cursor: pointer;
}

.trebuchet {
  font-family: "Trebuchet MS", Helvetica, sans-serif !important;
  font-weight: bold;
}

.found {
  background-color: #4caf50;
}

.respawning {
  background-color: #2196f3;
}

.unknown {
  background-color: #fb8c00;
}

.dead {
  background-color: #ff5252;
}

.padTop {
  padding-top: 22.5px;
}

.orcus1 {
  position: absolute;
  top: 45.5%;
  left: 37.3%;
}
</style>
