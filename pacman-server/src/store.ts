import Vue from 'vue'
import Vuex from 'vuex'
import {GREEN, PURPLE, RED} from "@/defined-color";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        firstPlayer: {
            id: "1",
            token: "1",
            name: "Hieu",
            color: RED,
            score: 0,
        },
        secondPlayer: {
            id: "2",
            token: "2",
            name: "Hung",
            color: GREEN,
            score: 0,
        },
        testPlayer: {
            id: "3",
            token: "test",
            name: "Test",
            color: PURPLE,
            score: 0,
        }
    },

    mutations: {
        updateScoreFirstPlayer: (state, value) => state.firstPlayer.score = value,
        updateScoreSecondPlayer: (state, value) => state.secondPlayer.score = value,
        updateScoreTestPlayer: (state, value) => state.testPlayer.score = value,
    },
    actions: {}
})
