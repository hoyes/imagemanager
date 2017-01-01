// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import Thumbnails from './components/Thumbnails'

Vue.use(VueResource);
Vue.http.options.root = '/photos';

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
