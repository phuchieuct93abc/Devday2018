import Vue from 'vue'
import Vuex from 'vuex'
import {PLAYER_ONE, PLAYER_TWO, TEST_PLAYER} from "@/predefined-player";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        firstPlayer: Object.assign({}, PLAYER_ONE),
        secondPlayer: Object.assign({}, PLAYER_TWO),
        testPlayer: Object.assign({}, TEST_PLAYER),
    },

    mutations: {
        updateFirstPlayer: (state, value) => state.firstPlayer = value,
        updateSecondPlayer: (state, value) => state.secondPlayer = value,
        updateScoreFirstPlayer: (state, value) => state.firstPlayer.score = value,
        updateScoreSecondPlayer: (state, value) => state.secondPlayer.score = value,
        updateScoreTestPlayer: (state, value) => state.testPlayer.score = value,
    },
    actions: {}
})
