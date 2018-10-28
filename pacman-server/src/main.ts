import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'


import MainBoard from '@/components/MainBoard.vue'
import TestBoard from '@/components/TestingBoard.vue'
import ScoreBoard from './components/ScoreBoard.vue'
import Admin from './components/Admin.vue'

Vue.config.productionTip = false;

Vue.component("dd-main-board", MainBoard);
Vue.component("dd-test-board", TestBoard);
Vue.component('dd-score-board', ScoreBoard);
Vue.component("dd-admin", Admin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
