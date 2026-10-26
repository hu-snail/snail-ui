import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import SnAnchor from './SnAnchor.vue';
import SnAnchorLink from './SnAnchorLink.vue';

/**
 * Anchor scroll-tracking tests.
 *
 * Harness notes (same conventions as `SnAffix.test.ts` / `SnBackTop.test.ts`):
 *
 * 1. happy-dom performs no layout, so every `getBoundingClientRect()` is all
 *    zeros. Section positions are therefore stubbed per element through
 *    `Element.prototype.getBoundingClientRect`, keyed by element id, so a
 *    section can be moved without re-mounting.
 *
 * 2. `SnAnchor` registers its scroll listener on `document` in the capture
 *    phase. happy-dom does not propagate `window.dispatchEvent` to document
 *    listeners, so tests dispatch on `document` directly.
 *
 * 3. Scroll handling is trailing-edge throttled at 128ms, so tests either
 *    drive the first (immediate) pass or advance fake timers to observe a
 *    trailing run.
 */

function rectOf(top: number, height: number): DOMRect {
  return {
    top,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    height,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

/** Install a rect stub that reads the per-id positions registered below. */
const positions = new Map<string, { top: number; height: number }>();

function installRectStub(): void {
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const pos = positions.get(this.id);
    if (pos) return rectOf(pos.top, pos.height);
    return rectOf(0, 0);
  };
}

/** Register a section element with an id and a rect. */
function addSection(id: string, top: number, height: number): HTMLElement {
  const el = document.createElement('section');
  el.id = id;
  document.body.appendChild(el);
  positions.set(id, { top, height });
  return el;
}

function setSection(id: string, top: number, height: number): void {
  positions.set(id, { top, height });
}

/** Fire a document scroll and flush the first (immediate) measurement. */
async function scroll(): Promise<void> {
  document.dispatchEvent(new Event('scroll'));
  await nextTick();
  await nextTick();
}

/** Mount an anchor with the given links. */
function mountAnchor(
  props: Record<string, unknown> = {},
  links: Array<{ title: string; href: string }> = [
    { title: '简介', href: '#intro' },
    { title: '用法', href: '#usage' },
  ],
) {
  const wrapper = mount(SnAnchor, {
    props,
    slots: {
      default: () => links.map((link) => h(SnAnchorLink, { title: link.title, href: link.href })),
    },
    attachTo: document.body,
  });
  return wrapper;
}

/** Find a rendered link wrapper by its title text. */
function linkByTitle(
  wrapper: ReturnType<typeof mount>,
  title: string,
): ReturnType<typeof wrapper.find> | null {
  const found = wrapper.findAll('.sn-anchor-link').find((link) => link.text().includes(title));
  return found ?? null;
}

describe('SnAnchor', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    positions.clear();
    installRectStub();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { hash: '' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    positions.clear();
  });

  describe('rendering', () => {
    it('should render the anchor and its links', () => {
      addSection('intro', 100, 200);
      addSection('usage', 400, 200);
      const wrapper = mountAnchor();

      expect(wrapper.attributes('data-snui-component')).toBe('anchor');
      expect(wrapper.findAll('.sn-anchor-link')).toHaveLength(2);
    });

    it('should render the rail and its bar by default', () => {
      const wrapper = mountAnchor();
      expect(wrapper.find('.sn-anchor-rail').exists()).toBe(true);
      expect(wrapper.find('.sn-anchor-rail__bar').exists()).toBe(true);
      expect(wrapper.classes()).toContain('sn-anchor--show-rail');
    });

    it('should hide the rail when type is block', () => {
      const wrapper = mountAnchor({ type: 'block' });
      expect(wrapper.classes()).toContain('sn-anchor--block');
      expect(wrapper.classes()).not.toContain('sn-anchor--show-rail');
      expect(wrapper.find('.sn-anchor-rail').exists()).toBe(false);
    });

    it('should hide the rail when showRail is false', () => {
      const wrapper = mountAnchor({ showRail: false });
      expect(wrapper.find('.sn-anchor-rail').exists()).toBe(false);
    });

    it('should hide the highlight when showBackground is false', () => {
      const wrapper = mountAnchor({ showBackground: false });
      expect(wrapper.find('.sn-anchor-link-background').exists()).toBe(false);
    });

    it('should render a link title and href', () => {
      const wrapper = mountAnchor({}, [{ title: '简介', href: '#intro' }]);
      const anchor = wrapper.find('.sn-anchor-link__title');
      expect(anchor.text()).toBe('简介');
      expect(anchor.attributes('href')).toBe('#intro');
      expect(anchor.attributes('title')).toBe('简介');
    });
  });

  describe('link registration', () => {
    it('should expose the hook on the link', () => {
      const wrapper = mountAnchor({}, [{ title: '简介', href: '#intro' }]);
      expect(wrapper.find('.sn-anchor-link').attributes('data-snui-component')).toBe('anchor-link');
    });

    it('should throw when a link is rendered outside an anchor', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => mount(SnAnchorLink, { props: { title: 'x', href: '#x' } })).toThrow(
        /must be placed inside SnAnchor/,
      );
      spy.mockRestore();
    });
  });

  describe('active link tracking', () => {
    it('should mark the last section scrolled past bound as active', async () => {
      addSection('intro', 100, 200);
      addSection('usage', 400, 200);
      const wrapper = mountAnchor({ bound: 12 });

      // intro has crossed the top; usage is still below it.
      setSection('intro', -150, 200);
      setSection('usage', 60, 200);
      await scroll();

      expect(linkByTitle(wrapper, '简介')?.classes()).toContain('sn-anchor-link--active');
    });

    it('should switch the active link as more sections cross bound', async () => {
      addSection('intro', 100, 200);
      addSection('usage', 400, 200);
      const wrapper = mountAnchor({ bound: 12 });

      setSection('intro', -150, 200);
      setSection('usage', -100, 200);
      await scroll();

      expect(linkByTitle(wrapper, '用法')?.classes()).toContain('sn-anchor-link--active');
      expect(linkByTitle(wrapper, '简介')?.classes()).not.toContain('sn-anchor-link--active');
    });

    it('should leave no link active when every section is below bound', async () => {
      addSection('intro', 300, 200);
      addSection('usage', 600, 200);
      const wrapper = mountAnchor({ bound: 12 });
      await scroll();

      expect(wrapper.find('.sn-anchor-link--active').exists()).toBe(false);
      expect(wrapper.find('.sn-anchor-rail__bar--active').exists()).toBe(false);
    });

    it('should honour ignoreGap for fully scrolled-past sections', async () => {
      addSection('intro', 100, 200);
      addSection('usage', 400, 200);
      // Both sections have scrolled entirely above the viewport.
      setSection('intro', -500, 200);
      setSection('usage', -200, 200);

      const wrapper = mountAnchor({ bound: 12, ignoreGap: true });
      await scroll();

      expect(linkByTitle(wrapper, '用法')?.classes()).toContain('sn-anchor-link--active');
    });

    it('should activate the hash target when its section has crossed bound', async () => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { hash: '#usage' },
      });
      addSection('intro', -300, 200);
      // `usage` must have crossed `bound` too, otherwise the initial
      // measurement overrides the hash with `null` (mirrors n-anchor, which
      // runs `_handleScroll(false)` right after `setActiveHref(hash)`).
      addSection('usage', 5, 200);
      const wrapper = mountAnchor();
      await nextTick();

      expect(linkByTitle(wrapper, '用法')?.classes()).toContain('sn-anchor-link--active');
    });
  });

  describe('click behaviour', () => {
    it('should scroll the section into view and activate the link on click', async () => {
      const section = addSection('intro', 100, 200);
      addSection('usage', 400, 200);
      const scrollSpy = vi.fn();
      section.scrollIntoView = scrollSpy;

      const wrapper = mountAnchor();
      await linkByTitle(wrapper, '简介')?.find('a').trigger('click');
      await nextTick();

      expect(scrollSpy).toHaveBeenCalled();
      expect(linkByTitle(wrapper, '简介')?.classes()).toContain('sn-anchor-link--active');
    });

    it('should expose scrollTo imperatively', async () => {
      const section = addSection('intro', 100, 200);
      const scrollSpy = vi.fn();
      section.scrollIntoView = scrollSpy;

      const wrapper = mountAnchor();
      (wrapper.vm as unknown as { scrollTo: (href: string) => void }).scrollTo('#intro');
      await nextTick();

      expect(scrollSpy).toHaveBeenCalled();
    });

    it('should ignore a link with a non-hash href', async () => {
      addSection('intro', 100, 200);
      const wrapper = mountAnchor({}, [{ title: '外链', href: '/docs' }]);
      await nextTick();
      // No throw; the section registry simply has nothing to track.
      expect(wrapper.findAll('.sn-anchor-link')).toHaveLength(1);
    });
  });

  describe('offsetTarget', () => {
    it('should measure against a custom element target', async () => {
      const container = document.createElement('div');
      container.id = 'anchor-offset-target';
      document.body.appendChild(container);
      positions.set('anchor-offset-target', { top: 50, height: 600 });

      addSection('intro', 30, 200);
      addSection('usage', 400, 200);

      const wrapper = mountAnchor({
        bound: 12,
        offsetTarget: container,
      });
      await scroll();

      // intro's offset becomes 30 - 50 = -20, which has crossed bound.
      expect(linkByTitle(wrapper, '简介')?.classes()).toContain('sn-anchor-link--active');
      container.remove();
    });

    it('should resolve a selector string offsetTarget', async () => {
      const container = document.createElement('div');
      container.id = 'anchor-offset-string';
      document.body.appendChild(container);
      positions.set('anchor-offset-string', { top: 50, height: 600 });

      addSection('intro', 30, 200);
      const wrapper = mountAnchor({
        bound: 12,
        offsetTarget: '#anchor-offset-string',
      });
      await scroll();

      expect(linkByTitle(wrapper, '简介')?.classes()).toContain('sn-anchor-link--active');
      container.remove();
    });

    it('should resolve a getter offsetTarget', async () => {
      const container = document.createElement('div');
      container.id = 'anchor-offset-getter';
      document.body.appendChild(container);
      positions.set('anchor-offset-getter', { top: 50, height: 600 });

      addSection('intro', 30, 200);
      const wrapper = mountAnchor({
        bound: 12,
        offsetTarget: () => container,
      });
      await scroll();

      expect(linkByTitle(wrapper, '简介')?.classes()).toContain('sn-anchor-link--active');
      container.remove();
    });
  });

  describe('affix', () => {
    it('should wrap the anchor in SnAffix when affix is true', () => {
      const wrapper = mountAnchor({ affix: true });
      expect(wrapper.classes()).toContain('sn-affix');
      expect(wrapper.find('.sn-anchor').exists()).toBe(true);
    });

    it('should still expose the anchor hook when affixed', () => {
      const wrapper = mountAnchor({ affix: true });
      expect(wrapper.find('[data-snui-component="anchor"]').exists()).toBe(true);
    });
  });

  describe('throttling', () => {
    it('should coalesce rapid scroll events into a trailing run', async () => {
      vi.useFakeTimers();
      try {
        addSection('intro', 100, 200);
        addSection('usage', 400, 200);
        const wrapper = mount(SnAnchor, {
          props: { bound: 12 },
          slots: {
            default: () => [
              h(SnAnchorLink, { title: '简介', href: '#intro' }),
              h(SnAnchorLink, { title: '用法', href: '#usage' }),
            ],
          },
          attachTo: document.body,
        });

        // First event runs immediately and opens the throttle window.
        setSection('intro', -150, 200);
        setSection('usage', 60, 200);
        document.dispatchEvent(new Event('scroll'));
        await nextTick();

        // Events inside the window are queued, not applied.
        setSection('intro', -150, 200);
        setSection('usage', 5, 200);
        document.dispatchEvent(new Event('scroll'));

        vi.advanceTimersByTime(128);
        await nextTick();
        await nextTick();

        expect(linkByTitle(wrapper, '用法')?.classes()).toContain('sn-anchor-link--active');
      } finally {
        vi.useRealTimers();
      }
    });
  });

  describe('dispose', () => {
    it('should register the document scroll listener in the capture phase', () => {
      const addSpy = vi.spyOn(document, 'addEventListener');
      mountAnchor();
      expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    });

    it('should remove the document scroll listener on unmount', () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      const wrapper = mountAnchor();
      wrapper.unmount();
      expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    });

    it('should not react to scroll after unmount', async () => {
      addSection('intro', 100, 200);
      const wrapper = mountAnchor({ bound: 12 });
      wrapper.unmount();
      await expect(scroll()).resolves.toBeUndefined();
    });

    it('should drop a link from the registry when it unmounts', async () => {
      addSection('intro', 100, 200);
      const toggled = defineComponent({
        components: { SnAnchor, SnAnchorLink },
        props: { show: { type: Boolean, default: true } },
        template: `
          <SnAnchor :bound="12">
            <SnAnchorLink title="简介" href="#intro" />
            <SnAnchorLink v-if="show" title="用法" href="#usage" />
          </SnAnchor>
        `,
      });
      const wrapper = mount(toggled, { props: { show: true } });
      expect(wrapper.findAll('.sn-anchor-link')).toHaveLength(2);

      await wrapper.setProps({ show: false });
      await nextTick();
      expect(wrapper.findAll('.sn-anchor-link')).toHaveLength(1);
      wrapper.unmount();
    });
  });
});
