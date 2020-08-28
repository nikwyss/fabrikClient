<template>
<q-layout view="hHh Lpr lFf" class="rounded-borders">
  <q-header  class="text-primary shadow-1 bg-white" >

    <q-toolbar class="absolute-top-right z-top">

      <q-space />

      <!-- ACCOUNT CHIP -->
      <q-chip :icon="$root.authenticated ? 'mdi-account-circle-outline' : 'mdi-incognito'"
          @click="right = !right" text-color="primary" class="cursor-pointer" clickable>
        <span v-if="$root.authenticated">
          {{ $t('auth.registered_as', {username: $root.username}) }}
          <q-tooltip max-width="300px">{{ $t('auth.tooltip_authenticated') }} </q-tooltip>
        </span>
        <span v-if="!$root.authenticated">
          {{ $t('auth.not_registered') }}
          <q-tooltip max-width="300px">{{ $t('auth.tooltip_non_authenticated') }} </q-tooltip>
        </span>
      </q-chip>

      <LanguageSwitch />

    </q-toolbar>

    <div align="center">
      <q-img src="~assets/logo.png" style="max-width: 250px"/>
      <q-tabs>
        <q-route-tab  name="home" icon="mdi-door" to="/" :label="$t('menu.items.home.label')">
          <q-tooltip :offset="menuOffset">{{$t('menu.items.home.tooltip')}}</q-tooltip>
        </q-route-tab>
        <q-route-tab name="showcase" icon="mdi-eye-outline" to="/showcase" :label="$t('menu.items.showcase.label')">
          <q-tooltip :offset="menuOffset" max-width="300px">{{$t('menu.items.showcase.tooltip')}}</q-tooltip>
        </q-route-tab>
        <!-- :icon="$root.authenticated ? 'mdi-lock-open-variant-outline' : 'mdi-lock-outline'"  -->
        <q-route-tab name="assemblies" to="/assemblies" icon="mdi-lead-pencil" :label="$t('menu.items.assembly.label')" >
          <q-tooltip :offset="menuOffset" max-width="300px">{{$t('menu.items.assembly.tooltip')}}</q-tooltip>
        </q-route-tab>
        <q-route-tab name="background" icon="mdi-help-circle-outline" to="/background" :label="$t('menu.items.background.label')">
          <q-tooltip :offset="menuOffset" max-width="300px">{{ $t('menu.items.background.tooltip') }} </q-tooltip> 
        </q-route-tab>
    </q-tabs>
    </div>
  </q-header>

  <!-- Right Drawer -->
  <q-drawer v-model="right" side="right" behavior="mobile">
    <ComponentDrawer @close_drawer_right="close_drawer_right()" />
  </q-drawer>

  <!-- CONTENT -->
  <q-page-container>

    <!-- MAIN PAGE CONTENT -->
    <!-- <div align="center"> -->
    <router-view />
    <!-- </div> -->

    <!-- DATA LOADING GIF -->
    <q-inner-loading :showing="TextLoadingVisible"  style="z-index:100">
        <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>

    <!-- NOTIFICATION BANNER -->
    <q-inner-loading :showing="NotificationBannerVisible" style="z-index:100" class="bg-white">
      <div class="q-ma-xl" style="max-width: 400px">
        <h1><q-icon v-if="NotificationBannerIcon" :name="NotificationBannerIcon" /> {{NotificationBannerTitle}}</h1>
        <div>{{NotificationBannerBody}}</div>
        <q-chip size="md" icon="mdi-close"  outline  color="primary" text-color="primary" class="bg-white cursor-pointer q-mt-md" clickable @click="hideNotificationBanner">
          {{ $t('app.error.btn_close') }}
        </q-chip>
      </div>
    </q-inner-loading>
  </q-page-container>

  <!-- Footer -->
  <q-footer class="bg-grey-8 text-white">
  <div>{{ $t('app.name') }} {{ $t('app.version') }} </div>
  </q-footer>

</q-layout>
</template>

<script>
import ComponentDrawer from './components/ComponentDrawer.vue'
import LanguageSwitch from './components/LanguageSwitch.vue'
import { LayoutEventBus } from './components/eventbus.js'

export default {
  name: 'MainLayout',

  components: {
    ComponentDrawer,
    LanguageSwitch
  },

  data () {
    return {
      menuOffset: [0, 3],
      right: false,
      TextLoadingVisible: false,
      NotificationBannerVisible: false,
      NotificationBannerType: 'info',
      NotificationBannerTitle: '',
      NotificationBannerBody: '',
      NotificationBannerIcon: ''
    }
  },

  methods: {

    emitGlobalClickEvent() {
      EventBus.$emit('i-got-clicked', 'extra data')
    },

    showLoadingGif () {
      this.TextLoadingVisible = true
      setTimeout(() => {
        this.TextLoadingVisible = false
      }, 5000)
    },

    showNotificationBanner (type, title, body, icon, settimer=false) {
      this.NotificationBannerVisible = true
      this.NotificationBannerBody = body
      this.NotificationBannerTitle = title
      this.NotificationBannerType = type
      this.NotificationBannerIcon = icon
      this.hideLoadingGif()
      if (settimer) {
        setTimeout(() => {
          this.NotificationBannerVisible = false
        }, 3000)
      }
    },

    hideNotificationBanner () {
      this.NotificationBannerVisible = false
    },
    hideLoadingGif () {
      this.TextLoadingVisible = false
    },

    close_drawer_right: function() {
      this.right = false
    }
  },

  watch: {
    // if route changes, hide TextLoading
    $route (to, from) {
        this.hideLoadingGif()
        this.hideNotificationBanner()
    }
  },

  created () {
    // Catch globally all show and hide TextLoading events
    LayoutEventBus.$on('hideLoading', data => {
      this.hideLoadingGif()
    })
    LayoutEventBus.$on('showLoading', data => {
      this.showLoadingGif()
    })
    LayoutEventBus.$on('showAuthorizationError', data => {
      let msg_title = 'Permission denied'
      let msg_body = 'You are not allowed to perform this action. Please notify the event organizers.'
      let icon = 'mdi-alarm-light-outline'
      let type = 'error'
      this.showNotificationBanner(type, msg_title, msg_body, icon)
    })
    LayoutEventBus.$on('showServiceError', data => {
      let msg_title = this.$i18n.t('app.error.service_error_title')
      let msg_body = this.$i18n.t('app.error.service_error_body')
      let icon = 'mdi-alarm-light-outline'
      let type = 'error'
      this.showNotificationBanner(type, msg_title, msg_body, icon)
    })
    LayoutEventBus.$on('showAuthenticationWarning', data => {
      let type = 'warning'
      let icon = 'mdi-emoticon-cool-outline'
      let msg_title = this.$i18n.t('auth.authentication_warning_title')
      let msg_body = this.$i18n.t('auth.authentication_warning_body')
      this.showNotificationBanner(type, msg_title, msg_body, icon)
    })
  },

  computed: {
    is_assembly_page: function () {
      return ( this.$route.name === 'assemblies' || !!this.$route.params.assemblyIdentifier)
    }
  }
}
</script>
