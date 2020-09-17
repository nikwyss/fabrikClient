<template>
<div>

    <div v-if="startingContent_node.nof_descendants">

            <span style="float:right; margin-bottom:1.8em; margin-right:0.3em; display:inline-block">
            <q-btn
                    size="md"
                    round
                    @click="expand_more()"
                    :disabled="expanded.length>=this.total_nof_contents"
                    title="expand more"
                    color="secondary"
                    icon="mdi-expand-all"
                    />
            <q-btn
                    size="md"
                    round
                    @click="expand_none()"
                    color="secondary"
                    :disabled="expanded.length==0"
                    title="collapse all"
                    icon="mdi-collapse-all"
                    />
            <q-btn
                    size="md"
                    round
                    @click="expanded_filter = !expanded_filter; filter = expanded_filter ? filter : '';"
                    color="secondary"
                    icon="mdi-feature-search"
                    />

                    <div class="q-gutter-md"><q-input
                        ref="filter"
                        filled
                        v-show="expanded_filter"
                        v-model="filter"
                        label="Search">
                         </q-input>
                    </div>
                </span>
    </div>                

    <span class="text-h6" v-if="!dense">{{label}}</span>
    
    <!-- AFTER LOADING -->
    <div class="q-pa-none q-ma-none q-gutter-sm" v-if="contenttree">
        
        <span v-if="startingContent_node.nof_descendants">{{startingContent_node.nof_descendants}} Beiträge</span>

            <!-- TREE MENU -->
            <!-- tyle="float:right; margin-top: 0.5em; margin-bottom:1.8em; margin-right:0.3em; display:inline-block"
                    style="float:right; display :inline-block; max-width: 300px; font-size:0.3em;"
                     style="float:right; margin-top: 0.5em; margin-bottom:1.8em; margin-right:0.3em; display:inline-block"
                     -->

            <br>

            <!-- Tree -->
            <q-tree
                ref="qtree"
                :nodes="startingContent_node.children"
                label-key="id"
                nodeKey="id"
                icon="mdi-play"
                :expanded.sync="expanded"
                @update:expanded="updateExpanded"
                :filter="filter"
                color="teal-10"
                style="clear:both;"
                :filter-method="treeFilterMethod"
                no-results-label="No matching entries found"
                no-nodes-label="Es sind noch keine Kommentare oder Fragen vorhanden. Machen Sie den Anfang?">

                <!-- Content Header -->
                <!-- OPTION: <template v-slot:header-topic="prop">-->
                    <!-- @deleteentry="deleteentry($event)" -->
                <template v-slot:default-header="prop">
                <ContentTitle
                    v-if="root_node_ids.includes(prop.node.id) || is_currently_expanded(cachedNode(prop.node.id).content.parent_id)"
                    :node="prop.node"
                    :obj="cachedNode(prop.node.id)" 
                    :expanded="prop.expanded"
                    :key="prop.node.id"
                    :contenttree="contenttree"
                    :acl="acl" />
                </template>

                <!-- Content Body -->
                <template v-slot:default-body="prop">

                    <div style="margin-bottom:0.5em;"  size="text-body1" >

                    {{ cachedNode(prop.node.id).content.text }}

                    <ContentEditor
                        v-if="acl.includes('contribute')"
                        :contenttreeID="contenttree.id"
                        :parent_id="prop.node.id"
                        @zoom-to-content="zoomToContent"
                        />
                    </div>
                </template>

            </q-tree>


            <!-- Add a new top-level entry -->
            <ContentEditor  
                :contenttreeID="contenttree.id"
                v-if="acl.includes('contribute')"
                @zoom-to-content=zoomToContent
                :parent_id="startingContentID"
                                class="full-width"
                 />

            <!-- Disclaimer -->

            <q-expansion-item
                v-if="startingContent_node.children.length>1"
                expand-separator
                icon="mdi-format-paragraph"
                label="Algorithmus-Disclaimer:"
                class="full-width"
            >
                          <!-- caption="John Doe" -->
                <q-card>
                <q-card-section>
                    <span>
                    Die Inhalte in diesem Forum werden in hierarchischer (und nicht in chronologischer) Reihenfolge aufgelistet.
                    Die Reihenfolge der Inhalte auf gleicher Hierarchiestufe ist zufällig und variiert von Benutzer zu Benutzer.
                    </span>
                    <span v-if="startingContent_node.children.length>30">
                    Die Diskussion ist schon recht umfassend. Damit die Diskussion übersichtlich bleibt, wurden nur 30 zufällig ausgewählte Beiträge vollständig aufgeklappt.
                    Sie können die restlichen Beiträge selbst per Mausklick öffnen.
                    </span>
                </q-card-section>
                </q-card>
          </q-expansion-item>

        </div>


    <!-- DURING LOADING -->
    <div v-else>
        <q-spinner-rings color="primary" size="2em"/>
        <q-tooltip :offset="[0, 8]">Bitte warten. Die Daten werden geladen.</q-tooltip>
    </div>

</div>
</template>

<script>
import QTreeMixin from "src/mixins/qtree"
import ContentTitle from "./ContentTitle"
import Fragment from 'vue-fragment'
// import ContentBody from "./ContentBody"
import ContentEditor from "./ContentEditor"

export default {
    name: "ContentTree",
    mixins: [QTreeMixin],
    props: ['contenttree', 'contenttree', 'startingContentID', 'custom_starting_node', 'acl', 'label', 'dense'],
    components: {ContentTitle, ContentEditor, Fragment}
}
</script>
