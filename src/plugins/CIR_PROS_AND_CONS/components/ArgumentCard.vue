<template>
<span>
        <span v-on:click.stop v-if="standalone" style="float:right;">
         <ContentToolbar
            :obj="content"
            @afterdeletion="openIndex()">
          </ContentToolbar>
        </span>
      <q-card class="q-ma-md cursor-pointer" flat bordered v-if="content" @click="openArgument(content.content)">

      <!-- COMMON -->
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs" style="height: 350px" >
          <div class="text-overline full-width">{{content.content.type}}</div>
          <div class="text-h5 q-mt-sm q-mb-xs">{{content.content.title}}</div>
          <div class="text-caption text-grey">
            {{content.content.text}}
          </div>
        </q-card-section>

        <div class="watermark">
           Genehmigung<br>ausstehend.
        </div>
      </q-card-section>

      <q-separator v-if="!standalone"  />
      <q-card-actions v-if="!standalone" >

        <q-space />
        <q-btn flat color="primary" round icon="mdi-clipboard-edit"> Discuss & Rate</q-btn>

        <!-- <ContentRating
          name="`elRating${content.content.id}`"
          v-if="standalone && ABLY.assembly_acls.includes('contribute')"
          :content="content"
        /> -->

      </q-card-actions>

    </q-card>

    <!-- Empty Card -->
    <q-card class="q-ma-md" flat bordered v-if="content===null">
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs" style="height: 350px" >
          <div class="text-overline">{{default_content_type}}</div>
          <div class="text-h5 q-mt-sm q-mb-xs">Placeholder</div>
          <div class="text-caption text-grey">
            Wissen Sie ein {{default_content_type}}-Argument, das in dieser List noch fehlt?          </div>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-space />

        <ContentEditor
            v-if="ABLY.assembly_acls.includes('contribute')"
            :content_type="default_content_type"
            @zoom-to-content="openArgument(content.content)"
            btnlabel="Add Argument"
            icon="mdi-folder-plus-outline"
            />
      </q-card-actions>
    </q-card>
</span>
</template>


<script>
// import { Fragment } from 'vue-fragment'
import ContentRating from "src/pages/ContentTree/components/ContentRating"
import ContentEditor from "src/pages/ContentTree/components/ContentEditor"
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar"

export default {
  name: 'ArgumentCard',
  props: ['content', 'standalone', 'default_content_type'],
  components: { ContentRating, ContentEditor, ContentToolbar},
  inject: ['ABLY', 'openIndex', 'openArgument']
}
</script>
