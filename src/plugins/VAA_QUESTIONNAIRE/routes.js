var routes = [

  {
    name: 'VAALayout',
    // path: '/:assemblyIdentifier/vaa/',
    // component: () => import('layouts/MainLayout.vue'),
    // children: [{
    path: '/:assemblyIdentifier/vaa/',
    component: () => import('./Layout.vue'),
    children: [
      { path: ':stageID/analyses', name: 'VAA_QUESTIONNAIRE_ANALYSES', component: () => import('./Analyses') },
      { path: ':stageID/questions/:contentID', name: 'VAA_QUESTIONNAIRE_QUESTIONS_ENTRY', component: () => import('./Questions') },
      { path: ':stageID/questions', name: 'VAA_QUESTIONNAIRE_QUESTIONS', component: () => import('./Questions') },
      { path: ':stageID/topics', name: 'VAA_QUESTIONNAIRE_TOPICS', component: () => import('./Topics') },
      { path: '', name: 'VAA_QUESTIONNAIRE_HOME', component: () => import('./Home') }
    ]
    // }]
  }
]


export default routes
