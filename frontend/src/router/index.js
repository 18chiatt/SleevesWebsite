import Vue from 'vue'
import VueRouter from 'vue-router'
import Browse from "./../components/Browse.vue"
import Suggest from "@/components/Suggest.vue"



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
  }


]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router