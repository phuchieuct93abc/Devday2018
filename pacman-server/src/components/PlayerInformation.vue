<template>
    <div>
        <v-text-field dark label="Name" :value="value.name" @input="updateName"></v-text-field>
        <v-combobox dark label="Color" :items="colors" :value="value.color" @input="updateColor">
            <template slot="item" slot-scope="{ index, item, parent }">
                <v-list-tile-content>
                    <v-chip :color="item.value" label small>{{ item.text }}</v-chip>
                </v-list-tile-content>
            </template>
        </v-combobox>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import {Color, PlayerData} from "../types";
    import * as DefinedColor from "../defined-color"

    @Component
    export default class PlayerInformation extends Vue {
        @Prop() value!: PlayerData;

        private colors: Color[];

        constructor() {
            super();
            this.colors = DefinedColor.Colors;
        }

        updateName(value: string) {
            this.value.name = value;
            this.updateModel();
        }

        updateColor(value: Color) {
            this.value.color = value;
            this.updateModel();
        }

        private updateModel() {
            this.$emit("input", this.value);
        }
    }
</script>

<style lang="less">

</style>
