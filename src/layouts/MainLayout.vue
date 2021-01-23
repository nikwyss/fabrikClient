
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
  <q-layout
    view="hHh Lpr lFf"
    class="rounded-borders"
  >

    <q-header class="text-primary shadow-1 bg-white">

      <q-toolbar class=" ">
        <!-- <q-toolbar-title v-if="oauth.authorized"> -->
        <!-- Demokratiefabrik -->
        <!-- </q-toolbar-title> -->
        <q-space />
        <q-item
          clickable
          v-close-popup
          tabindex="0"
        >
          <q-item-section @click="$router.pushR({name: 'news'})">
            <q-item-label>Aktuelles</q-item-label>
            <!-- <q-item-label caption>Hintergrund, Zweck, und Kontaktpersonen</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-separator vertical />

        <q-item
          clickable
          v-close-popup
          tabindex="0"
        >
          <q-item-section @click="$router.pushR({name: 'background'})">
            <q-item-label>Hintergrund</q-item-label>
            <!-- <q-item-label caption>Hintergrund, Zweck, und Kontaktpersonen</q-item-label> -->
          </q-item-section>
        </q-item>

        <q-separator vertical />

        <!-- DROPDOWN -->
        <q-btn-dropdown
          stretch
          flat
          v-if="oauth.authorized"
        >
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-avatar
                icon="mdi-image-filter-hdr"
                :style="{ 'background-color': public_profile.color }"
                text-color="white"
                class="q-ma-sm"
              />
              <div class="text-center">
                <q-item-section>
                  <q-item-label caption>{{ $t('auth.registered_as') }}</q-item-label>
                  <q-item-label>{{public_profile.username}}</q-item-label>
                </q-item-section>
              </div>
            </div>
          </template>
          <q-list>
            <q-item
              clickable
              v-close-popup
              tabindex="0"
            >
              <q-item-section>
                <q-item-label
                  caption
                  style="max-width:250px"
                >{{ name_derivation }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              tabindex="0"
            >
              <q-item-section
                @click="gotoProfile()"
                v-if="oauth.authorized"
              >
                <q-item-label>Sekretariat</q-item-label>
                <q-item-label caption>Angaben zu Ihrem Benutzerkonto</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section
                @click="oauth.logout()"
                v-if="oauth.authorized"
              >
                <q-item-label>Logout</q-item-label>
                <q-item-label caption>Demokratiefabrik verlassen</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-btn-dropdown>

        <q-btn
          stretch
          flat
          label="Anmelden"
          v-if="!oauth.authorized"
          @click="clickAuthLink"
        />

      </q-toolbar>

      <!-- DISABLED: at the moment. only de_CH -->
      <!-- <LanguageSwitch /> -->

      <!-- </q-toolbar> -->
      <!-- </div> -->

      <div
        align="center"
        style="min-height:40px"
      >

        <transition name="transitionlogo">

          <q-img
            v-if="expanded_logo"
            :ratio="1"
            style="max-width: 241px; max-height:120px;"
            src="layout/logoweb.png"
          />

        </transition>

      </div>

      <div align="center">

        <q-tabs v-model="currenttab">
          <CustomQRouteTab
            name="home"
            icon="mdi-door"
            exact
            to="/"
            :label="$t('menu.items.home.label')"
          >
            <q-tooltip :offset="menuOffset">{{$t('menu.items.home.tooltip')}}</q-tooltip>
          </CustomQRouteTab>
          <!-- <CustomQRouteTab name="showcase" icon="mdi-eye-outline" to="/showcase" :label="$t('menu.items.showcase.label')">
          <q-tooltip :offset="menuOffset" max-width="300px">{{$t('menu.items.showcase.tooltip')}}</q-tooltip>
        </CustomQRouteTab> -->
          <CustomQRouteTab
            name="assemblies"
            :to="{name: 'assemblies_ongoing_list'}"
            icon="mdi-lead-pencil"
            :label="$t('menu.items.assembly.label')"
          >
            <q-tooltip
              :offset="menuOffset"
              max-width="300px"
            >{{$t('menu.items.assembly.tooltip')}}</q-tooltip>
          </CustomQRouteTab>
          <CustomQRouteTab
            name="background"
            icon="mdi-help-circle-outline"
            to="/background"
            :label="$t('menu.items.background.label')"
          >
            <q-tooltip
              :offset="menuOffset"
              max-width="300px"
            >{{ $t('menu.items.background.tooltip') }} </q-tooltip>
          </CustomQRouteTab>
        </q-tabs>
      </div>
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
      <router-view />

      <!-- Footer  -->
      <br><br>
      <!-- bg-blue-grey-2 -->
      <!-- style="border-top: 1px solid black" -->
      <div class=" full-width text-primary  bg-white shadow-up-1">
        <br><br>
        <br>
        <q-page class="doc_content">

          <div class="q-col-gutter-md row items-start">

            <div class="col-4 q-pr-xl">
              <!-- {{ $t('app.name') }} {{ $t('app.version') }} <br> -->
              <b>Impressum:</b><br>
              Année Politique Suisse<br>
              Institut für Politikwissenschaft<br>
              Universität Bern<br>
              Fabrikstrasse 8<br>
              CH-3012 Bern<br>
              Tel. +41 (0)31 631 83 31<br>
              Fax +41 (0)31 631 48 17<br>

            </div>

            <div class="col-2">
              <q-img
                src='layout/logoaps.png'
                :ratio="1"
                contain
                class="q-ma-sm"
                style="height: 100px; "
              ></q-img>

            </div>

            <div class="col-2">
              <q-img
                src='layout/logounibe.png'
                :ratio="1"
                contain
                class="q-ma-sm"
                style="height: 100px; "
              ></q-img>

            </div>

            <div class="col-2">
              <q-img
                src='layout/logosnf.png'
                :ratio="1"
                contain
                class="q-ma-sm"
                style="height: 100px;"
              ></q-img>
            </div>

          </div>

        </q-page>
      </div>

    </q-page-container>
  </q-layout>
</template>

<script>
import { LayoutEventBus } from "src/utils/eventbus";
import { mapGetters } from "vuex";

// import ComponentDrawer from './components/ComponentDrawer'
// import LanguageSwitch from './components/LanguageSwitch'
// import PopupProfile from './components/PopupProfile'
import CustomQRouteTab from "./components/CustomQRouteTab";

export default {
  name: "MainLayout",

  components: {
    // ComponentDrawer,
    // LanguageSwitch,
    CustomQRouteTab,
    // PopupProfile
  },

  data() {
    return {
      currenttab: "assemblies",
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

  methods: {
    gotoProfile(destination_route) {
      if (!destination_route) {
        destination_route = this.$router.currentRouteObject();
      }

      if (destination_route.name == "profile") {
        LayoutEventBus.$emit("reload");
      } else {
        this.$router.push({
          name: "profile",
          params: { destination_route: destination_route },
        });
      }
    },

    clickAuthLink: function () {
      const destination_route = { name: "assemblies_ongoing_list" };
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
    expanded_logo: function () {
      return this.$route.name == "home";
    },

    name_derivation: function () {
      const altitude = this.public_profile.altitude;
      const fullname = this.public_profile.fullname;
      const canton = this.public_profile.canton;
      return this.$i18n.t("auth.name_derivation", {
        fullname: fullname,
        canton: canton,
        altitude: altitude,
      });
    },

    is_assembly_page: function () {
      return (
        this.$route.name === "assemblies" ||
        !!this.$route.params.assemblyIdentifier
      );
    },

    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile",
    }),
  },

  //   mounted: function() {
  // console.log(this.$router.currentRoute)

  //   }
};
</script>
