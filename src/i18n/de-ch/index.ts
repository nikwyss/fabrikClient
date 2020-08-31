// functional COmponent:
// <i18n path="term" tag="label" for="tos">
// <a :href="url" target="_blank"> {{ $t('tos') }}</a>
// </i18n>
// => <label>Accept <a href="...">terms of services</a></label>
// https://kazupon.github.io/vue-i18n/guide/interpolation.html#basic-usage

export default {

  app: {
    name: 'Demokratiefabrik',
    version: 'v1.0',
    error: {
      service_error_title: 'Betriebsstörung',
      service_error_body: 'Im Betrieb der Demokratiefabrik ist eine Störung aufgetreten. Wir bitten Sie um Entschuldigung. Bitte versuchen Sie es bitte erneut.',
      btn_close: 'Diese Meldung schliessen.'
    }
  },

  general: {
    button: {
      iam_ready: 'Ja, ich bin bereit'
    }
  },

  am: {
    actor: {
      1: 'Paul',
      2: 'Sophie'
    }
  },

  language: {
    switcher_label: 'Sprachwahl',
    items: {
      'en-us': { label: 'English' },
      'de-ch': { label: 'Deutsch' }
    }
  },

  menu: {
    items: {
      home: {
        label: 'Eingang',
        tooltip: 'Wo alles beginnt!'
      },
      assembly: {
        label: 'Produktionsstätte',
        tooltip: 'Hier finden unsere BürgerInnen-Konvents statt.'
      },
      showcase: {
        label: 'Schaufenster',
        tooltip: 'Die Ergebnisse unserer BürgerInnen-Konvents werden hier veröffentlicht.'
      },
      background: {
        label: 'Info-Point',
        tooltip: 'Sind Sie neugierig was es mit der Demokratiefabrik alles auf sich hat?'
      }
    }
  },

  auth: { 
    salutation_for_guests: 'Lieber Gast!',
    login_button_label: 'Anmeldung',
    login_button_text: "Klicken Sie auf 'Anmeldung', wenn Sie sich anmelden möchten. Eine Anmeldung ist notwendig, um sich aktiv in der Fabrik zu beteiligen.",
    registered_as: 'Angemeldet als {username}',
    not_registered: 'Anonymer Gast',
    goto_authentication_form: 'Zur Anmeldung',
    tooltip_authenticated: 'Klicken Sie hier um Ihr Benutzerprofil einzusehen oder sich abzumelden.',
    tooltip_non_authenticated: 'Sie sind noch nicht in der Demokratiefabrik angemeldet. Hier können Sie dies tun.',
    authentication_warning_title: 'Anmeldung erforderlich.',
    authentication_warning_body: 'Sie haben sich noch nicht bei der Demokratiefabrik angemeldet. Für den Zugriff auf diesen Bereich ist dies jedoch erforderlich.'
  },

  content: {

    index: {
      am: {
        general_greeting: '{salutation} Wir sind @:am.actor.1 und @:am.actor.2 und freuen uns sehr, dass Sie die Demokratiefabrik besuchen.',
        salutation_for_authenticated: 'Guten Tag {username}!',
        salutation_for_guests: 'Guten Tag lieber Gast!',
        invitation_to_authenticate: 'Sind Sie eine der 1000 ausgelosten Personen, die in die Demokratiefabrik eingeladen wurden? Dann möchten wir Sie bitten sich anzumelden.',
        delegates_redirect: 'Wir können gleich zum Thema kommen. Sind Sie bereit?',
        information_for_public_visitors: 'Auf dieser Webseite finden Sie spannende Ergebnisse von unseren Digitalen-Bürgerversammlungen. Schauen Sie sich bitte um!',
        factory_holiday: 'Wir haben zwar gerade Betriebsferien. Dennoch finden Sie auf dieser Seite viele Informationen über die Demokratiefabrik.',
        authenticated_user_without_permission_for_ongoing_assembly: 'Wir sind aktuell gerade an der Durchführung eines BürgerInnen-Konvents. Sie finden auf dieser Webseite viele Informationen dazu.',

        tooltip: {
          1: [
            // Tooltips for the first AM displayed on the page
            'Ich bin {actor} und bin übrigens sehr froh, dass Sie hier sind.',
            'Ich heisse {actor}'
          ],
          2: [
            // Tooltips for AM with index:2
            'Haben Sie Fragen, dann besuchen Sie bitte die Hilfe-Seite',
            'Ich bin {actor}',
            'Ich heisse {actor}'
          ]
        }
      }
    },

    assemblies: {
      h1: 'Aktuelle BürgerInnen-Konvents',
      am: {
        there_are_assemblies_ongoing: 'Wunderbar! Sie sind eingeladen sich an einem BürgerInnen-Konvent zu beteiligen.',
        no_assemblies_accessible: 'Sie können sich aktuell an keinem BürgerInnen-Konvent beteiligen. Wer sich beteiligen darf und wer nicht, entschied das Los.',
        invitation_to_authenticate: 'Sind Sie eine der 1000 eingeladenen Personen, die sich an einem BürgerInnen-Konvent beteiligen dürfen? Dann möchten wir Sie bitten sich anzumelden.',
        you_may_enter_this_assembly_for_the_first_time: 'Treten Sie ein: Es macht Spass und Sie leisten einen Beitrag für unsere Demokratie.'
      }
    },

    showcase: {
      h1: 'Die Resultate unserer BügerInnen-Konvents',
      am: {
        no_assemblies_in_public_state: 'Zur gegebener Zeit, werden wir hier die Resultate unserer BürgerInnen-Konvents veröffentlichen. Wir versprechen einen unabhängigen Blick auf die Perspektive der Stimmbürger.',
        there_are_assemblies_in_public_state: 'Wunderbar! Sie können hier schon die ersten Ergebnisse unserer Bürger-Konvents besichtigen.',
        chip_please_enter: 'Bitte treten Sie ein.'
      }
    },

    background: {
      h1: 'Was Sie über die Demokratiefabrik zu wissen brauchen',
      digital_participation: {
        label: 'Digitale Bürgerbeteiligung - Wie kann das funktionieren?',
        text: `Bürger*innen mittels Beteiligungsformaten wie Bürger*innenversammlungen stärker in
               politische Entscheidungen einzubeziehen, entspricht der Forderung von immer mehr
               politischen und akademischen Akteuren. Obwohl die digitale Transformation hierzu
               eigentlich zahlreiche Chancen bietet, ist aus verschiedenen Gründen das Angebot
               digitaler Beteiligungsformate noch stark eingeschränkt. Im Rahmen des Projekts
               wird ein digitales Beteiligungsformat entwickelt, das den Bürgerinnen und Bürgern
               ermöglicht, eigene Argumente und Überzeugungen in den Abstimmungs- und Wahldiskurs
               einzubringen. Damit soll nicht nur das Vertrauen in Online-Infrastruktur gestärkt,
               sondern auch die Legitimität der direkten Demokratie erhöht werden.`
      },
      
      team: {
        label: 'Wer steckt hinter der Demokratiefabrik?',
        text: `Involved in the projects are Prof. Marc Bühlmann, Marlène Gerber, Dominik Wyss, and
              Giada Gianola (all University of Berne). The project benefits from expert knowledge by
              Prof. André Bächtiger (University of Stuttgart) and Marc Klein (MIT Center for Collective Intelligence).`
      },

      artificialmoderators: {
        label: '@:am.actor.1 und @:am.actor.2 - Das Moderatorenteam',
        text: `Bestimmt sind Ihnen bereits @:am.actor.1 und @:am.actor.2 begegnet. Die beiden ModeratorInnen 
              begleiten Sie bei der Mitarbeit in der Demokratiefabrik. Sie machen Sie auf die wichtigsten 
              Aufgaben aufmerksam.`
      },

      next_steps: {
        label: 'Die nächsten Schritte',
        text: `Konkret werden im Projekt zwei Prototypen digitaler Bürger*innenbeteiligung getestet:
        1) Wahlberechtigte stellen einen Smartvote-Fragekatalog zusammen und
        2) Stimmberechtigte erstellen ein Argumentarium zu einer eidgenössischen Abstimmungsvorlage.
        Die Innovation unseres Projekts liegt in einer engen Verzahnung sozialer und technischer
        Ansätze: Wir übernehmen ein in der Politikwissenschaft etabliertes Konzept der repräsentativ
        zusammengestellten Bürgerversammlungen. Zudem entwickeln wir eine Plattform, die den
        Teilnehmenden eine autonome Rolle im politischen Gestaltungsprozess ermöglichen soll.
        Im 21. Jahrhundert erleben verschiedenste Formen der Bürgerbeteiligung einen Aufschwung.
        Zu wissen, unter welchen Bedingungen digitale Beteiligungsformen die Demokratie stärken können, stellt die Grundlage für eine erfolgreiche Bürgerbeteiligung im digitalen Zeitalter.
        Der Schweizerische Nationalfonds unterstützt das Projekt ab April 2020 für eine Dauer von
        36 Monaten im Rahmen des NFP77 «Digitale Transformation».<br>
        Lesen Sie mehr Informationen unter
        <a href="https://anneepolitique.swiss/pages/postvotes" target="_blank">Webseite des Année Politique Suisse</a>`
      },

      transparency: {
        label: 'Völlige Transparenz auf der einen Seite, ...',
        // text: 'Ein wichtiges Anliegen von uns ist, dass die Funktionsweise unserer Software von der angezeigt werden. {iconTechnicalTransparency}'
        text: `Ein wichtiges Anliegen von uns ist, dass die Funktionsweise unserer Software von der 
              interessierten Öffentlich jederzeit nachvollzogen und auf Herz und Nieren überprüft werden 
              kann. Es ist daher für uns eine Selbstverständlichkeit, dass unsere Software open source ist. 
              Doch auch für Leute ohne IT-Kenntnisse, schaffen wir Transparenz. Allem voran 
              finden sich auf auf der Plattform an verschiedensten Stellen das folgende Icon {iconTechnicalTransparency}.
              Dahinter verbergen sich jeweils Erläuterungen, warum welche Inhalte in welcher Reihenfolge
              angezeigt werden.`
      },

      privacy: {
        label: '...Maximalen Datenschutz auf der anderen Seite.',
        text: `Die Privatshpäre aller unserer TeilnehmerInnen und BesucherInnen ist uns wichtig. 
        Daher arbeiten wir auf der Plattform ausschliesslich mit Pseudonymen. Wir erfassen einzig 
        Personendaten (namentlich Email und allenfalls Handy-Nummer), welche für das Funktionieren 
        der Plattform notwendig sind. Diese Daten werden sofort nach Beendigung des Bürgerinnen-Konvente
        auf unseren Servern gelöscht. Die Daten werden allesamt auschliesslich in der Schweiz auf 
        hauseigenen Servern gehostet (d.h. Universität Bern). Zu keinem Zeitpunkt bekommen Drittpartein Zugriff 
        auf unsere Hardware, Software und Daten.`
      },
      am: {
        page_introduction: 'Sind Sie neugierig was die Demokratiefabrik genau ist oder haben Sie bereits eine konkrete Frage? Wir haben hier die wichtigsten Informationen zusammengetragen.',
        open_questions: 'Blieben noch Fragen offen? Dann können Sie uns auch gerne per Email via info@demokratiefabrik.ch kontaktieren.',
        cmd_email_composer: 'Email verfassen'
      }
    }
  },
  btn_ready_to_enter: 'Ja, ich bin bereit'
}
