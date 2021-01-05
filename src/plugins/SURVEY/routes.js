
var routes = [

  {
    path: '/:assemblyIdentifier/survey/:stageID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'SURVEY', component: () => import('./Index') }
    ]
  }
]

export default routes
