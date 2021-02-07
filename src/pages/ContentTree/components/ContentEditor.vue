<template>
  <div
    full-width
    class=" bg-red"
  >
    <q-popup-edit
      buttons
      v-model="localmodel"
      ref="popup_content_formor"
      v-on:save="saveContent"
    >
      <!-- auto-save -->

      <div class="q-pa-md bg-grey-2">
        <div
          class="q-gutter-y-md column"
          style="max-width: 600px"
        >
          <!-- HTML -->
          <!-- <b>{{$t('contenttree.editor.content_title')}}</b> -->
          <q-input
            type="text"
            v-model="localmodel['title']"
            :shadow-text="$t('contenttree.editor.content_title_shadow')"
            counter
            maxlength="60"
            dense
            autofocus
          />

          <!-- <b>{{$t('contenttree.editor.content_text')}}</b> -->
          <q-input
            v-model="localmodel['text']"
            :shadow-text="$t('contenttree.editor.content_text_shadow')"
            :hint="$t('contenttree.editor.content_text_hint')"
            type="textarea"
            counter
            maxlength="300"
            dense
          />

          <br />

          <span :hidden="contextNodeTypesOptions.length <= 1">
            <b>{{$t('contenttree.editor.content_type')}}</b><br>
            {{$t('contenttree.editor.content_type_hint')}}
            <q-option-group
              name="preferred_genre"
              v-model="localmodel['type']"
              :options="contextNodeTypesOptions"
              dense
              color="primary"
              inline
            />
          </span>
        </div>
      </div>

      <template v-slot:title>
        <div
          v-if="action=='create'"
          class="text-italic text-primary"
        >
          {{ $t('contenttree.editor.head_create') }}
        </div>
        <div
          v-if="action=='reply'"
          class="text-italic text-primary"
        >
          {{ $t('contenttree.editor.head_reply') }}
        </div>
        <div
          v-if="action=='edit'"
          class="text-italic text-primary"
        >
          {{ $t('contenttree.editor.head_edit') }}
        </div>
      </template>
    </q-popup-edit>
  </div>
</template>

<script>
import {mapGetters, mapActions } from "vuex"
import api from "src/utils/api"
import { runtimeStore } from 'src/store/runtime.store';

export default {
  name: "ContentEditor",
  inject: ["QUASAR_TREE", "CONTENTTREE", "limitNodeTypes"],

  data: function () {
    return {
      localmodel: {},
      error: false,
      errormsg: "",
      action: null,
      btnlabel: "",
    };
  },

  computed: {
    /* Get all context types that are allowed at this position.
    There are a) general contenttree restrictions (See Configuration.CONTENT_TYPES),
    There are b) parentType restrictions (See Configuration.ONTOLOGY),
    and there are c) context restrictions (See QTree.customLimitNodeTypes-Prop)),
     */
    contextNodeTypes: function () {
      if (!("id" in this.localmodel)) {
        return [];
      }

      var parentType = null;
      if (this.localmodel.parent_id) {
        console.log(this.localmodel.parent_id);
        const parent = this.CONTENTTREE.contenttree.entries[this.localmodel.parent_id]
          .content;
        parentType = parent.type;
      }

      var context_node_types = this.get_allowed_node_types({
        contenttreeID: this.CONTENTTREE.contenttreeID,
        parentType: parentType,
      });

      // are there any filtered node types in this context?
      context_node_types = context_node_types.filter((v) =>
        this.limitNodeTypes.includes(v)
      );
      if (!context_node_types) {
        this.error = true;
        this.errormsg = this.$i18n.t(
          "contentree.editor.error.type_misconfiguration"
        );
        // this.$refs.popup_content_formor.disabled = true
      }
      // this.$refs.popup_content_formor.disable = true
      return context_node_types;
    },

    contextNodeTypesOptions: function () {
      const options = Object.values(
        this.contextNodeTypes.reduce((obj, cur, i) => {
          return {
            ...obj,
            [i]: {
              value: cur,
              label: this.$i18n.t(`contenttree.types.${cur}`),
            },
          };
        }, [])
      );
      return options;
    },

    ...mapGetters({
      get_allowed_node_types: "contentstore/get_allowed_node_types",
    }),
  },

  methods: {
    initialize: function (action, model) {
      console.log("Initialize popup action " + action);
      this.action = action;

      const template = {
        id: null,
        title: "",
        text: "",
        parent_id: null,
      };

      // take template as default values
      model = {
        ...template,
        ...model,
      };

      // remove all keys that are not in the template object
      const keys_to_keep = Object.keys(template);
      for (var k in model) {
        if (keys_to_keep.indexOf(k) < 0) {
          delete model[k];
        }
      }

      // store model
      this.localmodel = model;

      // validate / and pre-select type
      const types = this.contextNodeTypes;
      if (this.localmodel.type) {
        if (!types.includes(this.localmodel.type)) {
          this.error = true;
          this.errormsg = this.$i18n.t(
            "contentree.editor.error.wrong_contenttype"
          );
        }
      }
      if (types.length == 1 && !this.localmodel.type) {
        this.localmodel.type = types[0];
      }
      this.$refs.popup_content_formor.show();
    },

    saveContent: function () {
      // console.log(this.localmodel)
      console.log("Save content");
      console.assert(this.CONTENTTREE.contenttreeID);
      var assemblyIdentifier = runtimeStore.assemblyIdentifier;
      console.assert(assemblyIdentifier);

      api
        .saveContent(
          assemblyIdentifier,
          this.CONTENTTREE.contenttreeID,
          this.localmodel
        )
        .then((response) => {
          console.log(response.data);
          console.log("Model saved");

          // ERROR RESPONSE
          if (response.data.OK) {
            console.log("data received");

            // update the whole tree
            if ("contenttree" in response.data) {
              this.add_or_update_contenttree({
                contenttreeID: this.CONTENTTREE.contenttreeID,
                contenttree: response.data.contenttree,
              });
            }

            // Zoom to newly created entry
            if ("content" in response.data) {
              var editor = this;
              setTimeout(function () {
                console.log("raise Zoomer CONTENT");
                editor.$emit("zoom-to-content", response.data.content);
              }, 75);
            }
          }

          this.$q.notify({
            type: response.data.OK ? "nFabrikInfo" : "nFabrikError",
            message: `${response.data.MESSAGE}`,
          });
        })
        .catch((error) => {
          console.warn(error);
          // Error Handling is done in Axios Interceptor
          console.warn("Request Error");
        });
    },

    ...mapActions({
      add_or_update_contenttree: "contentstore/add_or_update_contenttree",
    }),
  },

  // created: function () {
  //   if (this.contentType) {
  //     this.localmodel['type'] = this.contentType
  //   }
  // }
};
</script>
