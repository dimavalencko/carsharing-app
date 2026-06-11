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
      name: 'not-found',
      path: '/:pathMatch(.*)*',
      component: () => import('@pages/error-page/error-page.vue'),
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'cars' });
  }

  next();
});

router.onError(error => {
  console.error('Router error:', error);
});

export default router;
