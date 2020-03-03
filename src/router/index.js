import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/a'
        },
        {
            path: '/a',
            component: () => import('../views/A.vue')
        },
        {
            path: '/b',
            component: () => import('../views/B.vue')
        }
    ]
});
