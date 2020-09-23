import { i18n } from 'src/boot/i18n'

const messages = {
    'de-ch': {

        index: {
            leave_a_preliminary_completed_stage: 'Danke! Das reicht mir vorerst.',
            am: {
                new_visit_first_stage: `Wir beginnen mit folgendem Text. Darf ich Sie bitten diesen kurz durchzulesen?`,
                new_visit: `Darf ich Sie bitten diesen Text zu lesen. Sie können ihn sehr gerne auch kommentieren.`,
                completed: `Folgen Sie mir bitte, wenn Sie fertig sind.`,
                already_seen: `Sie können sich das ruhig noch etwas länger anschauen und bei Bedarf kommentieren.`
            }
        },
        contenttree: {
            comment_section_tooltip: 'Haben Sie an dieser Stelle Fragen oder Anregungen?',
            close_comment_section_tooltip: 'Klicken Sie hier um die Kommentarspalte wieder zu schliessen',
            am: {
                index: `Haben an dieser Stelle Fragen oder Anregungen? Die anderen Delegierten
                würde das sicher auch interessieren. | Hier ist Platz für Fragen und Kommentare zum obigen Abschnitt. | Hier wurden von anderen Besuchern bereits Beiträge eingegeben.`
            }
        }
    }
}

export default {
    created: function () {
        i18n.mergeLocaleMessage('de-ch', messages['de-ch'])
    }
}