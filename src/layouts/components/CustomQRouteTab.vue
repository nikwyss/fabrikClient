<script>
/*
Extending the QRouteTab Component with intelligence to detect subpages of the assembly- or the 
showcase top-menu.
*/

import { QRouteTab  } from 'quasar'
import { isSameRoute, isIncludedRoute } from 'quasar/src/utils/router.js'

export default {
  name: 'CustomQRouteTab',

  extends: QRouteTab,

  methods: {

    isIncludedRoute: function(a, b){

      if('assemblyIdentifier' in a.params) {
        return(a.meta.topmenu == b.name)
      }
      return(isIncludedRoute(a,b))
    },

    __checkActivation (selected = false) {
      /* This is a copy of the original function in QRouteTab.js */
      const
        current = this.$route,
        { href, location, route } = this.$router.resolve(this.to, current, this.append),
        redirected = route.redirectedFrom !== void 0,
        isSameRouteCheck = isSameRoute(current, route),
        checkFunction = this.exact === true ? isSameRoute : this.isIncludedRoute,
        params = {
          name: this.name,
          selected,
          exact: this.exact,
          priorityMatched: route.matched.length,
          priorityHref: href.length
        }
      if (isSameRouteCheck === true || (this.exact !== true && this.isIncludedRoute(current, route) === true)) {
        this.__activateRoute({
          ...params,
          redirected,
          // if it's an exact match give higher priority
          // even if the tab is not marked as exact
          exact: this.exact === true || isSameRouteCheck === true
        })
      }
      if (
        redirected === true &&
        checkFunction(current, {
          path: route.redirectedFrom,
          ...location
        }) === true
      ) {
        this.__activateRoute(params)
      }
      this.isActive === true && this.__activateRoute()
    }
  }
}
</script>
