import Vue from 'vue'
import Vuex from 'vuex'
import {DEFAULT_LAYER} from "@/predefined-player";
import {CombatStatus} from "@/constants";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        firstPlayer: Object.assign({}, DEFAULT_LAYER),
        secondPlayer: Object.assign({}, DEFAULT_LAYER),
        testPlayer: Object.assign({}, DEFAULT_LAYER),
        timer: 3,
        combatStatus: CombatStatus.STOPPED,
    },

    mutations: {
        updateFirstPlayer: (state, value) => state.firstPlayer = value,
        updateSecondPlayer: (state, value) => state.secondPlayer = value,
        updateScoreFirstPlayer: (state, value) => state.firstPlayer.score = value,
        updateScoreSecondPlayer: (state, value) => state.secondPlayer.score = value,
        updateScoreTestPlayer: (state, value) => state.testPlayer.score = value,
        updateTimer: (state, value) => state.timer = value,
        updateCombatStatus: (state, value) => state.combatStatus = value,
    },
    actions: {}
})
