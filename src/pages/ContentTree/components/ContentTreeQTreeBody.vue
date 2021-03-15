<template>
  <!-- EXPANDABLE-ALL: remove is_currently_expanded condition... -->
  <q-card
    v-if="isExpanded"
    flat
    class="full-width bg-none"
  >
    <q-card-section :style="node.children.length && realRootNodesIDs.includes(node.id) ? 'margin-left:1.4em' : ''">
      <div class="text-h5">{{ content.content.title }}</div>
      <div class="text-caption text-grey-9">
        {{ content.content.text }}
      </div>
    </q-card-section>

    <ContentToolbar
      :obj="content"
      v-if="IsContributor"
    />

  </q-card>
</template>


<script>
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar";
import { mapGetters } from "vuex";

export default {
  name: "ContentTreeQTreeBody",
  props: ["node", "content", "realRootNodesIDs"],
  components: {
    ContentToolbar,
  },
  inject: ["is_currently_expanded"],
  // "QUASAR_TREE", "contenttreeID", "popup_content_form"], // is injecting CONTENTTREE needed: only for contenttree_id, right?
  data() {
    return {};
  },

  computed: {
    isExpanded() {
      return this.is_currently_expanded(this.node);
    },
    ...mapGetters("assemblystore", [
      // "IsDelegate",
      // "IsExpert",
      "IsContributor",
      // "IsObserver",
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