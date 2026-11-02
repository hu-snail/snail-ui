import { httpGet } from '../request/http';
import type { ActivityItem, DashboardStats } from './types';

export const dashboardApi = {
  fetchStats: (): Promise<DashboardStats> => httpGet<DashboardStats>('/api/dashboard/stats'),

  fetchActivities: (): Promise<ActivityItem[]> => httpGet<ActivityItem[]>('/api/dashboard/activities'),
};
