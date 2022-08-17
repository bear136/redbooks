import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'

Vue.use(VueRouter)

// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    redirect: '/first',
  },
  {
    path: "/home",
    component: Home,
    redirect: "/first",
    children: [
      {
        path: '/first',
        name: 'First',
        component: () => import('../views/FirstPage.vue')
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: '/message',
        name: 'Message',
        component: () => import('../views/Message.vue'),
      },

      {
        path: '/shop',
        name: 'Shop',
        component: () => import('../views/Shop.vue')
      },

    ]
  },
  //登录
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  //注册
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  //发表文章
  {
    path: '/addDynamic',
    name: 'AddDynamic',
    component: () => import('../views/AddDynamic.vue')
  },
  //编辑个人信息
  {
    path: '/editInfo',
    name: 'EditInfo',
    component: () => import('../components/editInfo/index.vue'),
  },
  //聊天界面
  {
    path: '/chatpage',
    name: 'Chatpage',
    component: () => import('../components/message/Chatpage.vue'),
  },
  {
    path: '/detial',
    name: 'Detial',
    component: () => import('../components/show/Detial.vue'),
  },
  //别人的个人主页
  {
    path: "/otherPerson",
    name: "otherPerson",
    component: () => import('../components/person/otherPerson')
  },
  //关注点赞喜欢列表
  {
    path: '/fans',
    name: 'Fans',
    component: () => import('../components/person/Fans.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('../views/VideoShow')
  }

]

const router = new VueRouter({
  routes
})
//配置路由前置守卫实现没有登录不允许进入主页
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    return next()
  }
  else {
    const tokenStr = window.localStorage.getItem('redBooksToken')
    //如果没有token值，则直接强制跳转到登陆页面
    if (!tokenStr) return next('/login')
    //反之直接放行
    next()
  }
})

export default router
