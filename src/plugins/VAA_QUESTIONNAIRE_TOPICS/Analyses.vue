<template>
    <q-page class="doc_content" v-if="contenttree">


         <div class="row justify-between">
                <div class="seperator"><q-icon name="mdi-star-four-points-outline" /></div>
         </div>

        <!-- RESULT -->
        <div v-if="ratingCompleted">
            <h2>Resultat</h2>
            <div class="row justify-between">
                <ChartRadar :personalData="chartRadarPersonalData" :populationData="chartRadarPopulationData"  :labels="chartRadarLabels" />
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
import ChartRadar from 'src/components/charts/ChartRadar';


export default {
    name: 'VAATopics',
    mixins: [ContentTreeMixin],
    components: {
        ComponentStageEditor,
        TextsheetCard,
        ContentRatingSlider,
        ChartRadar
    },
    computed: {

        chartEntries() {
            const children = this.contenttree.structure.children
            return children.map(child => this.contenttree.entries[child.id])
        },
        chartRadarPersonalData() {
            // console.log(this.entries)
            return this.chartEntries.map(entry => entry.progression?.rating+50)
        },
        chartRadarLabels() {
            return this.chartEntries.map(entry => entry.content?.title)
        },
        chartRadarPopulationData() {
            return this.chartEntries.map(entry => Math.random()*100)
        },

        ratingCompleted() {
            const allRated = this.numberOfUnratedTopLevelEntries == 0
            if (allRated && this.is_stage_scheduled(this.routed_stage)) {
                this.markIdle()
            }
            return (allRated)           
        }
    },
}
</script>
