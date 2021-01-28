<template>
  <div id="q-app">
    <router-view
      :key="componentKey"
      ref="maincontent"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { LayoutEventBus } from "src/utils/eventbus";
import api from "src/utils/api";

export default {
  name: "App",
  data() {
    return {
      componentKey: 0,
    };
  },
  methods: {
    ...mapActions({
      touchRandomSeed: "assemblystore/touchRandomSeed",
    }),
  },
  mounted: function () {
    const that = this;
    this.$root.reload = function () {
      console.log("reload initiated...");
      that.componentKey += 1;
      console.log(that.componentKey);
    };

    this.touchRandomSeed();
    // console.log(this.$nLength([1,2]))
    console.log("APP mounted...");
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
      );
    });

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

    LayoutEventBus.$on("AfterLogin", (destination_route) => {
      // is email already set: if not => redirect to userprofile...

      this.$store.dispatch("publicprofilestore/syncProfile", {
        oauthUserID: this.oauth.userid,
      });

      if (this.oauth.payload.userEmail) {
        // ok, already set (not the first login)
        if (destination_route) {
          this.$router.push(destination_route);
        }
      } else {
        // console.log(this.oauth.payload)
        this.$refs?.maincontent?.gotoProfile(destination_route);
      }
    });

    LayoutEventBus.$on("hideNotificationBanners", (data) => {
      this.$refs?.maincontent?.hideNotificationBanner();
    });
  },
};
</script>
