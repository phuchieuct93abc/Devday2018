<template>
    <v-app>
        <v-content>
            <v-container>
                <v-layout>
                    <dd-gamepad :token="tokenFirst"></dd-gamepad>
                    <dd-gamepad :token="tokenSecond"></dd-gamepad>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class ClientSimulator extends Vue {
        get tokenFirst() {
            return this.$store.state.firstPlayer.token;
        }

        get tokenSecond(): string {
            return this.$store.state.secondPlayer.token;
        }
    }
</script>

<style scoped>

</style>