<template>
  <div
    class="justify-center center"
    style="max-width:350px"
  >

    <!-- LEFT  SIDE: Welcoming!!! -->
    <ArtificialModerator
      alignment="left"
      role="1"
      i18n_path_prefix="index"
    >
      {{$t('index.am.general_greeting', {salutation})}}
    </ArtificialModerator>

    <!-- RIGHT SIDE (NOT YET LOGGED IN):  -->
    <!-- Not authenticated && assembly is ONGOING => Assuming that visitor is a delegate -->
    <ArtificialModerator
      v-if="oauth.authorized === false && IsThereAnAssemblyOngoing"
      alignment="right"
      role="2"
      i18n_path_prefix="index"
      :ongoing_request="published_assemblies === null"
    >
      {{$t('index.am.invitation_to_authenticate')}}
      <template v-slot:actions>
        <Button
          :label="$t('auth.goto_authentication_form')"
          icon="mdi-key-outline"
          @click="clickAuthLink"
        >
        </Button>
      </template>
    </ArtificialModerator>
    <!-- RIGHT SIDE (AUTHENTICATED DELEGATES):  -->
    <ArtificialModerator
      v-else-if="oauth.authorized === true && IsUserDelegateOfOngoingAssembly === true"
      alignment="right"
      role="2"
      i18n_path_prefix="index"
      :ongoing_request="published_assemblies === null"
    >
      {{$t('index.am.delegates_redirect')}}
      <template v-slot:actions>
        <Button
          :label="$t('index.iam_ready')"
          icon="mdi-launch"
          @click="clickInitLink()"
        >
        </Button>
      </template>
    </ArtificialModerator>

    <!-- RIGHT SIDE (ONLY PUBLIC STATE ASSEMBLIES):  -->
    <ArtificialModerator
      v-else-if="!oauth.ongoing && IsThereAnAssemblyInPublicState === true"
      alignment="right"
      role="2"
      i18n_path_prefix="index"
      :ongoing_request="published_assemblies === null"
    >

      {{$t('index.am.information_for_public_visitors')}}
      <template v-slot:actions>
        <Button
          :label="$t('index.iam_ready')"
          icon="mdi-launch"
          @click="clickInitLink"
        >
        </Button>
      </template>
    </ArtificialModerator>

    <!-- RIGHT SIDE (NOTHING GOIING ON):  -->
    <ArtificialModerator
      alignment="right"
      role="2"
      i18n_path_prefix="index"
      v-else-if="!oauth.ongoing && IsThereNothingGoingOn === true"
      :ongoing_request="published_assemblies === null"
    >
      {{$t('index.am.factory_holiday')}}
    </ArtificialModerator>

    <!-- RIGHT SIDE (AUTHENTICATED NO PERMISSIONS):  -->
    <ArtificialModerator
      alignment="right"
      role="2"
      v-else-if="!oauth.ongoing"
      i18n_path_prefix="index"
      :ongoing_request="published_assemblies === null"
    >
      {{$t('index.am.authenticated_user_without_permission_for_ongoing_assembly')}}
    </ArtificialModerator>
  </div>
</template>

<script>
import ArtificialModerator from "./components/ArtificialModerator";
import Button from "./components/Button";
import { mapGetters, mapActions } from 'vuex'

export default {
  name: "ArtificialModeratorIndexPage",
  components: { ArtificialModerator, Button },
  computed: {

    // ...mapGetters({
    //   published_assemblies: 'publicindexstore/published_assemblies',
    //   ongoing_assemblies: 'publicindexstore/ongoing_assemblies',
    //   // getAssembly: 'publicindexstore/getAssembly',
    //   // UsersDelegateAssemblies: 'UsersDelegateAssemblies',
    //   // IsThereAnAssemblyInPublicState: 'publicindexstore/IsThereAnAssemblyInPublicState',
    //   // IsThereAnAssemblyOngoing: 'publicindexstore/IsThereAnAssemblyOngoing',
    //   // IsThereNothingGoingOn: 'publicindexstore/IsThereNothingGoingOn'
    // }),

    ...mapGetters(
     'publicindexstore',
      ['published_assemblies', 'ongoing_assemblies', 'IsUserDelegateOfOngoingAssembly', 'IsThereAnAssemblyOngoing', 
      'IsThereAnAssemblyInPublicState', 'IsThereNothingGoingOn', 'UsersDelegateAssemblies']
      ), 

    salutation: function () {
      if (this.oauth.authorized) {
        const salutation = this.$i18n.t(
          "index.am.salutation_for_authenticated",
          { username: this.oauth.username }
        );
        return salutation;
      } else {
        const salutation = this.$i18n.t("index.am.salutation_for_guests");
        return salutation;
      }
    },
  },

  methods: {
    clickInitLink: function () {
      if (this.UsersDelegateAssemblies.length > 1) {
        // Multiple parallel assemblies
        var route = { name: "assemblies_ongoing_list" };
        this.$router.push(route);
      } else if (this.UsersDelegateAssemblies.length == 1) {
        // Single assembly: default
        const assembly = this.UsersDelegateAssemblies[0];
        var route = {
          name: "assembly_home",
          params: { assemblyIdentifier: assembly.identifier },
        };
        this.$router.push(route);
      } else {
        console.log("Error: no assembly found...");
      }
    },

    clickAuthLink: function () {
      const destination_route = { name: "assemblies_ongoing_list" };
      this.oauth.login(destination_route);
    },
  },
};
</script>
