<template>
    <v-app id="app" dark>
        <v-navigation-drawer v-model="drawer" clipped fixed app>
            <dd-admin></dd-admin>
        </v-navigation-drawer>
        <v-content>
            <v-btn fab dark small color="primary" @click="toggleDrawer">
                <v-icon dark>settings</v-icon>
            </v-btn>
            <router-view/>
        </v-content>
    </v-app>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class App extends Vue {
        private drawer: boolean = true;

        toggleDrawer() {
            this.drawer = !this.drawer;
        }
    }
</script>

<style lang="less">
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font: 13px Helvetica, Arial;
        background-color: #323232;
        color: white;
    }

    form {
        background: #000;
        padding: 3px;
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    form input {
        border: 0;
        padding: 10px;
        width: 90%;
        margin-right: .5%;
    }

    form button {
        width: 9%;
        background: rgb(130, 224, 255);
        border: none;
        padding: 10px;
    }

    #messages {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    #messages li {
        padding: 5px 10px;
    }

    #messages li:nth-child(odd) {
        background: #eee;
    }
</style>
