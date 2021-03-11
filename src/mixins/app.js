import { mapGetters, mapActions } from 'vuex'
import { LayoutEventBus } from "src/utils/eventbus"
import { oAuthEventBus } from "src/utils/VueOAuth2PKCE/eventbus"
import constants from 'src/utils/constants'
import { runtimeStore, runtimeMutations } from "src/store/runtime.store"
import { scroll } from "quasar";
const { setScrollPosition, getScrollTarget } = scroll;


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

  watch: {
    // if route changes, hide TextLoading
    $route(to, from) {
      // Monitor Route changes
      this.$root.monitorLog(constants.MONITOR_ROUTE_CHANGE)
    },
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
      this.$root.monitorFire(constants.MONITOR_EXIT)
      runtimeMutations.exitApp()
    },

    ...mapActions({
      touchRandomSeed: "assemblystore/touchRandomSeed",
      storeOauthAcls: "publicprofilestore/storeOauthAcls",
      clearUserData: "clearUserData",
    })
  },

  created: function () {

    // not token refresh is ongoing!!!
    // this.$store.dispatch("tokenRefreshEnds")

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
    LayoutEventBus.$on("PublicProfileLoaded", () => {

      // SYNC USER PROFILE
      console.log("on PublicProfileLoaded")
      // is email already set: if not => redirect to userprofile...
      this.$store.dispatch("publicprofilestore/setUsernameDerivate", {
        usernameDerivate: this.usernameDerivate()
      })
    })
    LayoutEventBus.$on("hideNotificationBanners", data => {
      this.$refs?.maincontent?.hideNotificationBanner();
    })


    // oAuth2PKCE Hooks
    oAuthEventBus.$on('AfterTokenChanged', data => {
      // NOTIFY EVERYONE, THAT TOKEN HAS CHANGED NOW!
      this.storeOauthAcls({ oauthAcls: this.oauth?.payload?.roles })
    })

    oAuthEventBus.$on("AfterLogout", () => {
      this.$router.push({ name: "logout" })
      this.$root.clearUserData()
    })

    oAuthEventBus.$on('AfterLogin', () => {

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
    })

    // Random Seed => for random allocation of things (i.e. artificial moderator avatars)
    this.touchRandomSeed()

    // to enforce reload of page container!
    this.$root.reload = () => { this.componentKey += 1 }
    this.$root.initialized = false

    // MONITOR ACTIVITIES OF USERS (periodically and on demand)
    this.$store.dispatch('monitorSetup')


    this.$root.getAssemblyHomeRoute = (assembly) => {
      // console.log("get assembly route ", assembly)

      return ({
        name: assembly.type,
        params: { assemblyIdentifier: assembly.identifier }
      })

      // return ({
      //   name: 'assembly_home',
      //   params: { assemblyIdentifier: assembly.assembly.identifier }
      // })
    }


    this.$root.scrollToAnchor = (anchor, duration = 300) => {
      const dom = document.getElementsByName(anchor);
      const ele = dom?.item(0);
      if (ele) {
        this.fixedSelectedItem = anchor;
        const offset =
          ele.offsetTop - ele.scrollHeight - this.$root.headerOffset;

        const target = getScrollTarget(ele);
        setScrollPosition(target, offset, duration);
        setTimeout(() => (this.fixedSelectedItem = null), duration);
      }
    },

      this.$root.logout = async (eventString = null, extra = {}) => {
        await this.$store.dispatch('monitorFire', {
          eventString: constants.MONITOR_LOGOUT, data: {}
        })
        this.oauth.logout()
      }


    this.$root.username = (profile) => {
      return profile ? profile.U : "Anonymous";
    }

    this.$root.username_derivation = (profile, shortversion) => {
      if (!profile) {
        return "";
      }
      const altitude = profile.ALT;
      const fullname = profile.FN;
      const canton = profile.CA;

      return this.$i18n.t(`auth.name_derivation_3rd_party${shortversion ? '_short' : ''}`, {
        fullname: fullname,
        canton: canton,
        altitude: altitude,
      });
    }

    this.$root.monitorLog = async (eventString = null, extra = {}) => {
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

    this.$root.monitorFire = async (eventString = null, extra = {}) => {
      if (!this.oauth.authorized) {
        return (null)
      }
      const route = this.$router.currentRouteObject()
      const data = { name: route.name, ...route.params, ...extra }
      await this.$store.dispatch('monitorFire', {
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
      this.clearUserData()
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
    // console.log("...STATUS", this.appInitialized)


    console.log("*** START MONITOR ENGINE ***")
    // Start periodic monitorLog Raiser
    // keep this interval low (much lower than the intervall number specified in env. files) 
    // (e.g. 1 Min.)
    let intervall = parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS);
    if (!intervall) { intervall = 60 }
    // TODO: THIS MONITOR RUNS MULTIPLE TIMES (guess because of dev live DOM updates...)
    this.$root.$monitorTimer = setInterval(() => {
      console.log("/i")
      this.$root.monitorFire()
    }, intervall * 1000)



    // In case of oauth error. Dont load data from resource server...
    if (this.appInitialized) {

      console.log("*** SYNC LOCAL DATA ***")
      console.log("...publicIndex")
      this.$store.dispatch('publicindexstore/syncPublicIndex')

      if (this.oauth.userid) {
        console.log("...profile")
        await this.$store.dispatch("publicprofilestore/syncProfile", {
          oauthUserID: this.oauth.userid,
          oauthUserEmail: this.oauth.payload?.userEmail
        })
      }
    }

    // END
    console.log("*** APP MOUNTED ***", this.$root.hasCustomMenu)
  },

  beforeDestroy() {
    // TODO: destroy all eventbus listeners!!!
    // Don't forget to turn the listener off before your component is destroyed
    // this.$root.$off('openLeftDrawer', this.openLeftDrawerCallback)
  }
}
