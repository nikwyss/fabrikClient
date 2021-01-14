
<style scoped>
.transitionlogo-enter,
.transitionlogo-leave-to {
  height: 40px;
  opacity: 0;
}

.transitionlogo-leave,
.transitionlogo-enter-to {
  height: 120px;
  opacity: 100;
}

.transitionlogo-enter-active,
.transitionlogo-leave-active {
  transition: all 0.5s;
}

</style>
<template>
<q-layout view="hHh Lpr lFf" class="rounded-borders">
  <q-header  class="text-primary shadow-1 bg-white" >
    <div class="fixed-top-right z-top" align="right" style="width:320px">
    <q-toolbar style="width:320px">
      <!-- ACCOUNT CHIP -->

 <!-- <q-btn color="primary" label="Basic Menu">
        
      </q-btn> -->


      <q-chip :icon="oauth.authorized ? 'mdi-account-circle-outline' : 'mdi-incognito'"
          text-color="primary" class="cursor-pointer" clickable>
        <span v-if="oauth.authorized">
          {{ $t('auth.registered_as', {username: oauth.username}) }}
          <!-- <q-tooltip max-width="300px">{{ $t('auth.tooltip_authenticated') }} </q-tooltip> -->
        </span>
        <span v-if="!oauth.authorized">
          {{ $t('auth.not_registered') }}
          <!-- <q-tooltip max-width="300px">{{ $t('auth.tooltip_non_authenticated') }} </q-tooltip> -->
        </span>

        <q-menu fit>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="gotoProfile()" v-if="oauth.authorized">
              <q-item-section>Profil</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-close-popup @click="clickAuthLink()" v-if="!oauth.authorized">
              <q-item-section>Login</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="oauth.logout()" v-if="oauth.authorized">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-chip>

      <!-- DISABLED: at the moment. only de_CH -->
      <!-- <LanguageSwitch /> -->

    </q-toolbar>
  </div>

  <div align="center" style="min-height:40px">

      <transition name="transitionlogo">

      <q-img 
      v-if="expanded_logo"
      :ratio="1"
      style="max-width: 241px; max-height:120px;"
      src="~assets/logoweb.png"
      />

      </transition>

