
var routes = [

  {
    path: '/:assemblyIdentifier/politicaltopics/:stageID/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'analyses', name: 'VAA_QUESTIONNAIRE_ANALYSES', component: () => import('./Index') },
      { path: 'questions/', name: 'VAA_QUESTIONNAIRE_QUESTIONS', component: () => import('./Index') },
      { path: ':contentID/', name: 'VAA_QUESTIONNAIRE_TOPICS_CONTENT', component: () => import('./Content') },
      { path: '', name: 'VAA_QUESTIONNAIRE_TOPICS', component: () => import('./Index') }


    ]
  }
]


export default routes
