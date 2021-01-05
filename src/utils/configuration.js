import dotenv from 'dotenv'
dotenv.config()

export default class Configuration {
  static get CONFIG () {

    // THIS CONFIG VALUES BECOME OVERWRITTEN WITHIN entrypoint script:
    // if they werent overwritten, we are propbaby in the development mode.
    // then the values are taken from the env files.
    return {
      ENV_DOMAIN: '$ENV_DOMAIN',
      ENV_I18N_LOCALE: '$ENV_I18N_LOCALE',
      ENV_I18N_FALLBACK_LOCALE: '$ENV_I18N_FALLBACK_LOCALE',
      ENV_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS: '$ENV_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS',
      ENV_APISERVER_URL: '$ENV_APISERVER_URL',
      ENV_OAUTH_LOCAL_REDIRECTION_URI: '$ENV_OAUTH_LOCAL_REDIRECTION_URI',
      ENV_OAUTH_BASE_URL: '$ENV_OAUTH_BASE_URL',
      ENV_OAUTH_CLIENT_ID: '$ENV_OAUTH_CLIENT_ID',
      ENV_SURVEY_URL: '$ENV_SURVEY_URL'
    }
  }

  static value (name) {


    if (!(name in this.CONFIG)) {
      console.log(`Configuration: There is no key named "${name}"`)
      return
    }

    const value = this.CONFIG[name]

    if (!value) {
      console.log(`Configuration: Value for "${name}" is not defined`)
      return
    }

    if (value.startsWith('$ENV_')) {
      // value was not replaced, it seems we are in development.
      // Remove $ and get current value from process.env

      const envName = value.substr(1)

      // DW: NOTE: In Quasar, one can only access directly the properties in process.env.
      // This is for security purposes. The compile time replacement happens only when directly accessing the full path of process.env. Example: process.env.JAMES
      // TODO: is there a better way? than a switch loop or eval?

      var envValue = null
      switch (envName) {
        case 'ENV_DOMAIN':
          envValue = process.env.ENV_DOMAIN
          break;
        case 'ENV_I18N_LOCALE':
          envValue = process.env.ENV_I18N_LOCALE
          break;
        case 'ENV_I18N_FALLBACK_LOCALE':
          envValue = process.env.ENV_I18N_FALLBACK_LOCALE
          break;
        case 'ENV_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS':
          envValue = process.env.ENV_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS
          break;
        case 'ENV_APISERVER_URL':
          envValue = process.env.ENV_APISERVER_URL
          break;
        case 'ENV_OAUTH_LOCAL_REDIRECTION_URI':
          envValue = process.env.ENV_OAUTH_LOCAL_REDIRECTION_URI
          break;
        case 'ENV_OAUTH_BASE_URL':
          envValue = process.env.ENV_OAUTH_BASE_URL
          break;
        case 'ENV_OAUTH_CLIENT_ID':
          envValue = process.env.ENV_OAUTH_CLIENT_ID
          break
        case 'ENV_SURVEY_URL':
          envValue = process.env.ENV_SURVEY_URL
          break;
        }
      
      if (envValue !== null) {
        return envValue
      } else {
        console.log(`Configuration: Environment variable "${envName}" is not defined`)
      }

    } else {
      // RRODUCTION:
      // value was already replaced, it seems we are in production.
      return value
    }
  }
}