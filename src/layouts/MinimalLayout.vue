<template>
  <q-layout view="hHh Lpr lFf">
    <!-- Layout does not come with error, warning, notification and loading messages -->
    <q-page-container>
      
      <!-- Login Banner -->
      <q-banner class="secondary" v-if="!$root.authenticated" 
              @click="$session.redirect_to_provider()">
      <template v-slot:avatar>
        <q-icon name="mdi-login" color="primary" />
      </template>
      You are not logged on!  Please login to participate.
      <template v-slot:action>
        <q-btn flat color="primary" label="Anmeldung" @click="$session.redirect_to_provider()" />
      </template>
    </q-banner>

    <!-- Main Conent -->
    <router-view />
    </q-page-container>

    <!-- Footer -->
    <q-footer class="bg-grey-8 text-white">
    <div>Demokratiefabrik v1.0</div>
    </q-footer>

  </q-layout>
</template>

<script>
import ComponentDrawer from './components/ComponentDrawer.vue'

export default {
  name: 'MainLayout',

  components: {
    ComponentDrawer
  },

  data () {
    return {
      right: false
    }
  },

  methods: {
    close_drawer_right: function(){
      console.log("KKK")
      this.right = false;
    }
  }
}
</script>
