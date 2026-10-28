/**
 * SnSplit unit tests — web-end split (naive-ui n-splitter parity).
 *
 * Behavior coverage (AGENTS.md §46), not implementation detail:
 *   - initial percent distribution (defaultSize / unsized equal halves)
 *   - drag resize via document-level pointer listeners
 *   - min / max clamping of both adjacent panels
 *   - collapsible snap-to-collapse + dblclick restore + v-model round trip
 *   - keyboard: arrows (±2%), Home / End bounds
 *   - disabled suppresses drag, keyboard and marks aria-disabled
 *   - separator a11y semantics (role / orientation / value*)
 *   - vertical direction (heights, horizontal divider, ArrowDown)
 *   - resize emit payload on drag end
 *   - unmount detaches the document listeners (AGENTS.md §41/42)
 *
 * happy-dom has no layout: getBoundingClientRect is mocked to a fixed
 * 200×100 container rect, so 1px = 0.5% on the horizontal axis.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import SnSplit from './SnSplit.vue';
import SnSplitPanel from './SnSplitPanel.vue';

const RECT = {
  left: 0,
  top: 0,
  right: 200,
  bottom: 100,
  width: 200,
  height: 100,
  x: 0,
  y: 0,
  toJSON: () => ({}),
};

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(RECT as DOMRect);
});

afterEach(() => {
  vi.restoreAllMocks();
});

interface HostOptions {
  split?: Record<string, unknown>;
  panelA?: Record<string, unknown>;
  panelB?: Record<string, unknown>;
}

/** Host with a live v-model:collapsed on panel A so updates flow both ways. */
function mountSplit({ split = {}, panelA = {}, panelB = {} }: HostOptions = {}) {
  const collapsedA = ref(panelA.collapsed === true);
  const host = defineComponent({
    setup() {
      return () =>
        h(SnSplit, split, {
          default: () => [
            h(
              SnSplitPanel,
              {
                ...panelA,
                collapsed: collapsedA.value,
                'onUpdate:collapsed': (next: boolean) => {
                  collapsedA.value = next;
                },
              },
              { default: () => h('div', { class: 'pane-a' }, 'A') },
            ),
            h(
              SnSplitPanel,
              { ...panelB },
              { default: () => h('div', { class: 'pane-b' }, 'B') },
            ),
          ],
        });
    },
  });
  const wrapper = mount(host);
  return {
    wrapper,
    collapsedA,
    splitComponent: () => wrapper.findComponent(SnSplit),
    panels: () => wrapper.findAll('.sn-split__panel'),
    divider: () => wrapper.find('.sn-split__divider'),
  };
}

function pointerEvent(type: string, x: number): PointerEvent {
  return new PointerEvent(type, { clientX: x, clientY: 0, bubbles: true, cancelable: true });
}

