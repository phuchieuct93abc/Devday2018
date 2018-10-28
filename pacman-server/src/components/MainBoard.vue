<template>
    <div class="main-board">

        <dd-score-board class="team-one" :score=firstPlayer.score :team-name=firstPlayer.name></dd-score-board>

        <dd-score-board class="team-two" :score=secondPlayer.score :team-name=secondPlayer.name></dd-score-board>

        <div id="pacman">
            <span id="player-1" class="player-name-wrapper">
                <span class="player-name"></span>
            </span>
                <span id="player-2" class="player-name-wrapper">
                <span class="player-name"></span>
            </span>
        </div>

        <v-layout align-center justify-center>
            <v-btn @click="startGame" color="primary">Start</v-btn>
            <v-btn @click="restartGame" color="error">Restart</v-btn>
        </v-layout>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import * as io from 'socket.io-client';
    import Player from "../player";
    import pacmanController from "../pacman/pacmanController";
    import {PlayerData, RestData} from "../types";
    import {PLAYER_ONE, PLAYER_TWO} from "../predefined-player";

    @Component
    export default class MainBoard extends Vue {
        private player1!: Player;
        private player2!: Player;

        mounted() {
            const socket = io();
            socket.on('action', (action: RestData) => {
                let token = action.token;
                let player: Player;
                if (token === this.player1.token) {
                    player = this.player1;
                } else if (token === this.player2.token) {
                    player = this.player2;
                } else {
                    return;
                }
                player.move(action.action);
            });
        }

        startGame() {
            this.player1 = Player.fromPlayerData(this.firstPlayer);
            this.player2= Player.fromPlayerData(this.secondPlayer);
            pacmanController.setPlayer([this.player1, this.player2]).startGameWithNoGhost();
        }

        restartGame() {
            const el = document.getElementById("pacman");
            if (el) {
                // TODO Find the way to keep the name in header of pacman
                el.innerText = "";
            }
            this.$store.commit("updateFirstPlayer", Object.assign({}, PLAYER_ONE));
            this.$store.commit("updateSecondPlayer", Object.assign({}, PLAYER_TWO));
        }

        get firstPlayer(): PlayerData {
            return this.$store.state.firstPlayer;
        }

        get secondPlayer(): PlayerData {
            return this.$store.state.secondPlayer;
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

    .team-one {
        position: absolute;
        left: 20%;
    }

    .team-two {
        position: absolute;
        right: 20%;
    }
</style>
