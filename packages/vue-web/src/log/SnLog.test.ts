import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { defineComponent, h } from 'vue';
import SnLog from './SnLog.vue';

interface SnLogVm {
  scrollTo: (options: { top?: number; position?: 'top' | 'bottom'; silent?: boolean }) => void;
}

/** Mount SnLog through a wrapper component, mirroring real usage. */
function mountLog(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnLog },
      setup() {
        return () => h(SnLog, props as never);
      },
    }),
  );
}

function getScrollTo(w: ReturnType<typeof mountLog>): SnLogVm['scrollTo'] {
  return (w.findComponent(SnLog).vm as unknown as SnLogVm).scrollTo;
}

describe('SnLog (AUI-WEB-DD-013)', () => {
  describe('rendering', () => {
    it('renders one line per \n-separated chunk of the log prop', () => {
      const w = mountLog({ log: 'a\nb\nc' });
      const lines = w.findAll('.sn-log__line');
      expect(lines).toHaveLength(3);
      expect(lines[0].text()).toBe('a');
      expect(lines[2].text()).toBe('c');
    });

    it('falls back to the lines prop when log is absent', () => {
      const w = mountLog({ lines: ['x', 'y'] });
      const lines = w.findAll('.sn-log__line');
      expect(lines).toHaveLength(2);
      expect(lines[1].text()).toBe('y');
    });

    it('gives the log prop precedence over lines (reference behavior)', () => {
      const w = mountLog({ log: 'only-log', lines: ['x', 'y'] });
      const lines = w.findAll('.sn-log__line');
      expect(lines).toHaveLength(1);
      expect(lines[0].text()).toBe('only-log');
    });

    it('marks the root with the component contract attribute', () => {
      const w = mountLog({ log: 'a' });
      expect(w.find('.sn-log').attributes('data-snui-component')).toBe('log');
    });
  });

  describe('trim', () => {
    it('keeps raw line whitespace by default', () => {
      const w = mountLog({ log: ' a  ' });
      // VTU .text() trims; read the DOM directly to assert raw whitespace.
      expect(w.find('.sn-log__line').element.textContent).toBe(' a  ');
    });

    it('trims each line when trim is set', () => {
      const w = mountLog({ log: ' a  \n\tb\t', trim: true });
      const lines = w.findAll('.sn-log__line');
      expect(lines[0].text()).toBe('a');
      expect(lines[1].text()).toBe('b');
    });
  });

  describe('geometry', () => {
    it('applies font-size to the content block', () => {
      const w = mountLog({ log: 'a', fontSize: 20 });
      expect(w.find('.sn-log__content').attributes('style')).toContain('font-size: 20px');
    });

    it('applies unitless line-height to the root', () => {
      const w = mountLog({ log: 'a', lineHeight: 1.4 });
      expect(w.find('.sn-log').attributes('style')).toContain('line-height: 1.4');
    });

    it('sizes the root to rows × line-height × font-size', () => {
      const w = mountLog({ log: 'a', rows: 5, lineHeight: 1.25, fontSize: 14 });
      expect(w.find('.sn-log').attributes('style')).toContain('height: 88px');
    });
  });

  describe('loading', () => {
    it('renders no loader by default', () => {
      const w = mountLog({ log: 'a' });
      expect(w.find('.sn-log__loader').exists()).toBe(false);
    });

    it('renders the loader pill with spinner and label while loading', () => {
      const w = mountLog({ log: 'a', loading: true });
      const loader = w.find('.sn-log__loader');
      expect(loader.exists()).toBe(true);
      expect(loader.attributes('role')).toBe('status');
      expect(loader.find('svg').exists()).toBe(true);
      expect(loader.text()).toContain('加载中');
    });
  });

  describe('scroll events', () => {
    it('emits reach-top / reach-bottom / require-more on scroll with default offsets', async () => {
      const w = mountLog({ log: 'a\nb\nc' });
      await w.find('.sn-log__scroll').trigger('scroll');

      const vm = w.findComponent(SnLog);
      expect(vm.emitted('reach-top')).toHaveLength(1);
      expect(vm.emitted('reach-bottom')).toHaveLength(1);
      expect(vm.emitted('require-more')?.[0]?.[0]).toBe('top');
      expect(vm.emitted('require-more')?.[1]?.[0]).toBe('bottom');
    });

    it('emits nothing when the offsets exclude the current position', async () => {
      const w = mountLog({ log: 'a\nb\nc', offsetTop: -1, offsetBottom: -1 });
      await w.find('.sn-log__scroll').trigger('scroll');

      const vm = w.findComponent(SnLog);
      expect(vm.emitted('reach-top')).toBeUndefined();
      expect(vm.emitted('reach-bottom')).toBeUndefined();
      expect(vm.emitted('require-more')).toBeUndefined();
    });
  });

  describe('wheel events', () => {
    it('emits require-more top when wheeling up at the top edge', async () => {
      const w = mountLog({ log: 'a\nb\nc' });
      await w.find('.sn-log').trigger('wheel', { deltaY: -100 });
      expect(w.findComponent(SnLog).emitted('require-more')?.[0]?.[0]).toBe('top');
    });

    it('emits require-more bottom when wheeling down at the bottom edge', async () => {
      const w = mountLog({ log: 'a\nb\nc' });
      await w.find('.sn-log').trigger('wheel', { deltaY: 100 });
      expect(w.findComponent(SnLog).emitted('require-more')?.[0]?.[0]).toBe('bottom');
    });
  });

  describe('scrollTo method', () => {
    it('sets the absolute scroll offset via top', () => {
      const w = mountLog({ log: 'a\nb\nc' });
      getScrollTo(w)({ top: 7 });
      const el = w.find('.sn-log__scroll').element as HTMLElement;
      expect(el.scrollTop).toBe(7);
    });

    it('scrolls to the named top position', () => {
      const w = mountLog({ log: 'a\nb\nc' });
      getScrollTo(w)({ position: 'top' });
      const el = w.find('.sn-log__scroll').element as HTMLElement;
      expect(el.scrollTop).toBe(0);
    });

    it('suppresses reach / require-more events for a silent scroll', async () => {
      const w = mountLog({ log: 'a\nb\nc' });
      getScrollTo(w)({ position: 'bottom', silent: true });

      await w.find('.sn-log__scroll').trigger('scroll');
      expect(w.findComponent(SnLog).emitted('reach-bottom')).toBeUndefined();

      // The silent flag is consumed by the first scroll event (reference semantics).
      await nextTick();
      await w.find('.sn-log__scroll').trigger('scroll');
      expect(w.findComponent(SnLog).emitted('reach-bottom')).toHaveLength(1);
    });
  });
});
