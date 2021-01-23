<template>
  <q-page class="doc_content">

    <!-- RIGHT SIDE -->
    <div align="left">
      <ArtificialModerator
        alignment="rigth"
        role="1"
      >
        <template>
          {{ $t('news.am.newsletter') }}
        </template>

        <template v-slot:actions>
          <q-chip
            size="md"
            icon="mdi-email-outline"
            outline
            color="primary"
            text-color="primary"
            class="bg-white cursor-pointer"
            clickable
            @click="clickNewsletter"
          >
            {{ $t('news.am.cmd_newsletter_abo') }}
          </q-chip>
        </template>

      </ArtificialModerator>
    </div>
    <br />
    <br />
    <h1>{{$t('news.h1')}}</h1>

    <!-- content -->
  </q-page>
</template>


<script>
import ArtificialModerator from "src/artificialmoderation/components/ArtificialModerator";

export default {
  name: "PageNews",
  components: { ArtificialModerator },

  methods: {
    clickNewsletter: function () {
      // TODO: take email from environment variables
      const email = "demokratiefabrik@protonmail.com";
      window.location.href = `mailto:${email}`;
    },
  },
};
</script>