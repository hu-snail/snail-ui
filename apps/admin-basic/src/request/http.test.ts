import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, describeError, httpGet, httpPost, TOKEN_KEY } from './http';
import type { LoginResult } from '../api/types';

beforeEach(() => {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('request layer against the mock service', () => {
  it('should resolve the envelope data for a valid login', async () => {
    const result = await httpPost<LoginResult>('/api/auth/login', {
      username: 'admin',
      password: '123456',
    });
    expect(result.user.username).toBe('admin');
    expect(result.token).toContain('mock-token-admin');
  });

  it('should throw ApiError carrying the envelope code for bad credentials', async () => {
    const error = await httpPost('/api/auth/login', { username: 'admin', password: 'wrong' }).catch(
      (caught: unknown) => caught,
    );
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe(1001);
  });

  it('should reject an unauthenticated menu fetch with code 401', async () => {
    const error = await httpGet('/api/menu').catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe(401);
  });

  it('should attach the persisted bearer token to authenticated requests', async () => {
    const login = await httpPost<LoginResult>('/api/auth/login', {
      username: 'admin',
      password: '123456',
    });
    localStorage.setItem(TOKEN_KEY, login.token);
    const menu = await httpGet('/api/menu');
    expect(menu.length).toBeGreaterThan(0);
    const docsGroup = menu.find((node) => node.key === 'docs');
    expect(docsGroup?.children?.length).toBeGreaterThan(0);
  });
});

describe('describeError', () => {
  it('should localize known envelope codes', () => {
    const text = describeError(new ApiError(1001, 'raw'), (key) =>
      key === 'api.error.1001' ? '用户名或密码错误' : key,
    );
    expect(text).toBe('用户名或密码错误');
  });

  it('should keep the raw message for unknown codes', () => {
    expect(describeError(new ApiError(9999, 'boom'), (key) => key)).toBe('boom');
  });

  it('should pass through plain Error messages', () => {
    expect(describeError(new Error('network'), (key) => key)).toBe('network');
  });
});
