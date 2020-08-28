<style lang="sass" scoped>
// .my-card
    // margin-top: 2em;
    // margin-bottom: 2em;
    // margin-left: auto;
    // margin-right: auto;
    // width: 80%
</style>

<template>
    <q-page class="doc_content ">

        <h1>{{$t('content.assemblies.h1')}}</h1>

        <ArtificialModeratorAssemblyListOngoing />

        <!-- SHOW LIST OF ONGOING ASSEMBLIES -->
        <div v-if="get_publicIndex_ongoing_assemblies != null" class="full-width">
           <!-- <div class="text-h5 q-mt-sm q-mb-xs">{{$t('Current Citizen Assemblies')}}</div> -->

            <q-card class="my-card" flat bordered
                v-for="assembly of get_publicIndex_ongoing_assemblies" :key="assembly.identifier">

                <q-parallax
                    :src="assembly.image"
                    :height="150"
                />

                <q-card-section class="col-12">
                    <div class="text-h6">Bürger-Standpunkt zur {{assembly.title}}</div>
                    <div class="text-subtitle2">Eine Online-Bürgerversammlung</div>
                    <!-- <div class="text-subtitle2">{{assembly.date_start | formatDate}} - {{assembly.date_end | formatDate}}</div> -->
                    <span>{{assembly.info}}</span>
                </q-card-section>

                  <!-- <q-card-section> -->
                <q-card-section class="col-12">
                    <ArtificialModeratorAssemblyListOngoingSelection :public_assembly="assembly" />
                </q-card-section>
                </q-card>

        </div>
    </q-page>

</template>

<script>
import ArtificialModeratorAssemblyListOngoing from 'src/artificialmoderation/AssemblyListOngoing'
import ArtificialModeratorAssemblyListOngoingSelection from 'src/artificialmoderation/AssemblyListOngoingSelection'
import PublicIndex from "./mixins/publicIndex"

export default {

    name: 'PageAssemblyList',
    mixins: [PublicIndex],
    components: { ArtificialModeratorAssemblyListOngoing, ArtificialModeratorAssemblyListOngoingSelection },

    created() {
        if(this.get_current_assemblyIdentifier) {
            this.$router.push({name: 'assembly_home',
                params: {assemblyIdentifier: this.get_current_assemblyIdentifier}})
        }
    }
}
</script>
