import { createRouter, createWebHistory, type Router } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';

/**
 * Static routes. `/` is the authenticated shell — its children are appended
 * at runtime from the backend menu (`registerDynamicRoutes`), so the router
 * never needs to know the full page list up front.
 */
export const STATIC_ROUTES: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/register/RegisterView.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    name: 'layout',
    component: AdminLayout,
    redirect: '/home',
    children: [],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/error/NotFoundView.vue'),
  },
];

export function createAppRouter(): Router {
  return createRouter({
    history: createWebHistory(),
    routes: STATIC_ROUTES,
  });
}
