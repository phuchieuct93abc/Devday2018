import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        firstPlayer: {
            token: "1",
            name: "Hung",
            color: "#00ff18",
            score: 10,
        },
        secondPlayer: {
            token: "2",
            name: "Hieu",
            color: "#ff0000",
            score: 20,
        }
    },

    mutations: {
        updateScoreFirstPlayer: (state, value) => state.firstPlayer.score = value,
        updateScoreSecondPlayer: (state, value) => state.secondPlayer.score = value,
    },
    actions: {}
})
