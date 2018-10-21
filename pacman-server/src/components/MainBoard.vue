<template>
    <div class="main-board">

        <score-board class="team-one" :score=firstPlayer.score :team-name=firstPlayer.name></score-board>

        <score-board class="team-two" :score=secondPlayer.score :team-name=secondPlayer.name></score-board>

        <div id="pacman">
            <span id="player1" class="player-name-wrapper">
                <span class="player-name"></span>
            </span>
                <span id="player2" class="player-name-wrapper">
                <span class="player-name"></span>
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import * as io from 'socket.io-client';
    import Player from "../player";
    import pacmanController from "../pacman/pacmanController";

    @Component
    export default class MainBoard extends Vue {
        mounted() {
            const player1Token: string = this.firstPlayer.token;
            const player2Token: string = this.secondPlayer.token;
            let player1: Player = Player.getPlayerByToken(player1Token);
            let player2: Player = Player.getPlayerByToken(player2Token);
            pacmanController.setPlayer([player1, player2]).startGameWithNoGhost();

            var socket = io();
            socket.on('action', (action: any) => {
                let token = action.token;
                let player: Player;
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

        get firstPlayer() {
            return this.$store.state.firstPlayer;
        }

        get secondPlayer() {
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
