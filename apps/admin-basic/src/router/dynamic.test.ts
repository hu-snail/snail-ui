import { describe, expect, it } from 'vitest';
import { menuToNavOptions, menuToRoutes, VIEW_COMPONENTS } from './dynamic';
import type { MenuItem } from '../api/types';

const TREE: MenuItem[] = [
  { key: 'home', path: '/home', i18nKey: 'menus.home', icon: 'house' },
  {
    key: 'docs',
    i18nKey: 'menus.docs',
    icon: 'book-open',
    children: [
      { key: 'docs-theme', path: '/docs/theme', i18nKey: 'menus.docsTheme', icon: 'palette' },
      { key: 'docs-i18n', path: '/docs/i18n', i18nKey: 'menus.docsI18n', icon: 'languages' },
    ],
  },
];

describe('menuToRoutes', () => {
  it('should flatten menu leaves into layout-child routes', () => {
    const routes = menuToRoutes(TREE);
    expect(routes.map((route) => route.name)).toEqual(['home', 'docs-theme', 'docs-i18n']);
    expect(routes[0]).toMatchObject({ path: '/home', meta: { i18nKey: 'menus.home', icon: 'house' } });
  });

  it('should mark affix tabs from AFFIX_ROUTE_KEYS and leave the rest unmarked', () => {
    const routes = menuToRoutes(TREE);
    expect(routes[0]?.meta.affix).toBe(true);
    expect(routes[1]?.meta.affix).toBeUndefined();
  });

  it('should record the group i18n key as parent meta for breadcrumbs', () => {
    const routes = menuToRoutes(TREE);
    expect(routes[1]?.meta).toMatchObject({
      i18nKey: 'menus.docsTheme',
      parentI18nKey: 'menus.docs',
    });
  });

  it('should skip leaves whose key has no registered view', () => {
    const routes = menuToRoutes([{ key: 'ghost', path: '/ghost', i18nKey: 'menus.ghost' }]);
    expect(routes).toHaveLength(0);
  });

  it('should register a lazy view for every key the mock menu ships', () => {
    const mockKeys = ['home', 'docs-getting-started', 'docs-request', 'docs-router', 'docs-theme', 'docs-i18n'];
    for (const key of mockKeys) {
      expect(typeof VIEW_COMPONENTS[key]).toBe('function');
    }
  });
});

describe('menuToNavOptions', () => {
  it('should translate labels through the i18n key', () => {
    const options = menuToNavOptions(TREE, (key) => (key === 'menus.home' ? '首页' : key));
    expect(options[0]).toMatchObject({ key: 'home', label: '首页' });
  });

  it('should map known icon names to components and keep group children', () => {
    const options = menuToNavOptions(TREE, (key) => key);
    expect(options[0]?.icon).toBeDefined();
    expect(options[1]?.children).toHaveLength(2);
  });

  it('should skip unknown icon names instead of crashing', () => {
    const options = menuToNavOptions(
      [{ key: 'x', path: '/x', i18nKey: 'menus.x', icon: 'nope' }],
      (key) => key,
    );
    expect(options[0]?.icon).toBeUndefined();
  });
});
