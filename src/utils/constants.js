
// plugins/Constants.js
export default {
  //  create global Constants

  // User-specific Statuses
  // ongoing process: already started, but not yet finished 
  // not yet started
  // keep in sync with => fabrikApi/models/mixins.py
  // STATUS_IDLE: 1,
  // status = very important tasks
  // STATUS_ALERT: 2,
  // status = perliminary completed
  // STATUS_PRELIMINARY_COMPLETED: 3,
  // Task accomplished
  // (no way to re-open by user)
  // STATUS_COMPLETED: 11,
  // skipped/cancelled by user
  // STATUS_SKIPPED: 12,
  // locked by admins
  // STATUS_LOCKED: 13,

  // API Events
  MONITOR_ERROR_NETWORK: 'ERROR.NETWORK',
  MONITOR_ERROR_AUTHORIZATION: 'ERROR.AUTH',
  MONITOR_ERROR_TOO_MANY_REQUESTS: 'ERROR.TOO.MANY.REQ',
  MONITOR_ERROR_AUTHENTICATION: 'ERROR.AUTH',
  MONITOR_WARNING_AUTHENTICATION: 'WARNING.AUTH',
  MONITOR_ACCOUNT_PROFILE_UPDATE: 'PROFILE.UPDATE',
  MONITOR_ROUTE_CHANGE: 'ROUTE',
  MONITOR_LOGIN: 'LOGIN',
  MONITOR_LOGOUT: 'LOGOUT',
  MONITOR_EXIT: 'EXIT',
  MONITOR_ACCOUNT_PROFILE_VISIT: 'PROFILE.VISIT',
  MONITOR_ASSEMBLY_ENTERING: 'ASSEMBLY.ENTER',
  MONITOR_DISCUSSION_SHOW: 'DISCUSSION.SHOW',
  MONITOR_DISCUSSION_HIDE: 'DISCUSSION.HIDE',


  MONITOR_STAGE_ENTERING: 'STAGE.ENTER',
  MONITOR_STAGE_IDLE: 'STAGE.IDLE',
  MONITOR_STAGE_COMPLETED: 'STAGE.COMPLETED'

}