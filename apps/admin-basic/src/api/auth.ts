import { httpPost } from '../request/http';
import type { LoginPayload, LoginResult, RegisterPayload, UserInfo } from './types';

export const authApi = {
  login: (payload: LoginPayload): Promise<LoginResult> =>
    httpPost<LoginResult>('/api/auth/login', payload),

  register: (payload: RegisterPayload): Promise<UserInfo> =>
    httpPost<UserInfo>('/api/auth/register', payload),

  logout: (): Promise<null> => httpPost<null>('/api/auth/logout'),
};
