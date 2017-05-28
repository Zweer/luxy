import Vue from 'vue';
import VueRouter from 'vue-router';

import Showcase from '@/components/Showcase';
import Luxy from '@/components/Luxy';
import Selection from '@/components/Selection';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', name: 'showcase', component: Showcase },
    { path: '/luxy', name: 'luxy', component: Luxy },
    { path: '/selection', name: 'selection', component: Selection },
  ],
});
