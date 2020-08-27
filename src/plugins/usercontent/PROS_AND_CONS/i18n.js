import { i18n } from '../boot/i18n'

const messages = {
    'de-ch': {

    }
}

export default {
    created: function () {
        i18n.mergeLocaleMessage('de-ch', messages['de-ch'])
    }
}