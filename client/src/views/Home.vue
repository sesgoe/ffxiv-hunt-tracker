<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        class="biggerFont"
      >
        <h1>Welcome!</h1>
        <v-divider />
        <div class="pushDown">
          <p>
            This app was made to help groups of people (in the case of FFXIV,
            usually servers) keep track of their hunt statuses and provide a
            nice UI for other hunt train participants to see the status of the
            most popular hunts.
          </p>
          <p>My initial objectives while creating this app were as follows:</p>
          <ol>
            <li>
              Make it easier for people on servers to view the status of
              <span class="vocab">Hunts</span>
            </li>
            <li>
              By virtue of #1, make it easier to tell when a
              <span class="vocab">Hunt Train</span> was about to start without
              needing things like <span class="vocab">Relays</span> or
              <span class="vocab">Linkshells</span>
            </li>
            <li>
              Help <span class="vocab">Hunt Train</span> organizers organize
              <span class="vocab">Hunt Trains</span> more easily
            </li>
            <li>
              Help <span class="vocab">Scouts</span> keep track of what has been
              located for the next <span class="vocab">Hunt Train</span>
            </li>
            <li>
              Help people keep track of <span class="vocab">Hunt</span> spawn
              timers
            </li>
            <li>
              By virtue of #5, have a way to notify individual users about
              upcoming
              <span class="vocab">Hunt Trains</span> using the web browser
            </li>
            <li>
              Raise awareness about <span class="vocab">Hunt Trains</span>
            </li>
          </ol>
        </div>
        <div class="pushDown" />
        <v-divider />
        <div class="pushDown">
          <p>
            If you'd like to quickly get started viewing the Hunt Statuses for
            other servers, please feel free to view the examples below:
          </p>
          <ul>
            <li>Diabolos</li>
            <li>Brynhildr</li>
            <li>Balmung</li>
          </ul>
        </div>
        <div class="pushDown" />
        <v-divider />
        <div class="pushDown">
          <p>
            This site will always be free to use, but unlocking the full
            functionality requires you to login with Discord. You can get
            started by clicking on the avatar icon in the top right.
          </p>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {}
</script>

<style scoped>
.biggerFont {
  font-size: 16px;
}
.pushDown {
  margin-top: 15px;
}
.vocab {
  color: #1ca6e8;
  font-weight: bold;
  font-style: italic;
  font-size: 18px;
}
</style>
