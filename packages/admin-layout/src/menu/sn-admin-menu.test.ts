import { describe, expect, it } from 'vitest';
import {
  findTopAncestorKey,
  menuChildrenOf,
  menuPathTo,
  routesToMenuOptions,
  stripMenuChildren,
} from './sn-admin-menu';
import type { RouteLike } from './sn-admin-menu';

const iconStub = { render: () => null };

describe('routesToMenuOptions', () => {
  it('should map route table to menu options reading meta.title/icon', () => {
    const routes: RouteLike[] = [
      { name: 'home', path: '/home', meta: { title: '首页', icon: 'house' } },
      { name: 'about', path: '/about', meta: { title: '关于' } },
    ];
    expect(routesToMenuOptions(routes, { iconMap: { house: iconStub } })).toEqual([
      { key: 'home', label: '首页', icon: iconStub },
      { key: 'about', label: '关于' },
    ]);
  });

  it('should skip hidden routes and their subtrees', () => {
    const routes: RouteLike[] = [
      { name: 'a', path: '/a', meta: { title: 'A' } },
      {
        name: 'secret',
        path: '/secret',
        meta: { title: '隐藏', hidden: true },
        children: [{ name: 'inner', path: '/secret/inner', meta: { title: '内部' } }],
      },
    ];
    expect(routesToMenuOptions(routes)).toEqual([{ key: 'a', label: 'A' }]);
  });

  it('should collapse titleless parents without visible children', () => {
    const routes: RouteLike[] = [
      { path: '/', redirect: '/home' },
      { name: 'home', path: '/home', meta: { title: '首页' } },
    ];
    expect(routesToMenuOptions(routes)).toEqual([{ key: 'home', label: '首页' }]);
  });

  it('should keep titleless parents that still expose visible children', () => {
    const routes: RouteLike[] = [
      {
        path: '/system',
        children: [{ name: 'user', path: '/system/user', meta: { title: '用户' } }],
      },
    ];
    expect(routesToMenuOptions(routes)).toEqual([
      { key: '/system', label: '', children: [{ key: 'user', label: '用户' }] },
    ]);
  });

  it('should sort siblings by meta.order with missing last and stable ties', () => {
    const routes: RouteLike[] = [
      { name: 'b', path: '/b', meta: { title: 'B' } },
      { name: 'c2', path: '/c2', meta: { title: 'C2', order: 1 } },
      { name: 'c1', path: '/c1', meta: { title: 'C1', order: 1 } },
      { name: 'a', path: '/a', meta: { title: 'A', order: 0 } },
    ];
    expect(routesToMenuOptions(routes).map((o) => o.key)).toEqual(['a', 'c2', 'c1', 'b']);
  });

  it('should fall back to path when route has no name', () => {
    const routes: RouteLike[] = [{ path: '/only-path', meta: { title: 'P' } }];
    expect(routesToMenuOptions(routes)).toEqual([{ key: '/only-path', label: 'P' }]);
  });

  it('should be deterministic for equal input (idempotent mapping)', () => {
    const routes: RouteLike[] = [
      { name: 'a', path: '/a', meta: { title: 'A', icon: 'i', order: 2 } },
      {
        name: 'b',
        path: '/b',
        meta: { title: 'B' },
        children: [{ name: 'b1', path: '/b/1', meta: { title: 'B1' } }],
      },
    ];
    expect(routesToMenuOptions(routes)).toEqual(routesToMenuOptions(routes));
  });
});

describe('findTopAncestorKey', () => {
  const menu = [
    {
      key: 'system',
      label: '系统',
      children: [
        { key: 'user', label: '用户' },
        { key: 'role', label: '角色' },
      ],
    },
    { key: 'home', label: '首页' },
  ];

  it('should return the node itself when it is top-level', () => {
    expect(findTopAncestorKey(menu, 'home')).toBe('home');
  });

  it('should return the top ancestor for nested keys', () => {
    expect(findTopAncestorKey(menu, 'user')).toBe('system');
  });

  it('should return null for null and unknown keys', () => {
    expect(findTopAncestorKey(menu, null)).toBeNull();
    expect(findTopAncestorKey(menu, 'missing')).toBeNull();
  });
});

describe('menuChildrenOf', () => {
  const menu = [
    {
      key: 'system',
      label: '系统',
      children: [
        {
          key: 'auth',
          label: '权限',
          children: [{ key: 'role', label: '角色' }],
        },
      ],
    },
  ];

  it('should return direct children at any depth', () => {
    expect(menuChildrenOf(menu, 'system').map((o) => o.key)).toEqual(['auth']);
    expect(menuChildrenOf(menu, 'auth').map((o) => o.key)).toEqual(['role']);
  });

  it('should return empty array for leaves, null key and misses', () => {
    expect(menuChildrenOf(menu, 'role')).toEqual([]);
    expect(menuChildrenOf(menu, null)).toEqual([]);
    expect(menuChildrenOf(menu, 'nope')).toEqual([]);
  });
});

describe('menuPathTo', () => {
  const menu = [
    {
      key: 'system',
      label: '系统',
      children: [{ key: 'user', label: '用户' }],
    },
  ];

  it('should return the inclusive ancestor chain', () => {
    expect(menuPathTo(menu, 'user').map((o) => o.label)).toEqual(['系统', '用户']);
    expect(menuPathTo(menu, 'system').map((o) => o.label)).toEqual(['系统']);
  });

  it('should return empty for null and misses', () => {
    expect(menuPathTo(menu, null)).toEqual([]);
    expect(menuPathTo(menu, 'nope')).toEqual([]);
  });
});

describe('stripMenuChildren', () => {
  it('should drop children while keeping key/label/icon/disabled', () => {
    const menu = [
      {
        key: 'system',
        label: '系统',
        icon: iconStub,
        disabled: true,
        children: [{ key: 'user', label: '用户' }],
      },
      { key: 'home', label: '首页' },
    ];
    expect(stripMenuChildren(menu)).toEqual([
      { key: 'system', label: '系统', icon: iconStub, disabled: true },
      { key: 'home', label: '首页' },
    ]);
  });

  it('should not mutate the input tree', () => {
    const menu = [{ key: 'a', label: 'A', children: [{ key: 'b', label: 'B' }] }];
    stripMenuChildren(menu);
    expect(menu[0]?.children).toHaveLength(1);
  });
});
