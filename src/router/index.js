import Vue from 'vue';
import VueRouter from 'vue-router';

import Showcase from '@/components/Showcase';
import Luxy from '@/components/Luxy';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', name: 'showcase', component: Showcase },
    { path: '/luxy', name: 'luxy', component: Luxy },
  ],
});
