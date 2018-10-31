<template>
    <div class="score-board">
        <div class="score-container">
            <div class="score">{{ score }}</div>
        </div>
        <p class="team-name">{{ teamName }}</p>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class ScoreBoard extends Vue {
        @Prop({default: 0}) private score!: number;
        @Prop() private teamName!: String;
    }
</script>


<style lang="less" scoped>
    @axon-blue: #0096d7ff;

    .score-board {
        border: @axon-blue 2px dashed;
    }

    .score-container {
        height: 75%;
        display: flex;
        align-items: center;
        justify-content: center;

        .score {
            font-size: 65px;
        }
    }

    .team-name {
        height: 25%;
        text-align: center;
        font-size: large;
    }
</style>
