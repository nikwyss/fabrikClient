<template>
<div align="center" >



  <q-tabs v-model="currenttab">
      <!-- icon="mdi-door" -->
    <CustomQRouteTab
      name="home"
      icon="mdi-calendar-text"
      exact
      :to="{ 
        name: 'assembly_home', 
        params: {
          assemblyIdentifier: this.$route.params.assemblyIdentifier
        }
      }"
    >

    {{$t('menu.items.home.label')}}

      <q-tooltip :offset="menuOffset">{{$t('menu.items.home.tooltip')}}</q-tooltip>
    </CustomQRouteTab>

    <CustomQRouteTab
      name="showcase"
      icon="mdi-eye-outline"
      to="/showcase"
      label="Wahlthemen"
    >
      <q-tooltip
        :offset="menuOffset"
        max-width="300px"
      >{{$t('menu.items.showcase.tooltip')}}</q-tooltip>
    </CustomQRouteTab>

    <CustomQRouteTab
      name="assemblies"
      :to="{name: 'assemblies_ongoing_list'}"
      icon="mdi-lead-pencil"
      label="Fragenkatalog"
    >
      <q-tooltip
        :offset="menuOffset"
        max-width="300px"
      >{{$t('menu.items.assembly.tooltip')}}</q-tooltip>
    </CustomQRouteTab>

    <CustomQRouteTab
      name="discussions"
      :to="{name: 'assemblies_ongoing_list'}"
      icon="mdi-lead-pencil"
      label="Zusammenfassung"
    >
      <q-tooltip
        :offset="menuOffset"
        max-width="300px"
      >{{$t('menu.items.assembly.tooltip')}}</q-tooltip>
    </CustomQRouteTab>


  </q-tabs>
</div>
</template>


<script>
import CustomQRouteTab from "src/layouts/components/CustomQRouteTab";

export default {
  name: "AssemblyMenu",
  // inject: ['currentAssemblyName'],
  props: ['menuOffset'],
  components: { CustomQRouteTab },
  data: function () {
    return {
      currenttab: "",
    };
  },
};
</script>
