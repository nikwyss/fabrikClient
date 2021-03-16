var routes = [

  {
    path: '/:assemblyIdentifier/vaa/',
    component: () => import('./Layout.vue'),
    children: [
      // Note: Define a route for each stageGroup/=> /stageID/<stage.group>
      { path: ':stageID/overview', name: 'VAA_QUESTIONNAIRE_OVERVIEW', component: () => import('./Overview') },
      { path: ':stageID/questions/:contentID', name: 'VAA_QUESTIONNAIRE_QUESTIONS_ENTRY', component: () => import('./Questions') },
      { path: ':stageID/questions', name: 'VAA_QUESTIONNAIRE_QUESTIONS', component: () => import('./Questions') },
      { path: ':stageID/topics', name: 'VAA_QUESTIONNAIRE_TOPICS', component: () => import('./Topics') },
      { path: ':stageID/preparation', name: 'VAA_QUESTIONNAIRE_PREPARATION', component: () => import('./Preparation') },
      { path: '', name: 'VAA_QUESTIONNAIRE', component: () => import('./Preparation') }
    ]
  }
]


export default routes
