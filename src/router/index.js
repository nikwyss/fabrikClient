import { route } from 'quasar/wrappers'
import VueRouter from 'vue-router'
// import { Store } from 'vuex'
// import { StateInterface } from '../store'
import routes from './routes'
import { LayoutEventBus } from "src/utils/eventbus"

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default route(function ({ Vue }) {
  Vue.use(VueRouter)

  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })



  /* Get Object of current route/page (including name and params) */
  Router.currentRouteObject = function () {
    return ({ name: this.currentRoute.name, params: this.currentRoute.params })
  }

  Router.pushR = function (route) {
    const target = this.resolve(route).href
    const current = this.resolve(this.currentRouteObject()).href
    if (target === current) {
      // Reload      
      console.log("EVENT BUS!!!")
      LayoutEventBus.$emit('reload')
    } else {
      // Push
      this.push(route)
    }
  }


  // /* Push or Reload */
  // Router.reload = function () {
  //     this.isRouterAlive = false
  //     setTimeout(() => {
  //       this.isRouterAlive = true
  //     }, 0)

  //   return ({ name: this.currentRoute.name, params: this.currentRoute.params })
  // }


  // 2
  // It's my reload. Because of some browser very weird. location.reload can't reload.
  //   methods: {
  //   reload: function() {
  //   }
  // }

  // <router-view v-if="isRouterAlive" />



  return Router
})
