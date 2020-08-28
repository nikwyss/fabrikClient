var routes = [

  {
    path: '/:assemblyIdentifier/pros_and_cons/:containerID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':contentID/', name: 'PROS_AND_CONS_CONTENT', component: () => import('./Content') },
      { path: '', name: 'PROS_AND_CONS', component: () => import('./Index') }
    ]
  }
]

export default routes
