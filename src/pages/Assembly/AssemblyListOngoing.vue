<style lang="sass" scoped>
.assemblycard
    margin-top: 4em;
    margin-bottom: 4em;
</style>

<template>
    <q-page class="doc_content ">

        <!-- <ArtificialModeratorAssemblyListOngoing /> -->

        <h1>{{$tc('content.assemblies.h1', nLength(get_publicIndex_ongoing_assemblies))}}</h1>

        <!-- SHOW LIST OF ONGOING ASSEMBLIES -->
        <div v-if="get_publicIndex_ongoing_assemblies != null" class="full-width">
           <!-- <div class="text-h5 q-mt-sm q-mb-xs">{{$t('Current Citizen Assemblies')}}</div> -->

            <q-card class="assemblycard" flat bordered
                v-for="assembly of get_publicIndex_ongoing_assemblies" :key="assembly.identifier">

                <q-parallax
                    :src="assembly.image"
                    :height="150"
                />

                <q-card-section class="col-12">
                    <div class="text-subtitle2">{{$t('content.assemblies.item.subtitle')}}</div>
                    <h2>Bürger-Standpunkt zur {{assembly.title}}</h2>
                    <span>{{assembly.info}}</span>

                    <!-- v-if="assembly.date_end" -->
                <div class="inline-block" >
                     {{$t('content.assemblies.item.days_left', {days_left: 3}) }}
                </div>

                </q-card-section>

                  <!-- <q-card-section> -->
                <q-card-section class="col-12 " align="right">
                    <ArtificialModeratorAssemblyListOngoingSelection :ongoing_assembly="assembly" />
                </q-card-section>

                <br />
                </q-card>

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
    components: { ArtificialModeratorAssemblyListOngoingSelection }

    // created() {
    //     // if(this.get_current_assemblyIdentifier) {
    //     //     this.$router.push({name: 'assembly_home',
    //     //         params: {assemblyIdentifier: this.get_current_assemblyIdentifier}})
    //     // }
    // }
}
</script>
