<template>
    <div class="doc_content ">

        <!-- Ongoing -->
        <!-- <div v-if="oauth_ongoing">-->
        <!-- Show Loading -->
        <!-- </div> -->
<!-- {{oauth}} -->
<!-- {{oauth.authorized}} -->
<!-- {{oauth_state}} -->

        <!-- Not logged in -->
        <!-- <div v-if="!oauth.authorized && !oauth_ongoing">...</div> -->

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

    beforeDestroy () {
        // if (this.timer !== void 0) {
        //     clearTimeout(this.timer)
        //     LayoutEventBus.$emit('hideLoading')
        // }
    }
}
</script>