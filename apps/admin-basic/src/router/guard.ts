/**
 * Session router guard + dynamic route lifecycle.
 *
 * Flow: public routes pass through; unauthenticated users are bounced to
 * /login with a redirect hint; the first authenticated navigation fetches
 * the backend menu tree, registers its routes under the layout route, then
 * replays the target location so the freshly added routes can match.
 */
import type { Router } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { setUnauthorizedHandler } from '../request/http';
import { menuToRoutes } from './dynamic';
import type { MenuItem } from '../api/types';

const addedRouteNames = new Set<string>();
let dynamicRegistered = false;

/** Drop every dynamically added route (logout / session expiry). */
export function resetDynamicRoutes(router: Router): void {
  for (const name of addedRouteNames) {
    if (router.hasRoute(name)) router.removeRoute(name);
  }
  addedRouteNames.clear();
  dynamicRegistered = false;
}

export function registerDynamicRoutes(router: Router, menu: MenuItem[]): void {
  for (const route of menuToRoutes(menu)) {
    const name = route.name;
    if (typeof name === 'string') {
      router.addRoute('layout', route);
      addedRouteNames.add(name);
    }
  }
  dynamicRegistered = true;
}

export function setupRouterGuard(router: Router): void {
  // Any 401 surfaced by the request layer ends the session the same way as
  // an explicit logout: dynamic routes dropped, store cleared, login shown.
  setUnauthorizedHandler(() => {
    useAuthStore().clearSession();
    resetDynamicRoutes(router);
    void router.push({ name: 'login' });
  });

  router.beforeEach(async (to) => {
    const auth = useAuthStore();

    if (to.meta.public === true) {
      if (auth.isLoggedIn && (to.name === 'login' || to.name === 'register')) {
        return { path: '/home' };
      }
      return true;
    }

    if (!auth.isLoggedIn) {
      if (to.fullPath === '/') return { name: 'login' };
      return { name: 'login', query: { redirect: to.fullPath } };
    }

    if (!dynamicRegistered) {
      try {
        const menu = await auth.loadMenu();
        registerDynamicRoutes(router, menu);
        return { path: to.path, query: to.query, hash: to.hash, replace: true };
      } catch {
        // 401 already ran the unauthorized handler; other failures (e.g.
        // network down) land on login where the user can retry.
        auth.clearSession();
        return { name: 'login' };
      }
    }

    return true;
  });
}
