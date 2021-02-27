<style scoped>
/* .transitionlogo-enter,
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
} */
</style>

<template>
  <q-layout
    view="hHh Lpr lFf"
    class="rounded-borders"
  >
    <q-header class="text-primary bg-white">

      <!-- "Hidden" Logo -->
      <q-chip
        style="position:fixed; bottom:0px; left:0px; padding:1em; margin:0px"
        size="sm"
        color="white"
        text-color="grey"
        class=" q-mt-md"
      >
        demokratiefabrik.ch
      </q-chip>

      <!-- MAIN MENU -->
      <MainMenu :assemblyName="assemblyName" />

      <!-- LOGO -->
      <!-- <div
        align="center"
        style="min-height:20px; margin-top:1em"
      >
        <transition name="transitionlogo">
          <q-img
            v-if="frontpage"
            :ratio="1"
            style="max-width: 241px; max-height:120px;"
            src="layout/logoweb.png"
          />
        </transition>
      </div> -->

      <!-- DYNAMIC MENU -->
      <component
        :is="AssemblyMenuComponentLoader"
        :menuOffset="menuOffset"
        v-if="is_assembly_page"
      />
      <!-- END DYNAMIC MENU -->

    </q-header>

    <!-- CONTENT -->
    <q-page-container>

      <!-- DATA LOADING GIF -->
      <!-- TODO: remove??  -->
      <q-inner-loading
        :showing="TextLoadingVisible"
        style="z-index:100"
      >
        <q-spinner-dots
          size="50px"
          color="primary"
        />
      </q-inner-loading>

      <!-- NOTIFICATION BANNER -->
      <q-inner-loading
        :showing="NotificationBannerVisible"
        style="z-index:100; justify-content:flex-start; padding-top: 100px;"
        class="bg-white"
      >
        <div
          class="q-ma-xl"
          style="max-width: 400px"
        >
          <h1>
            <q-icon
              v-if="NotificationBannerIcon"
              :name="NotificationBannerIcon"
            /> {{NotificationBannerTitle}}
          </h1>
          <div>{{NotificationBannerBody}}</div>

          <q-chip
            v-if="NotificationBannerButtons.includes('hide')"
            size="md"
            icon="mdi-close"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer q-mt-md"
            clickable
            @click="hideNotificationBanner"
          >
            {{ $t('app.btn_close') }}
          </q-chip>
          <q-chip
            v-if="NotificationBannerButtons.includes('home')"
            size="md"
            icon="mdi-home"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer q-mt-md"
            clickable
            @click="gotoHome"
          >
            {{ $t('app.btn_home') }}
          </q-chip>
          <q-chip
            v-if="NotificationBannerButtons.includes('auth')"
            size="md"
            icon="mdi-forward"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer q-mt-md"
            clickable
            @click="clickAuthLink"
          >
            {{ $t('auth.goto_authentication_form') }}
          </q-chip>
          <q-chip
            v-if="NotificationBannerButtons.includes('profile')"
            size="md"
            icon="mdi-image-filter-hdr"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer q-mt-md"
            clickable
            @click="hideNotificationBanner"
          >
            {{ $t('auth.goto_profile_page') }}
          </q-chip>
          <q-chip
            v-if="NotificationBannerButtons.includes('redirect')"
            size="md"
            icon="mdi-forward"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer q-mt-md"
            clickable
            @click="$router.push(NotificationBannerRedirectRoute)"
          >
            {{ $t('app.btn_next') }}
          </q-chip>
        </div>
      </q-inner-loading>

      <!-- MAIN PAGE CONTENT -->
      <!-- <div align="center"> -->
      <router-view v-if="$parent.appInitialized" />

      <br><br>
      <Footer />

    </q-page-container>
  </q-layout>
</template>

<script>
import MainMenu from "./components/MainMenu";
import Footer from "./components/Footer";
import { mapGetters } from "vuex";

export default {
  name: "MainLayout",
  components: {
    Footer,
    MainMenu,
  },

  data() {
    return {
      currenttab: "",
      menuOffset: [0, 3],
      TextLoadingVisible: false,
      NotificationBannerVisible: false,
      NotificationBannerType: "info",
      NotificationBannerTitle: "",
      NotificationBannerRedirectRoute: {},
      NotificationBannerBody: "",
      NotificationBannerIcon: "",
      NotificationBannerButtons: [],
    };
  },

  /**
   * Ensure that all (error) messages disappear, when route changes...
   **/
  watch: {
    // if route changes, hide TextLoading
    $route(to, from) {
      this.hideLoadingGif();
      this.hideNotificationBanner();
    },
  },

  computed: {
    // https://medium.com/@codetheorist/using-vuejs-computed-properties-for-dynamic-module-imports-2046743afcaf
    AssemblyMenuComponentLoader() {
      return () => import(`../plugins/${this.assemblyType}/Menu.vue`);
    },

    frontpage: function () {
      return this.$route.name == "home";
    },

    is_assembly_page: function () {
      return (
        this.$route.name === "assemblies" ||
        !!this.$route.params.assemblyIdentifier
      );
    },

    ...mapGetters("assemblystore", ["assemblyName", "assemblyType"]),
  },

  methods: {
    clickAuthLink: function () {
      // const destination_route = { name: "home" };
      const destination_route = this.$router.currentRouteObject();
      this.oauth.login(destination_route);
    },

    showLoadingGif() {
      this.TextLoadingVisible = true;
      setTimeout(() => {
        this.TextLoadingVisible = false;
      }, 5000);
    },

    showNotificationBanner(
      type,
      title,
      body,
      icon,
      settimer = false,
      buttons = ["hide"],
      redirectRoute = null
    ) {
      this.NotificationBannerVisible = true;
      this.NotificationBannerBody = body;
      this.NotificationBannerTitle = title;
      this.NotificationBannerType = type;
      this.NotificationBannerIcon = icon;
      this.NotificationBannerButtons = buttons;
      this.NotificationBannerRedirectRoute = redirectRoute;
      if (!this.NotificationBannerRedirectRoute) {
        this.NotificationBannerRedirectRoute = { name: "home" };
      }

      this.hideLoadingGif();
      if (settimer) {
        setTimeout(() => {
          this.NotificationBannerVisible = false;
        }, 3000);
      }

      // scroll to top
      window.scrollTo(0, 0);
    },

    hideNotificationBanner() {
      this.NotificationBannerVisible = false;
    },
    hideLoadingGif() {
      this.TextLoadingVisible = false;
    },
    gotoHome() {
      this.$router.push({ name: "home" });
    },

    // loadComponent() {
    //   this.AssemblyMenuComponentLoader().then((comp) => {
    //     console.log(comp.data);
    //   });
    // },
  },

  mounted() {
    // if (this.is_assembly_page) {
    // loadComponent();
    // }
  },
};
</script>
