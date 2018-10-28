<template>
    <v-container>
        <v-layout text-xs-center wrap>
            <v-flex xs12>
                <h2 class="headline font-weight-bold">Player 1</h2>
                <dd-player-information :value="firstPlayer" @input="updateFirstPlayer"></dd-player-information>
            </v-flex>

            <v-flex xs12>
                <h2 class="headline font-weight-bold">Player 2</h2>
                <dd-player-information :value="secondPlayer" @input="updateSecondPlayer"></dd-player-information>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {PlayerData} from "../types";

    @Component
    export default class Admin extends Vue {

        get firstPlayer(): PlayerData {
            return this.$store.state.firstPlayer;
        }

        get secondPlayer(): PlayerData {
            return this.$store.state.secondPlayer;
        }

        updateFirstPlayer(value: PlayerData) {
            this.$store.commit("updateFirstPlayer", value);
        }

        updateSecondPlayer(value: PlayerData) {
            this.$store.commit("updateSecondPlayer", value);
        }
    }
</script>

<style lang="less" scoped>

</style>
