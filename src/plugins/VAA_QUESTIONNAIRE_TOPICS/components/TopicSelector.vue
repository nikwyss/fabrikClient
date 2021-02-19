<template>
  <div class="q-pa-md" style="max-width: 500px">
    <div class="q-gutter-sm">
      <q-btn color="teal" v-for="topic in topics" :label="topic.content.title" 
        @click="selectTopic(topic)"
        :key="`sm-${topic.content.id}`" />
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
    }
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