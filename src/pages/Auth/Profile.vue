<template>
  <div
    class="doc_content "
    v-if="oauth.payload"
  >
    <h1>Sekretariat</h1>
    <div>
      <div>
        <div
          class="q-gutter-y-md column"
          style="max-width: 600px"
        >
          <!-- HTML -->
          <!-- <b>{{$t('contenttree.editor.content_title')}}</b> -->

          <p>
            {{ profile.original_email ?  '' :  'Willkommen!' }}
            Folgendes Pseudonym wurde Ihnen zugewiesen: Andere Teilnehmende werden Sie unter diesem Namen ansprechen können. <br />
            <q-input
              disable
              outlined
              v-model="profile.pseudonym"
              :dense="true"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-account" />
              </template>
            </q-input>
            <small>{{username_derivation }}</small>
          </p>

          <p v-if="!loading">
            {{ this.profile.original_email ?  'Sie können hier Ihre Kontaktdaten ändern' :  'Daneben benötigen wir Ihre Emailadresse:' }}

            <q-input
              :bg-color="isValidContact ? 'lime' : 'orange'"
              outlined
              v-model="profile.email"
              :dense="true"
            >
              <template v-slot:prepend>
                <q-icon :name="isPhone ? 'mdi-phone' : 'mdi-email' " />
              </template>
            </q-input>
            <small>{{$t('auth.profile_email_hint')}}</small>
          </p>
        </div>

      </div>

      <br />
      <br />

      <q-btn
        class="q-ma-xs"
        :loading="loading"
        color="primary"
        :label="$t('auth.profile_update_action')"
        :disabled="!isEnabledSubmitButton"
        @click="saveProfile"
      >
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>

      <q-btn
        color="primary"
        :disabled="!profile.original_email"
        v-if="!!this.profile.original_email"
        outline
        :label="$t('app.btn_close')"
        @click="skipProfile"
      />

      <br />
      <br />
      <br />
      <br />

      <!-- Disclaimer -->
      <AlgorithmDisclaimer :text="$t('auth.profile_email_disclaimer')" />
    </div>
  </div>

</template>

<script>
// import Configuration from 'src/utils/configuration'
import ApiService from "src/utils/xhr";
import api from "src/utils/api";
import { mapGetters } from "vuex";
import AlgorithmDisclaimer from "src/layouts/components/AlgorithmDisclaimer";
import { LayoutEventBus } from "src/utils/eventbus.js";

export default {
  name: "PopupProfile",
  components: { AlgorithmDisclaimer },

  props: {
    destination_route: Object,
  },

  data() {
    return {
      profile: {
        pseudonym: "",
        email: "",
        original_email: "",
      },
      error: false,
      errormsg: "",
      loading: true,
      action: null,
      btnlabel: "",
      payload: this.oauth.payload,
    };
  },

  computed: {
    username_derivation: function () {
      if (!this.public_profile) {
        return "";
      }
      const altitude = this.public_profile.ALT;
      const fullname = this.public_profile.FN;
      const canton = this.public_profile.CA;
      return this.$i18n.t("auth.name_derivation", {
        fullname: fullname,
        canton: canton,
        altitude: altitude,
      });
    },

    ...mapGetters({
      public_profile: "publicprofilestore/get_public_profile",
    }),

    isEnabledSubmitButton: function () {
      const changed = this.profile.original_email != this.profile.email;
      return changed && this.isValidContact && !this.loading;
    },

    isValidContact: function () {
      return this.isPhone ? this.isValidPhone : this.isValidEmail;
    },

    isPhone: function () {
      // does not contain any alphas
      const emailPattern = /^[^a-zA-Z]+$/;
      return this.profile.email && emailPattern.test(this.profile.email);
    },

    isValidEmail: function () {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(this.profile.email);
    },

    isValidPhone: function () {
      const phonePatternSwiss = /(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?([1-9]{2}|77[1-9]{1})(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/;
      return phonePatternSwiss.test(this.profile.email);
    },
  },

  methods: {
    skipProfile: function () {
      const route = this.destination_route
        ? this.destination_route
        : { name: "home" };
      this.$router.push(route);
    },

    saveProfile: function () {
      this.loading = true;
      console.log("Save profile");
      api.authProfile(this.profile).then((response) => {
        // ERROR RESPONSE
        let message = "";
        if (response.data.ok) {
          message = this.$i18n.t("auth.profile_update_success");
          this.oauth.payload.userEmail = true;
          this.profile.original_email = this.profile.email;
        } else {
          message = this.$i18n.t("auth.profile_update_error");
        }

        // Notification
        const route = this.destination_route
          ? this.destination_route
          : { name: "home" };
        LayoutEventBus.$emit("AfterProfileUpdate", {
          userEmail: this.profile.email,
          destination_route: route,
        });

        this.loading = false;
      });
    },
  },

  mounted: function () {
    if (!this.oauth.payload) {
      // not logged in
      this.$router.push({ name: "home" });
    }
    // Get Username from the JWT token
    this.profile.pseudonym = this.public_profile.U;
    // Get Email from oauth server
    api
      .authProfile({})
      .then((response) => {
        if (response.data) {
          // Okay
          this.profile.email = response.data.email;
          // this.profile.last_name = response.data.last_name;
          this.profile.original_email = response.data.email;
        } else {
          // Error
          const message = this.$i18n.t("auth.profile_load_error");
          this.$q.notify({
            type: "nFabrikError",
            message,
          });
        }

        this.loading = false;
      })
      .catch((e) => {
        console.log(e);
        this.loading = false;
      });
  },
};
</script>