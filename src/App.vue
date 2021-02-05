<template>
  <div id="q-app">
    <router-view
      :key="componentKey"
      ref="maincontent"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters} from "vuex"
import { LayoutEventBus } from "src/utils/eventbus"
// import api from "src/utils/api";

export default {
  name: "App",
  data() {
    return {
      componentKey: 0,
      username_derivate: '',
    };
  },

  methods: {

    ...mapActions({
      touchRandomSeed: "assemblystore/touchRandomSeed",
      storeOauthAcls: "publicprofilestore/storeOauthAcls",
    }),
  },



  created() {

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
      );
    });
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
      );
    });
    LayoutEventBus.$on("showAuthorizationError", (data) => {
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
      console.log("...-- Store oauth.acls in store", this.oauth.payload.roles)
      this.storeOauthAcls({ oauthAcls: this.oauth.payload.roles })
    })

    LayoutEventBus.$on("AfterProfileUpdate", (data) => {
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
      this.$router.push({ name: "logout" });
    });

    LayoutEventBus.$on('AfterLogin', data => {
      // CHECK FOR REDIRECTION URL in local storage (During Login)
      const destination_route = JSON.parse(localStorage.getItem('oauth2authcodepkce-destination'));
      if (destination_route) {
        localStorage.removeItem('oauth2authcodepkce-destination');
        this.$router.push(destination_route);
      }else{
        this.$router.push({name: 'home'});
      }
    })

    LayoutEventBus.$on("AuthenticationLoaded", () => {

      // SYNC USER PROFILE
      // is email already set: if not => redirect to userprofile...
      console.log("app.vue: AuthenticationLoaded => syncProfile..")
      this.$store.dispatch("publicprofilestore/syncProfile", {
        oauthUserID: this.oauth.userid,
        oauthUserEmail: this.oauth.payload.userEmail
      });

      this.$emit('AppLoaded')
    })


    LayoutEventBus.$on("PublicProfileLoaded", () => {

      // SYNC USER PROFILE
      // is email already set: if not => redirect to userprofile...
      console.log("app.vue: AuthenticationLoaded => syncProfile..")
      this.$store.dispatch("publicprofilestore/setUsernameDerivate", {
        usernameDerivate: this.usernameDerivate()});
    });

    LayoutEventBus.$on("hideNotificationBanners", (data) => {
      this.$refs?.maincontent?.hideNotificationBanner();
    })
    // TODO: are thes event catch multiple times?
  },
  
  
  mounted: function () {
    const that = this;
    this.$root.reload = function () {
      console.log("reload initiated...");
      that.componentKey += 1;
      console.log(that.componentKey);
    }

    this.touchRandomSeed()
    // console.log("APP MOUNTED...");
  },
}
</script>
