<template>
  <v-layout justify-center>
    <v-flex
      v-if="huntStatus === 'unknown'"
      text-xs-center
    >
      <v-progress-circular
        v-if="isNaN(duration.seconds())"
        indeterminate
        color="white"
      />
      <h4 v-show="!isNaN(duration.seconds())">
        Unknown Hunt Status
      </h4>
      <h4 v-show="!isNaN(duration.seconds()) && duration.milliseconds() > 0">
        Force respawn in: {{ timerString() }}
      </h4>
    </v-flex>
    <v-flex
      v-if="huntStatus === 'dead'"
      text-xs-center
    >
      <v-progress-circular
        v-if="isNaN(duration.seconds())"
        indeterminate
        color="white"
      />
      <h4 v-show="!isNaN(duration.seconds())">
        Hunt Confirmed Dead
      </h4>
      <h4 v-show="!isNaN(duration.seconds())">
        Force respawn in: {{ timerString() }}
      </h4>
    </v-flex>
    <v-flex
      v-if="huntStatus === 'respawning'"
      text-xs-center
    >
      <v-progress-circular
        v-if="isNaN(duration.seconds())"
        indeterminate
        color="white"
      />
      <h4 v-show="!isNaN(duration.seconds()) && duration.milliseconds() > 0">
        Hunt Respawn Possible
      </h4>
      <h4 v-show="!isNaN(duration.seconds()) && duration.milliseconds() < 0">
        Hunt Force Respawned. Go find it!
      </h4>
      <h4 v-show="!isNaN(duration.seconds()) && duration.milliseconds() > 0">
        Force respawn in: {{ timerString() }}
      </h4>
    </v-flex>
  </v-layout>
</template>

<script>
  import moment from 'moment'

  export default {
    props: {
      deathTimestamp: {
        type: Number,
        default: moment().valueOf()
      },
      huntStatus: {
        type: String,
        default: 'unknown'
      }
    },
    data: function () {
      return {
        duration: moment.duration(
          this.deathTimestampPlusRespawnTime - moment().valueOf(),
          'milliseconds'
        )
      }
    },
    computed: {
      deathTimestampPlusRespawnTime: function () {
        return moment(this.deathTimestamp).add(6, 'hours').valueOf()
      }
    },
    mounted: function () {
      this.tick()
    },
    methods: {
      tick: function () {
        setInterval(() => {
          this.duration = moment.duration(
            this.deathTimestampPlusRespawnTime - moment().valueOf(),
            'milliseconds'
          )
        }, 1000)
      },
      durationSeconds: function () {
        if (this.duration.seconds() > 9) {
          return this.duration.seconds()
        } else {
          return '0' + this.duration.seconds()
        }
      },
      durationMinutes: function () {
        if (this.duration.minutes() > 9) {
          return this.duration.minutes()
        } else {
          return '0' + this.duration.minutes()
        }
      },
      timerString: function () {
        return this.duration.hours() + ':' + this.durationMinutes() + ':' + this.durationSeconds()
      }
    }
  }
</script>

<style></style>
