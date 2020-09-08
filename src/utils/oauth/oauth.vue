<template>
    <div class="doc_content ">

        <!-- Ongoing -->
        <div v-if="ongoing">
        <!-- Show Loading -->
        </div>

        <!-- Successful Login -->
        <div v-if="$root.authenticated">
            Okay. Login was successfully.
            <q-btn label="Standard" @click="forceVueUpdateOfOpener()"/>
        </div>

        <!-- Not logged in -->
        <div v-if="!$root.authenticated && !loginerror && !ongoing">            
        </div>

        <!-- Login Error -->
        <div v-if="loginerror">    
            Error. The login was not successfully. Please try again.
        </div>
    </div>
</template>

<script>
import { LayoutEventBus } from 'src/layouts/components/eventbus.js';

export default {
    name: 'OngoingAuthentication',
    data() {
        return {
            ongoing: !!this.$session.random_state,
            loginerror: false

        };
    },

    mounted() {
        if(this.ongoing) {
            console.log("ongoing authorization....39049382")
            LayoutEventBus.$emit('showLoading')
            const response = this.$session.authorize_by_authentication_code(this.authentication_ends)
        }
    },

    methods: {

        authentication_ends: function(response) {
            // Update local data.
            // this is since the cookie plugin as well as the VUE.prototype $session is not reactive.
            this.$root.oauth_callback()
            console.log("endign authorization....444444")
            LayoutEventBus.$emit('hideLoading')
            this.ongoing = false
            this.loginerror = !this.$root.authenticated
            this.forceVueUpdateOfOpener()
            if(this.$root.authenticated) {
                window.close()
            }
        }
    },

    beforeDestroy () {
        if (this.timer !== void 0) {
            clearTimeout(this.timer)
            LayoutEventBus.$emit('hideLoading')
        }
    }
}
</script>