<template>
    <v-container>
        <v-layout text-xs-center wrap>
            <v-flex mb-4 xs12>
                <h1 class="display-2 font-weight-bold mb-3">
                    Welcome to Admin page
                </h1>
            </v-flex>

            <v-flex mb-5 xs6>
                <h2 class="headline font-weight-bold mb-3">Player 1</h2>
                <player-information :player-data=firstPlayer ></player-information>
            </v-flex>

            <v-flex mb-5 xs6>
                <h2 class="headline font-weight-bold mb-3">Player 2</h2>
                <player-information :player-data=secondPlayer></player-information>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PlayerInformation from "../components/PlayerInformation.vue";
    import {PlayerData} from "../playerStorage";

    @Component({
        components: {
            "player-information": PlayerInformation
        }
    })
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
