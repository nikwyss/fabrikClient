
var routes = [

  {
    path: '/:assemblyIdentifier/vaa/:stageID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'analyses', name: 'VAA_QUESTIONNAIRE_ANALYSES', component: () => import('./Analyses') },
      { path: 'q/:contentID', name: 'VAA_QUESTIONNAIRE_QUESTIONS_ENTRY', component: () => import('./Questions') },
      { path: 'q', name: 'VAA_QUESTIONNAIRE_QUESTIONS', component: () => import('./Questions') },
      { path: '', name: 'VAA_QUESTIONNAIRE_TOPICS', component: () => import('./Index') }
    ]
  }
]


export default routes
