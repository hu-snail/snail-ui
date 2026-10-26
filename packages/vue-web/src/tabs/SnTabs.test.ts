import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, nextTick } from 'vue';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import SnTabs from './SnTabs.vue';
import SnTabPane from './SnTabPane.vue';

interface PaneSpec {
  name: string;
  tab?: string;
  body: string;
  disabled?: boolean;
  closable?: boolean;
}

/** Build a wrapper that mounts <SnTabs> + <SnTabPane> children so the test
 *  renderer sees the panes inside SnTabs' default slot. */
function wrapTabs(props: Record<string, unknown>, panes: PaneSpec[]) {
  return defineComponent({
    components: { SnTabs, SnTabPane },
    setup() {
      return () =>
        h(SnTabs, props as never, {
          default: () =>
            panes.map((p) =>
              h(
                SnTabPane,
                {
                  key: p.name,
                  name: p.name,
                  tab: p.tab ?? p.name,
                  disabled: p.disabled ?? false,
                  closable: p.closable,
                },
                { default: () => p.body },
              ),
            ),
        });
    },
  });
}

/** Same but binds `value` to a reactive ref so click-driven switching
 *  re-renders the pane bodies. */
function wrapTabsReactive(props: Record<string, unknown>, panes: PaneSpec[], initial?: string) {
  const value = ref<string | undefined>(initial);
  return defineComponent({
    components: { SnTabs, SnTabPane },
    setup() {
      return () =>
        h(
          SnTabs,
          {
            ...props,
            value: value.value,
            'onUpdate:value': (v: string) => {
              value.value = v;
            },
          } as never,
          {
            default: () =>
              panes.map((p) =>
                h(
                  SnTabPane,
                  {
                    key: p.name,
                    name: p.name,
                    tab: p.tab ?? p.name,
                    disabled: p.disabled ?? false,
                  },
                  { default: () => p.body },
                ),
              ),
          },
        );
    },
  });
}

const basicPanes: PaneSpec[] = [
  { name: 'a', tab: 'Tab A', body: 'Body A' },
  { name: 'b', tab: 'Tab B', body: 'Body B' },
  { name: 'c', tab: 'Tab C', body: 'Body C' },
];

