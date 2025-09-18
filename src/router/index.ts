import { createRouter, createWebHistory } from 'vue-router';
import { authRoutes } from '@/modules/auth/routes';
import ShopLayout from '@/modules/shop/layouts/ShopLayout.vue';
import { adminRoutes } from '@/modules/admin/routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'shop',
      component: ShopLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/modules/shop/views/HomeView.vue'),
        },
      ],
    },

    // AuthRoutes
    authRoutes,

    // Admin Routes
    adminRoutes,
  ],
});

export default router;
