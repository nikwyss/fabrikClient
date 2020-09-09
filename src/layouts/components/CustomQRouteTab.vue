<script>
/*
Extending the QRouteTab Component with intelligence to detect subpages of the assembly- or the
showcase top-menu.
*/

import { QRouteTab  } from 'quasar'

export default {
  name: 'CustomQRouteTab',

  extends: QRouteTab,

  watch: {

    $route () {
      this.check_for_assembly_routes()
    }
  },

  methods: {

    check_for_assembly_routes: function(){
      const
        selected = false,
        current = this.$route,
        { href, location, route } = this.$router.resolve(this.to, current, this.append),
        params = {
          name: this.name,
          selected,
          exact: this.exact,
          priorityMatched: route.matched.length,
          priorityHref: href.length
        }

      if(this.isAssemblyRoute(current, route)){
        this.__activateRoute({...params})
      }
    },

    isAssemblyRoute: function(current, route){
      if('assemblyIdentifier' in current.params) {
        return('meta' in current && 'topmenu' in current.meta && current.meta.topmenu == route.name)
      }

      return(false)
    }
  },

  mounted () {
    this.$router !== void 0 && this.check_for_assembly_routes()
  }
}
</script>
