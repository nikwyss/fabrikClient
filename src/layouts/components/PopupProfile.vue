<template>
<div full-width class=" bg-red">
  <q-popup-edit buttons  v-model="profile" ref="popup_profile" v-on:save="saveProfile">
      <!-- auto-save -->

    <div class="q-pa-md bg-grey-2">
      <div class="q-gutter-y-md column" style="max-width: 600px">
        <!-- HTML -->
        <!-- <b>{{$t('contenttree.editor.content_title')}}</b> -->
        <q-input type="text" v-model="profile.last_name"
          :shadow-text="$t('auth.profile_last_name')"
          maxlength="80"
          dense autofocus />

        <!-- <b>{{$t('contenttree.editor.content_text')}}</b> -->
        <q-input 
          v-model="profile.email"
          :shadow-text="$t('auth.profile_email')"
          :hint="$t('auth.profile_email_hint')"
          maxlength="80"
          dense />

      </div>


      <!-- Disclaimer -->
      <AlgorithmDisclaimer :text="$t('auth.profile_email_disclaimer')" />

{{$t('auth.profile_email_disclaimer')}}

    </div>
                  <!-- :validate="proteinRangeValidation" -->
              <!-- @hide="proteinRangeValidation" -->

    <template v-slot:title>
      <div v-if="action=='update'" class="text-italic text-primary">
       {{ $t('auth.profile_update_action') }}
      </div>
    </template>
  </q-popup-edit>
</div>
</template>

<script>
import ApiService from 'src/utils/xhr'
import api from 'src/utils/api';
import AlgorithmDisclaimer from "src/layouts/components/AlgorithmDisclaimer"


export default {
  name: 'PopupProfile',
  // inject: ['QUASAR_TREE', 'CTREE', 'limitNodeTypes'],

  data: function () {
    return {
      profile: {
        last_name: '1',  //this.oauth.payload.last_name, 
        email: '2'},
      // emailDisclaimerText: '',
      error: false,
      errormsg: '',
      action: null,
      btnlabel: ''
    }
  },

  methods: {

    initialize: function () {
      console.log('Initialize popup action ')
      api.authProfile({}).then(response => {
        if (response.data.last_name){
          // Okay
          console.log(this.profile)
          this.profile.email = response.data.email
          this.profile.last_name = response.data.last_name

        }else{
          // Error
          const message = this.$i18n.t('auth.profile_load_error')          
          this.$q.notify({
            type: 'error',
            message
          })
        }
      })



      // validate / and pre-select type
      // const types = this.contextNodeTypes
      // if (this.profile.type) {
      //   if (!types.includes(this.profile.type)){
      //       this.error = true
      //       this.errormsg = this.$i18n.t('contentree.editor.error.wrong_contenttype')
      //   }
      // }
      // if (types.length == 1 && !this.profile.type) {
      //   this.profile.type = types[0]
      // }
      this.$refs.popup_profile.show()
    },

    isValidEmail: function() {
        const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
        return emailPattern.test(this.profile.email) || 'Invalid email';
    },

    saveProfile: function() {
      console.log("Save profile")
      api.authProfile(this.profile).then(response => {

          console.log(response.data)
          console.log("Profile saved")
            
          // ERROR RESPONSE
          let message = ''
          if(response.data.ok) {
            console.log("data received")            
            message = this.$i18n.t('auth.profile_update_success')
          }else{
            message = this.$i18n.t('auth.profile_update_error')
          }
          
          this.$q.notify({
            type: response.data.ok ? 'info' : 'error',
            message
          })
        }
      )
    }
  }
}
</script>
