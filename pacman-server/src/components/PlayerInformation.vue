<template>
    <v-container>
        <v-layout>
            <v-flex>
                <v-text-field dark label="Id" :value=playerData.id disabled="true"></v-text-field>
                <v-text-field dark label="Token" :value=playerData.token></v-text-field>
                <v-text-field dark label="Name" :value=playerData.name></v-text-field>
                <v-combobox dark label="Color" :value=playerData.color></v-combobox>
                <v-text-field dark label="Score" :value=playerData.score disabled="true"></v-text-field>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {PlayerData} from "../playerStorage";

    @Component
    export default class PlayerInformation extends Vue {
        @Prop() playerData!: PlayerData;


    }
</script>

<style lang="less">

</style>
