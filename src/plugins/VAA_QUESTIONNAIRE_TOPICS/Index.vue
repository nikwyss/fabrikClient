<template>
    <q-page class="doc_content">
<!-- {{this.contenttree.access_date }} -->
        <!-- <q-btn align="around" 
            class="btn-fixed-width" color="brown-5" 
            label="Back to the assembly home"
            icon="mdi-arrow-left"
            @click="gotoAssemblyHome()" /> -->
        <div v-if="assembly && routed_stage" >

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="routed_stage.stage.disabled" style="padding:2em; margin-bottom:1em;">
            This Stage is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentStageEditor 
                v-if="IsManager"
                :assembly_id="assembly.id"
                :model="routed_stage" />

            <!-- <div class="text-h3">{{routed_stage.stage.title}}</div> -->

            <!-- <p>{{routed_stage.stage.info}}</p> -->
        </div>
<!-- {{contenttree}} -->
        <div class="" v-if="routed_stage && contenttree"  class="text-vessel">


        <!-- INTRODUCTION -->
        <h2>{{routed_stage.stage.title}}</h2>
        <p class="text-body1">{{routed_stage.stage.info}}</p>


            <!-- <div class="row justify-between">
                <div class="seperator"><q-icon name="mdi-star-four-points-outline" /></div>
            </div> -->

  

         <!-- TOPIC RATING -->
         <div class="row justify-between" v-for="(nodeL1, keyL1)  in contenttree.structure.children"
                    :key="`L1${nodeL1.id}`">

            <div class="seperator"><q-icon name="mdi-star-four-points-outline" /></div>

            <TextsheetCard 
                :level="1"
                :comments="filter_entries(nodeL1.children, ['COMMENT', 'QUESTION'])"
                :heading_number="(keyL1+1)"
                :item="contenttree.entries[nodeL1.id]"/>
                <!-- {{oauth.userid}} -->
            <ContentRatingSlider :content="contenttree.entries[nodeL1.id]" />
        </div>
        


         <div class="row justify-between">
                <div class="seperator"><q-icon name="mdi-star-four-points-outline" /></div>
         </div>

        <!-- RESULT -->
        <div v-if="ratingCompleted">
            <h2>Resultat</h2>
            <div class="row justify-between">
                <ChartBar :personalData="chartBarPersonalData" :labels="chartBarLabels" />
            </div>
        </div>
    </div>

    </q-page>
</template>


<script>
import ContentTreeMixin from 'src/mixins/contenttree'
import ComponentStageEditor from 'src/pages/ContentTree/components/StageEditor';
import TextsheetCard from './components/TextsheetCard';
import ContentRatingSlider from 'src/pages/ContentTree/components/ContentRatingSlider';
import ChartBar from 'src/components/charts/ChartBar';


export default {
    name: 'VAATopics',
    mixins: [ContentTreeMixin],
    components: {
        ComponentStageEditor,
        TextsheetCard,
        ContentRatingSlider,
        ChartBar
    },
    computed: {
        
        ratingCompleted() {

            const allRated = this.numberOfUnratedTopLevelEntries == 0
            if (allRated && this.is_stage_scheduled(this.routed_stage)) {
                this.markIdle()
            }

            return (allRated)           
        },

        sortedChartEntries() {
            const children = this.contenttree.structure.children
            const entries = children.map(child => this.contenttree.entries[child.id])
            return Object.values(entries).sort((a, b) => a.progression.rating > b.progression.rating ? -1 : a.progression.rating > b.progression.rating ? 1 : 0)
        },
        chartBarPersonalData() {
            return this.sortedChartEntries.map(entry => entry.progression?.rating+50)
        },
        chartBarLabels() {
            return this.sortedChartEntries.map(entry => entry.content?.title)
        }
    }
}
</script>
