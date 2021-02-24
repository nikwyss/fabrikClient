<template>
  <div class=" q-ma-none q-pa-none" style="max-width: 100%">

    <h2>Themenwahl</h2>
    <p>Bitte wählen Sie das Thema, welches sie bearbeiten möchten.</p>
    <div class="q-gutter-none  q-ma-none q-pa-none">
      <div class="row justify-between  q-ma-none q-pa-none">
        <q-btn 
          v-for="topic in topics" 
          icon="mdi-sign-direction" 
          :label="topic.content.title"
          @click="selectTopic(topic)"
          class="q-pa-none q-ma-none"
          flat
          color="teal" 
          :key="`sm-${topic.content.id}`" />
      </div>
    </div>
  </div>
</template>

<script>
import { runtimeStore } from "src/store/runtime.store"

export default {
  name: 'VAATopicSelector',
  props: ["children"],
  inject: ['gotoIndexAndMoveOn', 'STAGE', 'CONTENTTREE'],
  data () {
    return {
      filter: '',
      columns: [
        { name: 'title', label: 'Title', field: 'title' },
        { name: 'text', label: 'Text', field: 'text' }
      ]
    }
  },

  computed: {

    topics () {
      let topics = this.CONTENTTREE.contenttree.structure.children.map(child => this.CONTENTTREE.contenttree.entries[child.id])
      // topics = topics.map(child => Object.assign(child.content, child.progression))
      return topics
    },

    
    // initials() {
    //   const initials = {}
    //   for (const [key, topic] of Object.entries(this.topics)) {
    //     const fullName = topic.content.title.split(' ')
    //     const tmpinitials = fullName.shift().charAt(0) + fullName.pop().charAt(0)
    //     console.log(tmpinitials)
    //     initials[topic.content.id] = tmpinitials.toUpperCase()
    //   }

    //   return initials
    // }
  },


  methods: {

    selectTopic(topic) {
      // const route = this.$router.currentRouteObject()
      const route = {
        name: 'VAA_QUESTIONNAIRE_QUESTIONS_ENTRY', 
        params: {
          contentID: topic.content.id,
          stageID: runtimeStore.stageID,
          assemblyIdentifier: runtimeStore.assemblyIdentifier
        }
      }
      console.log(route, "COMPOSED ROUTE")
      this.$router.pushR(route);
    }
  }
}
</script>