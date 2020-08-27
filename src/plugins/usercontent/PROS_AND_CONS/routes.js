var routes = [

  {
    path: '/:assembly_identifier/pros_and_cons/:container_id/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':content_id/', name: 'PROS_AND_CONS_CONTENT', component: () => import('./Content') },
      { path: '', name: 'PROS_AND_CONS', component: () => import('./Index') }
    ]
  }
]

export default routes
