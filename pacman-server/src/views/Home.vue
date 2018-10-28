<template>
    <v-app id="home" dark>
        <v-content>
            <dd-test-board></dd-test-board>
        </v-content>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class Home extends Vue {
    }
</script>
