<template>

<div align="center" >

  <q-tabs v-model="currenttab">
    <CustomQRouteTab
      name="home"
      icon="mdi-calendar-text"
      exact
      :to="{ 
        name: 'assembly_home', 
        params: {assemblyIdentifier: this.assemblyIdentifier}
      }"
      :label="$t('menu.items.home.label')"
      :menuOffset="menuOffset"
      :highlighted="currentSection==sections[0]"
      :tooltip="$t('menu.items.home.tooltip')"
      :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
    />

    <CustomQRouteTab
      name="showcase"
      icon="mdi-eye-outline"
      v-if="stages_by_section[1]"
      :to="{
        name: 'VAA_QUESTIONNAIRE_TOPICS',
        params: {
          assemblyIdentifier: this.assemblyIdentifier,
          stageID: stages_by_section[1].stage.id
          }
      }"
      label="Wahlthemen"
      :menuOffset="menuOffset"
      :tooltip="$t('menu.items.assembly.tooltip')"
      :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      :highlighted="currentSection==sections[1]"
      :disable="!stages_by_section[1] || !is_stage_accessible(stages_by_section[1])"
    />

    <CustomQRouteTab
      name="assemblies"
      v-if="stages_by_section[2]"
      :to="{
        name: 'VAA_QUESTIONNAIRE_QUESTIONS',
        params: {
          assemblyIdentifier: this.assemblyIdentifier,
          stageID: stages_by_section[2].stage.id
          }
      }"
      icon="mdi-lead-pencil"
      label="Fragenkatalog"
      alert="orange"
      :menuOffset="menuOffset"
      :tooltip="$t('menu.items.assembly.tooltip')"
      :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      :highlighted="currentSection==sections[2]"
      :disable="!stages_by_section[2] || !is_stage_accessible(stages_by_section[2])"
    />
    
    
    <CustomQRouteTab
      name="analyses"
      :to="{
        name: 'VAA_QUESTIONNAIRE_ANALYSES',
        params: {
          assemblyIdentifier: this.assemblyIdentifier,
          stageID: stages_by_section[2].stage.id
        }
      }"
      icon="mdi-lead-pencil"
      label="Resultate"
      :menuOffset="menuOffset"
      :tooltip="$t('menu.items.assembly.tooltip')"
      :tooltipIfDisabled="$t('menu.items.locked.tooltip')"
      :highlighted="currentSection==sections[3]"
      :disable="!stages_by_section[3] || !is_stage_accessible(stages_by_section[3])"
    />

  </q-tabs>
</div>
</template>


<script>
import CustomQRouteTab from "src/layouts/components/CustomQRouteTab";
import VAAMixin from '../mixins/VAA'

export default {

  name: "AssemblyMenu",
  mixins: [VAAMixin],
  props: ['menuOffset'],
  components: { CustomQRouteTab },
  data: function () {
    return {
      currenttab: "",
    };
  },

  computed: {
    stages_by_section: function () {
      return (this.sections.map(section => this.getFirstStageBySection(section))) 
    }
  },
}

</script>