<template>

    <q-page class="doc_content " >

    <div align="center">


        <!-- <div v-if="routedStage"> -->
            <!-- EDIT CONTENT -->
            <!-- <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')"
                :assembly_id="assembly.id"
                :model="routedStage.stage" /> -->
            <!-- <div class="text-h4">{{routedStage.stage.title}}</div> -->
        <!-- </div> -->

        <!-- AM-OVERVIEW -->
        <div class="q-mb-xl">
            <ArtificialModeratorTEXTSHEETIndexTop 
            :ongoing="!routedStage || oauth.authorized === null" align="left" />
        </div>

        <div v-if="routedStage && contenttree" class="text-vessel">

            <h2>{{routedStage.stage.title}}</h2>
            <p class="text-body1">{{routedStage.stage.info}}</p>

            <div class="row justify-between" 
                v-for="(nodeL1, keyL1)  in filter_entries(contenttree.structure.children, TEXTTYPES)" 
                :key="`L1${nodeL1.id}`">

                <div class="seperator"><q-icon name="mdi-star-four-points-outline" /></div>

                <TextsheetCard 
                    :level="1"
                    :comments="filter_entries(nodeL1.children, ['COMMENT','QUESTION'])"
                    :heading_number="(keyL1+1)"
                    :item="contenttree.entries[nodeL1.id]"
                />

                <div class="row justify-between"
                        v-for="(nodeL2, keyL2) in filter_entries(nodeL1.children, TEXTTYPES)"
                        :key="`L2${nodeL2.id}`">

                    <TextsheetCard
                        :level="2"
                        :comments="filter_entries(nodeL2.children, ['COMMENT', 'QUESTION'])"
                        :heading_number="`${(keyL1+1)}.${(keyL2+1)}`"
                        :item="contenttree.entries[nodeL2.id]"
                    />

                    <div class="row justify-between" v-for="(nodeL3, keyL3) in filter_entries(nodeL2.children, TEXTTYPES)" 
                            :key="`L3${nodeL3.id}`">

                        <TextsheetCard
                            :comments="filter_entries(nodeL3.children, ['COMMENT', 'QUESTION'])"
                            :level="3"
                            :item="contenttree.entries[nodeL3.id]"/>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- AM-END -->
        <div class="q-mb-xl">
            <ArtificialModeratorTEXTSHEETIndexBottom 
            :ongoing="!routedStage || oauth.authorized === null" align="left" />
        </div>

    </div>
    </q-page>
</template>

<script>
import ContentTreeMixin from "src/mixins/contenttree"
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import TextsheetCard from "./components/TextsheetCard";
import ArtificialModeratorTEXTSHEETIndexTop from './artificialmoderation/IndexTop'
import ArtificialModeratorTEXTSHEETIndexBottom from './artificialmoderation/IndexBottom'
import i18nPluginMixin from "./i18n"

export default {
    name: 'TextsheetDefault',
    mixins: [ContentTreeMixin, i18nPluginMixin],
    data: function() {
        return {
            TEXTTYPES: ['PARAGRAPH', 'SECTION', 'SUBSECTION']
        }
    },
    components: {
        ComponentStageEditor,
        TextsheetCard,
        ArtificialModeratorTEXTSHEETIndexTop,
        ArtificialModeratorTEXTSHEETIndexBottom
    }
}

</script>
