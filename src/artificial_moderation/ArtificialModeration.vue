<style>
.tooltip {
  max-width: 251px;
}
</style>

<template>
  <div
    v-if="AM && Object.values(AM).length"
    :align="alignment"
    class="full-width"
  >
    <div
      v-if="enabled"
      align="left"
      style="max-width:450px;"
    >
      <q-chat-message
        size=7
        :text="loading ? [] : text"
        :sent="alignment=='left' ? false : true"
        :class="['artificialmoderation', actorClass]"
      >
        <template v-if="loading">
          <q-spinner-dots size="2rem" />
        </template>

        <template v-slot:avatar>
          <div style="z-index: 5">
            <span style="position:relative; top:40px">
              <img
                :src="avatar"
                aria-hidden="true"
                class="q-message-avatar q-message-avatar--sent"
              />
            </span>
          </div>
        </template>

      </q-chat-message>

      <div
        :class="['artificialmoderation', actorClass, 'full-width']"
        :style="`text-align:${alignment}; padding-${alignment}:100px`"
        v-if="buttons"
      >

        <q-chip
          v-for="(item, index) in buttons"
          :key="index"
          :icon="item.icon"
          :size="item.size ? item.size : 'md'"
          outline
          color="#EEE"
          clickable
          @click="item.action(ctx)"
        >
          {{ item.label ? item.label(ctx) : '...'}}
        </q-chip>

        <!-- <slot name="actions"></slot> -->
      </div>
    </div>

    <span
      v-if="!slim"
      class="q-mb-lg"
    >&nbsp;</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

/** EXAMPLE OF A AM-CONFIGURATION OBJECT
  topics_after_saliencing: {
    condition: (ctx) => ctx.routed_stage,
    items: [
      {
        body: `Sie sehen hier nun ihre persönliche Prioritätenliste der Wahlthemen. Sind sie mit Ihrer Priorisierung vorerst mal einverstanden?`,
        condition: (ctx) => ctx.salienceCompleted,
        buttons: [
          {
            action: (ctx) => ctx.gotoIndexAndMoveOn(),
            label: 'Ja, wir können weiterfahren!'
            // icon: null,
            // icon_rigth: null,
          }
        ]
      }
    ]
  }
 * 
 */
const numberOfActors = 2;

export default {
  /*
  Variables:
  "this.amGroup" -Prop allows to specify whether the ArtificialModerators are played by
    distinct actors or the same actors. However, it is only needed in specific cases. 
    (If not specified, it is a random choice)
  */
  props: {
    AM: {
      // AM Configuration Data-Object (see above)
      type: Object,
      required: true,
    },
    ctx: {
      // Context, where all the required varaibles are defiend. (passed to ongoing, condition ete. functions)
      type: Object,
      required: true,
    },
    slim: {
      // low margins around the AM
      type: Boolean,
      default: false,
    },
    displayMode: {
      // what to do, when there are multiple messages to display?
      type: String,
      default: "randomOne",
      validator(value) {
        return ["randomOne", "all"].indexOf(value) !== -1;
      },
    },

    alignment: {
      // right, left, center
      type: String,
      default: "left",
      validator(value) {
        return ["left", "center", "right"].indexOf(value) !== -1;
      },
    },
    amGroup: {
      /* Constant-Random-Allocate the actors to the AM-Roles
      For doing that calculate a constant number depending on the global random seed (localstorage) and the name
      of the context(ctx)-component (the component where the AM is displayed.)
      => For each visitor and each component the allocation of actors to the Am-roles varies
      randomly. (However, the allocation remains constant over time, browser-instance and page-reloads.)
      */
      default: null,
      type: String,
    },
    role: {
      default: null,
      required: false,
      type: Number || null,
    },
  },

  computed: {
    enabled() {
      console.log("ENABLED");
      return this.AM && (!this.AM.condition || this.AM.condition(this.ctx));
    },

    loading() {
      return this.AM && this.AM.loading && this.AM.loading(this.ctx);
    },

    validItems() {
      return this.AM.items.filter((item) => {
        return (
          item.text?.length > 0 && (!item.condition || item.condition(this.ctx))
        );
      });
    },

    selectedItems() {
      if (!this.validItems) {
        return [];
      }

      if (this.displayMode == "randomOne") {
        // randomly select one item!
        return [
          this.validItems[Math.floor(Math.random() * this.validItems.length)],
        ];
      }

      // Select all Items
      return this.validItems;
    },

    text() {
      return this.selectedItems.map((item) => {
        return item.body(this.ctx);
      });
    },

    buttons() {
      var buttons = [];
      this.selectedItems.forEach((item) => {
        if (item.buttons) {
          item.buttons.forEach((button) => {
            if (button && (!button.condition || button.condition(this.ctx))) {
              buttons.push(button);
            }
          });
        }
      });

      if (this.AM.buttons && this.AM.buttons.length) {
        this.AM.buttons.forEach((button) => {
          if (button && (!button.condition || button.condition(this.ctx))) {
            buttons.push(button);
          }
        });
      }
      return buttons;
    },

    actor: function () {
      var crc = 0;
      if (this.amGroup) {
        for (var i = 0; i < this.amGroup.length; i++) {
          crc += this.amGroup.charCodeAt(i);
        }
      } else {
        crc = this.ctx.$options.name.length + JSON.stringify(this.AM).length;
      }
      crc = Math.round(((parseInt(this.randomLocalStorageSeed) + crc) * 3) / 2);
      const allocationShift = crc % numberOfActors;

      // default value (could also already be defined in the props field)
      var role = parseInt(this.role);
      if (!role) {
        role = 1;
      }

      // Lets do the allocation of AM-roles and avatars.
      return ((role + allocationShift) % numberOfActors) + 1;
    },

    // Which is the displayed name of the Actor?
    actorName: function () {
      return this.$i18n.t(`am.actor.${this.actor}`);
    },

    actorClass: function () {
      return `artificialmoderator${this.actor}`;
    },

    // Which is the displayed avatar of the AM-Actor?
    avatar: function () {
      let path = require(`src/assets/actor${this.actor}.png`);
      return path;
    },

    invAlignment: function () {
      if (this.alignment == "left") {
        return "right";
      }
      if (this.alignment == "rigth") {
        return "left";
      }
      return this.alignment;
    },

    ...mapGetters({
      randomLocalStorageSeed: "assemblystore/randomLocalStorageSeed",
    }),
  },

  mounted() {
    if (!Object.values(this.AM).length) {
      console.log(
        "Artificial Moderator did not receive any instructions. AM is empty..."
      );
    }
  },
};
</script>
