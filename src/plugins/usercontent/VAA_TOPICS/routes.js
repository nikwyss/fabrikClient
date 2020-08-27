
var routes = [

  {
    path: '/:assembly_identifier/politicaltopics/:container_id/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':content_id/', name: 'VAA_TOPICS_CONTENT', component: () => import('./Content') },
      { path: '', name: 'VAA_TOPICS', component: () => import('./Index') }
    ]
  }
]

export default routes
