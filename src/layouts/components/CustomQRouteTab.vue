<template>

  <QRouteTab
    :name="name"
    :to="to"
    :alert='highlighted ? "blue" : false'
    :icon="icon"
    :disable="disable"
    :menuOffset="menuOffset"
    :label="label"
  >
    <q-tooltip
      :offset="menuOffset"
      max-width="300px"
    >
      {{!disable || !tooltipIfDisabled ? tooltip : tooltipIfDisabled}}</q-tooltip>

    <q-badge
      v-if="disable"
      color="orange"
      style="position:absolute; top:2em; right: 2em;"
    >
      <q-icon
        name="mdi-clock-time-eleven-outline"
        size="1.2em"
      />
    </q-badge>
    <!-- <q-badge v-if="highlighted" color="blue" style="position:absolute; top:2em; right: 2em;">
          <q-icon name="mdi-map-marker-outline" size="1.2em" />
      </q-badge> -->
  </QRouteTab>

</template>


<script>
/*
Extending the QRouteTab Component with intelligence to detect subpages of the assembly- or the
showcase top-menu.
*/

import { QRouteTab } from "quasar";

export default {
  name: "CustomQRouteTab",
  props: [
    "name",
    "disable",
    "menuOffset",
    "to",
    "icon",
    "label",
    "tooltip",
    "tooltipIfDisabled",
    "highlighted",
  ],
  extends: QRouteTab,

  // methods: {

  // check_for_assembly_routes: function(){
  //   const
  //     selected = false,
  //     current = this.$route,
  //     { href, location, route } = this.$router.resolve(this.to, current, this.append),
  //     params = {
  //       name: this.name,
  //       selected,
  //       exact: this.exact,
  //       priorityMatched: route.matched.length,
  //       priorityHref: href.length
  //     }

  //   if(this.isAssemblyRoute(current, route)){
  //     this.__activateRoute({...params})
  //   }
  // },

  // isAssemblyRoute: function(current, route){
  //   if('assemblyIdentifier' in current.params) {
  //     return('meta' in current && 'topmenu' in current.meta && current.meta.topmenu == route.name)
  //   }

  //   return(false)
  // }
  // },

  // mounted () {
  //   // this.$router !== void 0 && this.check_for_assembly_routes()
  // }
};
</script>
