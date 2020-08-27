declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    ENV_TYPE: string
    ENV_DEV: string
    OAUTH_API: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
    VUE_APP_DOMAIN: string,
    VUE_APP_I18N_LOCALE: string,
    VUE_APP_I18N_FALLBACK_LOCALE: string,
    VUE_APP_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS: number,
    VUE_APP_APISERVER_URL: string,
    VUE_APP_OAUTH_LOCAL_REDIRECTION_URI: string,
    VUE_APP_OAUTH_PROFILES: object
  }
}

// THEN: DEFINE THE ENVIRONMENT VARIABLES IN /.quasar.env.json

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
