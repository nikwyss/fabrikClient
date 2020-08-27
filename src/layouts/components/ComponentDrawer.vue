<template>
<div class="q-pa-none">
<q-list  bordered>
    <!-- Visitors => Login -->
    <q-item-section v-if="!$root.authenticated">


      <q-item tag="label" v-ripple>
        <q-item-section class="text-secondary">
          <q-item-label>Dear Guest</q-item-label>
          <q-item-label caption>Klicken Sie auf 'Anmeldung', wenn Sie sich anmelden möchten. Eine Anmeldung ist notwendig, um sich aktiv in der Fabrik zu beteiligen. </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        @click="$session.redirect_to_provider()"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="mdi-login" />
        </q-item-section>

        <q-item-section>Anmeldung</q-item-section>
      </q-item>
    </q-item-section>

    <!-- Account Info -->
    <q-item-section v-if="$root.authenticated">

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Dear {{$root.username}}</q-item-label>
          <q-item-label caption>Klicken Sie auf Logout, wenn Sie sich abmelden möchten. </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        @click="logout"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="mdi-logout" />
        </q-item-section>

        <q-item-section>Logout</q-item-section>
      </q-item>
      <q-separator spaced />

      <q-item-label header>Einstellungen</q-item-label>      
      <q-item tag="label" v-ripple>
        <q-item-section side top>
          <q-checkbox  v-model="user_setting_notification_email" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Notifications (recommended)</q-item-label>
          <q-item-label caption>
            We will send you during the days of assembly period a few email notifications. After 
            this period, we will asap remove your Emailadress from the Newsletter.
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item tag="label" v-ripple  v-if="$root.authenticated">
        <q-item-section side top>
          <q-checkbox v-model="user_setting_session_cookie" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Stay logged in (recommended)</q-item-label>
          <q-item-label caption>
            A cookie is stored to keep the session open during the days of the assembly. Afterwards, the cookie will be automatically removed.
          </q-item-label>
        </q-item-section>        
      </q-item>

    </q-item-section>

        <!-- <q-item-label header class="text-grey-8"> Session  -->
        <!-- <span> -->
        <!-- <q-btn v-if="!this.show_profile"  type="button" unelevated color="light-green-7" size="md" 
            label='Login with oAuth Provider Form' @click="click_to_own_oauth_provider"/>
        <q-chip v-if="this.show_profile">
            <span class="cursor-pointer">
        <q-avatar size="26px">
            <q-icon name="mdi-account-cog" size="sm" color="green"/>
        </q-avatar> {{$root.oauth_username}} -->
        <!-- </span> -->
        <!-- </q-item-label> -->

                        <!-- <q-item clickable v-close-popup @click="oauth_logout">
                    <q-item-section>Logout</q-item-section>
                </q-item> -->
</q-list>
</div>
</template>

<script>

import {SUPPORTED_LOCALES} from '../../../babel.config';
// import i18n from 'src/utils/i18n/i18n'
// import {set_new_locale} from 'src/utils/i18n/i18n.service'

export default {
  name: 'drawerDefault',
  data : function(){
    return {
        langs: SUPPORTED_LOCALES,
        user_setting_notification_email: true,
        user_setting_session_cookie: true
        // currentLanguage: i18n.locale
    }
  },

  methods: {
    logout: function(){
      this.$session.logout(this.$root.oauth_callback)
      let msg_title = 'SuccCessful Logout'
      let msg_body = 'You have been logged out successfully!'
      this.$emit("close_drawer_right");

      // this._flash.show({ status: 'info', title: msg_title, message: msg_body })
      // this.$router.push({ name: 'home' })
    }
  }
}
</script>
