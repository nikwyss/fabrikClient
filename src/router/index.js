import { route } from 'quasar/wrappers'
import VueRouter from 'vue-router'
// import { Store } from 'vuex'
// import { StateInterface } from '../store'
import routes from './routes'
import { LayoutEventBus } from "src/utils/eventbus"
import store from "src/store"
import { runtimeMutations } from "src/store/runtime.store";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export const Router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,

  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})



export default route(function ({ Vue }) {
  Vue.use(VueRouter)

  Router.afterEach((to, from) => {

    if (to.params?.assemblyIdentifier) {
      runtimeMutations.setAssemblyIdentifier(to.params.assemblyIdentifier)

      if (to.params?.stageID) {
        runtimeMutations.setStageID(to.params.stageID)
      }
    }

    // console.log(to, from, store, Vue)
    // store.dispatch('assemblystore/monitor_route_changes', { to, from })
  })

  /* Get Object of current route/page (including name and params) */
  Router.currentRouteObject = function () {
    return ({ name: this.currentRoute.name, params: this.currentRoute.params })
  }

  /* Reload Page, when redirecting to the same page */
  Router.pushR = function (route) {
    const target = this.resolve(route).href
    const current = this.resolve(this.currentRouteObject()).href
    if (target === current) {
      // Reload      
      // console.log("EVENT BUS!!!")
      LayoutEventBus.$emit('reload')
    } else {
      // Push
      this.push(route)
    }
  }

  /* Dont do anything when redirecting to the same page */
  Router.pushI = function (route) {
    const target = this.resolve(route).href
    const current = this.resolve(this.currentRouteObject()).href
    if (target !== current) {
      this.push(route)
    }
  }

  /* Scroll To Anchor */
  Router.anchor = function (anchor) {
    // scroll to element
    const el = document.querySelector(`a[name=${anchor}]`)
    console.log(el, "el")
    el && el.scrollIntoView()

    // account for fixed header
    const headerHeight = 200
    var scrolledY = window.scrollY;
    if (scrolledY) {
      window.scroll(0, scrolledY - headerHeight);
    }
  }

  return Router
})
