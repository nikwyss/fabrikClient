<style>
.q-tree .q-focus-helper {
    background-color:transparent !important
}
</style>

<template>
<div class="full-width q-mb-lg">

    <div v-if="startingContentNode.children && startingContentNode.children.length" class="full-width " align="right">

        <div>

            <q-chip :clickable="expanded.length < this.total_nof_contents"
                @click="expand_more"
                :disabled="expanded.length>=this.total_nof_contents"
                align="right" icon="mdi-expand-all">
              {{ $t('contenttree.expand_all') }}
            </q-chip>

            <q-chip 
                :clickable="expanded.length>0"
                @click="expand_none"
                :disabled="expanded.length==0"
                align="right" icon="mdi-collapse-all">
              {{ $t('contenttree.collapse_all') }}
            </q-chip>

            <q-chip clickable 
                    @click="expanded_filter = !expanded_filter; filter = expanded_filter ? filter : ''"
                    align="right" icon="mdi-feature-search">
                {{ $t('contenttree.search_button') }}
            </q-chip>
            <div class="q-gutter-md">
                <q-input
                    ref="filter"
                    filled
                    v-show="expanded_filter"
                    v-model="filter"
                    :label="$t('contenttree.search_field_label')">
                </q-input>
            </div>
        </div>
    </div>

    <br />
    <q-separator inset />

    <!-- AM-ContentTree Index -->
    <div class="q-mb-xl full-width">
    <component 
        v-if="artificialmoderationComponents && 'ContentTreeIndex' in artificialmoderationComponents"
        :is="artificialmoderationComponents.ContentTreeIndex"
        :startingContentNode="startingContentNode"
        :ongoing="!startingContentNode || oauth.authorized === null" 
        align="left"
    />
    </div>

    <!-- ContentTree Title (optional) -->
    <div class="text-h6" v-if="label">{{label}}</div>

    <!-- AFTER LOADING -->
    <div class="q-pa-none q-ma-none q-gutter-sm" v-if="startingContentNode">

        <span v-if="startingContentNode.nof_descendants && !hideNofEntriesText">
        {{startingContentNode.nof_descendants}} Beiträge
        </span>

        <q-tree
            ref="qtree"
            :nodes="startingContentNode.children"
            label-key="id"
            :expandable="false"
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

                <div @click.stop @keypress.stop style="cursor:default" class="full-width">

                    <!-- <div :id="`arg${prop.node.id}`" class="full-width" > -->
                    <span style="position:absolute; top:-0.75em; right:0px">
                    <ContentToolbar :obj="cachedNode(prop.node.id)" />
                    </span>

                    <div @click="toggle_node(prop.node.id)" :class="[prop.node.nof_descendants ? 'cursor-pointer' : '']">
                        <!-- <q-icon name="mdi-comment-outline" size="xs" /> -->
                        <UserAvatar v-if="cachedNode(prop.node.id).creator" :profile="cachedNode(prop.node.id).creator">
                            <template v-slot:extrainfos >
                                {{cachedNode(prop.node.id).content.date_created | formatDate}}
                            </template>
                        </UserAvatar>
                        <!-- <span class="text-date"> {{cachedNode(prop.node.id).content.date_created | formatDate}}</span> -->
                        <!-- <span v-if="cachedNode(prop.node.id).creator" class="text-user"> {{ $t('contenttree.created_by', {username: cachedNode(prop.node.id).creator}) }} </span><br> -->
                    </div>
                    <q-badge color="blue" v-if="!real_expanded" align="top">click to see {{prop.node.nof_descendants}} more</q-badge>
                </div>
            </template>

            <!-- Content Body -->
            <template v-slot:default-body="prop">
                <div size="text-body1"
                    class="q-mb-lg"
                    :style="!prop.node.nof_descendants && rootNodeIDs.includes(prop.node.id) ? 'margin-left:1.5em' : ''">
                      <div class="float-right q-pa-null">
                    <ContentRatingThumbs
                        v-if="IsContributor"
                        name="`elRating${obj.content.id}`"
                        :content="cachedNode(prop.node.id)"
                    />
                    </div>

                    <span class="text-bold "> {{ cachedNode(prop.node.id).content.title }} ({{ cachedNode(prop.node.id).content.type }})</span><br>
                    {{ cachedNode(prop.node.id).content.text }}
                    <!-- style="margin-bottom:0.5em"  -->

                  
                </div>
            </template>
        </q-tree>

        <!-- EDIT/CREATE FORM -->
        <ContentEditor
            ref="content_editor"
            v-if="IsContributor"
            :parent_id="startingContentID" />

        <q-separator inset />

        <div class="full-width" align="right">
                <!-- class="bg-accent" -->
            <q-chip
                v-if="IsContributor"
                icon="mdi-tooltip-plus-outline" clickable @click="popup_create">
                {{ $t('contenttree.add_comment_or_question') }}
            </q-chip>

            <!-- Disclaimer -->
            <AlgorithmDisclaimer :text="disclaimerText" v-if="startingContentNode.nof_descendants > 1"/>
    
            <slot name="actions"></slot>

        </div>
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
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar";
import ContentEditor from "./ContentEditor"
import AlgorithmDisclaimer from "src/layouts/components/AlgorithmDisclaimer"
import ContentRatingThumbs from "./ContentRatingThumbs";
import UserAvatar from "src/layouts/components/UserAvatar"
import { mapGetters} from "vuex";
    
export default {
    name: "ContentTree",
    props: ["artificialmoderationComponents", 'hideNoEntryText', 'hideNofEntriesText'],
    mixins: [QTreeMixin],
    components: {AlgorithmDisclaimer, ContentEditor, ContentToolbar, ContentRatingThumbs, UserAvatar},
    provide() {
        return {
            popup_content_form: this.popup_content_form
        }
    },

    computed: {
       real_expanded: function() {
            return(this.expanded || this.node.children.length==0)
        },
        
        disclaimerText: function () {
            var text = this.$i18n.t('disclaimer.contenttree.basic')

            if (this.startingContentNode.children.length>30) {
                text += ' ' + this.$i18n.t('disclaimer.contenttree.extensionExtraLarge')
            }

            return (text)
        },

        ...mapGetters(
            'assemblystore', ['IsDelegate',  'IsExpert', 'IsContributor', 'IsObserver', 'IsManager']
        )
    },


    methods: {

        popup_content_form: function (action, model) {
            console.log("popup action " + action )
            this.$refs.content_editor.initialize(action, model)
        },

        popup_create () {
            this.popup_content_form ('create', {parent_id: this.startingContentID})
        }
    }
}
</script>
