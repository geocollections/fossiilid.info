import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

Vue.use(Router)
Vue.use(Meta,{ssrAttribute: 'data-vue-meta-server-rendered'})

const StaticPage = () => import('../views/StaticPage.vue')
const FrontPage = () => import('../views/FrontPage.vue')
const ItemPage = () => import('../views/ItemPage.vue')
const ProtoPage = () => import('../views/ProtoPage.vue')

export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      { path: '/:id(\\d+)',name: 'ItemPage', component: ProtoPage , meta: { isSpecies: false} },
      { path: '/proto/:id(\\d+)', name: 'Proto', component: ItemPage , meta: { isSpecies: false} },
      { path: '/page/:id', component: StaticPage },
      { path: '/', component: FrontPage },
      { path: '*', redirect: '/' }
    ]
  })
}
