import {CombatStatus} from "../constants";
<template>
    <v-container fluid grid-list-md text-xs-center class="main-board">
        <v-layout row justify-space-around>
            <v-flex xs2>
                <dd-score-board class="team-one" :score="firstPlayer.score" :team-name="firstPlayer.name" :color="firstPlayer.color"></dd-score-board>
            </v-flex>

            <v-flex xs4>
                <v-layout column>
                    <v-flex xs6>
                        <dd-timer :status="status" :value="timer"></dd-timer>
                    </v-flex>
                    <v-flex>
                        <v-btn v-if="isStopped" @click="startGame" color="primary">Start</v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs2>
                <dd-score-board class="team-two" :score="secondPlayer.score" :team-name="secondPlayer.name" :color="secondPlayer.color"></dd-score-board>
            </v-flex>
        </v-layout>

        <v-layout row justify-center>
            <v-flex xs6>
                <div id="pacman">
                    <span id="player-1" class="player-name-wrapper">
                        <span class="player-name"></span>
                    </span>
                    <span id="player-2" class="player-name-wrapper">
                        <span class="player-name"></span>
                    </span>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import * as io from 'socket.io-client';
    import Player from "../player";
    import PacmanController from "../pacman/pacmanController";
    import {PlayerData, RestData} from "../types";
    import {CombatStatus} from "../constants";

    @Component
    export default class MainBoard extends Vue {
        private player1!: Player;
        private player2!: Player;
        private pacmanController!: PacmanController;

        mounted() {
            const socket = io("https://localhost");
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
                player.move(action.action,this.pacmanController);
            });
        }

        startGame() {
            this.player1 = Player.fromPlayerData(this.firstPlayer);
            this.player2= Player.fromPlayerData(this.secondPlayer);
            if(this.pacmanController){
                this.pacmanController.stop();
            }
            this.pacmanController = new PacmanController();
            this.pacmanController.setPlayer([this.player1, this.player2]);
            if (this.hasGhost) {
                this.pacmanController.setGhost();
            } else {
                this.pacmanController.setNoGhost();
            }
            this.pacmanController.startGame();
            this.$store.commit("updateCombatStatus", CombatStatus.STARTED);
        }

        get hasGhost(): boolean {
            return this.$store.state.hasGhost;
        }

        get firstPlayer(): PlayerData {
            return this.$store.state.firstPlayer;
        }

        get secondPlayer(): PlayerData {
            return this.$store.state.secondPlayer;
        }

        get timer(): number {
            return this.$store.state.timer;
        }

        get status(): CombatStatus {
            return this.$store.state.combatStatus;
        }

        get isStopped(): boolean {
            return this.$store.state.combatStatus === CombatStatus.STOPPED;
        }

    }
</script>

<style lang="less" scoped>
    #pacman {
        width: 500px;
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
