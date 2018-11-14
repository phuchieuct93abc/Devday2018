<template>
    <v-container>
        <v-layout text-xs-center wrap>
            <v-flex xs12>
                <v-text-field label="Timer" v-model="timer"></v-text-field>
            </v-flex>

            <v-flex xs12>
                <h2 class="headline font-weight-bold">Player 1</h2>
                <v-combobox :items="players" item-text="token" v-model="firstPlayer" label="Assign player"></v-combobox>
                <dd-player-information :value="firstPlayer" @input="updateFirstPlayer"></dd-player-information>
            </v-flex>

            <v-flex xs12>
                <h2 class="headline font-weight-bold">Player 2</h2>
                <v-combobox :items="players" item-text="token" v-model="secondPlayer" label="Assign player"></v-combobox>
                <dd-player-information :value="secondPlayer" @input="updateSecondPlayer"></dd-player-information>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {PlayerData} from "../types";
    import {PredefinedPlayer} from "../predefined-player";

    @Component
    export default class Admin extends Vue {
        get firstPlayer(): PlayerData {
            return this.$store.state.firstPlayer;
        }

        set firstPlayer(value: PlayerData) {
            this.updateFirstPlayer(value);
        }

        get secondPlayer(): PlayerData {
            return this.$store.state.secondPlayer;
        }

        set secondPlayer(value: PlayerData) {
            this.updateSecondPlayer(value);
        }

        updateFirstPlayer(value: PlayerData) {
            this.$store.commit("updateFirstPlayer", value);
        }

        updateSecondPlayer(value: PlayerData) {
            this.$store.commit("updateSecondPlayer", value);
        }

        get timer(): number {
            return this.$store.state.timer;
        }

        set timer(value: number) {
            this.$store.commit("updateTimer", value);
        }

        get players(): PlayerData[] {
            return PredefinedPlayer.players;
        }
    }
</script>

<style lang="less" scoped>

</style>