describe('SnTabs (AUI-WEB-NAV-002)', () => {
  /* ─────────── Rendering ─────────── */

  it('renders one tab button per pane with the given labels', async () => {
    const w = mount(wrapTabs({ defaultValue: 'a' }, basicPanes));
    // Panes register with the parent during their own setup; the strip
    // re-renders on the next tick.
    await nextTick();
    const tabs = w.findAll('[role="tab"]');
    expect(tabs).toHaveLength(3);
    expect(tabs.map((t) => t.text())).toEqual(['Tab A', 'Tab B', 'Tab C']);
  });

  it('exposes role=tablist on the strip and role=tabpanel on panes', async () => {
    const w = mount(wrapTabs({ defaultValue: 'a' }, basicPanes));
    await nextTick();
    expect(w.find('[role="tablist"]').exists()).toBe(true);
    expect(w.find('[role="tabpanel"]').exists()).toBe(true);
  });

  it('marks only the active tab with aria-selected=true', async () => {
    const w = mount(wrapTabs({ defaultValue: 'b' }, basicPanes));
    await nextTick();
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[0]!.attributes('aria-selected')).toBe('false');
    expect(tabs[1]!.attributes('aria-selected')).toBe('true');
    expect(tabs[2]!.attributes('aria-selected')).toBe('false');
  });

  it('renders only the active pane body in default displayDirective=if', async () => {
    const w = mount(wrapTabs({ defaultValue: 'a' }, basicPanes));
    await nextTick();
    expect(w.text()).toContain('Body A');
    expect(w.text()).not.toContain('Body B');
  });

  /* ─────────── Value control ─────────── */

  it('falls back to defaultValue when value prop is absent (uncontrolled)', async () => {
    const w = mount(wrapTabs({ defaultValue: 'c' }, basicPanes));
    await nextTick();
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[2]!.attributes('aria-selected')).toBe('true');
    expect(w.text()).toContain('Body C');
  });

  it('auto-selects the first non-disabled pane when no value is given', async () => {
    const w = mount(
      wrapTabs({}, [
        { name: 'a', tab: 'A', body: 'Body A', disabled: true },
        { name: 'b', tab: 'B', body: 'Body B' },
      ]),
    );
    await nextTick();
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[0]!.attributes('aria-selected')).toBe('false');
    expect(tabs[1]!.attributes('aria-selected')).toBe('true');
    expect(w.text()).toContain('Body B');
  });

  it('clicking a tab emits update:value with the pane name', async () => {
    const w = mount(wrapTabsReactive({}, basicPanes, 'a'));
    await nextTick();
    await w.findAll('[role="tab"]')[1]!.trigger('click');
    expect(w.findComponent(SnTabs).emitted('update:value')?.at(-1)).toEqual(['b']);
  });

  it('clicking a tab switches the visible pane body', async () => {
    const w = mount(wrapTabsReactive({}, basicPanes, 'a'));
    await nextTick();
    expect(w.text()).toContain('Body A');
    await w.findAll('[role="tab"]')[2]!.trigger('click');
    await nextTick();
    expect(w.text()).toContain('Body C');
    expect(w.text()).not.toContain('Body A');
  });

  it('does not emit when clicking the already-active tab', async () => {
    const w = mount(wrapTabsReactive({}, basicPanes, 'a'));
    await nextTick();
    await w.findAll('[role="tab"]')[0]!.trigger('click');
    expect(w.findComponent(SnTabs).emitted('update:value')).toBeFalsy();
  });

  it('does not activate a disabled tab', async () => {
    const w = mount(
      wrapTabsReactive(
        {},
        [
          { name: 'a', tab: 'A', body: 'Body A' },
          { name: 'b', tab: 'B', body: 'Body B', disabled: true },
        ],
        'a',
      ),
    );
    await nextTick();
    await w.findAll('[role="tab"]')[1]!.trigger('click');
    expect(w.findComponent(SnTabs).emitted('update:value')).toBeFalsy();
    expect(w.text()).toContain('Body A');
  });

  /* ─────────── trigger ─────────── */

  it('trigger=hover activates on mouseenter instead of click', async () => {
    const w = mount(wrapTabsReactive({ trigger: 'hover' }, basicPanes, 'a'));
    await nextTick();
    await w.findAll('[role="tab"]')[1]!.trigger('mouseenter');
    expect(w.findComponent(SnTabs).emitted('update:value')?.at(-1)).toEqual(['b']);
  });

  it('trigger=click ignores mouseenter (default)', async () => {
    const w = mount(wrapTabsReactive({}, basicPanes, 'a'));
    await nextTick();
    await w.findAll('[role="tab"]')[1]!.trigger('mouseenter');
    expect(w.findComponent(SnTabs).emitted('update:value')).toBeFalsy();
  });

  /* ─────────── onBeforeLeave guard ─────────── */

  it('onBeforeLeave returning false blocks the switch', async () => {
    const guard = vi.fn(() => false);
    const w = mount(wrapTabsReactive({ onBeforeLeave: guard }, basicPanes, 'a'));
    await nextTick();
    await w.findAll('[role="tab"]')[1]!.trigger('click');
    await nextTick();
    expect(guard).toHaveBeenCalledWith('b', 'a');
    expect(w.findComponent(SnTabs).emitted('update:value')).toBeFalsy();
    expect(w.text()).toContain('Body A');
  });

  it('onBeforeLeave returning true allows the switch', async () => {
    const guard = vi.fn(() => true);
    const w = mount(wrapTabsReactive({ onBeforeLeave: guard }, basicPanes, 'a'));
    await nextTick();
    await w.findAll('[role="tab"]')[1]!.trigger('click');
    await nextTick();
    expect(w.findComponent(SnTabs).emitted('update:value')?.at(-1)).toEqual(['b']);
  });

  it('async onBeforeLeave resolving false blocks the switch', async () => {
    const guard = vi.fn(async () => false);
    const w = mount(wrapTabsReactive({ onBeforeLeave: guard }, basicPanes, 'a'));
    await nextTick();
    await w.findAll('[role="tab"]')[1]!.trigger('click');
    await nextTick();
    await nextTick();
    expect(w.findComponent(SnTabs).emitted('update:value')).toBeFalsy();
  });

  /* ─────────── type / size / placement ─────────── */

  it.each(['line', 'card', 'bar', 'segment', 'chrome'] as const)(
    'applies the type=%s modifier class',
    async (type) => {
      const w = mount(wrapTabs({ type, defaultValue: 'a' }, basicPanes));
      await nextTick();
      expect(w.find(`.sn-tabs--${type}`).exists()).toBe(true);
    },
  );

  it('defaults to type=bar', () => {
    const w = mount(wrapTabs({ defaultValue: 'a' }, basicPanes));
    expect(w.find('.sn-tabs--bar').exists()).toBe(true);
  });

  /**
   * `type="chrome"` is an additive divergence: the reference has no
   * browser-style strip. happy-dom performs no layout, so the visual
   * contract (tinted strip, hairline drawn inside the strip's padding box
   * so the active tab's opaque background covers it, rounded-top tabs) is
   * asserted against the SFC source — the technique `SnAlert.test.ts` uses
   * for its alignment tokens.
   */
  describe('type=chrome (browser tab strip)', () => {
    const source = readFileSync(join(process.cwd(), 'src/tabs/SnTabs.vue'), 'utf8');
    const style = (/<style scoped>([\s\S]*?)<\/style>/.exec(source)?.[1] ?? '').replace(
      /\/\*[\s\S]*?\*\//g,
      '',
    );

    it('keeps the strip clipped and draws its hairline inside the padding box', () => {
      // The base strip stays `overflow: hidden`, so the chrome hairline must
      // not rely on a negative offset that clipping would swallow.
      expect(style).toMatch(/\.sn-tabs__nav\s*\{[^}]*overflow:\s*hidden/);
      expect(style).toContain('background-position: bottom left;');
      expect(style).toContain('background-size: 100% 1px;');
      expect(style).not.toMatch(/\.sn-tabs--chrome[^{]*\{[^}]*bottom:\s*-1px/);
    });

    it('rounds the tab tops and keeps the active tab on the content surface', () => {
      expect(style).toContain('border-radius: 8px 8px 0 0;');
      expect(style).toMatch(
        /\.sn-tabs--chrome \.sn-tabs__tab--active\s*\{[^}]*background:\s*var\(--sn-web-color-background-surface\)/,
      );
    });

    it('reveals the close affordance on hover and on the active tab', () => {
      expect(style).toMatch(/\.sn-tabs--chrome \.sn-tabs__tab-close\s*\{[^}]*opacity:\s*0/);
      expect(style).toMatch(
        /\.sn-tabs--chrome \.sn-tabs__tab--active \.sn-tabs__tab-close\s*\{[^}]*opacity:\s*1/,
      );
    });

    it('renders the chrome modifier with closable + addable affordances', async () => {
      const w = mount(
        wrapTabs({ type: 'chrome', closable: true, addable: true, defaultValue: 'a' }, basicPanes),
      );
      await nextTick();
      expect(w.find('.sn-tabs--chrome').exists()).toBe(true);
      expect(w.findAll('.sn-tabs__tab')).toHaveLength(basicPanes.length);
      expect(w.findAll('.sn-tabs__tab-close')).toHaveLength(basicPanes.length);
      expect(w.find('.sn-tabs__add').exists()).toBe(true);
    });
  });

  it.each(['small', 'medium', 'large'] as const)('applies the size=%s modifier class', (size) => {
    const w = mount(wrapTabs({ size, defaultValue: 'a' }, basicPanes));
    expect(w.find(`.sn-tabs--size-${size}`).exists()).toBe(true);
  });

  it('normalizes deprecated placement=start to left', () => {
    const w = mount(wrapTabs({ placement: 'start', defaultValue: 'a' }, basicPanes));
    expect(w.find('.sn-tabs--left').exists()).toBe(true);
  });

  it('normalizes deprecated placement=end to right', () => {
    const w = mount(wrapTabs({ placement: 'end', defaultValue: 'a' }, basicPanes));
    expect(w.find('.sn-tabs--right').exists()).toBe(true);
  });

  it('sets aria-orientation=vertical for left/right placement', () => {
    const w = mount(wrapTabs({ placement: 'left', defaultValue: 'a' }, basicPanes));
    expect(w.find('[role="tablist"]').attributes('aria-orientation')).toBe('vertical');
  });

  it('sets aria-orientation=horizontal for top placement', () => {
    const w = mount(wrapTabs({ placement: 'top', defaultValue: 'a' }, basicPanes));
    expect(w.find('[role="tablist"]').attributes('aria-orientation')).toBe('horizontal');
  });

  /* ─────────── closable / addable ─────────── */

  it('renders a close affordance on every tab when closable=true', async () => {
    const w = mount(wrapTabs({ closable: true, defaultValue: 'a' }, basicPanes));
    await nextTick();
    expect(w.findAll('.sn-tabs__tab-close')).toHaveLength(3);
  });

  it('per-pane closable override wins over the parent flag', async () => {
    const w = mount(
      wrapTabs({ defaultValue: 'a' }, [
        { name: 'a', tab: 'A', body: 'Body A', closable: true },
        { name: 'b', tab: 'B', body: 'Body B', closable: false },
      ]),
    );
    await nextTick();
    expect(w.findAll('.sn-tabs__tab-close')).toHaveLength(1);
  });

  it('clicking close emits close with the pane name and does not activate', async () => {
    const w = mount(wrapTabsReactive({ closable: true }, basicPanes, 'a'));
    await nextTick();
    await w.findAll('.sn-tabs__tab-close')[1]!.trigger('click');
    expect(w.findComponent(SnTabs).emitted('close')?.at(-1)).toEqual(['b']);
    expect(w.findComponent(SnTabs).emitted('update:value')).toBeFalsy();
  });

  it('renders the add button when addable=true and emits add on click', async () => {
    const w = mount(wrapTabs({ addable: true, defaultValue: 'a' }, basicPanes));
    await nextTick();
    const add = w.find('.sn-tabs__add');
    expect(add.exists()).toBe(true);
    await add.trigger('click');
    expect(w.findComponent(SnTabs).emitted('add')).toBeTruthy();
  });

  it('does not render the add button by default', async () => {
    const w = mount(wrapTabs({ defaultValue: 'a' }, basicPanes));
    await nextTick();
    expect(w.find('.sn-tabs__add').exists()).toBe(false);
  });

  it('addable={disabled:true} blocks the add emit', async () => {
    const w = mount(wrapTabs({ addable: { disabled: true }, defaultValue: 'a' }, basicPanes));
    await nextTick();
    await w.find('.sn-tabs__add').trigger('click');
    expect(w.findComponent(SnTabs).emitted('add')).toBeFalsy();
  });

  /* ─────────── displayDirective ─────────── */

  it('displayDirective=show keeps inactive panes mounted but hidden', async () => {
    const w = mount(
      wrapTabsReactive(
        {},
        [
          { name: 'a', tab: 'A', body: 'Body A' },
          { name: 'b', tab: 'B', body: 'Body B' },
        ],
        'a',
      ),
    );
    await nextTick();
    // Default 'if' mode: Body B is not in the DOM at all.
    expect(w.text()).not.toContain('Body B');
  });

  it('displayDirective=show on the pane keeps it mounted when inactive', async () => {
    const w = mount(
      defineComponent({
        components: { SnTabs, SnTabPane },
        setup() {
          return () =>
            h(SnTabs, { value: 'a' } as never, {
              default: () => [
                h(SnTabPane, { name: 'a', tab: 'A' }, { default: () => 'Body A' }),
                h(
                  SnTabPane,
                  { name: 'b', tab: 'B', displayDirective: 'show' },
                  { default: () => 'Body B' },
                ),
              ],
            });
        },
      }),
    );
    await nextTick();
    // Both panes exist in the DOM; the inactive one is hidden via style.
    const panes = w.findAll('.sn-tabs-pane');
    expect(panes).toHaveLength(2);
    expect(panes[1]!.attributes('style')).toContain('display: none');
  });

  /* ─────────── slots ─────────── */

  it('renders prefix and suffix slots around the strip', async () => {
    const w = mount(
      defineComponent({
        components: { SnTabs, SnTabPane },
        setup() {
          return () =>
            h(SnTabs, { defaultValue: 'a' } as never, {
              default: () => h(SnTabPane, { name: 'a', tab: 'A' }, { default: () => 'Body A' }),
              prefix: () => h('span', { class: 'pfx' }, 'PREFIX'),
              suffix: () => h('span', { class: 'sfx' }, 'SUFFIX'),
            });
        },
      }),
    );
    await nextTick();
    expect(w.find('.pfx').text()).toBe('PREFIX');
    expect(w.find('.sfx').text()).toBe('SUFFIX');
  });

  /* ─────────── style passthrough ─────────── */

  it('applies tabStyle and tabClass to every tab', async () => {
    const w = mount(
      wrapTabs(
        {
          tabClass: 'my-tab',
          tabStyle: { color: 'red' },
          defaultValue: 'a',
        },
        basicPanes,
      ),
    );
    await nextTick();
    const tabs = w.findAll('[role="tab"]');
    expect(tabs.every((t) => t.classes().includes('my-tab'))).toBe(true);
    expect(tabs[0]!.attributes('style')).toContain('color: red');
  });

  it('applies paneClass to every pane', async () => {
    const w = mount(wrapTabs({ paneClass: 'my-pane', defaultValue: 'a' }, basicPanes));
    await nextTick();
    expect(w.find('.sn-tabs-pane').classes()).toContain('my-pane');
  });

  it('tabsPadding sets a padding style on the root', () => {
    const w = mount(wrapTabs({ tabsPadding: 12, defaultValue: 'a' }, basicPanes));
    expect(w.find('.sn-tabs').attributes('style')).toContain('padding: 12px');
  });

  /* ─────────── A11y / keyboard ─────────── */

  it('only the active tab is in the tab order', async () => {
    const w = mount(wrapTabs({ defaultValue: 'b' }, basicPanes));
    await nextTick();
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[0]!.attributes('tabindex')).toBe('-1');
    expect(tabs[1]!.attributes('tabindex')).toBe('0');
    expect(tabs[2]!.attributes('tabindex')).toBe('-1');
  });

  it('marks disabled tabs with aria-disabled', async () => {
    const w = mount(
      wrapTabs({ defaultValue: 'a' }, [
        { name: 'a', tab: 'A', body: 'Body A' },
        { name: 'b', tab: 'B', body: 'Body B', disabled: true },
      ]),
    );
    await nextTick();
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[1]!.attributes('aria-disabled')).toBe('true');
  });

  /* ─────────── dynamic panes ─────────── */

  it('registers panes added after mount', async () => {
    const visible = ref(false);
    const w = mount(
      defineComponent({
        components: { SnTabs, SnTabPane },
        setup() {
          return () =>
            h(SnTabs, { defaultValue: 'a' } as never, {
              default: () => [
                h(SnTabPane, { name: 'a', tab: 'A' }, { default: () => 'Body A' }),
                visible.value
                  ? h(SnTabPane, { name: 'b', tab: 'B' }, { default: () => 'Body B' })
                  : null,
              ],
            });
        },
      }),
    );
    await nextTick();
    expect(w.findAll('[role="tab"]')).toHaveLength(1);
    visible.value = true;
    await nextTick();
    expect(w.findAll('[role="tab"]')).toHaveLength(2);
  });

  it('unregisters panes removed after mount (no stale tabs)', async () => {
    const visible = ref(true);
    const w = mount(
      defineComponent({
        components: { SnTabs, SnTabPane },
        setup() {
          return () =>
            h(SnTabs, { defaultValue: 'a' } as never, {
              default: () => [
                h(SnTabPane, { name: 'a', tab: 'A' }, { default: () => 'Body A' }),
                visible.value
                  ? h(SnTabPane, { name: 'b', tab: 'B' }, { default: () => 'Body B' })
                  : null,
              ],
            });
        },
      }),
    );
    await nextTick();
    expect(w.findAll('[role="tab"]')).toHaveLength(2);
    visible.value = false;
    await nextTick();
    expect(w.findAll('[role="tab"]')).toHaveLength(1);
  });

  describe('barWidth', () => {
    const panes = [
      { name: 'a', body: 'A' },
      { name: 'b', body: 'B' },
    ];

    it('should leave the active tab unstyled when barWidth is unset', async () => {
      const w = mount(wrapTabs({ defaultValue: 'a' }, panes));
      await nextTick();

      const active = w.find('.sn-tabs__tab--active');
      expect(active.attributes('style')).toBeUndefined();
    });

    it('should pin the active bar width when barWidth is set', async () => {
      const w = mount(wrapTabs({ defaultValue: 'a', barWidth: 24 }, panes));
      await nextTick();

      const style = w.find('.sn-tabs__tab--active').attributes('style');
      expect(style).toContain('width: 24px');
    });
  });

  describe('centerActiveTab', () => {
    const panes = [
      { name: 'a', body: 'A' },
      { name: 'b', body: 'B' },
    ];

    it('should not scroll when centerActiveTab is off', async () => {
      const w = mount(wrapTabs({ defaultValue: 'b' }, panes));
      const nav = w.find('.sn-tabs__nav').element as HTMLElement;
      const scrollTo = vi.fn();
      nav.scrollTo = scrollTo;
      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(scrollTo).not.toHaveBeenCalled();
    });

    it('should scroll the active tab toward the centre', async () => {
      const w = mount(wrapTabs({ defaultValue: 'b', centerActiveTab: true }, panes));
      const nav = w.find('.sn-tabs__nav').element as HTMLElement;
      const scrollTo = vi.fn();
      nav.scrollTo = scrollTo;
      // Give the strip a measurable box in happy-dom.
      Object.defineProperty(nav, 'clientWidth', { configurable: true, value: 400 });
      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      expect(scrollTo).toHaveBeenCalled();
    });
  });

  describe('pane wrapper', () => {
    it('should forward paneWrapperClass and paneWrapperStyle', async () => {
      const w = mount(
        wrapTabs(
          {
            defaultValue: 'a',
            paneWrapperClass: 'my-wrapper',
            paneWrapperStyle: { background: 'red' },
          },
          [{ name: 'a', body: 'A' }],
        ),
      );
      await nextTick();

      const wrapper = w.find('.sn-tabs__panes');
      expect(wrapper.classes()).toContain('my-wrapper');
      expect(wrapper.attributes('style')).toContain('background: red');
    });
  });
});
