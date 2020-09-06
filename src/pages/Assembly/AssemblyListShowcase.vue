<style lang="sass" scoped>
.my-card
    // margin-top: 2em;
    // margin-bottom: 2em;
    // margin-left: auto;
    // margin-right: auto;
    // width: 80%
</style>

<template>
    <q-page class="doc_content ">

        <h1>{{$tc('content.showcase.h1', nLength(get_publicIndex_published_assemblies))}}</h1>

        <ArtificialModeratorAssemblyListShowcase />

        <!-- SOME PUBLIC ASSEMBLIES -->
        <div v-if="get_publicIndex_published_assemblies != null" class="full-width">
           <!-- <div class="text-h5 q-mt-sm q-mb-xs">{{$t('Current Citizen Assemblies')}}</div> -->

            <q-card class="my-card" flat bordered 
                    v-for="assembly of get_publicIndex_published_assemblies" 
                    :key="assembly.identifier">

                <q-parallax :src="assembly.image" :height="150"/>

                <q-card-section class="col-12">
                    <div class="text-h6">Bürger-Standpunkt zur {{assembly.title}}</div>
                    <div class="text-subtitle2">Eine Online-Bürgerversammlung</div>
                    <span>{{assembly.info}}</span>
                </q-card-section>

                <ArtificialModeratorAssemblyListShowcaseSelection />

            </q-card>
        </div>
    </q-page>

</template>

<script>

import ArtificialModeratorAssemblyListShowcase from 'src/artificialmoderation/AssemblyListShowcase'
import ArtificialModeratorAssemblyListShowcaseSelection from 'src/artificialmoderation/AssemblyListShowcaseSelection'
import PublicIndex from "./mixins/publicIndex"

export default {

    name: 'PageAssemblyList',
    mixins: [PublicIndex],
    components: { ArtificialModeratorAssemblyListShowcase, ArtificialModeratorAssemblyListShowcaseSelection }
}
</script>
