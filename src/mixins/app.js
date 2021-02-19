import { mapGetters, mapActions } from 'vuex'
import { LayoutEventBus } from "src/utils/eventbus"
import constants from 'src/utils/constants';
import { runtimeStore, runtimeMutations } from "src/store/runtime.store";


export default {

  provide() {
    return {
      clickAssemblyLink: this.clickAssemblyLink,
    }
  },

  data() {
    return {
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
    },

    ...mapActions({
      touchRandomSeed: "assemblystore/touchRandomSeed",
      storeOauthAcls: "publicprofilestore/storeOauthAcls",
    })
  },

  created: function () {

    // GlOBAL Page Unmount Listener
    window.addEventListener('beforeunload', this.onPageLeave)

    this.$store.dispatch('publicindexstore/syncPublicIndex')

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
      let type = "error";
      this.$refs?.maincontent?.showNotificationBanner(
        type,
        msg_title,
        msg_body,
        icon
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
      this.storeOauthAcls({ oauthAcls: this.oauth.payload.roles })
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

    LayoutEventBus.$on("BeforeLogout", (data) => {
      this.$root.monitorLog(constants.MONITOR_LOGOUT)
    })

    LayoutEventBus.$on("AfterLogout", (data) => {
      this.$router.push({ name: "logout" });
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

      // TODO: Reset VUEX STORE!!

    })

    LayoutEventBus.$on("PublicProfileLoaded", () => {

      // SYNC USER PROFILE
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

  },

  mounted: function () {

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
