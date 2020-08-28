
var routes = [

  {
    path: '/:assemblyIdentifier/politicaltopics/:containerID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':contentID/', name: 'VAA_TOPICS_CONTENT', component: () => import('./Content') },
      { path: '', name: 'VAA_TOPICS', component: () => import('./Index') }
    ]
  }
]

export default routes
