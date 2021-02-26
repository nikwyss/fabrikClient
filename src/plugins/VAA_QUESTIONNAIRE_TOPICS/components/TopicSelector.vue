<template>
      <div class="row justify-between  q-ma-none q-pa-none">
        <!-- <q-btn outline 
          v-for="topic in topics" 
          :label="topic.content.title"
          icon="mdi-sign-direction" 
          @click="selectTopic(topic)"
          style="color: goldenrod;"
          class="q-mt-md" 
          :key="`sm-${topic.content.id}`" /> -->

        <q-carousel
            :value="value"
            swipeable
            animated
            transition-prev="slide-right"
            transition-next="slide-left"
            control-type="unelevated"
            navigation
            infinite
            navigation-icon="mdi-checkbox-blank-circle"
            navigation-active-icon="mdi-checkbox-circle"
            padding
            arrows
            @input="input"
            style="width:100%"
            height="300px"
            class="text-vaatopic rounded-borders"
            control-color="vaatopic"
          >
            <q-carousel-slide 
                name="index"
                class="column no-wrap flex-center"
                :key="`topic-content`">
                <q-icon name="mdi-routes" size="xl" />
              <div class="q-mt-md text-center"   style="font-size: 1.3rem;">
                  Bitte wählen Sie mit<br />den Pfeilen ein Thema aus!
              </div>
            </q-carousel-slide>

            <q-carousel-slide 
                :name="topic.content.id" 
                v-for="topic in topics"
                class="column no-wrap flex-center"
                :key="`topic-${topic.content.id}`"
                >
              <div class="q-mt-md text-center">
                <h2><q-icon name="mdi-sign-direction" size="56px" /><br /> {{ topic.content.title }} </h2>
              </div>
            </q-carousel-slide>
          </q-carousel>
      </div>
</template>

<script>

export default {
  name: 'VAATopicSelector',
  props: ['topicID'], 
  inject: ['CONTENTTREE'],
  computed: {

    topics () {
      let topics = this.CONTENTTREE.contenttree.structure.children.map(child => this.CONTENTTREE.contenttree.entries[child.id])
      return topics
    },

    value () {
      return this.topicID ? parseInt(this.topicID) : 'index'
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
    input(topicID) {
      this.$emit("input", topicID == 'index' ? null : topicID)
    }
  }
}
</script>