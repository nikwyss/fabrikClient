<template>
  <!-- <span
    style="display:inline-block"
    class="vertical-bottom "
    padding="0px"
    color="white"
  > -->
  <!-- <q-toolbar shrink> -->
  <!-- REPLY BUTTON -->
  <!-- <q-btn
      v-if="obj.content.append_permission"
      @click="popup_create"
      flat
      padding="0px"
      margin="0px"
      class="q-pa-none q-ma-none"
      size="1.1em"
      stack
      icon="mdi-reply-outline"
    > Antwort -->
  <!-- <q-tooltip>{{obj.content.common_property ? $t('contenttree.toolbar.reply_proposal') : $t('contenttree.toolbar.reply')}}</q-tooltip> -->
  <!-- <q-tooltip>{{$t('contenttree.toolbar.reply')}}</q-tooltip>
    </q-btn> -->

  <!-- EDIT BUTTON -->
  <!-- <q-btn
      padding="5px"
      stack
      size="1.1em"
      flat
      @click="popup_edit"
      v-if="obj.content.edit_permission"
    >

      <template> -->
  <!-- <q-card
    flat
    class="bg-none"
    bordered
  > -->

  <q-card-actions
    align="right"
    horizontal
  >

    <q-card-section
      vertical
      align="center"
      @click="popup_edit"
      margin="0px"
      v-if="obj.content.edit_permission"
      class="q-pa-sm q-ma-none  cursor-pointer"
    >
      <q-icon
        right
        size="md"
        class="q-pa-none q-ma-none"
        name="mdi-reply-outline"
      />
      <q-card-section class="q-pa-none q-ma-none">
        Antwort
      </q-card-section>
    </q-card-section>

    <q-card-section
      vertical
      align="center"
      v-if="obj.content.append_permission"
      @click="popup_create"
      flat
      margin="0px"
      class="q-pa-sm q-ma-none cursor-pointer"
    >
      <q-icon
        right
        size="md"
        class="q-pa-none q-ma-none"
        name="mdi-playlist-edit"
      />
      <q-card-section class="q-pa-none q-ma-none">
        Ändern</q-card-section>
    </q-card-section>

    <ContentRatingThumbs
      name="`elRating${obj.content.id}`"
      :content="obj"
    />

  </q-card-actions>

  <!-- </q-card> -->

  <!-- <div class="row items-center ">
          <q-icon
            right
            name="mdi-playlist-edit"
          />
          <div class="text-center">
            Ändern
          </div>
        </div> -->

  <!-- icon="mdi-playlist-edit" -->
  <!-- <q-icon :name="button.ratingicon">
            <q-tooltip>{{$t(`contenttree.rating.${button.tooltipNr}`)}}</q-tooltip>
          </q-icon> -->

  <!-- </div> -->

  <!-- </template> -->

  <!-- <q-tooltip>{{obj.content.common_property ? $t('contenttree.toolbar.edit_proposal') : $t('contenttree.toolbar.edit')}}</q-tooltip> -->
  <!-- </q-btn> -->

  <!-- DELETE -->
  <!-- <q-btn
      padding="0px"
      round
      size="1.2em"
      dense
      flat
      stack
      v-if="obj.content.delete_permission"
      size="sm"
      @click="deletePrompt(obj.content)"
      :icon="obj.content.common_property ? 'mdi-delete-outline' : 'mdi-delete-circle-outline'"
    > -->
  <!-- <q-tooltip>{{obj.content.common_property ? $t('contenttree.toolbar.delete_proposal') : $t('contenttree.toolbar.delete')}}</q-tooltip>
    </q-btn> -->
  <!-- <q-separator v-if="obj.content.delete_permission" vertical inset /> -->

  <!-- Track changes -->
  <!-- <q-btn  @click="switchTrackChanges" :color="track_changes_color"
        size="sm"
        class="q-mr-sm primary red" round dense flat  title="Track changes" :icon="track_changes_icon">
        <q-tooltip>{{$t('contenttree.toolbar.track_changes')}}</q-tooltip>
      </q-btn> -->

  <!-- <q-separator vertical inset /> -->

  <!-- <ContentRatingThumbs
        v-if="IsContributor"
        name="`elRating${obj.content.id}`"
        :content="obj"
      /> -->
  <!-- 
    <ContentBackground
      v-if="IsObserver"
      ref="backgroundDialog"
      name="`elBackground${obj.content.id}`"
      :obj="obj"
    /> -->

  <!-- </q-toolbar> -->
  <!-- </div> -->
  <!-- </span> -->
</template>


