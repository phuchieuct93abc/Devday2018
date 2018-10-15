<template>
    <div id="pacman">
        <span id="player1" class="player-name-wrapper">
            <span class="player-name"></span>
        </span>
        <span id="player2" class="player-name-wrapper">
            <span class="player-name"></span>
        </span>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as io from 'socket.io-client';
import Player from "../player"
import pacmanController from "../pacman/pacmanController";

@Component
export default class MainBoard extends Vue {
    mounted() {
        const player1Token: string = "1";
        const player2Token: string = "2"
        let player1: Player = Player.getPlayerByToken(player1Token);
        let player2: Player = Player.getPlayerByToken(player2Token);
        pacmanController.setPlayer([player1, player2]).startGameWithNoGhost();

        var socket = io();
        socket.on('action', (action: any) => {
            let token = action.token;
            let player;
            if (token == player1.token) {
                player = player1;
            } else if (token == player2.token) {
                player = player2;
            } else {
                return;
            }
            player.move(action.action);
        });
    }
}
</script>

<style lang="less" scoped>
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