describe('SnSplit', () => {
  describe('initial sizes', () => {
    it('should distribute panels from defaultSize on mount', async () => {
      const { wrapper, panels } = mountSplit({ panelA: { defaultSize: 30 } });
      await nextTick();
      expect(panels().length).toBe(2);
      expect(panels()[0].element.style.width).toBe('30%');
      expect(panels()[1].element.style.width).toBe('70%');
      expect(wrapper.find('.pane-a').exists()).toBe(true);
      wrapper.unmount();
    });

    it('should default two unsized panels to equal halves', async () => {
      const { panels } = mountSplit();
      await nextTick();
      expect(panels()[0].element.style.width).toBe('50%');
      expect(panels()[1].element.style.width).toBe('50%');
    });

    it('should honor a panel collapsed at mount', async () => {
      const { collapsedA, panels } = mountSplit({
        panelA: { defaultSize: 30, collapsed: true },
      });
      await nextTick();
      expect(collapsedA.value).toBe(true);
      expect(panels()[0].element.style.width).toBe('0%');
      expect(panels()[1].element.style.width).toBe('100%');
    });
  });

  describe('drag resize', () => {
    it('should update both panels while dragging the divider', async () => {
      const { panels, divider } = mountSplit({ panelA: { defaultSize: 30 } });
      await nextTick();
      await divider().trigger('pointerdown', { clientX: 100, clientY: 0 });
      document.dispatchEvent(pointerEvent('pointermove', 120));
      await nextTick();
      expect(panels()[0].element.style.width).toBe('40%');
      expect(panels()[1].element.style.width).toBe('60%');
      document.dispatchEvent(pointerEvent('pointerup', 120));
    });

    it('should emit resize with the adjacent panel sizes when the drag ends', async () => {
      const { splitComponent, divider } = mountSplit({ panelA: { defaultSize: 30 } });
      await nextTick();
      await divider().trigger('pointerdown', { clientX: 100, clientY: 0 });
      document.dispatchEvent(pointerEvent('pointermove', 120));
      document.dispatchEvent(pointerEvent('pointerup', 120));
      const emitted = splitComponent().emitted('resize');
      expect(emitted).toHaveLength(1);
      expect(emitted?.[0]).toEqual([
        { before: 40, after: 60, beforeSize: '40%', afterSize: '60%' },
      ]);
    });

    it('should clamp the drag against minSize of the leading panel', async () => {
      const { panels, divider } = mountSplit({
        panelA: { defaultSize: 30, minSize: 20 },
      });
      await nextTick();
      await divider().trigger('pointerdown', { clientX: 100, clientY: 0 });
      // -40px on a 200px container = -20% → below the 20% min.
      document.dispatchEvent(pointerEvent('pointermove', 60));
      document.dispatchEvent(pointerEvent('pointerup', 60));
      await nextTick();
      expect(panels()[0].element.style.width).toBe('20%');
      expect(panels()[1].element.style.width).toBe('80%');
    });

    it('should clamp the drag against maxSize of the leading panel', async () => {
      const { panels, divider } = mountSplit({
        panelA: { defaultSize: 30, maxSize: 60 },
      });
      await nextTick();
      await divider().trigger('pointerdown', { clientX: 100, clientY: 0 });
      // +100px = +50% → above the 60% max.
      document.dispatchEvent(pointerEvent('pointermove', 200));
      document.dispatchEvent(pointerEvent('pointerup', 200));
      await nextTick();
      expect(panels()[0].element.style.width).toBe('60%');
      expect(panels()[1].element.style.width).toBe('40%');
    });
  });

  describe('collapsible', () => {
    it('should snap a collapsible panel to collapsed when dragged below its min', async () => {
      const { collapsedA, panels, divider } = mountSplit({
        panelA: { defaultSize: 30, minSize: 20, collapsible: true },
      });
      await nextTick();
      await divider().trigger('pointerdown', { clientX: 100, clientY: 0 });
      // -70px = -35% → below the 20% min of a collapsible panel.
      document.dispatchEvent(pointerEvent('pointermove', 30));
      document.dispatchEvent(pointerEvent('pointerup', 30));
      await nextTick();
      expect(collapsedA.value).toBe(true);
      expect(panels()[0].element.style.width).toBe('0%');
      expect(panels()[1].element.style.width).toBe('100%');
    });

    it('should not snap a non-collapsible panel below its min', async () => {
      const { panels, divider } = mountSplit({
        panelA: { defaultSize: 30, minSize: 20 },
      });
      await nextTick();
      await divider().trigger('pointerdown', { clientX: 100, clientY: 0 });
      document.dispatchEvent(pointerEvent('pointermove', 30));
      document.dispatchEvent(pointerEvent('pointerup', 30));
      await nextTick();
      expect(panels()[0].element.style.width).toBe('20%');
    });

    it('should expand a collapsed panel on divider dblclick', async () => {
      const { collapsedA, panels, divider } = mountSplit({
        panelA: { defaultSize: 30, minSize: 20, collapsible: true, collapsed: true },
      });
      await nextTick();
      expect(panels()[0].element.style.width).toBe('0%');
      await divider().trigger('dblclick');
      await nextTick();
      expect(collapsedA.value).toBe(false);
      expect(panels()[0].element.style.width).toBe('30%');
      expect(panels()[1].element.style.width).toBe('70%');
    });

    it('should expand when the host clears v-model:collapsed', async () => {
      const { collapsedA, panels } = mountSplit({
        panelA: { defaultSize: 30, collapsed: true },
      });
      await nextTick();
      collapsedA.value = false;
      await nextTick();
      expect(panels()[0].element.style.width).toBe('30%');
      expect(panels()[1].element.style.width).toBe('70%');
    });
  });

  describe('keyboard', () => {
    it('should nudge sizes by 2% with arrow keys on a focused divider', async () => {
      const { splitComponent, panels, divider } = mountSplit({
        panelA: { defaultSize: 30 },
      });
      await nextTick();
      await divider().trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      expect(panels()[0].element.style.width).toBe('32%');
      await divider().trigger('keydown', { key: 'ArrowLeft' });
      await nextTick();
      expect(panels()[0].element.style.width).toBe('30%');
      expect(splitComponent().emitted('resize')?.length).toBe(2);
    });

    it('should move the divider to the bounds with Home and End', async () => {
      const { panels, divider } = mountSplit({
        panelA: { defaultSize: 30, minSize: 20, maxSize: 60 },
        panelB: { minSize: 10 },
      });
      await nextTick();
      await divider().trigger('keydown', { key: 'Home' });
      await nextTick();
      expect(panels()[0].element.style.width).toBe('20%');
      await divider().trigger('keydown', { key: 'End' });
      await nextTick();
      // Trailing panel pushed to its 10% min, clamped by the 60% max.
      expect(panels()[0].element.style.width).toBe('60%');
      expect(panels()[1].element.style.width).toBe('40%');
    });
  });

  describe('disabled', () => {
    it('should ignore drag and keyboard when disabled', async () => {
      const { splitComponent, panels, divider } = mountSplit({
        split: { disabled: true },
        panelA: { defaultSize: 30 },
      });
      await nextTick();
      await divider().trigger('pointerdown', { clientX: 100, clientY: 0 });
      document.dispatchEvent(pointerEvent('pointermove', 150));
      document.dispatchEvent(pointerEvent('pointerup', 150));
      await divider().trigger('keydown', { key: 'ArrowRight' });
      await nextTick();
      expect(panels()[0].element.style.width).toBe('30%');
      expect(divider().attributes('tabindex')).toBe('-1');
      expect(divider().attributes('aria-disabled')).toBe('true');
      expect(splitComponent().emitted('resize')).toBeUndefined();
    });
  });

  describe('a11y', () => {
    it('should expose separator semantics on the divider', async () => {
      const { divider } = mountSplit({ panelA: { defaultSize: 30, minSize: 10 } });
      await nextTick();
      const handle = divider();
      expect(handle.attributes('role')).toBe('separator');
      expect(handle.attributes('aria-orientation')).toBe('vertical');
      expect(handle.attributes('aria-valuenow')).toBe('30');
      expect(handle.attributes('aria-valuemin')).toBe('10');
      expect(handle.attributes('aria-valuemax')).toBe('100');
      expect(handle.attributes('tabindex')).toBe('0');
    });
  });

  describe('vertical direction', () => {
    it('should lay out vertically and respond to vertical arrow keys', async () => {
      const { wrapper, panels, divider } = mountSplit({
        split: { direction: 'vertical' },
        panelA: { defaultSize: 30 },
      });
      await nextTick();
      expect(wrapper.find('.sn-split--vertical').exists()).toBe(true);
      expect(panels()[0].element.style.height).toBe('30%');
      expect(divider().attributes('aria-orientation')).toBe('horizontal');
      await divider().trigger('keydown', { key: 'ArrowDown' });
      await nextTick();
      expect(panels()[0].element.style.height).toBe('32%');
    });
  });

  describe('lifecycle', () => {
    it('should render no divider for a single panel', () => {
      const wrapper = mount(
        defineComponent({
          setup: () => () =>
            h(
              SnSplit,
              {},
              {
                default: () => [h(SnSplitPanel, {}, { default: () => 'only' })],
              },
            ),
        }),
      );
      expect(wrapper.find('.sn-split__divider').exists()).toBe(false);
      wrapper.unmount();
    });

    it('should detach the document pointer listeners on unmount', async () => {
      const { wrapper, panels, divider } = mountSplit({ panelA: { defaultSize: 30 } });
      await nextTick();
      await divider().trigger('pointerdown', { clientX: 100, clientY: 0 });
      const panelA = panels()[0].element;
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      wrapper.unmount();
      expect(removeSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
      expect(removeSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function));
      // Listeners are gone: a late move must not throw or change anything.
      expect(() => document.dispatchEvent(pointerEvent('pointermove', 180))).not.toThrow();
      expect(panelA.style.width).toBe('30%');
    });
  });
});
