/**
 * Mock backend service (@alova/mock).
 *
 * One small in-memory session DB + the endpoints the template consumes:
 * auth (login / register / logout), menu (dynamic routes), dashboard.
 * Handlers return alova StatusResponse objects so business errors keep
 * HTTP 200 and travel via the `{ code, message, data }` envelope — the
 * same shape a real backend is expected to produce (see request/http.ts).
 *
 * Error `code`s are stable contract values; the UI renders them through
 * the `api.error.*` i18n namespace (`describeError` in request/http.ts).
 */
import { defineMock } from '@alova/mock';
import type {
  ActivityItem,
  DashboardStats,
  LoginPayload,
  MenuItem,
  RegisterPayload,
  UserInfo,
} from '../api/types';

interface MockUser extends UserInfo {
  password: string;
}

const users = new Map<string, MockUser>([
  [
    'admin',
    {
      username: 'admin',
      password: '123456',
      nickname: 'Admin',
      email: 'admin@snail-aui.dev',
      roles: ['admin'],
    },
  ],
  [
    'user',
    {
      username: 'user',
      password: '123456',
      nickname: 'Demo User',
      email: 'user@snail-aui.dev',
      roles: ['user'],
    },
  ],
]);

/** token → username. Module scope: survives in-app navigation, resets on reload. */
const sessions = new Map<string, string>();

function issueToken(username: string): string {
  const token = `mock-token-${username}-${Math.random().toString(36).slice(2)}`;
  sessions.set(token, username);
  return token;
}

function bearerUsername(headers: Record<string, string>): string | null {
  const raw = headers.Authorization ?? headers.authorization;
  if (typeof raw !== 'string') return null;
  const match = /^Bearer (.+)$/.exec(raw);
  const token = match?.[1];
  if (token === undefined) return null;
  return sessions.get(token) ?? null;
}

interface Envelope<T> {
  code: number;
  message: string;
  data: T;
}

/** StatusResponse — `statusText` is required for @alova/mock to treat the
 * return as a status-bearing response instead of the raw body. */
interface MockStatusResponse<T> {
  status: number;
  statusText: string;
  body: Envelope<T>;
}

function ok<T>(data: T): MockStatusResponse<T> {
  return { status: 200, statusText: 'ok', body: { code: 0, message: 'ok', data } };
}

function fail(code: number): MockStatusResponse<null> {
  return { status: 200, statusText: 'ok', body: { code, message: 'request failed', data: null } };
}

function toUserInfo(user: MockUser): UserInfo {
  return {
    username: user.username,
    nickname: user.nickname,
    email: user.email,
    roles: [...user.roles],
  };
}

const MENU_TREE: MenuItem[] = [
  { key: 'home', path: '/home', i18nKey: 'menus.home', icon: 'house' },
  {
    key: 'docs',
    i18nKey: 'menus.docs',
    icon: 'book-open',
    children: [
      {
        key: 'docs-getting-started',
        path: '/docs/getting-started',
        i18nKey: 'menus.docsGettingStarted',
        icon: 'rocket',
      },
      {
        key: 'docs-request',
        path: '/docs/request',
        i18nKey: 'menus.docsRequest',
        icon: 'globe',
      },
      {
        key: 'docs-router',
        path: '/docs/router',
        i18nKey: 'menus.docsRouter',
        icon: 'route',
      },
      {
        key: 'docs-theme',
        path: '/docs/theme',
        i18nKey: 'menus.docsTheme',
        icon: 'palette',
      },
      {
        key: 'docs-i18n',
        path: '/docs/i18n',
        i18nKey: 'menus.docsI18n',
        icon: 'languages',
      },
    ],
  },
];

const STATS: DashboardStats = {
  totalUsers: 12864,
  todayOrders: 342,
  revenue: 986_000,
  growth: 12.6,
};

const ACTIVITIES: ActivityItem[] = [
  { id: 1, user: 'admin', action: 'Deployed', target: 'admin-web v2.3.0', time: '09:12', status: 'success' },
  { id: 2, user: 'alice', action: 'Updated', target: 'payment gateway config', time: '09:47', status: 'success' },
  { id: 3, user: 'bob', action: 'Scaled', target: 'order-service ×4', time: '10:05', status: 'warning' },
  { id: 4, user: 'carol', action: 'Deleted', target: 'legacy cron jobs', time: '10:31', status: 'danger' },
  { id: 5, user: 'dave', action: 'Invited', target: '3 new members', time: '11:02', status: 'success' },
];

/** Mock transport toggle — set VITE_USE_MOCK=false to talk to a real backend. */
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const mockGroups = defineMock(
  {
    '[POST]/api/auth/login': ({ data }) => {
      const { username, password } = (data ?? {}) as Partial<LoginPayload>;
      const user = typeof username === 'string' ? users.get(username) : undefined;
      if (user === undefined || user.password !== password) return fail(1001);
      return ok({ token: issueToken(user.username), user: toUserInfo(user) });
    },

    '[POST]/api/auth/register': ({ data }) => {
      const payload = (data ?? {}) as Partial<RegisterPayload>;
      if (
        typeof payload.username !== 'string' ||
        payload.username.length < 3 ||
        typeof payload.password !== 'string' ||
        typeof payload.nickname !== 'string' ||
        typeof payload.email !== 'string'
      ) {
        return fail(1003);
      }
      if (users.has(payload.username)) return fail(1002);
      const user: MockUser = {
        username: payload.username,
        password: payload.password,
        nickname: payload.nickname,
        email: payload.email,
        roles: ['user'],
      };
      users.set(user.username, user);
      return ok(toUserInfo(user));
    },

    '[POST]/api/auth/logout': ({ headers }) => {
      const raw = headers.Authorization ?? headers.authorization;
      const match = /^Bearer (.+)$/.exec(raw ?? '');
      if (match?.[1] !== undefined) sessions.delete(match[1]);
      return ok(null);
    },

    '[GET]/api/menu': ({ headers }) => {
      if (bearerUsername(headers) === null) return fail(401);
      return ok(structuredClone(MENU_TREE));
    },

    '[GET]/api/dashboard/stats': ({ headers }) => {
      if (bearerUsername(headers) === null) return fail(401);
      return ok({ ...STATS });
    },

    '[GET]/api/dashboard/activities': ({ headers }) => {
      if (bearerUsername(headers) === null) return fail(401);
      return ok(ACTIVITIES.map((item) => ({ ...item })));
    },
  },
  USE_MOCK,
);
