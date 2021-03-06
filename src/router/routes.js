import UserContentDefault from 'src/pages/ContentTree/Default'
import plugin_routes from './plugin_routes.js'
import oauth_routes from "../utils/oauth/routes.js"

// Application Routes
const meta4AssemblyPages = {topmenu: 'assemblies_ongoing_list'}
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [

      // Main Menues
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/background', name: 'background', component: () => import(/* webpackPrefetch: true */ 'pages/Background.vue') },
      // { path: '/showcase', name: 'showcase', component: () => import(/* webpackPrefetch: true */ 'pages/Assembly/AssemblyListShowcase.vue') },
      { path: '/ongoing', name: 'assemblies_ongoing_list', component: () => import('pages/Assembly/AssemblyListOngoing.vue') },

      // ASSEMBLY Pages
      { path: '/:assemblyIdentifier/home', name: 'assembly_home', component: () => import('pages/Assembly/AssemblyHome.vue'), meta: meta4AssemblyPages},
      { path: '/:assemblyIdentifier/agenda/:stageID', name: 'assembly_home_stepper', component: () => import('pages/Assembly/AssemblyHome.vue'), meta: meta4AssemblyPages},
      { path: '/:assemblyIdentifier/stage/:stageID', name: 'stage', component: UserContentDefault, meta: meta4AssemblyPages},
      { path: '/:assemblyIdentifier/stage/:stageID/:contenttreeID', name: 'contenttree', component: UserContentDefault, meta: meta4AssemblyPages},
      { path: '/:assemblyIdentifier/stage/:stageID/:contenttreeID/:contentID', name: 'content', component: UserContentDefault, meta: meta4AssemblyPages }
    ]
  },

  // Add Plugin Routes
  ...plugin_routes,

  // Authentication Routes
  ...oauth_routes,

  // Catch all routes
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }

]

export default routes
