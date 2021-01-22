
// plugins/Constants.js
export default {
  //  create global Constants

  // User-specific Statuses
  // ongoing process: already started, but not yet finished 
  // not yet started
  // keep in sync with => fabrikApi/models/mixins.py
  STATUS_IDLE: 1,
  // status = very important tasks
  STATUS_ALERT: 2,
  // status = perliminary completed
  STATUS_PRELIMINARY_COMPLETED: 3,
  // Task accomplished
  // (no way to re-open by user)
  STATUS_COMPLETED: 11,
  // skipped/cancelled by user
  STATUS_SKIPPED: 12,
  // locked by admins
  STATUS_LOCKED: 13,

  // API Events
  // MONITOR_CONTENTTREE_ENTERING: 'MONITOR_CONTENTTREE_ENTERING',
  MONITOR_STAGE_ENTERING: 'MonitorStageEntering',
  MONITOR_ASSEMBLY_ENTERING: 'MonitorAssemblyEntering'

}