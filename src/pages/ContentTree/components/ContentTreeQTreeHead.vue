<template>
  <div
    @click.stop
    @keypress.stop
    :style="{
      'cursor': 'default', 
      'border-top': '5px solid white', 
      'background-color' :  headColor}"
    class='full-width q-pt-sm q-pb-none q-ma-none q-pr-sm q-pl-sm  vertical-top'
  >
    <q-badge
      color="blue"
      transparent
      style="left:17px; top: 5px;"
      class="absolute z-top "
      v-if="!isRead(content) && !isExpanded"
    >
      <!-- EXPANDABLE-ALL: v-if="isExpanded !== false" -->
      <q-tooltip>Dieser Beitrag haben Sie bisher noch nicht geöffnet.</q-tooltip>
      Neu
    </q-badge>
    <!--EXPANDABLE-ALL: :class="[prop.node.nof_descendants ? 'cursor-pointer' : '']" -->
    <div
      class="cursor-pointer"
      @click="toggle_node(node.id, content)"
    >
      <UserAvatar
        v-if="content.creator"
        :profile="content.creator"
      >
        <template v-slot:extrainfos>
          <span class="text-caption">
            ({{content.content.date_created | formatDate}})
          </span>
        </template>
      </UserAvatar>

      <!-- <span class="q-ml-sm vertical-top">
        <q-badge
          color="grey"
          class="on-left cursor-pointer "
          transparent
          @click.stop="$refs.backgroundDialog.toolbar = true"
          v-if="isExpanded"
        >
          <q-tooltip>Schauen Sie sich zusätzliche <br>Informationen zu diesem Beitrag an.</q-tooltip>
          Info
        </q-badge>

      </span> -->

      <span class="cursor-pointer float-right ">
        <span
          @click.stop="$refs.backgroundDialog.toolbar = true"
          v-if="isExpanded"
        >
          INFO |
          <q-tooltip>Schauen Sie sich zusätzliche <br>Informationen zu diesem Beitrag an.</q-tooltip>
        </span>
        <span>
          <!-- EXPANDABLE-ALL:  v-if="is_expandable(prop.node)" -->
          {{ isExpanded ? 'EINKLAPPEN' : 'AUSKLAPPEN' }}
          <q-tooltip v-if="isExpanded">Klicken Sie hier, um diesen Beitrag vollständig anzuzeigen.</q-tooltip>
          <q-tooltip v-if="!isExpanded">Klicken Sie hier um diesen Diskussionsast zu schliessen.</q-tooltip>
        </span>

      </span>

      <ContentBackground
        v-if="IsObserver"
        ref="backgroundDialog"
        name="`elBackground${obj.content.id}`"
        :obj="content"
      />
    </div>
  </div>
</template>


<script>
import ContentBackground from "./ContentBackground";
import { mapActions, mapGetters } from "vuex";
import UserAvatar from "src/layouts/components/UserAvatar";

export default {
  name: "ContentTreeQTreeHead",
  props: ["node", "content", "realRootNodesIDs"],
  components: {
    UserAvatar,
    ContentBackground,
  },
  inject: ["toggle_node", "is_currently_expanded", "isRead"],
  data() {
    return {};
  },

  computed: {
    isExpanded() {
      return this.is_currently_expanded(this.node);
    },

    headColor() {
      //   if (this.is_currently_expanded(this.node)) {
      //     return "";
      //   }

      //   if (this.isRead(this.content)) {
      //     return "#EEE";
      //   }

      //   if (this.node.children.length) {
      //     return "#F7F7F7";
      //   }

      return "";
    },

    // track_changes_color: function () {
    //   return this.track_changes ? "brown-9" : "grey-6";
    // },
    ...mapGetters("assemblystore", [
      // "IsDelegate",
      // "IsExpert",
      // "IsContributor",
      "IsObserver",
      // "IsManager",
    ]),
  },

  methods: {
    popup_edit() {
      this.popup_content_form("edit", this.content.content);
    },

    // ...mapActions({
    //   add_or_update_contenttree: "contentstore/add_or_update_contenttree",
    // }),
  },
};
</script>