import Vue from 'vue';
import VueRouter from 'vue-router';

import Showcase from '@/components/Showcase';
import Luxy from '@/components/Luxy';
import Selection from '@/components/Selection';
import Selfie from '@/components/Selfie';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', name: 'showcase', component: Showcase },
    { path: '/luxy', name: 'luxy', component: Luxy },
    { path: '/selection', name: 'selection', component: Selection },
    { path: '/selfie', name: 'selfie', component: Selfie },
  ],
});
