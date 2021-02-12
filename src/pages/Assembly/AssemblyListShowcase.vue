<style lang="sass" scoped>
.assemblycard
    margin-top: 4em
    margin-bottom: 4em
</style>

<template>
    <q-page class="doc_content ">

        <h1>{{$tc('showcase.h1', $nLength(published_assemblies))}}</h1>

        <ArtificialModeratorAssemblyListShowcase
            :ongoing="published_assemblies === null || oauth.authorized===null"
            :published_assemblies="published_assemblies"/>

        <!-- SOME PUBLIC ASSEMBLIES -->
        <div v-if="published_assemblies != null" class="full-width">
           <!-- <div class="text-h5 q-mt-sm q-mb-xs">{{$t('Current Citizen Assemblies')}}</div> -->

            <q-card class="assemblycard" flat bordered
                    v-for="assembly of published_assemblies" 
                    :key="assembly.identifier">

                <q-parallax :src="assembly.image" :height="150"/>

                <q-card-section class="col-12">
                    <div class="text-h6">Bürger-Standpunkt zur {{assembly.title}}</div>
                    <div class="text-subtitle2">Eine Online-Bürgerversammlung</div>
                    <span>{{assembly.info}}</span>
                </q-card-section>

                <q-card-section class="col-12 " align="right">
                <ArtificialModeratorAssemblyListShowcaseSelection :assembly="assembly" />
                </q-card-section>

            </q-card>
        </div>
    </q-page>

</template>

<script>

import ArtificialModeratorAssemblyListShowcase from './artificialmoderation/AssemblyListShowcase'
import ArtificialModeratorAssemblyListShowcaseSelection from './artificialmoderation/AssemblyListShowcaseSelection'
// import PublicIndex from "src/mixins/publicIndex"

export default {

    name: 'PageAssemblyList',
    // mixins: [PublicIndex],
    components: {
        ArtificialModeratorAssemblyListShowcase,
        ArtificialModeratorAssemblyListShowcaseSelection
    }
}
</script>
