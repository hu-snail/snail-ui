/**
 * Shared API contracts between the mock service (`src/mock`) and the api
 * modules (`src/api`). These mirror what a real backend would return, so
 * swapping the mock for a live server only changes transport, not types.
 */

export interface UserInfo {
  username: string;
  nickname: string;
  email: string;
  roles: string[];
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: UserInfo;
}

export interface RegisterPayload {
  username: string;
  password: string;
  nickname: string;
  email: string;
}

/** Sidebar/routes tree returned by the backend after login. */
export interface MenuItem {
  key: string;
  /** Leaf items carry a route path (absolute). Group items omit it. */
  path?: string | undefined;
  /** i18n key rendered as the label, so language switching relabels the menu. */
  i18nKey: string;
  /** Icon name resolved by the layout's icon registry (lucide-vue-next). */
  icon?: string | undefined;
  children?: MenuItem[] | undefined;
}

export interface DashboardStats {
  totalUsers: number;
  todayOrders: number;
  revenue: number;
  growth: number;
}

export type ActivityStatus = 'success' | 'warning' | 'danger';

export interface ActivityItem {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  status: ActivityStatus;
}
