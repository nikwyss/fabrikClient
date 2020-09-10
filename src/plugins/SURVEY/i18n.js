import { i18n } from 'src/boot/i18n'

const messages = {
  'de-ch': {
    survey: {
      misconfiguration_error: 'Es ist ein Fehler aufgeteten für den wir um Entschuldiung bitten. Momentan ist es nicht möglich die Befragung fortzusetzen.',
      redirect_to_survey: 'Sie werden zum Fragebogen weitergleietet...',
      already_completed_error: 'Sie haben diesen Fragebogen fertig ausgefüllt. Sie können zur Tagesübersicht zurückkehren.'
    }
  }
}

export default {
    created: function () {
        i18n.mergeLocaleMessage('de-ch', messages['de-ch'])
    }
}