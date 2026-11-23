const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../pages/RegisterPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'items', component: () => import('../pages/ItemsPage.vue') },
      { path: 'items/new', name: 'item-new', component: () => import('../pages/ItemFormPage.vue') },
      {
        path: 'items/:id/edit',
        name: 'item-edit',
        component: () => import('../pages/ItemFormPage.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin',
        name: 'admin',
        component: () => import('../pages/AdminPage.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  { path: '/:catchAll(.*)*', component: () => import('../pages/ErrorNotFound.vue') }
]

export default routes
