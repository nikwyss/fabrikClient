<style>
.tooltip{
  max-width: 251px;
}
</style>

<template>
  <!-- <ArtificialModerator :text="['had']"> -->
  <Fragment>
    <div style="max-width:450px">
      <q-chat-message class="artificialmoderation" size=7 :text="text" :sent="alignment=='right' ? false : true" :class="actorClass">

        <slot></slot>

        <!-- assembly is PUBLIC => Assuming that visitor likes to see the results -->
        <template v-if="ongoing_request">
          <q-spinner-dots size="2rem" />
        </template>

        <template v-slot:avatar>
            <div style="z-index: 5">
                <q-tooltip content-class="tooltip" v-if="tooltip" anchor="bottom middle">{{tooltip}}</q-tooltip>
                <span style="position:relative; top:40px">
                <img :src="avatar" aria-hidden="true" class="q-message-avatar q-message-avatar--sent" />
                </span>
            </div>
        </template>

      </q-chat-message>
    </div>

    <!-- RESPONSE BAR -->
    <div style="text-align:center; margin-top:50px; " class="full-width" v-if="!!$slots.actions" >
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
  "group" -Prop allows to allocate exactly whether the displayed avatars are played by
    distinct actors or the same actors. However, it is only needed if parent component name of
    artificial moderators visible on the same browser page are different.
  */
  props: ['text', 'alignment', 'ongoing_request', 'randomSeed', 'role', 'i18n_path_prefix', 'amGroup'],

  computed: {
    /* Constant-Random-Allocate the actors to the AM-Roles
    For doing that calculate a constant number depending on the global random seed (localstorage) and the name
    of the parent component (the component where the AM is displayed.)
    => For each visitor and each component the allocation of actors to the Am-roles varies
    randomly. (However, the allocation remains constant over time, browser-instance and page-reloads.)
    */
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
      return (`img/actor${this.actor}.png`)
    },

    /* Shall the avatar be extended by a tooltip? */
    tooltip: function () {

      // Where in the i18n file are the tooltips stored?
      if (!this.i18n_path_prefix) {
        return (null)
      }

      // default value of AM-Role
      var role = parseInt(this.role)
      if (!role) { role = 1 }

      // get the tooltip (if there are mulitple tooltips defined for this role,
      // then take a random draw)
      let key = `${this.i18n_path_prefix}.am.tooltip.${role}`
      return (this.$tr(key, {actor: this.actorName}))
    },

    ...mapGetters({
      randomLocalStorageSeed: 'assemblystore/randomLocalStorageSeed'
    })
  }
}
</script>