</div>

    <div align="center">

      <q-tabs v-model="currenttab">
        <CustomQRouteTab  name="home" icon="mdi-door" exact to="/" :label="$t('menu.items.home.label')">
          <q-tooltip :offset="menuOffset">{{$t('menu.items.home.tooltip')}}</q-tooltip>
        </CustomQRouteTab>
        <!-- <CustomQRouteTab name="showcase" icon="mdi-eye-outline" to="/showcase" :label="$t('menu.items.showcase.label')">
          <q-tooltip :offset="menuOffset" max-width="300px">{{$t('menu.items.showcase.tooltip')}}</q-tooltip>
        </CustomQRouteTab> -->
        <CustomQRouteTab name="assemblies" :to="{name: 'assemblies_ongoing_list'}" icon="mdi-lead-pencil" :label="$t('menu.items.assembly.label')" >
          <q-tooltip :offset="menuOffset" max-width="300px">{{$t('menu.items.assembly.tooltip')}}</q-tooltip>
        </CustomQRouteTab>
        <CustomQRouteTab name="background" icon="mdi-help-circle-outline" to="/background" :label="$t('menu.items.background.label')">
          <q-tooltip :offset="menuOffset" max-width="300px">{{ $t('menu.items.background.tooltip') }} </q-tooltip> 
        </CustomQRouteTab>
    </q-tabs>
    </div>
  </q-header>

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
    <q-inner-loading :showing="NotificationBannerVisible" style="z-index:100; justify-content:flex-start; padding-top: 100px;" class="bg-white">
      <div class="q-ma-xl" style="max-width: 400px">
        <h1><q-icon v-if="NotificationBannerIcon" :name="NotificationBannerIcon" /> {{NotificationBannerTitle}}</h1>
        <div>{{NotificationBannerBody}}</div>

        <q-chip v-if="NotificationBannerButtons.includes('hide')" size="md" icon="mdi-close"  outline  color="primary" text-color="primary" class="bg-white cursor-pointer q-mt-md" clickable @click="hideNotificationBanner">
          {{ $t('app.btn_close') }}
        </q-chip>
        <q-chip v-if="NotificationBannerButtons.includes('home')" size="md" icon="mdi-home"  outline  color="primary" text-color="primary" class="bg-white cursor-pointer q-mt-md" clickable @click="gotoHome">
          {{ $t('app.btn_home') }}
        </q-chip>
        <q-chip v-if="NotificationBannerButtons.includes('auth')" size="md" icon="mdi-forward"  outline  
            color="primary" text-color="primary" class="bg-white cursor-pointer q-mt-md" clickable 
            @click="clickAuthLink">
          {{ $t('auth.goto_authentication_form') }}
        </q-chip>
        <q-chip v-if="NotificationBannerButtons.includes('profile')" size="md" icon="mdi-account"  outline  
            color="primary" text-color="primary" class="bg-white cursor-pointer q-mt-md" clickable 
            @click="hideNotificationBanner">
          {{ $t('auth.goto_profile_page') }}
        </q-chip>
        <q-chip v-if="NotificationBannerButtons.includes('redirect')" size="md" icon="mdi-forward"  outline  
            color="primary" text-color="primary" class="bg-white cursor-pointer q-mt-md" clickable 
            @click="$router.push(NotificationBannerRedirectRoute)">
          {{ $t('app.btn_next') }}
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
// import ComponentDrawer from './components/ComponentDrawer.vue'
// import LanguageSwitch from './components/LanguageSwitch.vue'
// import PopupProfile from './components/PopupProfile.vue'
import CustomQRouteTab from './components/CustomQRouteTab.vue'
import { LayoutEventBus } from 'src/utils/eventbus.js'

