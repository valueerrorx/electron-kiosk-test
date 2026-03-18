import { createRouter as _createRouter, createWebHashHistory } from 'vue-router';
import kiosktest from '/src/pages/kiosktest.vue';

const routes = [
  { path: '/', name: 'kiosktest', component: kiosktest },
];

export function createRouter() {
  return _createRouter({ history: createWebHashHistory(), routes });
}
