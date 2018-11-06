<template>
    <v-layout grid-list-md text-xs-center row wrap>
        <v-layout justify-center>
            <v-flex xs4><v-text-field label="Token" v-model="token"></v-text-field></v-flex>
        </v-layout>
        <v-flex xs12>
            <v-btn @click="goUp">Up</v-btn>
        </v-flex>
        <v-flex xs12>
            <v-btn @click="goLeft">Left</v-btn>
            <v-btn @click="goRight">Right</v-btn>
        </v-flex>
        <v-flex xs12>
            <v-btn @click="goDown">Down</v-btn>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import http from "axios";

    @Component
    export default class GamePad extends Vue {
        @Prop() private token!: string;
        private url: string = "https://localhost:3000/move";

        goUp() {
            http.get(this.url, {
                params: {
                    action: "up",
                    token: this.token
                }
            })
        }

        goDown() {
            http.get(this.url, {
                params: {
                    action: "down",
                    token: this.token
                }
            })
        }

        goLeft() {
            http.get(this.url, {
                params: {
                    action: "left",
                    token: this.token
                }
            })
        }

        goRight() {
            http.get(this.url, {
                params: {
                    action: "right",
                    token: this.token
                }
            })
        }
    }
</script>

<style lang="less" scoped>

</style>