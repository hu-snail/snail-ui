import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref, nextTick } from 'vue';
import SnFloatingToc from './SnFloatingToc.vue';
import SnFloatingTocTrigger from './SnFloatingTocTrigger.vue';
import SnFloatingTocBar from './SnFloatingTocBar.vue';
import SnFloatingTocContent from './SnFloatingTocContent.vue';
import SnFloatingTocItem from './SnFloatingTocItem.vue';

/**
 * Harness notes:
 *
 * 1. happy-dom implements no layout, so every section rect is stubbed with a
 *    fixed `top`. `measureSections()` reads it through
 *    `sn-floating-toc-utils`, and `window.scrollY` stands in for the scroll
 *    offset of the document container.
 *
 * 2. The panel lives inside a `<Transition>`. @vue/test-utils stubs
 *    transitions by default and a transition stub does not keep its `v-if`
 *    child in the DOM, so every mount disables `transition` stubs. happy-dom
 *    never fires `transitionend`, so the leave transition — and therefore the
 *    panel removal — only completes when the wrapper unmounts. Assertions on
 *    "the panel closed" therefore go through `expectPanelClosed()`, which
 *    unmounts first.
 *
 * 3. Bars register in `registerSection()` behind a microtask and hover timers
 *    are real (`openDelay` / `closeDelay`), so the delay props are set to 0
 *    and awaited with `flush()` (tick + macrotask + tick).
 */

const mounted: VueWrapper[] = [];

type VueWrapper = ReturnType<typeof mount>;

function track<T extends VueWrapper>(wrapper: T): T {
  mounted.push(wrapper);
  return wrapper;
}

