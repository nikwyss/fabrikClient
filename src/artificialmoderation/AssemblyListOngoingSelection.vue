<template>
  <div class="justify-center center">
    <!-- style="max-width:350px" -->

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator
      alignment="left"
      role="2"
      amGroup='ongoingassemblyPage'
      :ongoing="ongoing"
    >

      <!-- First Time Entering -->
      <!-- <template  v-if="assembly_acls.length > 0">
        {{$t('assemblies.am.you_may_enter_this_assembly_for_the_first_time')}}
        </template> -->

      <template v-if="assembly_acls.includes('delegate') && !oauth.payload.userEmail">
        Bevor es los geht, müsssen Sie noch kurz beim Sekretariat vorbei. Dort wird noch eine Kontaktangabe von Ihnen benötigt.
      </template>

      <template v-else-if="assembly_acls.includes('delegate')">
        In dem Sie hier teilnehmen, helfen Sie den BewohnerInnen Ihrer Gemeinde eine gute Wahlentscheidung zu treffen!
      </template>

      <template v-else-if="assembly_acls.includes('expert') || assembly_acls.includes('manage')">
        Sie können nun gerne eintreten. Viel Vergnügen!
        <q-btn
          class="q-pa-sm"
          size="6"
          color="white"
          text-color="accent"
          @click="clickAssemblyLink(assembly)"
          label="Bitte hier lang"
          icon-right="mdi-forward"
        />
      </template>

      <template v-else-if="assembly_acls.includes('observe')">
        Schauen Sie sich an, wie 1000 zufällig ausgewählte und unabhängige BürgerInnen über das Thema denken. Sie werden hier auf jeden Fall etwas lernen können.
        <!-- <q-btn
                size="6"
                bg-color="primary"
                text-color="accent"
                @click="clickAssemblyLink(assembly)"
                label="Bitte hier lang"
                icon-right="mdi-forward"
            /> -->
      </template>

      <template v-if="oauth.authorized && !assembly_acls.length">
        Wir können Sie im Moment nicht zu der Veranstaltung zulassen.
      </template>

      <template v-if="!oauth.authorized && !assembly_acls.length">
        {{$t('assemblies.am.invitation_to_authenticate')}}
      </template>

      <!-- ACTION CHIPS -->
      <template v-slot:actions>
        <q-chip
          size="md"
          icon="mdi-forward"
          v-if="assembly_acls.includes('delegate') && !oauth.payload.userEmail"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer"
          clickable
          @click="gotoProfile(assembly.identifier)"
        >
          {{ $t('app.btn_goto_profile') }}
        </q-chip>

        <q-chip
          size="md"
          icon="mdi-forward"
          v-else-if="assembly_acls.length > 0"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer"
          clickable
          @click="clickAssemblyLink(assembly)"
        >
          {{ $t('assemblies.please_enter') }}
        </q-chip>

        <q-chip
          size="md"
          icon="mdi-forward"
          v-if="!oauth.authorized"
          outline
          color="primary"
          text-color="primary"
          class="bg-white cursor-pointer"
          clickable
          @click="clickAuthLink(assembly.identifier)"
        >
          {{ $t('auth.goto_authentication_form') }}
        </q-chip>
      </template>

    </ArtificialModerator>

  </div>
</template>

<script>
import ArtificialModerator from "./components/ArtificialModerator";
import { mapGetters } from "vuex";

export default {
  name: "ArtificialModeratorAssemblyListOngoingSelection",
  components: { ArtificialModerator },
  props: ["assembly", "ongoing"],
  inject: ["clickAssemblyLink"],
  computed: {
    assembly_acls: function () {
      return this.oauth.acls(this.assembly.identifier);
    },
  },

  methods: {
    clickInitLink() {
      const route = { name: "assemblies_ongoing_list" };
      this.$router.push(route);
    },

    clickAuthLink(assemblyIdentifier) {
      const destination_route = {
        name: "assembly_home",
        params: { assemblyIdentifier },
      };
      this.oauth.login(destination_route);
    },

    gotoProfile(assemblyIdentifier) {
      const destination_route = {
        name: "assembly_home",
        params: { assemblyIdentifier },
      };
      this.$router.push({
        name: "profile",
        params: { destination_route: destination_route },
      });
    },
  },
};
</script>
