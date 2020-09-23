<template>
<div>

    <!-- AM-ContentTree Index -->
    <div class="q-mb-xl">
        <component 
            v-if="artificialmoderationComponents && 'ContentTreeIndex' in artificialmoderationComponents"
            :is="artificialmoderationComponents.ContentTreeIndex"
            :startingContentNode="startingContentNode"
            :ongoing="!startingContentNode || oauth_authenticated === null" 
            align="left"
        />
    </div>

    <div v-if="startingContentNode.children && startingContentNode.children.length">
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

    <span class="text-h6" v-if="label">{{label}}</span>

    <!-- AFTER LOADING -->
    <div class="q-pa-none q-ma-none q-gutter-sm" v-if="startingContentNode">

        <span v-if="startingContentNode.nof_descendants && !hideNofEntriesText">
        {{startingContentNode.nof_descendants}} Beiträge
        </span>

        <q-tree
            ref="qtree"
            :nodes="startingContentNode.children"
            label-key="id"
            nodeKey="id"
            icon="mdi-play"
            :expanded.sync="expanded"
            @update:expanded="updateExpanded"
            :filter="filter"
            color="teal-10"
            style="clear:both;"
            :filter-method="treeFilterMethod"
            :no-results-label="$t('contenttree.no_filter_results')"
            :no-nodes-label="hideNoEntryText ? ' ' : $t('contenttree.no_entries')">

            <!-- Content Header -->
            <template v-slot:default-header="prop">
                    <!-- v-if="root_node_ids.includes(prop.node.id) || is_currently_expanded(cachedNode(prop.node.id).content.parent_id)" -->
                <!-- v-if="startingContentNode.children.map(x=> x.id).includes(prop.node.id) || is_currently_expanded(cachedNode(prop.node.id).content.parent_id)" -->
                <ContentTitle
                    :node="prop.node"
                    :obj="cachedNode(prop.node.id)" 
                    :expanded="prop.expanded"
                    :key="prop.node.id" />
            </template>

            <!-- Content Body -->
            <template v-slot:default-body="prop">
                <div style="margin-bottom:0.5em" size="text-body1">
                    <span class="text-user">
                        {{cachedNode(prop.node.id).creator}}: 
                    </span>

                    {{ cachedNode(prop.node.id).content.text }}

                    <ContentEditor
                        v-if="ABLY.assembly_acls.includes('contribute')" :parent_id="prop.node.id"
                    />
                </div>
            </template>
        </q-tree>

        <!-- Add a new top-level entry -->
        <ContentEditor 
            :hideAddNewEntryButton="hideAddNewEntryButton"
            ref="content_editor"
            v-if="ABLY.assembly_acls.includes('contribute')"
            :parent_id="startingContentID" />

        <!-- Disclaimer -->
        <AlgorithmDisclaimer :text="disclaimerText" />

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
import ContentEditor from "./ContentEditor"
import AlgorithmDisclaimer from "src/layouts/components/AlgorithmDisclaimer"

export default {
    name: "ContentTree",
    props: ["artificialmoderationComponents", 'hideNoEntryText', 'hideNofEntriesText', 
        'hideAddNewEntryButton'],
    mixins: [QTreeMixin],
    components: {ContentTitle, AlgorithmDisclaimer, ContentEditor},
    computed: {
        disclaimerText: function () {
            var text = this.$i18n.t('disclaimer.contenttree.basic')

            if (this.startingContentNode.children.length>30) {
                text += ' ' + this.$i18n.t('disclaimer.contenttree.extensionExtraLarge')
            }

            return (text)
        }
    }
}
</script>
