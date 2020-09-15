<template>
    <div class="doc_content ">

        <!-- Ongoing -->
        <!-- <div v-if="oauth_ongoing">-->
        <!-- Show Loading -->
        <!-- </div> -->

        <!-- Successful Login -->
        <div v-if="oauth_authenticated">Okay. Login was successfully.</div>

        <!-- Not logged in -->
        <div v-if="!oauth_authenticated && !oauth_ongoing"></div>

        <!-- Login Error -->
        <!-- <div v-if="loginerror">
            Error. The login was not successfully. Please try again.
        </div> -->
    </div>
</template>

<script>
import { LayoutEventBus } from 'src/utils/eventbus.js'

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