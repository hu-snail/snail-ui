import { describe, expect, it } from 'vitest';
import type { SnMenuOption } from '@snui/vue-web';
import { searchMenuOptions } from './sn-menu-search';

const menus: SnMenuOption[] = [
  { key: 'home', label: '首页' },
  {
    key: 'system',
    label: '系统管理',
    children: [
      { key: 'user', label: '用户管理' },
      { key: 'role', label: '角色权限' },
      {
        key: 'audit',
        label: '审计日志',
        children: [{ key: 'audit-login', label: '登录日志' }],
      },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    children: [
      { key: 'report-sales', label: 'Sales report' },
      { key: 'report-legacy', label: 'Legacy sales', disabled: true },
    ],
  },
];

const keysOf = (hits: Array<{ key: string | number }>): Array<string | number> =>
  hits.map((h) => h.key);

describe('searchMenuOptions · matching', () => {
  it('should match a leaf by its own label', () => {
    expect(keysOf(searchMenuOptions(menus, '用户'))).toEqual(['user']);
  });

  it('should match every leaf under a named ancestor (group name is searchable)', () => {
    expect(keysOf(searchMenuOptions(menus, '系统'))).toEqual(['user', 'role', 'audit-login']);
  });

  it('should match case-insensitively', () => {
    expect(keysOf(searchMenuOptions(menus, 'REPORT'))).toEqual(['report-sales']);
    expect(keysOf(searchMenuOptions(menus, 'sales'))).toEqual(['report-sales']);
  });

  it('should trim the query before matching', () => {
    expect(keysOf(searchMenuOptions(menus, '  首页  '))).toEqual(['home']);
  });

  it('should return the ancestor trail on every hit', () => {
    const [hit] = searchMenuOptions(menus, '登录');
    expect(hit?.path.map((node) => node.label)).toEqual(['系统管理', '审计日志', '登录日志']);
  });

  it('should return [] for an empty or whitespace-only query', () => {
    expect(searchMenuOptions(menus, '')).toEqual([]);
    expect(searchMenuOptions(menus, '   ')).toEqual([]);
  });

  it('should return [] when nothing matches', () => {
    expect(searchMenuOptions(menus, '不存在的菜单')).toEqual([]);
  });
});

describe('searchMenuOptions · node selection rules', () => {
  it('should exclude group rows by default (groups are not navigable)', () => {
    expect(keysOf(searchMenuOptions(menus, '系统'))).not.toContain('system');
    expect(keysOf(searchMenuOptions(menus, '系统'))).not.toContain('audit');
  });

  it('should include group rows when includeGroups is set, in document order', () => {
    expect(keysOf(searchMenuOptions(menus, '系统', { includeGroups: true }))).toEqual([
      'system',
      'user',
      'role',
      'audit',
      'audit-login',
    ]);
  });

  it('should skip disabled leaves', () => {
    expect(keysOf(searchMenuOptions(menus, 'legacy'))).toEqual([]);
  });

  it('should still walk the subtree of a disabled group', () => {
    const tree: SnMenuOption[] = [
      { key: 'g', label: 'Group', disabled: true, children: [{ key: 'g1', label: 'Group child' }] },
    ];
    expect(keysOf(searchMenuOptions(tree, 'Group'))).toEqual(['g1']);
  });
});

describe('searchMenuOptions · limits and determinism', () => {
  it('should cap the result count at maxResults', () => {
    expect(keysOf(searchMenuOptions(menus, '系统', { maxResults: 2 }))).toEqual(['user', 'role']);
  });

  it('should return [] when maxResults is not positive', () => {
    expect(searchMenuOptions(menus, '系统', { maxResults: 0 })).toEqual([]);
    expect(searchMenuOptions(menus, '系统', { maxResults: -1 })).toEqual([]);
  });

  it('should apply a custom filter before the maxResults budget is consumed', () => {
    const hits = searchMenuOptions(menus, '系统', {
      maxResults: 1,
      filter: (_query, hit) => hit.key === 'audit-login',
    });
    expect(keysOf(hits)).toEqual(['audit-login']);
  });

  it('should be idempotent — equal input yields deep-equal output', () => {
    const first = searchMenuOptions(menus, '系统');
    const second = searchMenuOptions(menus, '系统');
    expect(second).toEqual(first);
    expect(second).not.toBe(first);
  });
});
