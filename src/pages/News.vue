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
    <br /><br />

    <h1>{{$t('news.h1')}}</h1>

    <div class="q-px-lg q-pb-md">
      <q-timeline color="secondary">

        <!-- <q-timeline-entry heading>
          Aktuelle Einträge
        </q-timeline-entry> -->


        <q-timeline-entry
          title="Aufschaltung der Online-Plattform «Demokratiefabrik»"
          subtitle="30. April 2021"
          icon="mdi-wifi"
        >
          <div>
          Die vom Team entwickelte Online-Plattform «Demokratiefabrik» ist online! Diese wird in den kommenden Monaten in zwei Fallstudien umgesetzt.
          </div>
        </q-timeline-entry>


        <!-- <q-timeline-entry heading>
          2020
        </q-timeline-entry> -->

        <q-timeline-entry
          title="Start des SNF-Projekts «Digital Democratic Innovations to Empower Citizens in the Digital Age»"
          subtitle="1. April 2020"
          icon="mdi-rocket-launch-outline"
        >
          <div>
          Im April startete das Projekt «Digital Democratic Innovations to Empower Citizens in the Digital Age» unter der Leitung von Prof. Dr. Marc Bühlmann, Dr. Marlène Gerber und Dr. Dominik Wyss und Giada Gianola, alle am Institut für Politikwissenschaft der Universität Bern tätige Forscher*innen. Zudem ergänzt Prof. Dr. André Bächtiger (Universität Stuttgart) das Team. 
          Der Schweizerische Nationalfonds unterstützt das Projekt für eine Dauer von 36 Monaten im Rahmen des NFP77 «Digitale Transformation».  Untersucht wird, ob Digitalisierung in die Schweiz eine Chance für mehr demokratische Mitsprache darstellt.
          Im Rahmen des Projekts wird ein digitales Beteiligungsformat entwickelt, das den Bürgerinnen und Bürgern ermöglicht, eigene Argumente und Überzeugungen in den Abstimmungs- und Wahldiskurs einzubringen. Damit soll nicht nur das Vertrauen in Online-Infrastruktur gestärkt, sondern auch die Legitimität der direkten Demokratie erhöht werden. Konkret werden im Projekt zwei Prototypen digitaler Bürger*innenbeteiligung getestet: 1) Wahlberechtigte stellen einen smartvote-Fragekatalog zusammen und 2) Stimmberechtigte erstellen ein Argumentarium zu einer eidgenössischen Abstimmungsvorlage. Um das zu ermögliche, entwickelten wir die Plattform «Demokratiefabrik», die den Teilnehmenden eine autonome Rolle im politischen Gestaltungsprozess ermöglichen soll. Die Innovation unseres Projekts liegt in einer engen Verzahnung sozialer und technischer Ansätze: Wir übernehmen ein in der Politikwissenschaft etabliertes Konzept der repräsentativ zusammengestellten Bürgerversammlungen. Im 21. Jahrhundert erleben verschiedenste Formen der Bürgerbeteiligung einen Aufschwung. Zu wissen, unter welchen Bedingungen digitale Beteiligungsformen die Demokratie stärken können, stellt die Grundlage für eine erfolgreiche Bürgerbeteiligung im digitalen Zeitalter. 
          </div>
        </q-timeline-entry>

      </q-timeline>
    </div>
  </q-page>
</template>


<script>
import ArtificialModerator from "src/components/ArtificialModerator";

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