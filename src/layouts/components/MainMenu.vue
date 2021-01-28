<style scoped>
.topmenuSelected {
  border-top: 2px solid #111;
}
.topmenuDefault {
  border-top: 2px solid #fff;
}
.dropdownSelected {
  border-left: 2px solid #111;
}
.dropdownDefault {
  border-left: 2px solid #fff;
}
</style>
<template>
      <q-toolbar>

        <q-space />
          <!-- <h1 v-if="currentAssemblyName"></h1> -->

                <q-toolbar-title style="min-width:200px; font-weight:400" v-if="currentAssemblyName">{{currentAssemblyName}}</q-toolbar-title>

          <!-- Basic Menu:  -->
          <!-- <div v-if="!is_assembly_page"> -->
          <q-item
            v-for="item in menu"
            clickable
            v-show="!is_assembly_page"
            :label=item.text
            :class="item.to.name == currentRoute ? 'topmenuSelected' : 'topmenuDefault'"
            @click="$router.pushR(item.to)"
            :key="item.text"
          >{{item.text}}
          </q-item>
          <!-- </div> -->
        <!-- <slot name="menuitems"></slot> -->
          <!-- <q-separator vertical /> -->

        <!-- MENU: for assembly views  -->
        <q-btn size="lg" flat icon="mdi-menu" label="" v-if="is_assembly_page">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item
                v-for="item in menu"
                clickable
                :key=item.text
                :class="item.to.name == currentRoute ? 'topmenuSelected' : 'topmenuDefault'"
                @click="$router.pushR(item.to)"
                v-close-popup
              >
                <q-item-section>{{item.text}}</q-item-section> 
              </q-item>

            </q-list>
          </q-menu>
        </q-btn>


        <!-- ACCOUNT DROPDOWN -->
        <q-btn-dropdown
          stretch
          flat
          v-if="oauth.authorized"
        >
          <template v-slot:label>
            <UserAvatar
              :profile="public_profile"
              menu="true"
            ></UserAvatar>
          </template>

          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label
                  caption
                  style="max-width:250px"
                >{{ name_derivation }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              :class="'profile'==currentRoute ? 'dropdownSelected' : 'dropdownDefault'"
              @click="gotoProfile()"
              v-if="oauth.authorized"
              v-close-popup
            >
              <q-item-section>
                <q-item-label>Sekretariat</q-item-label>
                <q-item-label caption>Angaben zu Ihrem Benutzerkonto</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              @click="oauth.logout()"
              clickable
              v-close-popup
            >
              <q-item-section v-if="oauth.authorized">
                <q-item-label>Abmelden</q-item-label>
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
          @click="oauth.login()"
        />


        <!-- DISABLED: at the moment. only de_CH -->
        <!-- <LanguageSwitch /> -->

      </q-toolbar>

</template>

<script>
import UserAvatar from "./UserAvatar"
import { LayoutEventBus } from "src/utils/eventbus"
import { mapGetters } from "vuex"

export default {
  name: "MainMenu",
  props: ['currentAssemblyName'],
  components: {
      UserAvatar
  },
  data: function() {
    return ({
      menu: [
        {
          text : 'Online-Konferenz',
          to : {name: 'home'},
        },
        {
          text : 'Aktuelles',
          to : {name: 'news'},
        },
        {
          text : 'Hintergrund',
          to : {name: 'background'},
        }
      ]
    })
  },
  computed: {
    currentRoute: function () {
      return this.$route.name;
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
    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile",
    }),

    name_derivation: function () {
      if (!this.public_profile) {return ""}
      const altitude = this.public_profile.altitude;
      const fullname = this.public_profile.fullname;
      const canton = this.public_profile.canton;
      return this.$i18n.t("auth.name_derivation", {
        fullname: fullname,
        canton: canton,
        altitude: altitude,
      })
    }
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
    }
  }
}
</script>