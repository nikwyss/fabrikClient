<template>
  <q-page class="doc_content" >

  <h1>{{$t('background.h1')}}</h1>

  <!-- RIGHT SIDE -->
  <div align="right">
  <ArtificialModerator alignment="left" role="1">
      <template>
      {{ $t('background.am.page_introduction') }}
      </template>
  </ArtificialModerator>
  </div>

  <q-list class="q-ma-xl q-pt-xl rounded-borders" style="clear: both">
      
      <!-- CITIZEN ASSEMBLIES -->
      <q-expansion-item group="somegroup" 
          icon="mdi-account-supervisor-circle"
          :label="$t('background.citizen_assemblies.label')"
          header-class="text-secondary">
        <q-card>
          <q-card-section>
            {{$t('background.citizen_assemblies.text')}}
          </q-card-section>
        </q-card>
      </q-expansion-item>


      <!-- DIGITAL PARTICIPATION -->
      <q-expansion-item group="somegroup" 
          icon="mdi-mouse-variant"
          :label="$t('background.digital_participation.label')"
          header-class="text-secondary">
        <q-card>
          <q-card-section>
            {{$t('background.digital_participation.text')}}
          </q-card-section>
        </q-card>
      </q-expansion-item>


      <!-- TRANSPARENCY -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-monitor-clean"
        :label="$t('background.transparency.label')"
        header-class="text-secondary"
      >
        <q-card>
          <q-card-section v-dompurify-html="$t('background.transparency.text', {iconTechnicalTransparency: iconTechnicalTransparency})"></q-card-section>
        </q-card>
      </q-expansion-item>


      <!-- PRIVACY AND DATAPROTECTION -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-incognito"
        :label="$t('background.privacy.label')"
        header-class="text-secondary"
      >
        <q-card>
          <q-card-section>
            {{$t('background.privacy.text')}}
          </q-card-section>
        </q-card>
      </q-expansion-item>



      <!-- ARTIFICIAL MODERATORS -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-sign-direction"
        :label="$t('background.artificialmoderators.label')"
        header-class="text-secondary rounded-borders bg-primarylight"
      >
        <q-card>
          <q-card-section>
            {{$t('background.artificialmoderators.text')}}
          </q-card-section>
        </q-card> 
      </q-expansion-item>

      
      <!-- ABOUT US / TEAM -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-account-group-outline"
        :label="$t('background.team.label')"
        header-class="text-secondary rounded-borders bg-primarylight"
      >
        <q-card>
          <q-card-section>
            {{$t('background.team.text')}}
          </q-card-section>
        </q-card> 
      </q-expansion-item>



      <!-- TECHNOLOGIES -->
      <q-expansion-item
        group="somegroup"
        icon="mdi-hammer-screwdriver"
        :label="$t('background.technologies.label')"
        header-class="text-secondary"
      >
        <q-card>
          <q-card-section>
            {{$t('background.technologies.text')}}
            <div class="full-width" align="center">
            <q-img src="~assets/technologies.png" style="max-width: 400px;"   />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>


      <!-- THE NEXT STEPS OF THE PROJECT -->
      <q-expansion-item group="somegroup"
        icon="mdi-shoe-print"
        :label="$t('background.next_steps.label')"
        header-class="text-secondary">
        <q-card>
          <q-card-section v-dompurify-html:alink="$t('background.next_steps.text', {linkAPS})" />
        </q-card>
      </q-expansion-item>

    </q-list>

    <!-- RIGHT SIDE -->
    <ArtificialModerator alignment="right" role="2" i18n_path_prefix="background">

        <template>
          {{ $t('background.am.open_questions') }}
        </template>

        <template  v-slot:actions>
          <q-chip size="md" icon="mdi-email-outline" outline  color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickSendEmail">
            {{ $t('background.am.cmd_email_composer') }}
          </q-chip>
        </template>

    </ArtificialModerator>

    </q-page>
</template>

<script>
import ArtificialModerator from 'src/components/ArtificialModerator'

export default {
  name: 'PageBackground',
  components: { ArtificialModerator},

  data() {
    return {
      linkAPS: '<a href="https://anneepolitique.swiss/pages/postvotes" target="_blank"> Webseite des Année Politique Suisse</a>',
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
