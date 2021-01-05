<template>
    <div class="doc_content ">

        <!-- Ongoing -->
        <!-- <div v-if="oauth_ongoing">-->
        <!-- Show Loading -->
        <!-- </div> -->

        <!-- Not logged in -->
        <div v-if="!oauth_authenticated && !oauth_ongoing">...</div>

        <!-- Login Error -->
        <!-- <div v-if="loginerror">
            Error. The login was not successfully. Please try again.
        </div> -->
    </div>
</template>

<script>
import { LayoutEventBus } from 'src/utils/eventbus.js'
import Configuration from 'src/utils/configuration'

export default {
    name: 'OngoingAuthentication',

    data() {
        return {
            loginerror: false
        };
    },

    mounted() {
        console.log("ongoing::.......  " + this.oauth_ongoing)
        if(this.oauth_ongoing) {
            console.log("ongoing authorization...")
            LayoutEventBus.$emit('showLoading')
            const response = this.$session.authorize_by_authentication_code()
        }else if (this.oauth_authenticated){

            // Missing Email...
            // TODO: remember url before redirect to auth...
            let url = Configuration.value('ENV_DOMAIN')
            window.location.href=url

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