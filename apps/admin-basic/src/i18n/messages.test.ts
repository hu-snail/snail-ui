import { describe, expect, it } from 'vitest';
import zhCN from './zh-CN';
import enUS from './en-US';

function collectKeys(node: unknown, prefix = ''): string[] {
  if (typeof node !== 'object' || node === null) return [prefix];
  const keys: string[] = [];
  for (const [key, value] of Object.entries(node)) {
    keys.push(...collectKeys(value, prefix === '' ? key : `${prefix}.${key}`));
  }
  return keys.sort();
}

describe('i18n messages', () => {
  it('should keep zh-CN and en-US key trees identical', () => {
    expect(collectKeys(enUS)).toEqual(collectKeys(zhCN));
  });

  it('should localize every mock error code the service can return', () => {
    const apiErrors = (zhCN as { api: { error: Record<string, unknown> } }).api.error;
    for (const code of ['401', '1001', '1002']) {
      expect(apiErrors[code]).toBeDefined();
      expect((enUS as { api: { error: Record<string, unknown> } }).api.error[code]).toBeDefined();
    }
  });

  it('should register an i18n key for every menu label the mock ships', () => {
    const menus = (zhCN as { menus: Record<string, unknown> }).menus;
    for (const key of ['home', 'docs', 'docsGettingStarted', 'docsRequest', 'docsRouter', 'docsTheme', 'docsI18n']) {
      expect(menus[key]).toBeDefined();
    }
  });
});