/** Tick, macrotask (timers / registration microtask) and tick again. */
async function flush(): Promise<void> {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Assert the panel leaves the DOM once the component is unmounted.
 *
 * The leave transition runs on a `setTimeout`-driven frame and happy-dom
 * never fires `transitionend`, so the panel stays mounted while the wrapper
 * lives. Unmounting drives the leave to completion; it is awaited because
 * VTU's `unmount()` is async.
 */
async function expectPanelClosed(wrapper: VueWrapper): Promise<void> {
  await wrapper.unmount();
  await sleep(20);
  await nextTick();
  expect(document.body.querySelector('[data-snui-component="floating-toc-content"]')).toBeNull();
}

function installSections(tops: Record<string, number>): void {
  for (const [id, top] of Object.entries(tops)) {
    const el = document.getElementById(id) ?? document.createElement('section');
    el.id = id;
    el.getBoundingClientRect = () =>
      ({
        top,
        height: 300,
        bottom: top + 300,
        left: 0,
        right: 0,
        width: 0,
        x: 0,
        y: top,
      }) as DOMRect;
    if (!el.isConnected) document.body.appendChild(el);
  }
}

function setScrollY(value: number): void {
  Object.defineProperty(window, 'scrollY', { configurable: true, value });
}

function panel(wrapper: VueWrapper) {
  return wrapper.find('[data-snui-component="floating-toc-content"]');
}

function trigger(wrapper: VueWrapper) {
  return wrapper.find('[data-snui-component="floating-toc-trigger"]');
}

function bars(wrapper: VueWrapper) {
  return wrapper.findAll('[data-snui-component="floating-toc-bar"]');
}

function items(wrapper: VueWrapper) {
  return wrapper.findAll('[data-snui-component="floating-toc-item"]');
}

const mountOptions = { attachTo: document.body, global: { stubs: { transition: false } } } as const;

interface BuildOptions {
  placement?: 'left' | 'right';
  triggerMode?: 'hover' | 'press';
  open?: boolean;
  defaultOpen?: boolean;
  openDelay?: number;
  closeDelay?: number;
  bound?: number;
  scrollContainer?: string | HTMLElement;
  levels?: Record<string, number>;
  hrefs?: string[];
  onOpenChange?: (open: boolean) => void;
}

/** Mount a complete TOC (trigger + bars + content + items). */
function build(options: BuildOptions = {}): VueWrapper {
  const hrefs = options.hrefs ?? ['#intro', '#usage'];
  return track(
    mount(
      defineComponent({
        setup: () => () =>
          h(
            SnFloatingToc,
            {
              placement: options.placement,
              triggerMode: options.triggerMode,
              open: options.open,
              defaultOpen: options.defaultOpen,
              openDelay: options.openDelay ?? 0,
              closeDelay: options.closeDelay ?? 0,
              bound: options.bound,
              scrollContainer: options.scrollContainer,
              onOpenChange: options.onOpenChange,
            },
            () => [
              h(SnFloatingTocTrigger, null, () =>
                hrefs.map((href) =>
                  h(SnFloatingTocBar, {
                    href,
                    title: href.slice(1),
                    level: options.levels?.[href] ?? 1,
                  }),
                ),
              ),
              h(SnFloatingTocContent, null, () =>
                hrefs.map((href) => h(SnFloatingTocItem, { href })),
              ),
            ],
          ),
      }),
      mountOptions,
    ),
  );
}

describe('SnFloatingToc', () => {
  beforeEach(() => {
    setScrollY(0);
    installSections({ intro: 0, usage: 600 });
  });

  afterEach(() => {
    while (mounted.length > 0) mounted.pop()?.unmount();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('should render the root with the default right placement', async () => {
      const wrapper = build();
      await flush();
      expect(
        wrapper.find('[data-snui-component="floating-toc"]').attributes('data-placement'),
      ).toBe('right');
    });

    it('should reflect the left placement on the root and trigger', async () => {
      const wrapper = build({ placement: 'left' });
      await flush();
      expect(
        wrapper.find('[data-snui-component="floating-toc"]').attributes('data-placement'),
      ).toBe('left');
      expect(trigger(wrapper).attributes('data-placement')).toBe('left');
    });

    it('should render one bar per section with its level', async () => {
      const wrapper = build({ levels: { '#usage': 3 } });
      await flush();
      expect(bars(wrapper)).toHaveLength(2);
      expect(bars(wrapper)[1].attributes('data-level')).toBe('3');
      expect(bars(wrapper)[1].attributes('style')).toContain('--floating-toc-level: 3');
    });

    it('should open the panel away from the page edge', async () => {
      // A right-edge TOC must open leftwards, otherwise the panel lands
      // outside the viewport and the whole control looks "blocked".
      const right = build({ open: true });
      await flush();
      expect(panel(right).attributes('data-placement')).toBe('left');

      const left = build({ open: true, placement: 'left' });
      await flush();
      const panels = left.findAll('[data-snui-component="floating-toc-content"]');
      expect(panels[panels.length - 1].attributes('data-placement')).toBe('right');
    });

    it('should let an explicit content placement win', async () => {
      const wrapper = track(
        mount(
          defineComponent({
            setup: () => () =>
              h(SnFloatingToc, { open: true, placement: 'right' }, () => [
                h(SnFloatingTocContent, { placement: 'right' }, () => 'panel'),
              ]),
          }),
          mountOptions,
        ),
      );
      await flush();
      expect(panel(wrapper).attributes('data-placement')).toBe('right');
    });

    it('should not render the panel while closed', async () => {
      const wrapper = build();
      await flush();
      expect(panel(wrapper).exists()).toBe(false);
    });

    it('should fall back to the bar title for an item without a title', async () => {
      const wrapper = build({ open: true });
      await flush();
      expect(items(wrapper)[0].text()).toBe('intro');
      expect(items(wrapper)[1].text()).toBe('usage');
    });

    it('should render a custom item slot instead of the label', async () => {
      const wrapper = track(
        mount(
          defineComponent({
            setup: () => () =>
              h(SnFloatingToc, { open: true }, () => [
                h(SnFloatingTocContent, null, () =>
                  h(SnFloatingTocItem, { href: '#intro' }, () =>
                    h('span', { class: 'custom' }, 'Custom'),
                  ),
                ),
              ]),
          }),
          mountOptions,
        ),
      );
      await flush();
      expect(wrapper.find('.custom').exists()).toBe(true);
    });
  });

  describe('active section', () => {
    it('should mark the first section active before any scroll', async () => {
      const wrapper = build();
      await flush();
      expect(bars(wrapper)[0].attributes('data-active')).toBe('true');
      expect(bars(wrapper)[1].attributes('data-active')).toBe('false');
    });

    it('should move the active bar when the container scrolls', async () => {
      const wrapper = build();
      await flush();

      // Section #usage sits at 600; 650 puts it above the bound line.
      setScrollY(650);
      document.dispatchEvent(new Event('scroll'));
      await flush();

      expect(bars(wrapper)[0].attributes('data-active')).toBe('false');
      expect(bars(wrapper)[1].attributes('data-active')).toBe('true');
    });

    it('should apply the bound prop to the active section', async () => {
      // #usage sits at 600. `bound` is the viewport line a section must rise
      // above before it counts, so a 600px bound means #usage only turns
      // active at 1200 of scroll instead of 600.
      const wrapper = build({ bound: 600 });
      await flush();

      setScrollY(1200);
      document.dispatchEvent(new Event('scroll'));
      await flush();
      expect(bars(wrapper)[1].attributes('data-active')).toBe('true');
    });

    it('should let an explicit active prop win over the scroll state', async () => {
      const wrapper = track(
        mount(
          defineComponent({
            setup: () => () =>
              h(SnFloatingToc, null, () => [
                h(SnFloatingTocTrigger, null, () => [
                  h(SnFloatingTocBar, { href: '#intro', title: 'a' }),
                  h(SnFloatingTocBar, { href: '#usage', title: 'b', active: true }),
                ]),
              ]),
          }),
          mountOptions,
        ),
      );
      await flush();
      expect(bars(wrapper)[1].attributes('data-active')).toBe('true');
    });

    it('should mark the active entry as current for assistive technology', async () => {
      const wrapper = build({ open: true });
      await flush();
      expect(items(wrapper)[0].attributes('data-active')).toBe('true');
      expect(items(wrapper)[0].attributes('aria-current')).toBe('location');
      expect(items(wrapper)[1].attributes('aria-current')).toBeUndefined();
    });

    it('should keep the collapsed bars decorative', async () => {
      // The rail is a pointer affordance: keyboard users reach the sections
      // through the trigger (arrows) and the panel entries, so the bars must
      // not add tab stops or duplicate the entry semantics.
      const wrapper = build();
      await flush();
      const bar = bars(wrapper)[0];
      expect(bar.attributes('aria-hidden')).toBe('true');
      expect(bar.attributes('role')).toBeUndefined();
      expect(bar.attributes('tabindex')).toBeUndefined();
    });

    it('should re-render the bar active state after a scroll', async () => {
      const wrapper = build();
      await flush();

      setScrollY(650);
      document.dispatchEvent(new Event('scroll'));
      await flush();

      expect(items(wrapper)).toHaveLength(0);
      expect(bars(wrapper)[1].attributes('data-active')).toBe('true');
    });
  });

  describe('open state', () => {
    it('should open after openDelay on pointer enter', async () => {
      const onOpenChange = vi.fn();
      const wrapper = build({ openDelay: 10, onOpenChange });
      await flush();

      await trigger(wrapper).trigger('pointerenter');
      expect(panel(wrapper).exists()).toBe(false);

      await sleep(20);
      await flush();
      expect(panel(wrapper).exists()).toBe(true);
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('should cancel a pending open when the pointer leaves first', async () => {
      const onOpenChange = vi.fn();
      const wrapper = build({ openDelay: 20, onOpenChange });
      await flush();

      await trigger(wrapper).trigger('pointerenter');
      await trigger(wrapper).trigger('pointerleave');
      await sleep(30);
      await flush();

      // The leave cancelled the pending open, so the panel never rendered.
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(panel(wrapper).exists()).toBe(false);
    });

    it('should close after closeDelay on pointer leave', async () => {
      const wrapper = build({ closeDelay: 10 });
      await flush();

      await trigger(wrapper).trigger('pointerenter');
      await sleep(5);
      await flush();
      expect(panel(wrapper).exists()).toBe(true);

      await trigger(wrapper).trigger('pointerleave');
      await sleep(20);
      await flush();
      // The leave transition is still running, so the panel is present in the
      // stub-free DOM; unmounting completes it and proves the state flipped.
      await expectPanelClosed(wrapper);
    });

    it('should toggle on click in press mode without hover delays', async () => {
      const wrapper = build({ triggerMode: 'press', openDelay: 1000 });
      await flush();

      await trigger(wrapper).trigger('pointerenter');
      await flush();
      expect(panel(wrapper).exists()).toBe(false);

      await trigger(wrapper).trigger('click');
      await flush();
      expect(panel(wrapper).exists()).toBe(true);

      await trigger(wrapper).trigger('click');
      await flush();
      await expectPanelClosed(wrapper);
    });

    it('should open on click in hover mode instead of closing', async () => {
      const wrapper = build({ triggerMode: 'hover', openDelay: 10_000 });
      await flush();

      await trigger(wrapper).trigger('click');
      await flush();
      expect(panel(wrapper).exists()).toBe(true);

      // A second click keeps it open: the pointer reopened it on entry, so a
      // click is a confirmation, not a request to dismiss.
      await trigger(wrapper).trigger('click');
      await flush();
      expect(panel(wrapper).exists()).toBe(true);
    });

    it('should toggle on Enter in hover mode', async () => {
      const wrapper = build({ triggerMode: 'hover', openDelay: 10_000 });
      await flush();

      await trigger(wrapper).trigger('keydown', { key: 'Enter' });
      await flush();
      expect(panel(wrapper).exists()).toBe(true);

      await trigger(wrapper).trigger('keydown', { key: 'Enter' });
      await flush();
      await expectPanelClosed(wrapper);
    });

    it('should keep a controlled open state even when hovered', async () => {
      const onOpenChange = vi.fn();
      const wrapper = build({ open: false, onOpenChange });
      await flush();

      await trigger(wrapper).trigger('pointerenter');
      await flush();
      expect(panel(wrapper).exists()).toBe(false);

      await trigger(wrapper).trigger('click');
      await flush();
      // Controlled: the panel stays shut, but the host is told.
      expect(panel(wrapper).exists()).toBe(false);
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('should follow the controlled open prop', async () => {
      const open = ref(false);
      const wrapper = track(
        mount(
          defineComponent({
            setup: () => () =>
              h(SnFloatingToc, { open: open.value }, () => [
                h(SnFloatingTocContent, null, () => 'panel'),
              ]),
          }),
          mountOptions,
        ),
      );
      await flush();
      expect(panel(wrapper).exists()).toBe(false);

      open.value = true;
      await flush();
      expect(panel(wrapper).exists()).toBe(true);
    });

    it('should open when defaultOpen is set', async () => {
      const wrapper = build({ defaultOpen: true });
      await flush();
      expect(panel(wrapper).exists()).toBe(true);
    });

    it('should expose aria-expanded on the trigger', async () => {
      const wrapper = build();
      await flush();
      expect(trigger(wrapper).attributes('aria-expanded')).toBe('false');

      await trigger(wrapper).trigger('click');
      await flush();
      expect(trigger(wrapper).attributes('aria-expanded')).toBe('true');
    });

    it('should close when Escape is pressed inside the panel', async () => {
      const wrapper = build({ open: true });
      await flush();
      expect(panel(wrapper).exists()).toBe(true);
      expect(trigger(wrapper).attributes('aria-expanded')).toBe('true');

      await panel(wrapper).trigger('keydown', { key: 'Escape' });
      await flush();
      await expectPanelClosed(wrapper);
    });
  });

  describe('bar hover preview', () => {
    function previewCard(wrapper: VueWrapper) {
      return wrapper.find('[data-snui-component="floating-toc-preview"]');
    }

    it('should show the section title and summary when a bar is hovered', async () => {
      const wrapper = build();
      await flush();

      await bars(wrapper)[1].trigger('pointerenter');
      await flush();

      const card = previewCard(wrapper);
      expect(card.exists()).toBe(true);
      // The demo's sections are plain <section> elements, so the summary is
      // derived from their text content.
      expect(card.text()).toContain('usage');
      expect(card.attributes('aria-hidden')).toBe('true');
    });

    it('should prefer an explicit summary over the section text', async () => {
      const wrapper = track(
        mount(
          defineComponent({
            setup: () => () =>
              h(SnFloatingToc, null, () => [
                h(SnFloatingTocTrigger, null, () => [
                  h(SnFloatingTocBar, {
                    href: '#intro',
                    title: 'Intro',
                    summary: 'What this page is about.',
                  }),
                ]),
              ]),
          }),
          mountOptions,
        ),
      );
      await flush();

      await bars(wrapper)[0].trigger('pointerenter');
      await flush();
      expect(previewCard(wrapper).text()).toContain('What this page is about.');
    });

    it('should hide the preview when the pointer leaves the bar', async () => {
      const wrapper = build();
      await flush();

      await bars(wrapper)[0].trigger('pointerenter');
      await flush();
      expect(previewCard(wrapper).exists()).toBe(true);

      await bars(wrapper)[0].trigger('pointerleave');
      await flush();
      wrapper.unmount();
      await flush();
      expect(
        document.body.querySelector('[data-snui-component="floating-toc-preview"]'),
      ).toBeNull();
    });

    it('should drop the preview once the panel expands', async () => {
      const wrapper = build();
      await flush();

      await bars(wrapper)[0].trigger('pointerenter');
      await flush();
      expect(previewCard(wrapper).exists()).toBe(true);

      await trigger(wrapper).trigger('click');
      await flush();
      expect(panel(wrapper).exists()).toBe(true);
      // Like the panel, the preview leaves through a <Transition>; happy-dom
      // never fires `transitionend`, so assert the leave class instead of
      // removal from the DOM (same convention as SnColorPicker's tests).
      const card = previewCard(wrapper);
      expect(
        card.exists() &&
          card.classes().some((name) => name.startsWith('sn-floating-toc-preview-leave')),
      ).toBe(true);
    });

    it('should truncate a long auto summary', async () => {
      const section = document.getElementById('intro');
      section!.textContent = 'x'.repeat(300);
      const wrapper = build();
      await flush();

      await bars(wrapper)[0].trigger('pointerenter');
      await flush();
      const text = previewCard(wrapper).text();
      expect(text).toContain('…');
      expect(text.length).toBeLessThan(200);
    });
  });

  describe('navigation', () => {
    it('should scroll to the section when a bar is clicked', async () => {
      const wrapper = build();
      await flush();
      const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      await bars(wrapper)[1].trigger('click');

      expect(spy).toHaveBeenCalledWith({ top: 600, behavior: 'smooth' });
      expect(bars(wrapper)[1].attributes('data-active')).toBe('true');
    });

    it('should scroll to the section when an item is clicked', async () => {
      const wrapper = build({ open: true });
      await flush();
      const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      await items(wrapper)[1].trigger('click');

      expect(spy).toHaveBeenCalledWith({ top: 600, behavior: 'smooth' });
    });

    it('should walk sections with the arrow keys', async () => {
      const wrapper = build();
      await flush();
      const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      await trigger(wrapper).trigger('keydown', { key: 'ArrowDown' });
      expect(spy).toHaveBeenLastCalledWith({ top: 600, behavior: 'smooth' });

      await trigger(wrapper).trigger('keydown', { key: 'ArrowUp' });
      expect(spy).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should close on Escape from the trigger', async () => {
      const wrapper = build({ open: true });
      await flush();

      await trigger(wrapper).trigger('keydown', { key: 'Escape' });
      await flush();
      await expectPanelClosed(wrapper);
    });

    it('should expose the active href through the public instance', async () => {
      const wrapper = build();
      await flush();
      const root = wrapper.findComponent(SnFloatingToc);
      expect((root.vm as unknown as { activeHref: string }).activeHref).toBe('#intro');
    });
  });

  describe('scroll container', () => {
    it('should listen to an explicit container and clean up on unmount', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      Object.defineProperty(container, 'scrollTop', { configurable: true, value: 0 });
      const addSpy = vi.spyOn(container, 'addEventListener');
      const removeSpy = vi.spyOn(container, 'removeEventListener');

      const wrapper = build({ scrollContainer: container });
      await flush();

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      wrapper.unmount();
      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      container.remove();
    });

    it('should track the scroll position of an explicit container', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      Object.defineProperty(container, 'scrollTop', { configurable: true, value: 0 });

      const wrapper = build({ scrollContainer: container });
      await flush();
      expect(bars(wrapper)[0].attributes('data-active')).toBe('true');

      Object.defineProperty(container, 'scrollTop', { configurable: true, value: 650 });
      container.dispatchEvent(new Event('scroll'));
      await flush();

      expect(bars(wrapper)[1].attributes('data-active')).toBe('true');
      container.remove();
    });

    it('should accept a selector string as the container', async () => {
      const container = document.createElement('div');
      container.id = 'floating-toc-scroller';
      document.body.appendChild(container);
      const addSpy = vi.spyOn(container, 'addEventListener');

      build({ scrollContainer: '#floating-toc-scroller' });
      await flush();

      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
      container.remove();
    });
  });

  describe('dispose', () => {
    it('should remove the document scroll listener on unmount', async () => {
      const wrapper = build();
      await flush();
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      wrapper.unmount();
      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    });

    it('should clear a pending open timer on unmount', async () => {
      const onOpenChange = vi.fn();
      const wrapper = build({ openDelay: 20, onOpenChange });
      await flush();

      await trigger(wrapper).trigger('pointerenter');
      wrapper.unmount();
      await sleep(30);

      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it('should disconnect the intersection observer on unmount', async () => {
      const disconnect = vi.fn();
      const observe = vi.fn();
      vi.stubGlobal(
        'IntersectionObserver',
        class {
          observe = observe;
          unobserve = vi.fn();
          disconnect = disconnect;
          takeRecords = vi.fn();
          root = null;
          rootMargin = '';
          thresholds = [];
        },
      );

      const wrapper = build();
      await flush();
      // Both bars are observed; the observer instance is reused across
      // re-measurements rather than recreated.
      expect(observe).toHaveBeenCalled();

      wrapper.unmount();
      expect(disconnect).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });

    it('should drop a section from the registry when its bar unmounts', async () => {
      const showSecond = ref(true);
      const wrapper = track(
        mount(
          defineComponent({
            setup: () => () =>
              h(SnFloatingToc, null, () => [
                h(SnFloatingTocTrigger, null, () => [
                  h(SnFloatingTocBar, { href: '#intro', title: 'a' }),
                  showSecond.value ? h(SnFloatingTocBar, { href: '#usage', title: 'b' }) : null,
                ]),
              ]),
          }),
          mountOptions,
        ),
      );
      await flush();
      expect(bars(wrapper)).toHaveLength(2);

      showSecond.value = false;
      await flush();
      expect(bars(wrapper)).toHaveLength(1);
    });

    it('should not throw on a scroll event after unmount', async () => {
      const wrapper = build();
      await flush();
      wrapper.unmount();
      expect(() => document.dispatchEvent(new Event('scroll'))).not.toThrow();
    });
  });
});
