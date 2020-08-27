
var routes = [

  {
    path: '/:assembly_identifier/textsheet/:container_id/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: ':content_id/', name: 'TEXTSHEET_CONTENT', component: () => import('./Content') },
      { path: '', name: 'TEXTSHEET', component: () => import('./Index') }
    ]
  }
]

export default routes
