
const meta4AssemblyPages = {topmenu: 'assemblies_ongoing_list'}

var routes = [

  {
    path: '/:assemblyIdentifier/textsheet/:containerID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: ':contentID/', name: 'TEXTSHEET_CONTENT', component: () => import('./Content') },
      { path: '', name: 'TEXTSHEET', component: () => import('./Index'), meta: meta4AssemblyPages}
    ]
  }
]

export default routes