<script>
// import ContentBackground from "./ContentBackground";
import ApiService from "src/utils/xhr";
import { mapActions, mapGetters } from "vuex";
import { runtimeStore } from "src/store/runtime.store";
import ContentRatingThumbs from "./ContentRatingThumbs";

export default {
  name: "ContentToolbarComponent",
  props: ["obj"],
  components: {
    ContentRatingThumbs,
  },
  inject: ["QUASAR_TREE", "contenttreeID", "popup_content_form"], // is injecting CONTENTTREE needed: only for contenttree_id, right?
  data() {
    return {
      confirm_deletion: false,
      confirm_deletion_content: null,
      confirm_deletion_justification: "",
      confirm_deletion_justification_error: false,
      confirm_deletion_justification_error_message: "",
      track_changes: this.obj.progression
        ? this.obj.progression.track_changes
        : false,
    };
  },

  computed: {
    // assemblyAcls: function () {
    //   return this.oauth.acls(runtimeStore.assemblyIdentifier);
    // },

    track_changes_icon: function () {
      return this.track_changes
        ? "mdi-bookmark-remove"
        : "mdi-bookmark-plus-outline";
    },
    track_changes_color: function () {
      return this.track_changes ? "brown-9" : "grey-6";
    },

    ...mapGetters("assemblystore", [
      "IsDelegate",
      "IsExpert",
      "IsContributor",
      "IsObserver",
      "IsManager",
    ]),
  },

  methods: {
    popup_edit() {
      this.popup_content_form("edit", this.obj.content);
    },

    popup_create() {
      this.popup_content_form("reply", { parent_id: this.obj.content.id });
    },

    deletePrompt(content) {
      var message = "";
      if (content.common_property) {
        message =
          "This is common property. You can submit a Proposal to delete this entry. However, provide a short justification, why do you think deletion is appropriate.";
      } else {
        message =
          "This is private property. If you want, you can delete it. However, please provide a short justification.";
      }

      this.$q
        .dialog({
          title: content.common_property
            ? this.$i18n.t("contenttree.toolbar.submit_delete_proposal")
            : this.$i18n.t("contenttree.toolbar.delete"),
          message: message,
          prompt: {
            model: "",
            isValid: (val) => val.length > 3, // << here is the magic
            type: "text", // optional
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          this.deleteEntry(content, data);
        });
    },

    // LOAD TREE
    // TODO: move deleteentry to contenttre.js
    deleteEntry(content, justification) {
      console.log("deleteEntry");
      var identifier = runtimeStore.assemblyIdentifier;
      console.assert(identifier);
      let url = `${process.env.ENV_APISERVER_URL}/assembly/${identifier}/contenttree/${QUASAR_TREE.contenttreeID}/content/${content.id}`;
      var data = { justification: justification };
      ApiService.delete(url, data).then((response) => {
        console.log("RESPONSE RECEIVED");
        var msg = null;

        // ON SUCCESS RESPONSE
        if (response.data.OK) {
          // update the whole tree
          this.add_or_update_contenttree({
            contenttreeID: QUASAR_TREE.contenttreeID,
            contenttree: response.data.contenttree,
          });

          // Zoom to parent entry (if catched)
          console.log("raise after-deletion (if catched in parent component)");
          this.$emit("afterdeletion");
        }

        this.$q.notify({
          type: response.data.OK ? "nFabrikInfo" : "nFabrikError",
          message: `${response.data.MESSAGE}`,
        });
      });
    },

    validateConfirmDeletion() {
      var has_error = false;
      this.confirm_deletion_justification_error_message = "";
      this.confirm_deletion_justification_error = false;

      if (
        !this.confirm_deletion_justification ||
        this.confirm_deletion_justification.length < 5
      ) {
        this.confirm_deletion_justification_error = true;
        this.confirm_deletion_justification_error_message =
          "Please indicate why you want to delete this entry. What is wrong with it?";
        has_error = true;
      }

      return !has_error;
    },

    switchTrackChanges: function () {
      this.track_changes = !this.track_changes;
      // TODO: IMPLEMENT
      //this.$emit('setTrackChanges', this.node, this.track_changes)

      var msg = "";
      if (this.track_changes) {
        msg = "You become notified about activities on this place";
      } else {
        msg = "Notifcation is disabled";
      }

      // if(response.data.OK) {
      // this.$q.notify({
      //   type: response.data.OK ? 'info' : 'error',
      //   message: `${response.data.MESSAGE}`
      // })

      this.$q.notify({
        type: "nFabrikInfo",
        message: `${msg}`,
      });
    },

    ...mapActions({
      add_or_update_contenttree: "contentstore/add_or_update_contenttree",
    }),
  },
};
</script>