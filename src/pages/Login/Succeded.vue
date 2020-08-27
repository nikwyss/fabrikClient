<template>
    <q-page class="doc_content ">
        {{RESPONSE_TEXT}}
    </q-page>
</template>

<script>

    export default {
        name: "Authorization",

        data() {
            return {
                RESPONSE_TEXT : 'Superba! Your are logged in...'
             };
        },

    };
</script>