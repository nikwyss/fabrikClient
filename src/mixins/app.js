import { mapGetters, mapActions } from 'vuex'
import { LayoutEventBus } from "src/utils/eventbus"
import constants from 'src/utils/constants'
import { runtimeStore, runtimeMutations } from "src/store/runtime.store"
// import store from 'src/store'


export default {

  provide() {
    return {
      clickAssemblyLink: this.clickAssemblyLink,
    }
  },

  data() {
    return {
      appInitialized: false,
      componentKey: 0,
      username_derivate: '',
    };
  },

  computed: {

    appExitState: function () {
      return runtimeStore.appExitState
    },

    ...mapGetters(
      'publicindexstore',
      ['published_assemblies', 'ongoing_assemblies']
    ),

  },

  methods: {

    clickAssemblyLink: function (assembly) {
      console.assert(assembly)
      var route = { name: 'assembly_home', params: { assemblyIdentifier: assembly.identifier } }
      this.$router.push(route)
    },

    onPageLeave: function handler(event) {
      // ON PAGE LEAVE
      console.log("Shutdown Demokratiefabrik")
      runtimeMutations.exitApp()
      this.$root.monitorLog(constants.MONITOR_EXIT)
      this.$store.dispatch("tokenRefreshEnds")
    },

    ...mapActions({
      touchRandomSeed: "assemblystore/touchRandomSeed",
      storeOauthAcls: "publicprofilestore/storeOauthAcls",
    })
  },

  created: function () {

    // not token refresh is ongoing!!!
    this.$store.dispatch("tokenRefreshEnds")

    // GlOBAL Page Unmount Listener
    window.addEventListener('beforeunload', this.onPageLeave)

    // Catch globally all show and hide TextLoading events
    LayoutEventBus.$on("reload", () => {
      this.$root.reload();
    });
    LayoutEventBus.$on("hideLoading", (data) => {
      this.$refs?.maincontent?.hideLoadingGif();
    });
    LayoutEventBus.$on("showLoading", (data) => {
      this.$refs?.maincontent?.showLoadingGif();
    });
    LayoutEventBus.$on("showServiceError", (data) => {
      let msg_title = this.$i18n.t("app.error.service_error_title");
      let msg_body = this.$i18n.t("app.error.service_error_body");
      let icon = "mdi-alarm-light-outline";
      let settimer = data?.settimer ? data.settimer : false;
      let buttons = data?.nobuttons ? [] : ["hide"];

      let type = "error";
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        settimer,
        buttons
      )
    })
    LayoutEventBus.$once("showNetworkError", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_NETWORK, data)
    })

    LayoutEventBus.$on("showNetworkError", (data) => {
      let msg_title = this.$i18n.t("app.error.network_error_title");
      let msg_body = this.$i18n.t("app.error.network_error_body");
      let icon = "mdi-alarm-light-outline";
      let type = "error";
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
      )
    })

    LayoutEventBus.$on("showAuthorizationError", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_AUTHORIZATION, data)
      let msg_title = this.$i18n.t("app.error.authorization_error_title");
      let msg_body = this.$i18n.t("app.error.authorization_error_body");
      let icon = "mdi-key-outline";
      let type = "error";
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
      );
    });


    LayoutEventBus.$on("showAuthorizationInvalidToken", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_INVALID_TOKEN, data)
      let msg_title = this.$i18n.t("auth.authentication_invalid_warning_title");
      let msg_body = this.$i18n.t("auth.authentication_invalid_warning_body");
      let icon = "mdi-key-outline";
      let type = "error";
      let settimer = data?.settimer ? data.settimer : false;
      let buttons = ['auth'];

      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        settimer,
        buttons
      )
    })

    LayoutEventBus.$on("showTooManyRequestsError", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_TOO_MANY_REQUESTS, data)
      let msg_title = this.$i18n.t("app.error.toomanyrequests_error_title");
      let msg_body = this.$i18n.t("app.error.toomanyrequests_error_body");
      let icon = "mdi-car-multiple";
      let type = "error";
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
      );
    });
    LayoutEventBus.$on("showAuthenticationWarning", (data) => {
      this.$root.monitorLog(constants.MONITOR_WARNING_AUTHENTICATION, data)
      let type = "warning";
      let icon = "mdi-emoticon-cool-outline";
      let msg_title = this.$i18n.t("auth.authentication_warning_title");
      let msg_body = this.$i18n.t("auth.authentication_warning_body");
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        false,
        ["auth", "home"]
      );
    });

    LayoutEventBus.$on("showAuthenticationError", (data) => {
      this.$root.monitorLog(constants.MONITOR_ERROR_AUTHENTICATION, data)
      let type = "error";
      let icon = "mdi-alarm-light-outline";
      let msg_title = this.$i18n.t("auth.authentication_error_title");
      let msg_body = this.$i18n.t("auth.authentication_error_body");
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
      )
    })

    LayoutEventBus.$on('AfterTokenChanged', () => {
      // NOTIFY EVERYONE, THAT TOKEN HAS CHANGED NOW!
      this.storeOauthAcls({ oauthAcls: this.oauth?.payload?.roles })
    })

    LayoutEventBus.$on("AfterProfileUpdate", (data) => {
      this.$root.monitorLog(constants.MONITOR_ACCOUNT_PROFILE_UPDATE, data)
      const type = "info";
      const icon = "mdi-account";
      const msg_title = "Benutzerprofil gespeichert"; // this.$i18n.t('auth.authentication_error_title')
      const msg_body = `Das Benutzerprofil wurde erfolgreich gespeichert. Überprüfen Sie bitte ein letztes Mal ob die folgende Kontaktangabe korrekt ist: ${data.userEmail}`;
      const buttons = ["redirect", "profile"];
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon,
        false,
        buttons,
        data.destination_route
      );
    });

    LayoutEventBus.$on("AfterLogout", (data) => {
      this.$router.push({ name: "logout" })
      this.$store.dispatch("monitorReset")
    });

    LayoutEventBus.$on('AfterLogin', data => {

      // reset monitor routine (and push first action)
      this.$store.dispatch('monitorSetup',)
      this.$root.monitorLog(constants.MONITOR_LOGIN)

      // CHECK FOR REDIRECTION URL in local storage (During Login)
      const destination_route = JSON.parse(localStorage.getItem('oauth2authcodepkce-destination'));
      if (destination_route) {
        localStorage.removeItem('oauth2authcodepkce-destination');
        this.$router.push(destination_route);
      } else {
        this.$router.push({ name: 'home' });
      }

      // Clear data of last session...
      this.$root.clearSession()

      // TODO: Reset VUEX STORE!! remove all data of different users

    })

    LayoutEventBus.$on("PublicProfileLoaded", () => {

      // SYNC USER PROFILE
      console.log("on PublicProfileLoaded")
      // is email already set: if not => redirect to userprofile...
      this.$store.dispatch("publicprofilestore/setUsernameDerivate", {
        usernameDerivate: this.usernameDerivate()
      })
    })

    LayoutEventBus.$on("hideNotificationBanners", (data) => {
      this.$refs?.maincontent?.hideNotificationBanner();
    })
    // TODO: are these event catch multiple times?



    // Random Seed => for random allocation of things (i.e. artificial moderator avatars)
    this.touchRandomSeed()

    // to enforce reload of page container!
    this.$root.reload = () => { this.componentKey += 1 }
    this.$root.initialized = false

    // MONITOR ACTIVITIES OF USERS (periodically and on demand)
    this.$store.dispatch('monitorSetup')

    this.$root.monitorLog = (eventString = null, extra = {}) => {
      if (!this.oauth.authorized) {
        return (null)
      }
      const route = this.$router.currentRouteObject()
      const data = { name: route.name, ...route.params, ...extra }
      this.$store.dispatch('monitorLog', {
        eventString,
        data
      })
    }

    this.$root.monitorFire = (eventString = null, extra = {}) => {
      if (!this.oauth.authorized) {
        return (null)
      }
      const route = this.$router.currentRouteObject()
      const data = { name: route.name, ...route.params, ...extra }
      this.$store.dispatch('monitorFire', {
        eventString,
        data
      })
    }

    /**
     * Clear all the data, that we want to reset for every participation session
     */
    this.$root.clearSession = () => {
      runtimeMutations.setStageID(null)
      runtimeMutations.setAssemblyIdentifier(null)
    }

    /**
     * Clear all the data, that is linked to a certain user. => performed at logout
     */
    this.$root.clearUserData = () => {
      this.$root.clearSession()
      // TODO
    }

    // console.log("--- end of app.js created")
  },

  mounted: async function () {
    console.log("*** INIT OAUTH ***")
    // let response = null

    try {
      await this.oauth.initialize()
    } catch (error) {
      console.log("error in oauth initialization...", error)
      switch (error.message) {
        case 'ErrorInvalidGrant':
          LayoutEventBus.$emit('showAuthorizationInvalidToken')
          break;
        default:
          LayoutEventBus.$emit('showServiceError', { nobuttons: true })
          break;
      }
      // end mounting...
      return;
    }

    // check token 
    console.log("*** TOKEN EXPIRE? ***")
    this.appInitialized = await this.oauth.refresh_token_if_required()
    // this.appInitialized = false
    console.log("*** OAUTH STATUS", this.appInitialized)

    // LayoutEventBus.$emit('AuthenticationLoaded')

    console.log("*** APP CREATED ***")


    // Start periodic monitorLog Raiser
    // keep this interval low (much lower than the intervall number specified in env. files) 
    // (e.g. 1 Min.)
    let intervall = parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS);
    if (!intervall) {
      intervall = 60
    }
    this.$root.$monitorTimer = setInterval(() => {
      // console.log("/intervall")
      this.$root.monitorLog()
    }, intervall * 1000)


    // In case of oauth error. Dont load data from resource server...
    if (this.appInitialized) {

      // Load Public Index 
      console.log("sync publicIndex")
      this.$store.dispatch('publicindexstore/syncPublicIndex')

      if (this.oauth.userid) {
        console.log("sync profile")
        await this.$store.dispatch("publicprofilestore/syncProfile", {
          oauthUserID: this.userid,
          oauthUserEmail: this.payload?.userEmail
        })

        console.log("end of profile sync!")
      }
    }

    // END
    console.log("*** APP MOUNTED ***")
  },


  /**
   * Ensure that all (error) messages disappear, when route changes...
   **/
  watch: {
    // if route changes, hide TextLoading
    $route(to, from) {
      // Monitor Route changes
      this.$root.monitorLog(constants.MONITOR_ROUTE_CHANGE)
    },
  }
}
