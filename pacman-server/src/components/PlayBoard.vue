<template>
  <div id="pacman">
    <span id="player" class="player-name-wrapper">
      <span class="player-name"></span>
      <p>{{ errorMessage }}</p>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PacmanController from "../pacman/pacmanController";
import Player from "../player"
import * as io from 'socket.io-client';

@Component
export default class PlayBoard extends Vue {
  private errorMessage: String = "";

  mounted() {
    var urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get('token');
    if (token) {
      this.errorMessage = "";
      let player = Player.getPlayerByToken(token);
        PacmanController.setPlayer([player]).startGameWithNoGhost();

        var socket = io();
        socket.on('action', function (action) {
            if (action.token == token) {
                player.move(action.action)
            }
        });
    } else {
      this.errorMessage = "Please put token in url like ?token=ABC";
    }
    console.log(token)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#pacman {
  height: 470px;
  width: 382px;
  border-radius: 5px;
  margin: 20px auto;
  position: relative;
}

.player-name-wrapper {
  position: absolute;
  width: 0;
  display: flex;
  overflow: visible;
  white-space: nowrap;
  justify-content: center;
  font-size: 1.5em;
}
</style>
