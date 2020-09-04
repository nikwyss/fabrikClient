<template>
  <q-page class="doc_content" >

  <h1>{{$t('content.background.h1')}}</h1>

    <!-- RIGHT SIDE -->
    <div class="float-right">
    <ArtificialModerator alignment="left"  style="margin-right:0px" role="1">
        <template>
        {{ $t('content.background.am.page_introduction') }}
        </template>
    </ArtificialModerator>
    </div>
  
  <q-list class="q-ma-xl q-pt-xl rounded-borders" style="clear: both">
      
      <!-- ABOUT US / TEAM -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-account-group-outline"
        :label="$t('content.background.team.label')"
        header-class="text-secondary rounded-borders bg-primarylight"
      >
        <q-card>
          <q-card-section>
            {{$t('content.background.team.text')}}
          </q-card-section>
        </q-card> 
      </q-expansion-item>


      <!-- <q-separator /> -->

      <!-- DIGITAL PARTICIPATION -->
      <q-expansion-item group="somegroup" 
          icon="mdi-mouse-variant"
          :label="$t('content.background.digital_participation.label')"
          header-class="text-secondary">
        <q-card>
          <q-card-section>
            {{$t('content.background.digital_participation.text')}}
          </q-card-section>
        </q-card>
      </q-expansion-item>


      <!-- ARTIFICIAL MODERATORS -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-sign-direction"
        :label="$t('content.background.artificialmoderators.label')"
        header-class="text-secondary rounded-borders bg-primarylight"
      >
        <q-card>
          <q-card-section>
            {{$t('content.background.artificialmoderators.text')}}
          </q-card-section>
        </q-card> 
      </q-expansion-item>

      
      <!-- TRANSPARENCY -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-monitor-clean"
        :label="$t('content.background.transparency.label')"
        header-class="text-secondary"
      >
        <q-card>
          <q-card-section v-html="$t('content.background.transparency.text', {iconTechnicalTransparency: iconTechnicalTransparency})"></q-card-section>
        </q-card>
      </q-expansion-item>


      <!-- PRIVACY AND DATAPROTECTION -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-incognito"
        :label="$t('content.background.privacy.label')"
        header-class="text-secondary"
      >
        <q-card>
          <q-card-section>
            {{$t('content.background.privacy.text')}}
          </q-card-section>
        </q-card>
      </q-expansion-item>



      <!-- TECHNOLOGIES -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-hammer-screwdriver"
        :label="$t('content.background.technologies.label')"
        header-class="text-secondary"
      >
        <q-card>
          <q-card-section>
            {{$t('content.background.technologies.text')}}
            <div class="full-width" align="center">
            <q-img src="~assets/technologies.png" style="max-width: 400px;"   />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>



      <!-- THE NEXT STEPS OF THE PROJECT -->
      <q-expansion-item group="somegroup"
        icon="mdi-shoe-print"
        :label="$t('content.background.next_steps.label')"
        header-class="text-secondary">
        <q-card>
          <q-card-section>
            {{$t('content.background.next_steps.text')}}
          </q-card-section>
        </q-card>
      </q-expansion-item>

    </q-list>

    <!-- RIGHT SIDE -->
    <ArtificialModerator alignment="right" role="2">

        <template>
          {{ $t('content.background.am.open_questions') }}
        </template>

        <template  v-slot:actions>
          <q-chip size="md" icon="mdi-email-outline" outline  color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickSendEmail">
            {{ $t('content.background.am.cmd_email_composer') }}
          </q-chip>
        </template>

    </ArtificialModerator>

    </q-page>
</template>

<script>
import ArtificialModerator from 'src/artificialmoderation/components/ArtificialModerator'

export default {
  name: 'PageBackground',
  components: { ArtificialModerator},

  data() {
    return {
      iconTechnicalTransparency: '<i aria-hidden="true" role="presentation" class="q-tab__icon mdi mdi-monitor-clean q-icon notranslate"></i>'
    }
  },

  methods: {
    clickSendEmail: function () {
      // TODO: take email from environment variables
      const email = 'demokratiefabrik@protonmail.com'
      window.location.href = `mailto:${email}`
    }
  }
}
</script>