export default {
  name: 'MainLayout',

  components: {
    // ComponentDrawer,
    // LanguageSwitch,
    CustomQRouteTab
    // PopupProfile
  },

  data () {
    return {
      currenttab: 'assemblies',
      menuOffset: [0, 3],
      TextLoadingVisible: false,
      NotificationBannerVisible: false,
      NotificationBannerType: 'info',
      NotificationBannerTitle: '',
      NotificationBannerRedirectRoute: {},
      NotificationBannerBody: '',
      NotificationBannerIcon: '',
      NotificationBannerButtons: []
    }
  },

  methods: {

    gotoProfile(destination_route) {
      if (!destination_route) {
        destination_route = this.oauth.currentRouteObject(this.$router)
      }
      this.$router.push({name: 'profile', params: {destination_route: destination_route}})
    },

    clickAuthLink: function () {
        const destination_route = {name: 'assemblies_ongoing_list'}
        this.oauth.login(destination_route)
    },

    emitGlobalClickEvent() {
      EventBus.$emit('i-got-clicked', 'extra data')
    },

    showLoadingGif () {
      this.TextLoadingVisible = true
      setTimeout(() => {
        this.TextLoadingVisible = false
      }, 5000)
    },

    showNotificationBanner (type, title, body, icon, settimer=false, buttons=['hide'], redirectRoute=null) {
      this.NotificationBannerVisible = true
      this.NotificationBannerBody = body
      this.NotificationBannerTitle = title
      this.NotificationBannerType = type
      this.NotificationBannerIcon = icon
      this.NotificationBannerButtons = buttons
      this.NotificationBannerRedirectRoute = redirectRoute
      if (!this.NotificationBannerRedirectRoute) {
        this.NotificationBannerRedirectRoute = {name: 'home'}
      }
                console.log(redirectRoute)
                console.log("redirectRoute")

      this.hideLoadingGif()
      if (settimer) {
        setTimeout(() => {
          this.NotificationBannerVisible = false
        }, 3000)
      }

      // scroll to top
      window.scrollTo(0, 0)
    },

    hideNotificationBanner () {
      this.NotificationBannerVisible = false
    },
    hideLoadingGif () {
      this.TextLoadingVisible = false
    },
    gotoHome () {
      this.$router.push({name: 'home'})
    }
  },

  /**
   * Ensure that all (error) messages disappear, when route changes...
   **/ 
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

    LayoutEventBus.$on('showServiceError', data => {
      let msg_title = this.$i18n.t('app.error.service_error_title')
      let msg_body = this.$i18n.t('app.error.service_error_body')
      let icon = 'mdi-alarm-light-outline'
      let type = 'error'
      this.showNotificationBanner(type, msg_title, msg_body, icon)

    })
    LayoutEventBus.$on('showNetworkError', data => {
      let msg_title = this.$i18n.t('app.error.network_error_title')
      let msg_body = this.$i18n.t('app.error.network_error_body')
      let icon = 'mdi-alarm-light-outline'
      let type = 'error'
      this.showNotificationBanner(type, msg_title, msg_body, icon)
    })
    LayoutEventBus.$on('showAuthorizationError', data => {
      let msg_title = this.$i18n.t('app.error.authorization_error_title')
      let msg_body = this.$i18n.t('app.error.authorization_error_body')
      let icon = 'mdi-key-outline'
      let type = 'error'
      this.showNotificationBanner(type, msg_title, msg_body, icon)
    })    
    LayoutEventBus.$on('showAuthenticationWarning', data => {
      let type = 'warning'
      let icon = 'mdi-emoticon-cool-outline'
      let msg_title = this.$i18n.t('auth.authentication_warning_title')
      let msg_body = this.$i18n.t('auth.authentication_warning_body')
      this.showNotificationBanner(type, msg_title, msg_body, icon, false, ['auth', 'home'])
    })
    LayoutEventBus.$on('showAuthenticationError', data => {
      let type = 'error'
      let icon = 'mdi-alarm-light-outline'
      let msg_title = this.$i18n.t('auth.authentication_error_title')
      let msg_body = this.$i18n.t('auth.authentication_error_body')
      this.showNotificationBanner(type, msg_title, msg_body, icon)
    })

    LayoutEventBus.$on('AfterProfileUpdate', data => {
      const type = 'info'
      const icon = 'mdi-account'
      const msg_title = 'Benutzerprofil gespeichert' // this.$i18n.t('auth.authentication_error_title')
      const msg_body = `Das Benutzerprofil wurde erfolgreich gespeichert. Überprüfen Sie bitte ein letztes Mal ob die folgende Kontaktangabe korrekt ist: ${data.userEmail}`
      const buttons = ['redirect','profile']
      this.showNotificationBanner(type, msg_title, msg_body, icon, false, buttons, data.destination_route)
    })

    LayoutEventBus.$on('AfterLogout', data => {
      this.$router.push({name: 'logout'})
    })

    LayoutEventBus.$on('AfterLogin', destination_route => {

      // is email already set: if not => redirect to userprofile...
      if (this.oauth.payload.userEmail) {
        // ok, already set (not the first login)
        if(destination_route) {
          this.$router.push(destination_route)
        }
      }else{
        // console.log(this.oauth.payload)
        this.gotoProfile(destination_route)
      }
    })

    LayoutEventBus.$on('hideNotificationBanners', data => {
      this.hideNotificationBanner()
    })
  },

  computed: {

    expanded_logo: function () {
      return (this.$route.name == 'home')
    },

    is_assembly_page: function () {
      return ( this.$route.name === 'assemblies' || !!this.$route.params.assemblyIdentifier)
    }
  },


//   mounted: function() {
// console.log(this.$router.currentRoute)

//   }
}
</script>
