var routes = [

  {
    path: '/:assemblyIdentifier/vaa/',
    component: () => import('./Layout.vue'),
    children: [
      { path: ':stageID/overview', name: 'VAA_QUESTIONNAIRE_OVERVIEW', component: () => import('./Overview') },
      { path: ':stageID/questions/:contentID', name: 'VAA_QUESTIONNAIRE_QUESTIONS_ENTRY', component: () => import('./Questions') },
      { path: ':stageID/questions', name: 'VAA_QUESTIONNAIRE_QUESTIONS', component: () => import('./Questions') },
      { path: ':stageID/topics', name: 'VAA_QUESTIONNAIRE_TOPICS', component: () => import('./Topics') },
      { path: '', name: 'VAA_QUESTIONNAIRE', component: () => import('./Preparation') }
    ]
  }
]


export default routes
