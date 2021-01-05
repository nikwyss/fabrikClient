var routes = [

  {
    path: '/:assemblyIdentifier/pros_and_cons/:stageID/:contenttreeID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: ':contentID/', name: 'CIR_PROS_AND_CONS_CONTENT', component: () => import('./Content') },
      { path: '', name: 'CIR_PROS_AND_CONS', component: () => import('./Index') }
    ]
  }
]

export default routes
