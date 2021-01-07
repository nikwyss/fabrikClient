<template>
<div class="justify-center center" style="max-width:350px">

    <!-- LEFT  SIDE -->
    <ArtificialModerator 
            v-if="oauth.authorized !== undefined" 
            alignment="left" role="1" 
            i18n_path_prefix="index">
        <template>
        {{$t('index.am.general_greeting', {salutation})}}
        </template>
    </ArtificialModerator>

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator  alignment="right" role="2" i18n_path_prefix="index" 
            :ongoing_request="published_assemblies === null">

        <!-- Not authenticated && assembly is ONGOING => Assuming that visitor is a delegate -->
        <template v-if="oauth.authorized === false && IsThereAnAssemblyOngoing === true">
        {{$t('index.am.invitation_to_authenticate')}}
        </template>

        <!-- Already authenticated delegate -->
        <template  v-else-if="oauth.authorized === true && IsUserDelegateOfOngoingAssembly === true">
        {{$t('index.am.delegates_redirect')}} 
        </template>

        <!-- assembly is PUBLIC => Assuming that visitor likes to see the results -->
        <template v-else-if="oauth.authorized !== undefined && IsThereAnAssemblyInPublicState === true">
        {{$t('index.am.information_for_public_visitors')}}
        </template>

        <!-- no assembly is PUBLIC -->
        <template v-else-if="oauth.authorized !== undefined && IsThereNothingGoingOn === true">
        {{$t('index.am.factory_holiday')}}
        </template>

        <!-- authenticated user does not have permission to ongoing assembly-->
        <template v-else-if="oauth.authorized !== undefined">
        {{$t('index.am.authenticated_user_without_permission_for_ongoing_assembly')}}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip size="md" icon="mdi-key-outline" 
                v-if="oauth.authorized === false && IsThereAnAssemblyOngoing === true" 
                outline color="primary" text-color="primary" class="bg-white cursor-pointer" 
                clickable @click="clickAuthLink">
            {{ $t('auth.goto_authentication_form') }}
        </q-chip>

        <q-chip size="md" icon="mdi-launch" v-if="oauth.authorized === true && IsUserDelegateOfOngoingAssembly === true" outline  color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickInitLink">
            {{ $t('index.iam_ready') }}
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

            if (this.oauth.authorized) {

                const salutation = this.$i18n.t(
                'index.am.salutation_for_authenticated',
                {username: this.oauth.username}
                )
                return (salutation)

            } else {

                const salutation = this.$i18n.t('index.am.salutation_for_guests')
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
            destination_route = {name: 'assemblies_ongoing_list'}
            this.oauth.login(destination_route)
        }
    }
}
</script>
