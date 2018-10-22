import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

import ScoreBoard from './components/ScoreBoard.vue'

Vue.config.productionTip = false;

Vue.component('score-board', ScoreBoard);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
