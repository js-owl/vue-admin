import router from './router'
import store from './store'
import { getToken } from '@/utils/auth' // get token from cookie
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import getPageTitle from '@/utils/get-page-title'

let isRoleMatched = false
const whiteList = ['/login', '/auth-redirect', '/401', '/404']

router.beforeEach(async (to, from, next) => {
  const hasToken = !!getToken()

  if (whiteList.includes(to.path)) {
    next()
  } else {
    if (hasToken) {
      const pageRoles = to.meta?.roles
      const userRole = store.state.user.role_name
      isRoleMatched = pageRoles && pageRoles.includes(userRole)
      if (userRole) {
        if (isRoleMatched) {
          if (to.path === '/request' && userRole === 'dialer') {
            next({ path: '/settings' })
          } else {
            next()
          }
        } else {
          console.log(
            '🚀 ~ file: permission.js:39 ~ if !isRoleMatched: \x1b[30m \x1b[42m 401 '
          )
          next({ path: '/401' })
        }
      } else {
        console.log(
          '🚀 ~ file: permission.js:43 ~ else userRole: \x1b[30m \x1b[42m login '
        )
        next({ path: '/login' })
      }

      // }
    } else {
      next({ path: '/login' })
      // next(`/login?redirect=${to.path}`)
    }
  }
})

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
// let hasRoles = false
// router.beforeEach(async (to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
//     } else {
//       // determine whether the user has obtained his permission roles through getInfo

//       if (hasRoles) {
//         next()
//       } else {
//         hasRoles = store.state.user.roles && store.getters.roles.length > 0
//         try {
//           // get user info
//           // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
//           const { roles } = await store.dispatch('user/getInfo')

//           // generate accessible routes map based on roles
//           const accessRoutes = await store.dispatch(
//             'permission/generateRoutes',
//             roles
//           )

//           // dynamically add accessible routes
//           router.addRoutes(accessRoutes)

//           // hack method to ensure that addRoutes is complete
//           // set the replace: true, so the navigation will not leave a history record
//           next({ ...to, replace: true })
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
