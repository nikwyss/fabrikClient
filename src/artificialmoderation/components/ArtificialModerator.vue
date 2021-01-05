<style>
.tooltip{
  max-width: 251px;
}
</style>

<template>
  <!-- <ArtificialModerator :text="['had']"> -->
  <Fragment>
    <div style="max-width:450px">
      <q-chat-message align="left" size=7 :text="text" :sent="alignment=='right' ? false : true" :class="['artificialmoderation', actorClass]">

        <slot></slot>

        <template v-if="ongoing_request">
          <q-spinner-dots size="2rem" />
        </template>

        <template v-slot:avatar>
            <div style="z-index: 5" >
              <q-tooltip v-model="tooltip_shown" content-class="tooltip" v-if="tooltip" 
                anchor="bottom middle">{{tooltip}}</q-tooltip>
              <span style="position:relative; top:40px" @click="tooltip_shuffle"  :class="tooltip_cursor" >
              <img :src="avatar" aria-hidden="true" class="q-message-avatar q-message-avatar--sent" />
              </span>
            </div>
        </template>

      </q-chat-message>
    </div>

    <!-- RESPONSE BAR -->
    <div  :class="['artificialmoderation', actorClass, 'full-width']" :style="`text-align:${invAlignment}; padding-${invAlignment}:100px`" 
        v-if="!!$slots.actions" >
        <slot name="actions"></slot>
    </div>

  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import { mapGetters } from 'vuex'

const numberOfActors = 2

export default {
  components: { Fragment },

  /*
  Props:
  "amGroup" -Prop allows to allocate exactly whether the displayed avatars (one one page) are played by
    distinct actors or the same actors. However, it is only needed in specific cases:
    - when two AMs are displayed on one browser page
    - and when the parent component name of the  artificial moderator components are distinct 
  */
  props: ['text', 'alignment', 'ongoing_request', 'randomSeed', 'role', 'i18n_path_prefix', 'amGroup'],
  data () {
    return {
        tooltip_nr: -1,
        available_tooltips: null,
        tooltip_shown: false
    }
  },

  computed: {
    /* Constant-Random-Allocate the actors to the AM-Roles
    For doing that calculate a constant number depending on the global random seed (localstorage) and the name
    of the parent component (the component where the AM is displayed.)
    => For each visitor and each component the allocation of actors to the Am-roles varies
    randomly. (However, the allocation remains constant over time, browser-instance and page-reloads.)
    */

    invAlignment: function() {
      return (this.alignment=='left' ? 'right': 'left')
    },

    actor: function () {

      let crc = 0
      if (this.amGroup) {
        crc = this.amGroup.length
      } else {
        crc = this.$parent.$options.name.length
      }
      const allocationShift = Math.floor(parseInt(this.randomLocalStorageSeed) + crc) % numberOfActors

      // default value (could also already be defined in the props field)
      var role = parseInt(this.role)
      if (!role) {
        role = 1
      }

      // Lets do the allocation of AM-roles and avatars.
      return ((role + allocationShift) % numberOfActors) + 1
    },

    // Which is the displayed name of the Actor?
    actorName: function () {
      return (this.$i18n.t(`am.actor.${this.actor}`))
    },

    actorClass: function () {
      return (`artificialmoderator${this.actor}`)
    },

    // Which is the displayed avatar of the AM-Actor?
    avatar: function () {

      let path = require(`src/assets/actor${this.actor}.png`)
      return (path )
    },

    /* Shall the avatar be extended by a tooltip? */
    // available_tooltips: function () {
    //   return(tooltips)
    // },

    /* Shall the avatar be extended by a tooltip? */
    tooltip_translation_key: function () {
      
      // default value of AM-Role
      var role = parseInt(this.role)
      if (!role) { role = 1 }

      // get the tooltip (if there are mulitple tooltips defined for this role,
      // then take a random draw)
      let key = `${this.i18n_path_prefix}.am.tooltip.${role}`
      
      return(key)
    },

    /* Shall the avatar be extended by a tooltip? */
    tooltip: function () {

      // Where in the i18n file are the tooltips stored?
      if (!this.i18n_path_prefix) {
        return (null)
      }


      if(this.available_tooltips === null){
        this.available_tooltips = this.$t(this.tooltip_translation_key, {actor: this.actorName})
      }

      if (this.tooltip_nr < 0){
        return(null)
      }

      // this.tooltip_nr = this.available_tooltips !== null && this.available_tooltips.length > 0 ? 0 : null
      // console.log("Entry" + this.tooltip_nr)

      return (this.$i18n.t(`${this.tooltip_translation_key}.${this.tooltip_nr}`, {actor: this.actorName}))
    },

    tooltip_cursor: function(){
      // console.log(this.available_tooltips.length)
      let cursor = this.available_tooltips ? 'cursor-pointer' : 'no-pointer-events'
      return cursor
    },

    ...mapGetters({
      randomLocalStorageSeed: 'assemblystore/randomLocalStorageSeed'
    })
  },

  methods: {
    tooltip_shuffle () {
      // take next tooltip
      this.tooltip_nr += 1
      // console.log("Shuffled tooltip " + this.tooltip_nr)

      
      if (this.tooltip_nr >= this.available_tooltips.length) {
        this.tooltip_shown = false
        this.tooltip_nr = -1
      } else {
        this.tooltip_shown = true
      }
    },

    tooltip_reset () {
      // take next tooltip
      this.tooltip_nr = 0
    }
  }
}
</script>
