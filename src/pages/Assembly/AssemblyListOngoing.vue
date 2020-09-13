<style lang="sass" scoped>
.assemblycard
    margin-bottom: 6em;
</style>

<template>
    <q-page class="doc_content ">

        <!-- SHOW LIST OF ONGOING ASSEMBLIES -->
        <div v-if="publicIndex_ongoing_assemblies != null" class="full-width">
           <!-- <div class="text-h5 q-mt-sm q-mb-xs">{{$t('Current Citizen Assemblies')}}</div> -->

            <q-card class="assemblycard" flat 
                v-for="assembly of publicIndex_ongoing_assemblies" :key="assembly.identifier">

                <q-parallax
                    :src="assembly.image"
                    :height="150"
                />

                <q-card-section class="col-12">
                    <div class="text-subtitle2">{{$t('content.assemblies.item.home_caption', {assembly_title: assembly.title})}}</div>
                    <h2>{{assembly.caption}}</h2>
                    <span>{{assembly.info}}</span>

                    <!-- v-if="assembly.date_end" -->
                <div class="q-mt-md text-caption" v-if="assembly.date_end">
                     {{ $t('content.assemblies.item.date_end', {relative_end_date: $moment('2020-09-11T23:00').fromNow(true)}) }}
                     <!-- TODO: Add timer for the last hour -->
                </div>
                </q-card-section>


                  <!-- <q-card-section> -->
                <q-card-section class="col-12 " align="right">
                    <ArtificialModeratorAssemblyListOngoingSelection :ongoing_assembly="assembly" />
                </q-card-section>

                <br />
                </q-card>

        </div>

        <div v-else>
            <h1>{{$tc('content.assemblies.h1', nLength(publicIndex_ongoing_assemblies))}}</h1>
            
            <ArtificialModeratorAssemblyListOngoing />
        </div>

    </q-page>

</template>

<script>
// import ArtificialModeratorAssemblyListOngoing from 'src/artificialmoderation/AssemblyListOngoing'
import ArtificialModeratorAssemblyListOngoingSelection from 'src/artificialmoderation/AssemblyListOngoingSelection'
import PublicIndex from "./mixins/publicIndex"

export default {

    name: 'PageAssemblyList',
    mixins: [PublicIndex],
    components: { ArtificialModeratorAssemblyListOngoingSelection },

    mounted: function() {
        console.log("kdddk")


        //, "from", "now", true) )

        // if(this.get_current_assemblyIdentifier) {
        //     this.$router.push({name: 'assembly_home',
        //         params: {assemblyIdentifier: this.get_current_assemblyIdentifier}})
        // }
    }
}
</script>
