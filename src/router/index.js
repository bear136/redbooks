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
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/first',
    children: [
      {
        path: '/first',
        name: 'First',
        redirect: '/first/recommended',
        component: () => import('../views/FirstPage.vue'),
        children: [
          // 推荐
          {
            path: 'recommended',
            name: 'recommended',
            component: () => import('../views/HomePage.vue'),
            meta: {
              keepAlive: true // 需要缓存的页面
            }
          },
          {
            path: 'focuse',
            name: 'focuse',
            component: () => import('../views/HomePage.vue'),
            meta: {
              keepAlive: true // 需要缓存的页面
            }
          },
          {
            path: 'discover',
            name: 'discover',
            component: () => import('../views/HomePage.vue'),
            meta: {
              keepAlive: true // 需要缓存的页面
            }
          }
        ]
      },

      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: '/message',
        name: 'Message',
        component: () => import('../views/Message.vue')
      },

      {
        path: '/friends',
        name: 'friends',
        component: () => import('../views/Friends.vue')
      }

    ]
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  // 注册
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  // 发表文章
  {
    path: '/addDynamic',
    name: 'AddDynamic',
    component: () => import('../views/AddDynamic.vue')
  },
  // 编辑个人信息
  {
    path: '/editInfo',
    name: 'EditInfo',
    component: () => import('../components/editInfo/index.vue')
  },
  // 聊天界面
  {
    path: '/chatpage',
    name: 'Chatpage',
    component: () => import('../components/message/Chatpage.vue')
  },
  {
    path: '/detial',
    name: 'Detial',
    component: () => import('../components/show/Detial.vue')
  },
  // 别人的个人主页
  {
    path: '/otherPerson',
    name: 'otherPerson',
    component: () => import('../components/person/otherPerson')
  },
  // 关注点赞喜欢列表
  {
    path: '/fans',
    name: 'Fans',
    component: () => import('../components/person/Fans.vue')
  },
  // 视频展示界面
  {
    path: '/video',
    name: 'video',
    component: () => import('../views/VideoShow')
  },
  /**
   * 下面的是notify界面
   */
  {
    path: '/likeNotify',
    name: 'likeNotify',
    component: () => import('../views/Notify/GiveLikeNotify')
  },
  {
    path: '/focusNotify',
    name: 'focusNotify',
    component: () => import('../views/Notify/GiveFocusNotify')
  },
  {
    path: '/commentNotify',
    name: 'commentNotify',
    component: () => import('../views/Notify/GiveCommentNotify')
  },
  // 搜索页面
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search')
  },
  // 修改账户
  {
    path: '/editaccount',
    name: 'editAccount',
    component: () => import('../views/EditAccount'),
    redirect: '/editaccount/accountInfo',
    children: [
      {
        path: 'accountInfo',
        name: 'accountInfo',
        component: () => import('../views/AccountInfo/AccountInfo'),
        meta: {
          keepAlive: true // 需要缓存的页面
        }
      },
      {
        path: 'sendMail',
        name: 'sendMail',
        component: () => import('../views/AccountInfo/SendMail')
      },
      {
        path: 'changePhone',
        name: 'changePhone',
        component: () => import('../views/AccountInfo/ChangePhone')
      },
      {
        path: 'changePassword',
        name: 'changePassword',
        component: () => import('../views/AccountInfo/ChangePassword')
      },
      {
        path: 'changeMail',
        name: 'changeMail',
        component: () => import('../views/AccountInfo/ChangeMail')
      }
    ]
  }

]

const router = new VueRouter({
  routes
})
// 配置路由前置守卫实现没有登录不允许进入主页
router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register') {
    return next()
  } else {
    const tokenStr = window.localStorage.getItem('redBooksToken')
    // 如果没有token值，则直接强制跳转到登陆页面
    if (!tokenStr) return next('/login')
    // 反之直接放行
    next()
  }
})

export default router
