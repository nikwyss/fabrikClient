
const meta4AssemblyPages = { topmenu: 'assemblies_ongoing_list' }
// , acls: ['observe']  // NOT IMPLEMENTED/ NOT NECESSARY=> VUEX 

var routes = [

  {
    path: '/:assemblyIdentifier/textsheet/:stageID/:contenttreeID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: ':contentID/', name: 'TEXTSHEET_CONTENT', component: () => import('./Content') },      
      // TODO: remember: when loading components on runtime, we cannot subsribe to events that are emitted during main app init...
      { path: '', name: 'TEXTSHEET', component: () => import('./Index'), meta: meta4AssemblyPages }
    ]
  }
]

export default routes
