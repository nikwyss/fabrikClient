// functional COmponent:
// <i18n path="term" tag="label" for="tos">
// <a :href="url" target="_blank"> {{ $t('tos') }}</a>
// </i18n>
// => <label>Accept <a href="...">terms of services</a></label>
// https://kazupon.github.io/vue-i18n/guide/interpolation.html#basic-usage

export default {
  // btn_ready_to_enter: 'Ja, ich bin bereit',

  app: {
    name: 'Demokratiefabrik',
    version: 'v1.0',
    error: {
      toomanyrequests_error_title: 'Es ist gerade sehr viel los.',
      toomanyrequests_error_body: 'Haben Sie etwas Geduld. Es kann vereinzelnt zu Störungen kommen.',
      authorization_error_title: 'Zugang verweigert',
      authorization_error_body: 'Sie sind nicht berechtigt auf diesen Bereich der Demokratiefabrik zuzugreifen. Bitte kontaktieren Sie die Organisatoren.',
      service_error_title: 'Betriebsstörung',
      service_error_body: 'Im Betrieb der Demokratiefabrik ist eine Störung aufgetreten. Wir bitten Sie um Entschuldigung.',
      network_error_title: 'Netzwerkstörung',
      network_error_body: 'Die Kommunikation innnerhalb der Demokratiefabrik ist momentan suboptimal. Wir bitten Sie um Entschuldigung. Bitte versuchen Sie es bitte erneut.',
    },
    btn_close: 'Diese Meldung schliessen',
    btn_back: 'Zurück',
    btn_next: 'Weiter',
    btn_skip: 'Überspringen',
    btn_cancel: 'Abbrechen',
    btn_home: 'Zur Startseite',
    btn_goto_profile: 'Zum Sekretariat',
    ask_for_bookmark_title: 'Hinweis:',
    ask_for_bookmark: 'Möchten Sie diese Webseite während dem Event in Ihren Favoriten/Lesezeichen speichern? Dann drücken Sie die beiden Tasten {bookmarkKeys}'
  },

  disclaimer: {
    btnLabel: 'Transparenzerklärung',
    contenttree: {
      basic: `Die Inhalte in diesem Forum werden in hierarchischer (und nicht in chronologischer) Reihenfolge aufgelistet.
      Die Reihenfolge der Inhalte auf gleicher Hierarchiestufe ist zufällig und variiert von Benutzer zu Benutzer.`,
      extensionExtraLarge: `Die Diskussion ist schon recht umfassend. Damit die Diskussion übersichtlich bleibt, wurden nur 30 zufällig ausgewählte Beiträge vollständig aufgeklappt.
      Sie können die restlichen Beiträge selbst per Mausklick öffnen.`
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
      locked: {
        tooltip: 'Dieser Bereich ist noch nicht zugänglich. Unsere ModeratorInenn haben zuerst noch eine andere Bitte an Sie!'
      },
      home: {
        label: 'Tagesübersicht',
        tooltip: 'Was sie heute alles erwartet!'
      },
      assembly: {
        label: 'Mitwirkung',
        tooltip: 'Hier finden die BürgerInnenversammlungen statt.'
      },
      showcase: {
        label: 'Schaufenster',
        tooltip: 'Die Ergebnisse unserer BürgerInnenversammlungen werden hier veröffentlicht.'
      },
      background: {
        label: 'Info-Point',
        tooltip: 'Sind Sie neugierig was es mit der Demokratiefabrik alles auf sich hat?'
      }
    }
  },

  auth: {
    salutation_for_guests: 'Lieber Gast!',
    name_derivation: 'Ihr Namensgeber ist der {altitude} Meter hohe Berg "{fullname}" ({canton})',
    login_button_label: 'Anmeldung',
    login_button_text: 'Klicken Sie auf \'Anmeldung\', wenn Sie sich anmelden möchten. Eine Anmeldung ist notwendig, um sich aktiv in der Fabrik zu beteiligen.',
    registered_as: 'Ihr Pseudonym',
    not_registered: 'Nicht angmeldet',
    profile_last_name: 'Pseudonym',
    profile_email: 'Email',
    profile_email_hint: 'Falls Sie keine Email Adresse besitzen, dann können sie auch ihre Handy Nummer eingeben. Wir werden Sie dann via SMS kontaktieren.',
    profile_email_disclaimer: 'Sie fragen sich, wozu wir Ihre Emailadresse benötigen? Wir werden Ihnen in den kommenden Tagen eine Handvoll Emails zusenden. (Benachrichtigungen über wichtige Ereignisse auf der Plattform, Nachbefragung für die wissenschaftliche Begleitstudie und für die Benachrichtung über die Gewinnausschreibung). Gleich nach Ende des Projektes werden wir sämtliche Emailadressen wieder von unserm Server an der Universität Bern löschen. Zu keinem Zeitpunkt werden wir Ihre Emailadresse an Dritte weiterreichen.',
    profile_update_action: 'Speichern',
    profile_update_success: 'Das Benutzerprofil wurde gespeichert',
    profile_update_error: 'Das Benutzerprofil konnte nicht gespeichert werden',
    profile_load_error: 'Das Benutzerprofil konnte nicht geladen werden',
    goto_authentication_form: 'Zur Anmeldung',
    goto_profile_page: 'Benutzerprofil überarbeiten',
    tooltip_authenticated: 'Klicken Sie hier um Ihr Benutzerprofil einzusehen oder sich abzumelden.',
    tooltip_non_authenticated: 'Sie sind noch nicht in der Demokratiefabrik angemeldet. Hier können Sie dies tun.',
    logout_succeeded_title: 'Vielen Dank und auf Wiedersehen',
    logout_succeeded_caption: 'Natürlich freuen wir uns auf einen erneuten Besuch. Wie wärs gleich morgen?',
    authentication_succeeded_title: 'Anmeldung erfolgreich.',
    authentication_succeeded_caption: 'Sie haben sich erfolgreich bei der Demokratiefabrik angemeldet. Wir danken Ihnen schon jetzt für Ihre Mithilfe.',
    authentication_warning_title: 'Anmeldung erforderlich.',
    authentication_warning_body: 'Sie haben sich noch nicht bei der Demokratiefabrik angemeldet. Für den Zugriff auf diesen Bereich ist dies jedoch erforderlich.',
    authentication_error_title: 'Anmeldung schlug fehl.',
    authentication_error_body: 'Bei der Anmeldung tratt ein unerwarteter Fehler auf. Bitte kontakieren Sie uns via Email: info@demokratiefabrik.ch'
  },

  index: {
    iam_ready: 'Zur Online-Konferenz, bitte!',
    goto_userprofile: 'Zum Benutzerprofil',
    am: {
      general_greeting: '{salutation} Wir sind @:am.actor.1 und @:am.actor.2 und freuen uns sehr, dass Sie hier sind.',
      salutation_for_authenticated: 'Guten Tag {username}!',
      salutation_for_guests: 'Guten Tag lieber Gast!',
      invitation_to_authenticate: 'Gehören Sie zu den 1000 für eine digitale Bürgerversammlung ausgelosten Teilnehmenden? Dann möchten wir Sie bitten sich anzumelden.',
      delegates_redirect: 'Wir können gleich zum Thema kommen. Sind Sie bereit?',
      email_required: 'Für die Dauer des Projektes benötigen wir eine Möglichkeit Sie zu kontaktieren. Dürfen wir Sie um eine Kontaktangabe bitten?',
      information_for_public_visitors: 'Auf dieser Webseite finden Sie spannende Ergebnisse von unseren Digitalen-Bürgerversammlungen. Schauen Sie sich bitte um!',
      factory_holiday: 'Wir haben zwar gerade Betriebsferien. Dennoch finden Sie auf dieser Seite viele Informationen über die Demokratiefabrik.',
      authenticated_user_without_permission_for_ongoing_assembly: 'Wir sind aktuell gerade an der Durchführung eines BürgerInnenversammlungen. Sie finden auf dieser Webseite viele Informationen dazu.',

      tooltip: {
        1: [
          // Tooltips for the first AM displayed on the page
          'Ich bin {actor} und bin übrigens sehr froh, dass Sie hier sind.'
        ],
        2: [
          // Tooltips for AM with index:2
          'Ich bin {actor}',
          'Haben Sie Fragen, dann besuchen Sie bitte den Info-Point',
        ]
      }
    }
  },

  assemblies: {
    h1: 'Aktuelle BürgerInnenversammlung | Aktuelle BürgerInnenversammlungen',
    home_caption: 'Konferenz der BürgerInnen: {assembly_title}',
    home_description: 'Bis zum Ende der BürgerInnenversammlung {relative_end_date} finden Sie hier täglich eine Übersicht der anstehenden Aufgaben.',
    please_enter: 'Bitte Eintreten',
    date_end: 'Noch {relative_end_date}',
    go_back_to_assembly_home: 'Zur Tagesübersicht',
    am: {
      there_are_assemblies_ongoing: 'Wunderbar! Sie sind eingeladen sich an einer BürgerInnenversammlung zu beteiligen.',
      no_assemblies_accessible: 'Sie können sich aktuell an keiner BürgerInnenversammlung beteiligen. Wer sich beteiligen darf und wer nicht, entschied das Los.',
      invitation_to_authenticate: 'Sind Sie eine der 1000 eingeladenen Personen, die sich an einer BürgerInnenversammlung beteiligen dürfen? Dann möchten wir Sie bitten sich anzumelden.',
      you_may_enter_this_assembly_for_the_first_time: 'Treten Sie ein: Es macht Spass und Sie leisten einen Beitrag für unsere Demokratie.'
    }
  },

  stages: {
    home_title: 'Ihre Agenda für den {current_date}',
    status_completed: 'Nicht mehr zugänglich',
    status_not_yet_accessible: 'Noch nicht zugänglich',
    status_disabled: 'Deaktiviert',
    status_deleted: 'Gelöscht',
    please_enter_stage: 'Öffnen',
    goto_next_stage: 'Weiter zum nächsten Punkt',
    goto_final_message: 'Zum Abschluss',
    am: {
      welcome_full_schedule: 'Dann legen wir los. Heute sind {numberOfStages} Punkte auf Ihrer Agenda.',
      welcome_partial_schedule: 'Nun habe ich nur noch eine Bitte für Heute. | Nun sind es nur noch {numberOfScheduledStages} Punkte für heute. Halten Sie bitte durch!',
      welcome_empty_schedule: 'Heute sind {numberOfStages} Punkte auf Ihrer Agenda.',
      enter_first: 'Wir möchten gerne hier anfangen. Sind Sie bereit?',
      enter_continue: 'Wir möchten nun gerne hier weiterfahren. Sind Sie bereit?',
      enter_end: 'Bevor wir für heute Schluss machen: Darf ich Sie bitten mir zu folgen.',
      already_seen: 'Möchten Sie sich das noch einmal ansehen? Ansonsten gehen wir weiter mit dem nächsten Punkt.',
      already_completed: 'Dieser Bereich haben Sie bereits abgeschlossen.',
      attention_needed: 'Hierzu hätten wir noch einen Wunsch. Folgen Sie uns bitte.',
      enter_unique_stage: 'Dies ist heute der einzige Punkt auf dem Programm. Sind Sie bereit?',
    }
  },

  showcase: {
    h1: 'Das Ergebnis unserer BügerInnenversammlung | Die Ergebnisse unserer BügerInnenversammlungen',
    am: {
      no_assemblies_in_public_state: `Zur gegebener Zeit, werden wir hier die Resultate unserer 
        BürgerInnenversammlungen veröffentlichen. Wir versprechen Ihnen einen unabhängigen Blick 
        aus der Perspektive des Stimmvolks.`,
      there_are_assemblies_in_public_state: `Wunderbar! Sie können hier schon die ersten Ergebnisse 
        unserer BürgerInnenversammlungen besichtigen.`,
      chip_please_enter: 'Bitte treten Sie ein.',
      tooltip: {
        1: [
          // Tooltips for the first AM displayed on the page
          `Das von den Stimmbürgern erarbeitete Material ist ungemein hilfreich, wenn man sich selber ein Bild über ein politisches 
          Thema machen will.`,
          // Tooltips for the first AM displayed on the page
          'Das warten lohnt sich auf jeden Fall. Besuchen Sie uns einfach später wieder.'
        ]
      }
    }
  },

  background: {
    h1: 'Alles über die Demokratiefabrik!',
    citizen_assemblies: {
      label: 'Die Demokratiefabrik: Ein Ort für digitiale BürgerInnenversammlungen',
      text: `Bürger*innen mittels Beteiligungsformaten wie Bürger*innenversammlungen stärker in
              politische Entscheidungen einzubeziehen, entspricht der Forderung von immer mehr
              politischen und akademischen Akteuren....`
    },

    digital_participation: {
      label: 'Was Sie bei unserere digitalen Plattform erwartet.',
      text: `Im Rahmen des Projekts
              wird ein digitales Beteiligungsformat entwickelt, das den Bürgerinnen und Bürgern
              ermöglicht, eigene Argumente und Überzeugungen in den Abstimmungs- und Wahldiskurs
              einzubringen. Damit soll nicht nur das Vertrauen in Online-Infrastruktur gestärkt,
              sondern auch die Legitimität der direkten Demokratie erhöht werden. Damit das gelingt
              setzen wir auf zwei Neuerungen: Erstens, werden bei der Mitarbeit die BürgerInnen
              von einem digitalen Moderatorenteam begleitet. Und besitzen die
              Teilnehmenden in der Demokratiefabrik weitgehende Autonomie. Dabei werden die meisten
              Entscheidungen in zufällig ausgelosten Kommittees gefällt. Damit erreichen wir
              eine im Internet ansonsten selten anzutreffende Balance.
`
    },

    team: {
      label: 'Wer für die Demokratiefabrik verantwortlich ist',
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
      der Plattform notwendig sind. Diese Daten werden sofort nach Beendigung des Bürgerinnenversammlungen
      auf unseren Servern gelöscht. Die Daten werden allesamt auschliesslich in der Schweiz auf 
      hauseigenen Servern gehostet (d.h. Universität Bern). Zu keinem Zeitpunkt bekommen Drittparteien Zugriff 
      auf unsere Hardware, Software und Daten.`
    },

    technologies: {
      label: 'Die Technologie, welche die Fabrik antreibt.',
      text: `Für den Aufbau der Demokratiefabrik setzen wir auf moderne Software-Architektur und breit 
      angewendete Open-Source-Software. Sie finden im Folgenden eine kleine Auswahl der verwendeten
      Technologien und Konzepte.`
    },

    am: {
      page_introduction: 'Wir haben auf dieser Seite die wichtigsten Informationen zur Demokratiefabrik zusammengetragen.',
      open_questions: 'Blieben noch Fragen offen? Dann können Sie uns auch gerne via Email kontaktieren.',
      cmd_email_composer: 'Email verfassen',
      tooltip: {
        2: [
          // Tooltips for the second AM displayed on the page
          'Ziemlich innovativ das Ganze. Finden Sie nicht?'
        ]
      }
    }
  },



  news: {
    h1: 'Was aktuell in der Demokratiefabrik läuft!',
    am: {
      newsletter: 'Möchten Sie bezüglich der Demokratiefabrik auf dem Laufenden bleiben? Dann können sie unseren Newsletter abonnieren.',
      cmd_newsletter_abo: 'Newsletter-Abo',
      tooltip: {
        2: [
          // Tooltips for the second AM displayed on the page
          'Schauen Sie sich doch auch noch auf der Seite "Hintergrund" um.'
        ]
      }
    }
  },

  contenttree: {
    comment_section_tooltip: 'Haben Sie an dieser Stelle Fragen oder Anregungen?',
    close_comment_section_tooltip: 'Klicken Sie hier um die Kommentarspalte wieder zu schliessen',
    no_entries: 'Es sind noch keine Kommentare oder Fragen vorhanden. Machen Sie den Anfang?',
    no_filter_results: 'Keine Einträge passen zu dieser Sucheingabe!',
    created_by: 'von {username}',
    search_button: 'Suche',
    search_field_label: 'Suchbegriff...',
    add_comment_or_question: 'Neuer Beitrag',
    close_comment_section: 'Forum schliessen',
    notification_number_of_expanded: 'Sie sehen aktuell {nof_shown} von {nof_total} Beiträgen.',
    expand_all: 'Beiträge ausklappen',
    collapse_all: 'Beiträge schliessen',
    toolbar: {
      reply: 'Möchten Sie diesem Beitrag antworten?',
      edit: 'Möchten Sie diesen Beitrag bearbeiten?',
      delete: 'Möchten Sie diesen Beitrag löschen?',
      reply_proposal: 'Möchten Sie eine Antwort vorschlagen?',
      edit_proposal: 'Möchten Sie eine Überarbeitung vorschlagen?',
      delete_proposal: 'Möchten Sie eine Löschung dieses Beitrags vorschlagen?',
      track_changes: 'Möchten Sie diesen zur Nachverfolgung kennzeichnen?',
      show_background: 'Beitragssummarium anzeigen.'
    },
    types: {
      'COMMENT': 'Kommentar',
      'QUESTION': 'Frage',
      'ANSWER': 'Antwort',
      'PARAGRAPH': 'Absatz',
      'SECTION': 'Kapitel',
      'SUBSECTION': 'Unterkapitel'
    },
    rating: {
      1: 'Schlechter Beitrag',
      2: 'Mittelmässiger Beitrag',
      3: 'Guter Beitrag'
    },
    rating_response: 'Danke! Ihre Bewertung wurde vermerkt.',
    editor: {
      head_create: 'Neuer Beitrag',
      head_reply: 'Beitrag Beantworten',
      head_edit: 'Beitrag Bearbeiten',
      content_title: 'Überschrift',
      content_title_shadow: 'Geben Sie Ihrem Beitrag eine prägnante Überschrift',
      content_text: 'Text',
      content_text_shadow: 'Geben Sie hier Ihren Beitrag ein.',
      content_text_hint: 'Schreiben Sie prägnant. Niemand möchte hier ganze Romane lesen.',
      content_type: 'Art des Beitrags',
      content_type_hint: 'Zu welcher Kategorie gehört der Beitrag am ehesten?',
      error: {
        wrong_contenttype: 'The content has a wrong type.',
        type_misconfiguration: 'The Contenttree is misconfigured. No type can be assigned to the content.'
      }
    },
    am: {
      index: `Haben an dieser Stelle Fragen oder Anregungen? Die anderen Delegierten
                würde das sicher auch interessieren. | Hier ist Platz für Fragen und Kommentare zum obigen Abschnitt. | Hier wurden von anderen Besuchern bereits Beiträge eingegeben.`
    }
  }
}
