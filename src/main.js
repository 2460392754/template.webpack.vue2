import Vue from 'vue';
import App from './App.vue';
import VueRouter from '@/plugins/router.js';
import './assets/styles/global.css';

new Vue({
    router: VueRouter,
    render: (h) => h(App)
}).$mount('#app');
