import { defineRouter } from '#q-app/wrappers'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'

export default defineRouter(function ({ store }) {
  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory(process.env.VUE_ROUTER_BASE)
  })


  router.beforeEach((to) => {
    const auth = useAuthStore(store)

    if (to.matched.some(r => r.meta.requiresAuth) && !auth.isLoggedIn) {
      return { name: 'login' }
    }
    if (to.matched.some(r => r.meta.requiresAdmin) && !auth.isAdmin) {
      return { name: 'items' } // user ธรรมดาเข้าหน้า admin/แก้ไข ไม่ได้
    }
    if (to.matched.some(r => r.meta.guestOnly) && auth.isLoggedIn) {
      return { name: 'items' }
    }
  })

  return router
})
