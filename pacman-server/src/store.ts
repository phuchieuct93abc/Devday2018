import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        firstPlayer: {
            id: "1",
            token: "1",
            name: "Hieu",
            color: "#00ff18",
            score: 0,
        },
        secondPlayer: {
            id: "2",
            token: "2",
            name: "Hung",
            color: "#ff0000",
            score: 0,
        },
        testPlayer: {
            id: "3",
            token: "test",
            name: "Test",
            color: "#6f2b8f",
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
