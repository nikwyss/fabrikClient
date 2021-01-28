<template>
<div align="center" >



  <q-tabs v-model="currenttab">
    <CustomQRouteTab
      name="home"
      icon="mdi-calendar-text"
      exact
      :to="{ 
        name: 'assembly_home', 
        params: {assemblyIdentifier: this.$route.params.assemblyIdentifier}
      }"
      :label="$t('menu.items.home.label')"
      :menuOffset="menuOffset"
      :tooltip="$t('menu.items.home.tooltip')"
      :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      :disable="false"
    />

    <CustomQRouteTab
      name="showcase"
      icon="mdi-eye-outline"
      to="/showcase"
      label="Wahlthemen"
      :menuOffset="menuOffset"
      :tooltip="$t('menu.items.assembly.tooltip')"
      :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      :disable="true"
    />

    <CustomQRouteTab
      name="assemblies"
      :to="{name: 'assemblies_ongoing_list'}"
      icon="mdi-lead-pencil"
      label="Fragenkatalog"
      :menuOffset="menuOffset"
      :tooltip="$t('menu.items.assembly.tooltip')"
      :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      :disable="true"
    />

    <CustomQRouteTab
      name="discussions"
      :to="{name: 'assemblies_ongoing_list'}"
      icon="mdi-lead-pencil"
      label="Analyse"
      :menuOffset="menuOffset"
      :tooltip="$t('menu.items.assembly.tooltip')"
      :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      :disable="true"
    />


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
