<template>
<div class="justify-center center" style="max-width:350px">



                            <!-- <template v-if="assembly.acl.includes('delegate')">
                            Durch die Hilfe von Ihnen und 1000 anderen eingeladenen BürgerInnen
                            erstellen wir hier einen unabhängigen Standpunkt.

                            </template>

                            <template v-else-if="assembly.acl.includes('expert') || assembly.acl.includes('manage')">
                            Sie können hier eintreten. Vielen Dank für Ihre Hilfe.
                            <q-btn
                                class="q-pa-sm"
                                size="6"
                                color="white"
                                text-color="accent"
                                @click="clickAssemblyLink(assembly)"
                                label="Bitte hier lang"
                                icon-right="mdi-forward"
                                />

                            </template>

                            <template v-else-if="assembly.acl.includes('observe')">
                                Schauen Sie sich an, wie 1000 zufällig ausgewählte und unabhängige BürgerInnen über das Thema denken. Sie werden hier auf jeden Fall etwas lernen können.
                                <q-btn
                                    size="6"
                                    bg-color="primary"
                                    text-color="accent"
                                    @click="clickAssemblyLink(assembly)"
                                    label="Bitte hier lang"
                                    icon-right="mdi-forward"
                                />
                            </template>
                            <template v-else>
                                {{assembly}}
                                Wir können Sie im Moment nicht zu der Veranstaltung zulassen.
                         -->
    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage'
            v-if="$root.authenticated" 
            :ongoing="public_assembly===null">

        <!-- First Time Entering -->
        <template  v-if="public_assembly.acl.length > 0">
        {{$t('content.assemblies.am.you_may_enter_this_assembly_for_the_first_time')}}
        </template>

        <!-- Repeated Entering
        <template  v-if="IsUserDelegateOfOngoingAssembly">
        {{$t('content.assemblies.am.you_may_enter_this_assembly_for_the_repeatedly')}}
        </template> -->

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip size="md" icon="mdi-forward" v-if="public_assembly.acl.length > 0" outline color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickAssemblyLink">
            Bitte Eintreten
            <!-- {{ $t('auth.goto_authentication_form') }} -->
        </q-chip>
        </template>

    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import AssemblyMixin from 'src/pages/Assembly/mixins/assembly'

export default{
    name: "ArtificialModeratorAssemblyListOngoingSelection",
    components: {ArtificialModerator},
    mixins: [AssemblyMixin],
    props: ['public_assembly'],

    methods: {
        clickAssemblyLink: function () {
            var route = {name: 'assembly_home', params: {assembly_identifier: this.public_assembly.identifier}}
            console.assert(this.public_assembly)
            this.$router.push(route)
        }
    }
}
</script>
