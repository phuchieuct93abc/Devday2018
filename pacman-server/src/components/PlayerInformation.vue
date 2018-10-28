<template>
    <v-flex>
        <v-text-field dark label="Id" :value=playerData.id disabled="true"></v-text-field>
        <v-text-field dark label="Token" :value=playerData.token></v-text-field>
        <v-text-field dark label="Name" :value=playerData.name></v-text-field>
        <v-combobox dark label="Color" :items="colors" return-object="false" :value=playerData.color>
            <template slot="item" slot-scope="{ index, item, parent }">
                <v-list-tile-content>
                    <v-chip :color="item.value" label small>{{ item.text }}</v-chip>
                </v-list-tile-content>
            </template>
        </v-combobox>
        <v-text-field dark label="Score" :value=playerData.score disabled="true"></v-text-field>
    </v-flex>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {Color, PlayerData} from "../types";
    import * as DefinedColor from "../defined-color"

    @Component
    export default class PlayerInformation extends Vue {
        @Prop() playerData!: PlayerData;

        private colors: Color[];

        constructor() {
            super();
            this.colors = DefinedColor.Colors;
        }
    }
</script>

<style lang="less">

</style>
