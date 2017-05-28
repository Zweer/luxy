import Vue from 'vue';
import VueRouter from 'vue-router';

import Showcase from '@/components/Showcase';
import Luxy from '@/components/Luxy';
import Selection from '@/components/Selection';
import Selfie from '@/components/Selfie';
import Pre1 from '@/components/Pre1';
import Pre2 from '@/components/Pre2';
import Final from '@/components/Final';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '*', redirect: '/pre-1' },
    { path: '/pre-1', name: 'pre-1', component: Pre1 },
    { path: '/pre-2', name: 'pre-2', component: Pre2 },
    { path: '/final', name: 'final', component: Final },
    { path: '/showcase', name: 'showcase', component: Showcase },
    { path: '/luxy', name: 'luxy', component: Luxy },
    { path: '/selection', name: 'selection', component: Selection },
    { path: '/selfie', name: 'selfie', component: Selfie },
  ],
});

export default router;
