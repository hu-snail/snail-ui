import { defineStore } from 'pinia';
import { authApi } from '../api/auth';
import { menuApi } from '../api/menu';
import { TOKEN_KEY, clearToken } from '../request/http';
import type { LoginPayload, MenuItem, RegisterPayload, UserInfo } from '../api/types';

const USER_KEY = 'admin_basic_user';

function isUserInfo(value: unknown): value is UserInfo {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.username === 'string' &&
    typeof candidate.nickname === 'string' &&
    Array.isArray(candidate.roles)
  );
}

function restoreUser(): UserInfo | null {
  const raw = localStorage.getItem(USER_KEY);
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isUserInfo(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) ?? '',
    user: restoreUser(),
    /** Menu tree fetched by the router guard; sidebar reads from here. */
    menu: [] as MenuItem[],
  }),

  getters: {
    isLoggedIn: (state) => state.token !== '',
  },

  actions: {
    async login(payload: LoginPayload): Promise<void> {
      const result = await authApi.login(payload);
      this.setSession(result.token, result.user);
    },

    /** Register then auto-login with the fresh credentials. */
    async register(payload: RegisterPayload): Promise<void> {
      await authApi.register(payload);
      await this.login({ username: payload.username, password: payload.password });
    },

    setSession(token: string, user: UserInfo): void {
      this.token = token;
      this.user = user;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    async loadMenu(): Promise<MenuItem[]> {
      const menu = await menuApi.fetchMenu();
      this.menu = menu;
      return menu;
    },

    /** Server logout + local teardown; local teardown is unconditional. */
    async logout(): Promise<void> {
      try {
        await authApi.logout();
      } finally {
        this.clearSession();
      }
    },

    clearSession(): void {
      this.token = '';
      this.user = null;
      this.menu = [];
      clearToken();
      localStorage.removeItem(USER_KEY);
    },
  },
});
