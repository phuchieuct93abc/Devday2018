<template>
    <div>
        <div v-if="isError" class="error-message">Please put token in url like ?token=ABC</div>
        <div v-else>
            <score-board class="test-player" :score=testPlayer.score :team-name=testPlayer.name></score-board>
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
    import pacmanController from "../pacman/pacmanController";
    import Player from "../player"
    import * as io from 'socket.io-client';
    import {PlayerData, RestData} from "../playerStorage";

    @Component
    export default class TestingBoard extends Vue {
        private error: boolean = false;

        mounted() {
            let urlParams = new URLSearchParams(window.location.search);
            let token = urlParams.get('token');
            if (token) {
                this.error = false;
                let player = Player.fromPlayerData(this.testPlayer);
                pacmanController.setPlayer([player]).startGameWithNoGhost();

                let socket = io();
                socket.on('action', function (data: RestData) {
                    if (data.token == token) {
                        player.move(data.action)
                    }
                });
            } else {
                this.error = true;
            }
        }

        get testPlayer(): PlayerData {
            return this.$store.state.testPlayer;
        }

        get isError() {
            return this.error;
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
