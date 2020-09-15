<template>
<div class="justify-center center" style="max-width:350px">

    <!-- LEFT  SIDE -->
    <ArtificialModerator 
            v-if="this.oauth_authenticated !== undefined" 
            alignment="left" role="1" 
            i18n_path_prefix="content.index">
        <template>
        {{$t('content.index.am.general_greeting', {salutation: salutation})}}
        </template>
    </ArtificialModerator>

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator  alignment="right" role="2" i18n_path_prefix="content.index" 
            :ongoing_request="published_assemblies === null">

        <!-- Not authenticated && assembly is ONGOING => Assuming that visitor is a delegate -->
        <template v-if="oauth_authenticated === false && IsThereAnAssemblyOngoing === true">
        {{$t('content.index.am.invitation_to_authenticate')}}
        </template>

        <!-- Already authenticated delegate -->
        <template  v-else-if="oauth_authenticated === true && IsUserDelegateOfOngoingAssembly === true">
        {{$t('content.index.am.delegates_redirect')}} 
        </template>

        <!-- assembly is PUBLIC => Assuming that visitor likes to see the results -->
        <template v-else-if="this.oauth_authenticated !== undefined && IsThereAnAssemblyInPublicState === true">
        {{$t('content.index.am.information_for_public_visitors')}}
        </template>

        <!-- no assembly is PUBLIC -->
        <template v-else-if="this.oauth_authenticated !== undefined && IsThereNothingGoingOn === true">
        {{$t('content.index.am.factory_holiday')}}
        </template>

        <!-- authenticated user does not have permission to ongoing assembly-->
        <template v-else-if="this.oauth_authenticated !== undefined">
        {{$t('content.index.am.authenticated_user_without_permission_for_ongoing_assembly')}}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip size="md" icon="mdi-key-outline" 
                v-if="oauth_authenticated === false && IsThereAnAssemblyOngoing === true" 
                outline color="primary" text-color="primary" class="bg-white cursor-pointer" 
                clickable @click="clickAuthLink">
            {{ $t('auth.goto_authentication_form') }}
        </q-chip>

        <q-chip size="md" icon="mdi-launch" v-if="oauth_authenticated === true && IsUserDelegateOfOngoingAssembly === true" outline  color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickInitLink">
            {{ $t('general.button.iam_ready') }}
        </q-chip>

        </template>
    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import {mapGetters} from 'vuex'
import PublicIndex from "src/mixins/publicIndex"

export default{
    name: "ArtificialModeratorIndexPage",
    mixins: [PublicIndex],
    components: {ArtificialModerator},

    computed: {

        salutation: function() {

            if (this.oauth_authenticated) {

                const salutation = this.$i18n.t(
                'content.index.am.salutation_for_authenticated',
                {username: this.oauth_username}
                )
                return (salutation)

            } else {

                const salutation = this.$i18n.t('content.index.am.salutation_for_guests')
                return (salutation)
            }
        }
    },

    methods: {
        clickInitLink: function () {
            var route = { name: 'assemblies_ongoing_list' }
            this.$router.push(route)
        },
        clickAuthLink: function () {
            var route = {name: 'assemblies_ongoing_list'}
            route = this.$router.resolve(route)
            this.$session.redirect_to_provider(route.href)
        }
    }
}
</script>
