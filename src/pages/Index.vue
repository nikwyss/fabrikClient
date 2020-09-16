<template>
  <q-page class="doc_content">
    <div align="center">
      <ArtificialModeratorIndexPage />
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import ArtificialModeratorIndexPage from "src/artificialmoderation/IndexPage"
import PublicIndex from "src/mixins/publicIndex"

export default Vue.extend({
  name: 'PageIndex',
  mixins: [PublicIndex],
  components: { ArtificialModeratorIndexPage },
  mounted: function {
    
    // TEMP
    const tooo_old_jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJhdWQiOiJkZW1va3JhdGllZmFicmlrL2ZhYnJpa0FwaSIsInN1YiI6NywiaXNzIjoiZGVtb2tyYXRpZWZhYnJpay9mYWJyaWtBdXRoIiwidXNlck5hbWUiOiJkZWxlZ2F0ZSIsInJvbGVzIjpbImRlbGVnYXRlQGRpZ2lrb24yMDIyIiwiZGVsZWdhdGVAaW5pdGlhdGl2ZVhZIl0sImF1dGh0eXBlIjoidG9rZW4iLCJleHBpcmF0aW9uIjoiMjAyMC0wOS0xNlQxMDoxOTowNC4zNzA5MzYifQ.4WggtoV0OlWyI7SdtViKvqB3hj1O-brzWY_HWG5ZaeoRvl67hA9wEMYaO4g8I-xeKbTi-LdfyzsEYT2AdcfuEw"
    this.$session.set_jwt_cookie(tooo_old_jwt)
  }
})
</script>
