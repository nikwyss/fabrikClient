// import UserContentDefault from 'src/pages/ContentTree/Default'
import plugin_routes from './plugin_routes.js'

// Application Routes
const meta4AssemblyPages = {topmenu: 'assemblies_ongoing_list'}
// , acls: ['observe']  // NOT IMPLEMENTED/ NOT NECESSARY=> VUEX 

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [

      // Main Menues
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/authorization', props: true, name: 'authorization', component: () => import(/* webpackPrefetch: true */ 'pages/Empty.vue') },
      { path: '/logout', name: 'logout', component: () => import(/* webpackPrefetch: true */ 'pages/Auth/Logout.vue') },
      { path: '/profile', name: 'profile', props: true, component: () => import(/* webpackPrefetch: true */ 'pages/Auth/Profile.vue') },
      { path: '/background', name: 'background', component: () => import(/* webpackPrefetch: true */ 'pages/Background.vue') },
      // { path: '/showcase', name: 'showcase', component: () => import(/* webpackPrefetch: true */ 'pages/Assembly/AssemblyListShowcase.vue') },
      { path: '/ongoing', name: 'assemblies_ongoing_list', component: () => import('pages/Assembly/AssemblyListOngoing.vue') },

      // ASSEMBLY Pages
      // acls = a list of minimum roles required to visit this route...
      // (Note that all delegates have also contribution rights, etc..)
      { path: '/:assemblyIdentifier/home', name: 'assembly_home', 
        component: () => import('pages/Assembly/AssemblyHome.vue'), meta: meta4AssemblyPages},
      { path: '/:assemblyIdentifier/agenda/:stageID', name: 'assembly_home_stepper', 
        component: () => import('pages/Assembly/AssemblyHome.vue'), meta: meta4AssemblyPages},
      { path: '/:assemblyIdentifier/stage/:stageID', name: 'stage', 
        component: () => import('pages/ContentTree/Default.vue'), meta: meta4AssemblyPages},
      // component: UserContentDefault, meta: meta4AssemblyPages},
      { path: '/:assemblyIdentifier/stage/:stageID/:contenttreeID', name: 'contenttree', 
        component: () => import('pages/ContentTree/Default.vue'), meta: meta4AssemblyPages},
      // component: UserContentDefault, meta: meta4AssemblyPages}, 
      { path: '/:assemblyIdentifier/stage/:stageID/:contenttreeID/:contentID', name: 'content', 
        component: () => import('pages/ContentTree/Default.vue'), meta: meta4AssemblyPages}
      // component: UserContentDefault, meta: meta4AssemblyPages}
    ]
  },

  // Add Plugin Routes
  ...plugin_routes,

  // Catch all routes
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }

]

export default routes
