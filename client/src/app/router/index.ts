import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '@pages/main-page/main-page.vue';
import ErrorPage from '@pages/error-page/error-page.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'home',
      path: '/',
      component: MainPage,
      meta: {},
      redirect: {
        name: 'posts',
      },
      children: [
        {
          name: 'posts',
          path: 'posts',
          component: () => import('@pages/posts/posts-page.vue'),
          meta: {},
        },
      ],
    },
    {
      name: 'notFound',
      path: '/:pathMatch(.*)*',
      component: ErrorPage,
      meta: { title: '404 - Page Not Found' },
    },
  ],
});

// Navigation guards
router.beforeEach((to, _from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }

  next();
});

router.onError(error => {
  console.error('Router error:', error);
});

export default router;
