import { i18n } from 'src/boot/i18n'

const messages = {
    'de-ch': {

        index: {
            leave_a_preliminary_completed_stage: 'Danke! Das reicht mir vorerst.',
            button_end_of_page_on_last_stage: 'Hier geht es lang.',
            button_end_of_page_on_early_stage: 'Ja, ich komme mit.',
            am: {
                new_visit_first_stage: `Wir beginnen mit folgendem Text. Darf ich Sie bitten diesen kurz durchzulesen?`,
                new_visit: `Darf ich Sie bitten diesen Text zu lesen. Sie können ihn sehr gerne auch kommentieren.`,
                completed: `Folgen Sie mir bitte, wenn Sie fertig sind.`,
                button_end_of_page_on_early_stage: `Sie sind schon fertig mit dem Text? Dann kommen Sie mit. Nun geht es erst richtig los.`,
                button_end_of_page_on_last_stage: `Sie sind schon fertig mit dem Text? Dann folgen Sie mir bitte.`,
                already_seen: `Sie können sich das ruhig noch etwas länger anschauen und bei Bedarf kommentieren.`
            }
        }
    }
}

export default {
    created: function () {
        i18n.mergeLocaleMessage('de-ch', messages['de-ch'])
    }
}