<template>
    <div>
        <div v-if="isError" class="error-message">{{ message }}</div>
        <div v-else>
            <dd-score-board class="test-player" :score="testPlayer.score" :team-name="testPlayer.name" :color="testPlayer.color"></dd-score-board>
            <div id="pacman">
                <span id="player" class="player-name-wrapper">
                <span class="player-name"></span>
            </span>
            </div>
        </div>
    </div>
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
                let player = Player.fromPlayerData(this.predefinedPlayer.getUser());
                pacmanController.setPlayer([player]).startGame();

                let socket = io("https://localhost");
                socket.on('action', function (data: RestData) {
                    player.move(data.action, pacmanController)
                });
            }
        }

        get testPlayer(): PlayerData {
            const player: PlayerData = this.predefinedPlayer.getUser();
            if (player) {
                return player;
            } else {
                return DEFAULT_LAYER
            }
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

    .test-player {
        position: absolute;
        right: 20%;
    }

    .error-message {
        margin: 0 auto;
        width: 800px;
        font-size: 40px;
    }
</style>
