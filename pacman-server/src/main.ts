import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'


import MainBoard from '@/components/MainBoard.vue'
import TestBoard from '@/components/TestingBoard.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import PlayerInformation from "@/components/PlayerInformation.vue";
import Admin from '@/components/Admin.vue'
import Timer from '@/components/Timer.vue'
import GamePad from "@/components/GamePad.vue";

Vue.config.productionTip = false;

Vue.component("dd-main-board", MainBoard);
Vue.component("dd-test-board", TestBoard);
Vue.component('dd-score-board', ScoreBoard);
Vue.component("dd-admin", Admin);
Vue.component("dd-player-information", PlayerInformation);
Vue.component("dd-timer", Timer);
Vue.component("dd-gamepad", GamePad);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
