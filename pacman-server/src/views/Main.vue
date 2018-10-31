<template>
    <v-app id="main" dark>
        <v-navigation-drawer v-model="drawer" clipped fixed app>
            <dd-admin></dd-admin>
        </v-navigation-drawer>
        <v-content>
            <v-btn fixed fab dark small color="primary" @click="toggleDrawer">
                <v-icon dark>settings</v-icon>
            </v-btn>
            <dd-main-board></dd-main-board>
        </v-content>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Main extends Vue {
        private drawer: boolean = false;

        toggleDrawer() {
            this.drawer = !this.drawer;
        }
    }
</script>
