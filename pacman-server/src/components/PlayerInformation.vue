<template>
    <v-container>
        <v-layout>
            <v-flex>
                <v-text-field label="Id"></v-text-field>
                <v-text-field label="Token"></v-text-field>
                <v-text-field label="Name"></v-text-field>
                <v-combobox label="Color"></v-combobox>
                <v-text-field label="Score"></v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";

    @Component
    export default class PlayerInformation extends Vue {

    }
</script>

<style lang="less">

</style>
