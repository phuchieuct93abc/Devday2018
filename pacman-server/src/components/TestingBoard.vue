<template>
    <v-container fluid grid-list-md text-xs-center class="test-board">
        <v-layout row justify-space-around>
            <v-flex xs2>
                <dd-score-board v-if="!isError" :score="testPlayer.score" :team-name="testPlayer.name" :color="testPlayer.color"></dd-score-board>
            </v-flex>
        </v-layout>

        <v-layout row justify-center>
            <v-flex xs12>
                <div v-if="isError" class="error-message">{{ message }}</div>
                <div v-else id="pacman">
                    <span id="player" class="player-name-wrapper">
                        <span class="player-name"></span>
                    </span>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import PacmanController from "../pacman/pacmanController";
    import Player from "../player"
    import * as io from 'socket.io-client';
    import {PlayerData, RestData} from "../types";
    import {DEFAULT_LAYER, PredefinedPlayer} from "../predefined-player";

    @Component
    export default class TestingBoard extends Vue {
        private error!: boolean;
        private message: string = "";
        private predefinedPlayer!: PredefinedPlayer;

        beforeCreate() {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            this.predefinedPlayer = new PredefinedPlayer(token);
        }

        created() {
            this.evaluateMessage();
        }

        mounted() {
            if (!this.error) {
                const pacmanController = new PacmanController();
                let player = Player.fromPlayerData(this.testPlayer);
                pacmanController.setPlayer([player]).startGame();

                let socket = io("https://localhost");
                socket.on('action', (data: RestData) => {
                    if (data.token === this.testPlayer.token) {
                        player.move(data.action, pacmanController)
                    }
                });
            }
        }

        get testPlayer(): PlayerData {
            let player: PlayerData = this.predefinedPlayer.getUser();
            if (!player) {
                player = DEFAULT_LAYER;
            }
            this.$store.commit("updateTestPlayer", player);
            return this.$store.state.testPlayer;
        }

        get isError(): boolean {
            return this.error;
        }

        private evaluateMessage(): void {
            if (!this.predefinedPlayer.isValidToken()) {
                this.message = "Please put token in url like ?token=ABC";
                this.error = true;
            } else if (!this.predefinedPlayer.isFoundUser()) {
                this.message = "Your token is not correct, please refers to a document";
                this.error = true;
            } else {
                this.message = ""
                this.error = false;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    #pacman {
        width: 400px;
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

    .error-message {
        margin: 0 auto;
        width: 800px;
        font-size: 40px;
    }
</style>
