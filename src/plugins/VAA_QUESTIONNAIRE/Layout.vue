<template>
  <q-page class="doc_content side_menu">
    <router-view></router-view>
  </q-page>
</template>

<script>
// import { LayoutEventBus } from "src/utils/eventbus";
export default {
  name: "VAALayout",

  // created() {
  //   const CustomMenuComponentLoader = () => import(`./Menu.vue`);
  //   // this.$root.CustomMenuComponentLoader = CustomMenuComponent;
  //   // this.$root.hasCustomMenu = true;
  //   LayoutEventBus.$emit("LoadCustomMenu", CustomMenuComponentLoader);
  // },
};
</script>