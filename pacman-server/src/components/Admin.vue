<template>
    <v-container>
        <v-layout text-xs-center wrap>
            <v-flex xs12>
                <h2 class="headline font-weight-bold">Player 1</h2>
                <dd-player-information :player-data=firstPlayer></dd-player-information>
            </v-flex>

            <v-flex xs12>
                <h2 class="headline font-weight-bold">Player 2</h2>
                <dd-player-information :player-data=secondPlayer></dd-player-information>
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
    }
</script>

<style lang="less" scoped>

</style>
