<template>
    <q-page class="doc_content">


        <q-btn align="around" 
            class="btn-fixed-width" color="brown-5" 
            label="Back to the assembly home"
            icon="mdi-arrow-left"
            @click="gotoAssemblyHomeIndex()" />

        <div v-if="assembly && stage">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="stage.disabled" style="padding:2em; margin-bottom:1em;">
            This ContentTree Stage is disabled and, therefore, not visible for users.
            </q-banner>

            <StagePeerReview />

            <!-- EDIT CONTENT -->
            <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')"
                :assembly_id="assembly.id"
                :model="stage" />

            <div class="text-h4">{{stage.title}}</div>

            <p>{{stage.info}}</p>
        </div>

        <q-spinner-dots color="secondary" size="7em" v-if="!contenttree"/>

        <div class="" v-if="stage && contenttree">
            <!-- gt-sm: SHOW ONLY ON WIDE SCREENS -->
            <div class="row justify-between gt-xs ">

                <div class="col-12 col-sm-6">
                    <h2 class=" q-mb-none q-ml-md">{{column_titles[0]}}</h2>
                </div>
                <div class="col-12 col-sm-6">
                    <h2 class=" q-mb-none  q-ml-md">{{column_titles[1]}}</h2>
                </div>

            </div>
            <div class="row justify-between" v-for="row in maxrows" :key="row">
                <div class="col-12 col-sm-6  ">
                    <ArgumentCard 
                        :acl="assembly_acls" 
                        :default_content_type="column_types[0]"
                        :stage="stage" 
                        :content="get_content_entry(row,0)"/>

                </div>
                <div class="col-12 col-sm-6">
                    <ArgumentCard 
                        :acl="assembly_acls" 
                        :default_content_type="column_types[1]"
                        :stage="stage"
                        :content="get_content_entry(row,1)"/>
                </div>

            </div>

            <br><q-banner class="bg-grey-3"><span class="text-weight-thin"><b>Algorithmus-Disclaimer:</b>
            Die Reihenfolge der Argumente, sowie die Zuweisung der Pro und Kontra auf die Rechte beziehungsweise 
            linke Seite wurden zufälllig vorgenommen und variieren von Benutzer zu Benutzer. Die zu Beginn
            im Forum vorhandenen Argumenten sind HIER einsehbar und stammen von den jeweiligen Abstimmungskomittees. 
            Für die Weiterverarbeitung hier im Forum sind alleine die Delegierten verantwortlich. Die Systembetreuuer und 
            Event-Organisatoren haben darauf keinen Einfluss.
            </span></q-banner>

        </div>

    </q-page>
</template>


<script>
import ContentTreeMixin from "src/mixins/contenttree"
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import ArgumentCard from "./components/ArgumentCard";
import StagePeerReview from "src/pages/ContentTree/components/StagePeerReview"

export default {
    name: 'ProsAndConsDefault',
    components: {
        ComponentStageEditor,
        ArgumentCard,
        StagePeerReview
    },

    mixins: [ContentTreeMixin],

    computed: {
        pros: function() {
            let pros = this.contenttree.structure.children.filter(
                item => this.contenttree.entries[item.id].content.type == 'PRO')
            return(pros)
        },
        cons: function() {
            let cons = this.contenttree.structure.children.filter(
                item => this.contenttree.entries[item.id].content.type == 'CONTRA')
            return(cons)
        },
        maxrows: function() {
            // return maximal item number
            // add one empty card
            return(Math.max(this.pros.length+1,this.cons.length+1))
        },
        random_column_order: function() {
            // Return 0 or 1
            console.assert(this.stage.stage)
            return(this.stage.stage.RANDOM_LEFTRIGHT_ASSIGNMENT)
        },
        column_args: function() {
            console.assert(this.random_column_order!==undefined)
            let both = [this.cons, this.pros]
            return([both[Number(this.random_column_order==0)], both[Number(this.random_column_order==1)]])
        },
        column_titles: function() {
            let both = ["Contra", "Pro"]
            return([both[Number(this.random_column_order==0)], both[Number(this.random_column_order==1)]])
        },
        column_types: function() {
            let both = ["CONTRA", "PRO"]
            return([both[Number(this.random_column_order==0)], both[Number(this.random_column_order==1)]])
        }
    },
    methods: {
        
        gotoAssemblyHomeIndex: function() {

            // REDIRECT TO ARGUMENT PAGE
            this.$router.replace({name: 'assembly_home_stepper', 
                params: {
                    assemblyIdentifier: this.assembly.identifier,
                    stageID: this.stage.id
                    }
            })
        },

        get_content_entry: function(row,side) {

            // randomly choose left/right sides for pro and con arguments
            let args = this.column_args[side]
    
            // left or right colum
            if(row > args.length) {
                // no argument available for this position: return placeholder
                return(null)
            }

            // return content
            let contentID = args[row-1].id
            console.log(contentID)
            return(this.contenttree.entries[contentID])
        }
    }
}
</script>
