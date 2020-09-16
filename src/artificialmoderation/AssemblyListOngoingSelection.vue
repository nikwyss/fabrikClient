<template>
<div class="justify-center center" >
<!-- style="max-width:350px" -->

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage'
            :ongoing="oauth_authenticated!==undefined && ongoing_assembly===null">

        <!-- First Time Entering -->
        <!-- <template  v-if="assembly_acls.length > 0">
        {{$t('content.assemblies.am.you_may_enter_this_assembly_for_the_first_time')}}
        </template> -->

        <template v-if="assembly_acls.includes('delegate')">
        Durch die Hilfe von Ihnen und 1000 anderen eingeladenen BürgerInnen
        erstellen wir hier einen unabhängigen Standpunkt.
        </template>

        <template v-else-if="assembly_acls.includes('expert') || assembly_acls.includes('manage')">
        Sie können hier eintreten. Vielen Dank für Ihre Hilfe.
        <q-btn
            class="q-pa-sm"
            size="6"
            color="white"
            text-color="accent"
            @click="clickAssemblyLink(ongoing_assembly)"
            label="Bitte hier lang"
            icon-right="mdi-forward"
            />
        </template>

        <template v-else-if="assembly_acls.includes('observe')">
            Schauen Sie sich an, wie 1000 zufällig ausgewählte und unabhängige BürgerInnen über das Thema denken. Sie werden hier auf jeden Fall etwas lernen können.
            <q-btn
                size="6"
                bg-color="primary"
                text-color="accent"
                @click="clickAssemblyLink(ongoing_assembly)"
                label="Bitte hier lang"
                icon-right="mdi-forward"
            />
        </template>

        <template v-if="oauth_authenticated && !assembly_acls.length">
            Wir können Sie im Moment nicht zu der Veranstaltung zulassen.
        </template>

        <template v-if="!oauth_authenticated && !assembly_acls.length">
        {{$t('content.assemblies.am.invitation_to_authenticate')}}
        </template>

        <!-- Repeated Entering
        <template  v-if="IsUserDelegateOfOngoingAssembly">
        {{$t('content.assemblies.am.you_may_enter_this_assembly_for_the_repeatedly')}}
        </template> -->

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip size="md" icon="mdi-forward" v-if="assembly_acls.length > 0" outline color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickAssemblyLink">
            {{ $t('content.assemblies.item.please_enter') }}
        </q-chip>
        <q-chip size="md" icon="mdi-forward" v-if="!oauth_authenticated" outline color="primary" 
                text-color="primary" class="bg-white cursor-pointer" 
                clickable @click="clickAuthLink">
            {{ $t('auth.goto_authentication_form') }}
        </q-chip>
        </template>

    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import AssemblyMixin from 'src/pages/Assembly/mixins/assembly'
import {mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorAssemblyListOngoingSelection",
    components: {ArtificialModerator},
    mixins: [AssemblyMixin],
    props: ['ongoing_assembly'],

    computed: {

        oauth: function() {
            return(this.$store.oauth)
        },
 
        assembly_acls: function() {
            return (this.store_assembly_acls(this.ongoing_assembly.identifier))
        },

        ...mapGetters({
           store_assembly_acls: 'oauthstore/assembly_acls'
        })
    },

    methods: {
        clickAssemblyLink: function () {
            var route = {name: 'assembly_home', params: {assemblyIdentifier: this.ongoing_assembly.identifier}}
            console.assert(this.ongoing_assembly)
            this.$router.push(route)
        },
        clickAuthLink: function () {
            // var route = {name: 'assemblies'}
            var route = {name: 'assembly_home', params: {assemblyIdentifier: this.ongoing_assembly.identifier}}
            route = this.$router.resolve(route)
            this.$session.redirect_to_provider(route.href)
        }

    }
}
</script>
