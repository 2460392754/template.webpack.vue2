import Vue from 'vue';
import App from './App.vue';
import VueRouter from '@/plugins/router.js';
import Store from '@/plugins/store';
import '@/assets/styles/global.scss';

new Vue({
    router: VueRouter,
    store: Store,
    render: (h) => h(App)
}).$mount('#app');
