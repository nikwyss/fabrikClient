import PageAuthentication from './oauth.vue'

var routes = [
  {
    path: '/authorization',
    component: () => import('layouts/MinimalLayout.vue'),
    children: [
      { path: '', name: 'authorization', component: PageAuthentication }
      // { path: 'success/', name: 'home', component: PageAuthentication },
      // { path: 'login/', name: 'home', component: PageAuthentication }
    ]
  }
]

export default routes
