import Vue from 'vue'
import VueRouter from 'vue-router'
import Browse from "./../components/Browse.vue"
import Suggest from "./../components/Suggest.vue"
import Moderate from "./../components/Moderate.vue"
import About from "./../components/About.vue"



Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Browse',
    component: Browse
  },
  {
    path: "/Suggest",
    name: "Suggest",
    component: Suggest,
  },
  {
    path: "/Moderate",
    name: "Moderate",
    component: Moderate
  },
  {
    path: "/About",
    name: "About",
    component: About
  }


]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router