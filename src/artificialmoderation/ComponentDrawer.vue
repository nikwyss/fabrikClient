<template>
<div class="q-pa-none">
<q-list  bordered>
    <!-- Visitors => Login -->
    <q-item-section v-if="!oauth.authorized">


      <q-item tag="label" v-ripple>
        <q-item-section class="text-secondary">
          <q-item-label v-t="'auth.salutation_for_guests'" />
          <q-item-label caption  v-t="'auth.login_button_text'" />
        </q-item-section>
      </q-item>
<!-- oauth.authorized.redirect_to_provider() -->
      <q-item
        clickable
        v-ripple
        @click="oauth.login()"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-icon name="mdi-login" />
        </q-item-section>

        <q-item-section v-t="'auth.login_button_label'"/>
      </q-item>
    </q-item-section>

    <!-- Account Info -->
    <q-item-section v-if="oauth.authorized">

      <q-item tag="label" v-ripple>
        <q-item-section>
          <q-item-label>Dear {{oauth.username}}</q-item-label>
          <q-item-label caption>Klicken Sie auf Logout, wenn Sie sich abmelden möchten. </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        @click="oauth.logout()"
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

      <q-item tag="label" v-ripple  v-if="oauth.authorized">
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

</q-list>
</div>
</template>

<script>

// TODO: supported_locales??
import {SUPPORTED_LOCALES} from '../../../babel.config';

export default {
  name: 'drawerDefault',
  data : function() {
    return {
        langs: SUPPORTED_LOCALES,
        user_setting_notification_email: true,
        user_setting_session_cookie: true
    }
  }
}
</script>
