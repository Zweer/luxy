import Vue from 'vue';
import VueRouter from 'vue-router';

import Showcase from '@/components/Showcase';

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    { path: '/', name: 'showcase', component: Showcase },
  ],
});
