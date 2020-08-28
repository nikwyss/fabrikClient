import { RouteConfig } from 'vue-router'

import UserContentDefault from 'src/pages/UserContent/Default'
import plugin_routes from 'src/plugins/routes.js'

const routes = [

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/assemblies', name: 'assemblies', component: () => import(/* webpackPrefetch: true */ 'pages/Assembly/AssemblyListOngoing.vue') },
      { path: '/showcase', name: 'showcase', component: () => import(/* webpackPrefetch: true */ 'pages/Assembly/AssemblyListShowcase.vue') },
      { path: '/background', name: 'background', component: () => import(/* webpackPrefetch: true */ 'pages/Background.vue') }
    ]
  },

  {
    path: '/:assemblyIdentifier/container/:containerID',
    name: 'container',
    component: UserContentDefault,
    meta: {
      authRequired: false,  // TODO; sure?
      text: 'UserContent'
    },
  },
  {
    path: '/:assemblyIdentifier/container/:containerID/:contentID',
    name: 'content',
    component: UserContentDefault,
    meta: {
      authRequired: false, // TODO; sure?
      text: 'UserContent'
    }
  }
]

const final_routes_with_placeholder = [

  {
    path: '/:assemblyIdentifier/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', name: 'assembly_home', component: () => import('pages/Assembly/AssemblyHome.vue') },
      { path: 'step/:containerID', name: 'assembly_home_stepper', component: () => import('pages/Assembly/AssemblyHome.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

// Define Routes
routes.push(...plugin_routes)
routes.push(...final_routes_with_placeholder)

// Export routes.
export default routes