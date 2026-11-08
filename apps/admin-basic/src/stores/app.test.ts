import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

// The app store (via ../i18n) touches localStorage at module scope — the
// stub must exist before the import, hence the dynamic import below.
const backing = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (key: string) => backing.get(key) ?? null,
  setItem: (key: string, value: string) => void backing.set(key, value),
  removeItem: (key: string) => void backing.delete(key),
});

const { useAppStore, AFFIX_TAB_KEY } = await import('./app');

beforeEach(() => {
  backing.clear();
  setActivePinia(createPinia());
});

describe('useAppStore layout preferences', () => {
  it('should persist the layout mode and tab style', () => {
    const app = useAppStore();
    app.setLayout('mix');
    app.setTabType('bar');
    expect(backing.get('admin_basic_layout')).toBe('mix');
    expect(backing.get('admin_basic_tab_type')).toBe('bar');
  });

  it('should fall back to side/chrome on a stale persisted value', () => {
    backing.set('admin_basic_layout', 'diagonal');
    backing.set('admin_basic_tab_type', 'ribbon');
    const app = useAppStore();
    expect(app.layout).toBe('side');
    expect(app.tabType).toBe('chrome');
  });
});

describe('useAppStore visited tabs', () => {
  it('should start with only the affix tab', () => {
    const app = useAppStore();
    expect(app.visitedKeys).toEqual([AFFIX_TAB_KEY]);
  });

  it('should append visits and keep the affix tab first', () => {
    const app = useAppStore();
    app.addVisited(AFFIX_TAB_KEY);
    app.addVisited('docs-theme');
    app.addVisited('docs-theme');
    app.addVisited('docs-i18n');
    expect(app.visitedKeys).toEqual([AFFIX_TAB_KEY, 'docs-theme', 'docs-i18n']);
  });

  it('should refuse to remove the affix tab', () => {
    const app = useAppStore();
    app.removeVisited(AFFIX_TAB_KEY);
    expect(app.visitedKeys).toEqual([AFFIX_TAB_KEY]);
  });

  it('should drop the visited key and persist the list', () => {
    const app = useAppStore();
    app.addVisited('docs-theme');
    app.removeVisited('docs-theme');
    expect(app.visitedKeys).toEqual([AFFIX_TAB_KEY]);
    expect(JSON.parse(backing.get('admin_basic_visited_tabs')!)).toEqual([AFFIX_TAB_KEY]);
  });

  it('should re-anchor the affix tab on a persisted list without it', () => {
    backing.set('admin_basic_visited_tabs', JSON.stringify(['docs-theme']));
    const app = useAppStore();
    expect(app.visitedKeys).toEqual([AFFIX_TAB_KEY, 'docs-theme']);
  });

  it('should reset to the affix tab on clearVisited', () => {
    const app = useAppStore();
    app.addVisited('docs-theme');
    app.clearVisited();
    expect(app.visitedKeys).toEqual([AFFIX_TAB_KEY]);
  });
});
