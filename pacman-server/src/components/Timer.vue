<template>
    <div>
        <div>
            <div>
                <span class="timer">{{ timer }}</span>
            </div>
            <div>
                <v-btn @click="start">Start</v-btn>
                <v-btn @click="stop">Stop</v-btn>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";

    @Component
    export default class Timer extends Vue {
        @Prop() private value!: number;
        private timeLeft: number = this.value * 60;
        private intervalId!: number;

        start() {
            this.intervalId = setInterval(() => {
                if (this.timeLeft !== 0) {
                    this.timeLeft--;
                } else {
                    clearInterval(this.intervalId);
                }
            }, 1000);
        }

        stop() {
            clearInterval(this.intervalId);
            this.timeLeft = this.value * 60;
        }

        get timer() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            return minutes+ ':' + (seconds === 0 ? "00" : seconds);
        }
    }
</script>

<style lang="less" scoped>
    .timer {
        font-size: 65px;
        font-weight: bold;
    }
</style>