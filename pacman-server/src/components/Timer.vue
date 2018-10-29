import {CombatStatus} from "../constants";
import {CombatStatus} from "../constants";
import {CombatStatus} from "../constants";
<template>
    <div class="timer">{{ timer }}</div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {CombatStatus} from "../constants";

    @Component
    export default class Timer extends Vue {
        @Prop() private value!: number;
        @Prop() private status: CombatStatus = CombatStatus.STOPPED;
        private timeLeft: number = this.value * 60;
        private intervalId!: number;

        @Watch('status')
        onStatusChanged(newValue: CombatStatus) {
            if (newValue == CombatStatus.STARTED) {
                this.start();
            } else if (newValue == CombatStatus.STOPPED) {
                this.stop();
            }
        }

        @Watch('value')
        onValueChanged(newValue: number) {
            this.timeLeft = newValue * 60;
        }

        private start() {
            this.intervalId = setInterval(() => {
                if (this.timeLeft !== 0) {
                    this.timeLeft--;
                } else {
                    clearInterval(this.intervalId);
                }
            }, 1000);
        }

        private stop() {
            clearInterval(this.intervalId);
            this.timeLeft = this.value * 60;
        }

        get timer() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            return (minutes >= 10 ? minutes : '0' + minutes) + ':' + (seconds === 0 ? "00" : (seconds >= 10) ? seconds : '0' + seconds);
        }
    }
</script>

<style lang="less" scoped>
    .timer {
        font-size: 65px;
        font-weight: bold;
    }
</style>