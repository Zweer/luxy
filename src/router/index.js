import Vue from 'vue';
import VueRouter from 'vue-router';

import Showcase from '@/components/Showcase';
import Luxy from '@/components/Luxy';
import Selection from '@/components/Selection';
import Selfie from '@/components/Selfie';
import Pre0 from '@/components/Pre0';
import Pre1 from '@/components/Pre1';
import Pre2 from '@/components/Pre2';
import Aft1 from '@/components/Aft1';
import Aft2 from '@/components/Aft2';
import Final from '@/components/Final';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '*', redirect: '/pre-0' },
    { path: '/pre-0', name: 'pre-0', component: Pre0 },
    { path: '/pre-1', name: 'pre-1', component: Pre1 },
    { path: '/pre-2', name: 'pre-2', component: Pre2 },
    { path: '/final', name: 'final', component: Final },
    { path: '/showcase', name: 'showcase', component: Showcase },
    { path: '/luxy', name: 'luxy', component: Luxy },
    { path: '/selection', name: 'selection', component: Selection },
    { path: '/selfie', name: 'selfie', component: Selfie },
    { path: '/aft-1', name: 'aft-1', component: Aft1 },
    { path: '/aft-2', name: 'aft-2', component: Aft2 },
  ],
});

export default router;
