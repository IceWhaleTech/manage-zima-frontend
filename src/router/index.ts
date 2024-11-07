import { createWebHashHistory, createRouter } from 'vue-router'
import Main from '../pages/Main.vue'
import Home from '../pages/Home.vue'
const routes = [
  { path: '/', 
    component: Main,
    redirect:'/home',
    children: [
      { path: '/home', component: Home },
      { path: '/docs', component: ()=> import("../pages/docs/Index.vue")},
      {
        path:'/docs/editor',
        component: ()=> import("../pages/docs/EditorWrapper.vue"),
      },
      { path: '/event', component: ()=> import("../pages/event/Index.vue")},
      { path: '/search', component: ()=> import("../pages/search/Index.vue")},
      { path: '/gallery/images', component: ()=> import("../pages/gallery/Images.vue")},
      { path: '/gallery/videos', component: ()=> import("../pages/gallery/Videos.vue")},
      { path: '/feedback', component: ()=> import("../pages/feedback/Index.vue")},
      { path: '/share_ad', component: ()=> import("../pages/share/Index.vue")},
    ],
  },
  {
    path:'/login',
    component: ()=> import("../pages/Login.vue"),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router