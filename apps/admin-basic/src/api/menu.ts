import { httpGet } from '../request/http';
import type { MenuItem } from './types';

/** Menu/routes tree for the logged-in user — drives dynamic routes + sidebar. */
export const menuApi = {
  fetchMenu: (): Promise<MenuItem[]> => httpGet<MenuItem[]>('/api/menu'),
};
