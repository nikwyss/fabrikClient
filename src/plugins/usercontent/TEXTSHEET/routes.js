
var routes = [

  {
    path: '/:assemblyIdentifier/textsheet/:containerID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: ':contentID/', name: 'TEXTSHEET_CONTENT', component: () => import('./Content') },
      { path: '', name: 'TEXTSHEET', component: () => import('./Index') }
    ]
  }
]

export default routes
