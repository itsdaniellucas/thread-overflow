import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import qs from 'qs'

import StorageService from '@/services/storageService'

Vue.config.productionTip = false

axios.interceptors.request.use((cfg) => {
  let token = StorageService.getToken();

  if(token) {
    cfg.headers['x-access-token'] = token;
  }

  cfg.paramsSerializer = params => {
    return qs.stringify(params, {
      encode: false
    });
  }

  return cfg;
}, (err) => Promise.reject(err));

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
