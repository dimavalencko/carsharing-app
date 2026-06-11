import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/entities/auth/model/auth.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/cars',
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@pages/login/login-page.vue'),
      meta: { requiresGuest: true },
    },
    {
      name: 'register',
      path: '/register',
      component: () => import('@pages/register/register-page.vue'),
      meta: { requiresGuest: true },
    },
    {
      name: 'cars',
      path: '/cars',
      component: () => import('@pages/cars/cars-page.vue'),
    },
    {
      name: 'car-detail',
      path: '/cars/:id',
      component: () => import('@pages/car-detail/car-detail-page.vue'),
    },
    {
      name: 'bookings',
      path: '/bookings',
      component: () => import('@pages/bookings/bookings-page.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      component: () => import('@pages/admin/admin-layout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin',
          component: () => import('@pages/admin/dashboard/admin-dashboard-page.vue'),
        },
        {
          path: 'cars',
          name: 'admin-cars',
          component: () => import('@pages/admin/cars/admin-cars-page.vue'),
        },
        {
          path: 'bookings',
          name: 'admin-bookings',
          component: () => import('@pages/admin/bookings/admin-bookings-page.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@pages/admin/users/admin-users-page.vue'),
        },
      ],
    },
    {
      name: 'not-found',
      path: '/:pathMatch(.*)*',
      component: () => import('@pages/error-page/error-page.vue'),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  const isAdminRoute = to.path.startsWith('/admin');
  const isGuestRoute = !!to.meta.requiresGuest;

  if (!auth.isAuthenticated) {
    if (to.meta.requiresAuth) {
      return next({ name: 'login', query: { redirect: to.fullPath } });
    }
    return next();
  }

  if (auth.isAdmin) {
    if (!isAdminRoute) {
      return next({ name: 'admin' });
    }
    return next();
  }

  if (isAdminRoute) {
    return next({ name: 'cars' });
  }

  if (isGuestRoute) {
    return next({ name: 'cars' });
  }

  next();
});

router.onError(error => {
  console.error('Router error:', error);
});

export default router;
