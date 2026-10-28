import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import SnTooltip from './SnTooltip.vue';

const Trigger = defineComponent({
  name: 'Trigger',
  setup() {
    return () => h('button', { class: 'trigger-btn' }, 'trigger');
  },
});

/**
 * happy-dom doesn't implement getBoundingClientRect predictably;
 * stub it on every HTMLElement so position math has stable input.
 *
 * The popover is the only element that reports a *different* rect from the
 * trigger (200×40 vs 100×32) — otherwise `recompute()` cannot tell the two
 * apart, and assertions on the computed `top` / `left` would be vacuous.
 *
 * The trigger sits at the centre of the 1280×800 viewport on purpose: every
 * placement then has room on all four sides, so `flip` never fires and each
 * assertion measures the requested side rather than the flipped one.
 */
const TRIGGER_RECT = { top: 384, left: 500, width: 100, height: 32 };
const POPOVER_RECT = { top: 0, left: 0, width: 200, height: 40 };
const ARROW_SIZE = 8; // must track SnTooltip's own arrow reserve

function stubRect() {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: HTMLElement) {
      const isPopover = this.classList?.contains('sn-tooltip');
      const r = isPopover ? POPOVER_RECT : TRIGGER_RECT;
      return {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        right: r.left + r.width,
        bottom: r.top + r.height,
        x: r.left,
        y: r.top,
        toJSON() {
          return {};
        },
      };
    },
  });
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
  // The positioning engine reads the bubble's size from the LAYOUT box
  // (offsetWidth / offsetHeight — immune to the enter animation's
  // transform), so the stub provides them independently of the rect.
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList?.contains('sn-tooltip') ? POPOVER_RECT.width : TRIGGER_RECT.width;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList?.contains('sn-tooltip') ? POPOVER_RECT.height : TRIGGER_RECT.height;
    },
  });
}

/** Read the teleported popover's computed inline position. */
function popoverStyle(): CSSStyleDeclaration {
  const pop = document.body.querySelector('.sn-tooltip') as HTMLElement | null;
  expect(pop).not.toBeNull();
  return pop!.style;
}

/** Read the teleported arrow's computed inline position. */
function arrowEl(): HTMLElement {
  const arrow = document.body.querySelector('.sn-tooltip__arrow') as HTMLElement | null;
  expect(arrow).not.toBeNull();
  return arrow!;
}

describe('SnTooltip (AUI-WEB-FEED-006)', () => {
  // Wrappers left mounted keep their window-level scroll listeners alive and
  // pollute later tests that count events — always tear them down.
  const liveWrappers: ReturnType<typeof mountTooltip>[] = [];
  beforeEach(() => stubRect());
  afterEach(() => {
    while (liveWrappers.length) {
      const w = liveWrappers.pop();
      try {
        if (w.exists()) w.unmount();
      } catch {
        // already unmounted by the test itself
      }
    }
    vi.restoreAllMocks();
    // Tear down any Teleport nodes that survived the prior component.
    document.body.querySelectorAll('.sn-tooltip').forEach((el) => el.remove());
  });

  function mountTooltip(props: Record<string, unknown> = {}, slot?: () => unknown) {
    const w = mount(SnTooltip, {
      props,
      slots: { default: slot ?? (() => h(Trigger)) },
      attachTo: document.body,
    });
    liveWrappers.push(w);
    return w;
  }

  it('renders the default slot wrapped in a <span class="sn-tooltip-trigger">', () => {
    const w = mountTooltip({ content: 'hello' });
    expect(w.find('.sn-tooltip-trigger').exists()).toBe(true);
    expect(w.find('button.trigger-btn').exists()).toBe(true);
  });

  it('does not render the popover until hovered (uncontrolled default)', async () => {
    const w = mountTooltip({ content: 'hello', delay: 0 });
    expect(document.body.querySelector('.sn-tooltip')).toBeNull();
    await w.find('.sn-tooltip-trigger').trigger('mouseenter');
    await nextTick();
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.querySelector('.sn-tooltip')).not.toBeNull();
  });

  it('hides after mouseleave', async () => {
    // `delay` gates opening and `duration` gates closing — both must be 0
    // for the hide to be observable within the test's wait window.
    const w = mountTooltip({ content: 'hello', delay: 0, duration: 0 });
    await w.find('.sn-tooltip-trigger').trigger('mouseenter');
    await nextTick();
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.querySelector('.sn-tooltip')).not.toBeNull();
    await w.find('.sn-tooltip-trigger').trigger('mouseleave');
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.querySelector('.sn-tooltip')).toBeNull();
  });

  it('should keep the popover open until duration elapses', async () => {
    const w = mountTooltip({ content: 'hello', delay: 0, duration: 120 });
    await w.find('.sn-tooltip-trigger').trigger('mouseenter');
    await nextTick();
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.querySelector('.sn-tooltip')).not.toBeNull();

    await w.find('.sn-tooltip-trigger').trigger('mouseleave');
    await new Promise((r) => setTimeout(r, 20));
    // Still inside the close window.
    expect(document.body.querySelector('.sn-tooltip')).not.toBeNull();

    await new Promise((r) => setTimeout(r, 140));
    expect(document.body.querySelector('.sn-tooltip')).toBeNull();
  });

  it('controlled show=true renders the popover on first render', async () => {
    mountTooltip({ show: true });
    await nextTick();
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.querySelector('.sn-tooltip')).not.toBeNull();
  });

  it('controlled show=false leaves the popover closed', async () => {
    mountTooltip({ show: false });
    await nextTick();
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.querySelector('.sn-tooltip')).toBeNull();
  });

  it('trigger=click emits update:show (parent can opt in to toggle)', async () => {
    const seen: boolean[] = [];
    const w = mount(SnTooltip, {
      props: {
        trigger: 'click',
        show: false,
        'onUpdate:show': (v: boolean) => seen.push(v),
      },
      slots: { default: () => h(Trigger) },
      attachTo: document.body,
    });
    await nextTick();
    await w.find('.sn-tooltip-trigger').trigger('click');
    expect(seen).toEqual([true]);
    // Second click while still false → another true (parent has to mirror
    // the prop; we don't simulate that here, just verify the event payload).
    await w.find('.sn-tooltip-trigger').trigger('click');
    expect(seen).toEqual([true, true]);
    w.unmount();
  });

  it('disabled suppresses any show', async () => {
    const w = mountTooltip({ content: 'x', disabled: true, delay: 0 });
    await w.find('.sn-tooltip-trigger').trigger('mouseenter');
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.querySelector('.sn-tooltip')).toBeNull();
  });

  it('content prop renders inside the popover body', async () => {
    mountTooltip({ content: 'Ideas', show: true });
    await nextTick();
    await new Promise((r) => setTimeout(r, 10));
    const pop = document.body.querySelector('.sn-tooltip');
    expect(pop?.textContent).toContain('Ideas');
  });

  it('exposes imperative show / hide via the component instance', async () => {
    const w = mountTooltip({ content: 'x' });
    // defineExpose in <script setup> surfaces on vm directly (vue-test-utils
    // unwraps the proxy).
    const exposed = w.vm as unknown as {
      show: () => void;
      hide: () => void;
      isShown: () => boolean;
    };
    expect(typeof exposed.show).toBe('function');
    expect(typeof exposed.hide).toBe('function');
    expect(typeof exposed.isShown).toBe('function');
    expect(exposed.isShown()).toBe(false);
    exposed.show();
    await new Promise((r) => setTimeout(r, 10));
    expect(exposed.isShown()).toBe(true);
    exposed.hide();
    await nextTick();
    expect(exposed.isShown()).toBe(false);
  });

  it('arrow prop=false omits the arrow element', async () => {
    mountTooltip({ content: 'x', show: true, arrow: false });
    await nextTick();
    await new Promise((r) => setTimeout(r, 10));
    const pop = document.body.querySelector('.sn-tooltip');
    expect(pop?.querySelector('.sn-tooltip__arrow')).toBeNull();
  });

  describe('displayDirective', () => {
    it('should unmount the popover after hiding by default', async () => {
      const w = mountTooltip({ content: 'x', delay: 0, duration: 0 });
      await w.find('.sn-tooltip-trigger').trigger('mouseenter');
      await new Promise((r) => setTimeout(r, 10));
      await w.find('.sn-tooltip-trigger').trigger('mouseleave');
      await new Promise((r) => setTimeout(r, 10));

      expect(document.body.querySelector('.sn-tooltip')).toBeNull();
    });

    it('should keep the node mounted with displayDirective=show', async () => {
      const w = mountTooltip({ content: 'x', delay: 0, duration: 0, displayDirective: 'show' });
      await w.find('.sn-tooltip-trigger').trigger('mouseenter');
      await new Promise((r) => setTimeout(r, 10));
      await w.find('.sn-tooltip-trigger').trigger('mouseleave');
      await new Promise((r) => setTimeout(r, 10));

      const pop = document.body.querySelector('.sn-tooltip') as HTMLElement | null;
      expect(pop).not.toBeNull();
      // Retained but hidden.
      expect(pop?.style.display).toBe('none');
    });
  });

  describe('appearance props', () => {
    it('should drop the built-in bubble styling when raw', async () => {
      mountTooltip({ content: 'x', show: true, raw: true });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.body.querySelector('.sn-tooltip')?.classList).toContain('sn-tooltip--raw');
    });

    it('should mark the popover non-animated when animated is false', async () => {
      mountTooltip({ content: 'x', show: true, animated: false });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.body.querySelector('.sn-tooltip')?.classList).toContain(
        'sn-tooltip--no-animation',
      );
    });

    it('should mark the body scrollable when scrollable', async () => {
      mountTooltip({ content: 'x', show: true, scrollable: true });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.body.querySelector('.sn-tooltip')?.classList).toContain(
        'sn-tooltip--scrollable',
      );
    });

    it('should forward contentClass and contentStyle to the body', async () => {
      mountTooltip({
        content: 'x',
        show: true,
        contentClass: 'my-body',
        contentStyle: { color: 'red' },
      });
      await new Promise((r) => setTimeout(r, 10));

      const body = document.body.querySelector('.sn-tooltip__body');
      expect(body?.classList).toContain('my-body');
      expect((body as HTMLElement | null)?.style.color).toBe('red');
    });

    it('should apply arrowClass to the arrow element', async () => {
      mountTooltip({ content: 'x', show: true, arrowClass: 'my-arrow' });
      await new Promise((r) => setTimeout(r, 10));

      expect(document.body.querySelector('.sn-tooltip__arrow')?.classList).toContain('my-arrow');
    });

    it('should apply zIndex to the popover style', async () => {
      mountTooltip({ content: 'x', show: true, zIndex: 4242 });
      await new Promise((r) => setTimeout(r, 10));

      const pop = document.body.querySelector('.sn-tooltip') as HTMLElement | null;
      expect(pop?.style.zIndex).toBe('4242');
    });

    it('should pin the popover width to the trigger when width="trigger"', async () => {
      mountTooltip({ content: 'x', show: true, width: 'trigger' });
      await new Promise((r) => setTimeout(r, 10));

      const pop = document.body.querySelector('.sn-tooltip') as HTMLElement | null;
      // stubRect reports a 100px-wide trigger.
      expect(pop?.style.width).toBe('100px');
    });

    it('should apply a numeric width directly', async () => {
      mountTooltip({ content: 'x', show: true, width: 240 });
      await new Promise((r) => setTimeout(r, 10));

      const pop = document.body.querySelector('.sn-tooltip') as HTMLElement | null;
      expect(pop?.style.width).toBe('240px');
    });
  });

  /**
   * Positioning + arrow geometry.
   *
   * These assertions cover a bug class that renders perfectly well in unit
   * tests but is obviously wrong on screen: the bubble lands on top of the
   * trigger (or clips against the viewport) and the arrow detaches from the
   * bubble. All expectations here are derived from the stubbed rects:
   *   trigger  → top 384, left 500, 100×32   (right 600, bottom 416)
   *   popover  → 200×40
   *   viewport → 1280×800
   * The trigger centre is therefore (550, 400) and the trigger's top edge is
   * exactly `bottom - ARROW_SIZE` whenever the arrow reserve works.
   */
  describe('positioning and arrow geometry', () => {
    it('should place a top tooltip entirely above the trigger, with no gap', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      const top = Number.parseFloat(s.top);
      expect(top).toBe(TRIGGER_RECT.top - POPOVER_RECT.height - ARROW_SIZE);
      // The bubble stops one arrow-band short of the trigger; the arrow fills
      // that band, so the rendered result reads as "no gap".
      expect(top + POPOVER_RECT.height).toBe(TRIGGER_RECT.top - ARROW_SIZE);
      expect(top + POPOVER_RECT.height + ARROW_SIZE).toBe(TRIGGER_RECT.top);
    });

    /**
     * Root-cause regression for the DEGENERATE-VIEWPORT detachment family
     * (embedded webviews / iframes / capture panels report
     * `window.innerWidth / innerHeight` as 0): clamping against a zero
     * viewport pinned the bubble onto the window edge — detached from its
     * trigger — on every placement. The engine must trust the raw
     * beside-the-trigger anchor when the viewport metrics cannot hold the
     * bubble.
     */
    it('positions beside the trigger when the viewport metrics are degenerate (0×0)', async () => {
      Object.defineProperty(window, 'innerWidth', { configurable: true, value: 0 });
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: 0 });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        configurable: true,
        value: 0,
      });
      Object.defineProperty(document.documentElement, 'clientHeight', {
        configurable: true,
        value: 0,
      });

      mountTooltip({ content: 'x', show: true, placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      // Raw beside-the-trigger anchor: trigger.top - pop.height - arrow band.
      expect(Number.parseFloat(s.top)).toBe(TRIGGER_RECT.top - POPOVER_RECT.height - ARROW_SIZE);
      // Cross axis (center) also passes through unclamped.
      expect(Number.parseFloat(s.left)).toBe(
        TRIGGER_RECT.left + TRIGGER_RECT.width / 2 - POPOVER_RECT.width / 2,
      );
    });

    /**
     * Root-cause regression for the recurring "top 方向分离" detachment:
     * the bubble always mounts mid-enter-animation (`scale(0.96)` for
     * 180ms), and getBoundingClientRect() reflects that transform — the old
     * engine measured a 4%-shrunken bubble and wrote top/left from it, so
     * every placement drifted away from its trigger while the animation
     * played. The engine must read the bubble's size from the LAYOUT box
     * (offsetWidth / offsetHeight) and ignore the transformed client rect.
     */
    it('should measure the bubble from its layout box, not the animated client rect', async () => {
      // Simulate the mid-animation measurement: the client rect reports a
      // 4%-shrunken bubble while the layout box stays 200×40.
      const previous = HTMLElement.prototype.getBoundingClientRect;
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value(this: HTMLElement) {
          const isPopover = this.classList?.contains('sn-tooltip');
          if (!isPopover) return previous.call(this);
          const r = POPOVER_RECT;
          const w = r.width * 0.96;
          const h = r.height * 0.96;
          return {
            top: 0,
            left: 0,
            width: w,
            height: h,
            right: w,
            bottom: h,
            x: 0,
            y: 0,
            toJSON() {
              return {};
            },
          };
        },
      });

      mountTooltip({ content: 'x', show: true, placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      // With the shrunken rect the old engine computed
      // top = 384 - 38.4 - 8 = 337.6 — a visible gap. The layout box keeps
      // the bubble exactly one arrow-band below the trigger's top edge.
      expect(Number.parseFloat(s.top)).toBe(TRIGGER_RECT.top - POPOVER_RECT.height - ARROW_SIZE);
      expect(Number.parseFloat(s.left)).toBe(
        TRIGGER_RECT.left + TRIGGER_RECT.width / 2 - POPOVER_RECT.width / 2,
      );
    });

    /**
     * Root-cause regression #2 for the detachment reports: when the trigger
     * sits outside the viewport along the main axis (scrolled away, short
     * panel), NEITHER side fits and the last-resort `rectFor(..., false)`
     * used to return null anyway — crashing `recompute()` on `r.top`. The
     * watcher rejected, popoverStyle was never written, and the bubble
     * rendered in normal flow at the end of <body>, visually detached from
     * everything. The committed side must clamp and always return a rect.
     */
    it('should still position (not crash) when the trigger is outside the viewport', async () => {
      const previous = HTMLElement.prototype.getBoundingClientRect;
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value(this: HTMLElement) {
          const isPopover = this.classList?.contains('sn-tooltip');
          const r = isPopover ? POPOVER_RECT : { top: 1200, left: 500, width: 100, height: 32 };
          return {
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
            right: r.left + r.width,
            bottom: r.top + r.height,
            x: r.left,
            y: r.top,
            toJSON() {
              return {};
            },
          };
        },
      });

      // 1200 is far below the 800px viewport: neither `top` nor `bottom`
      // fits the strict probe. The old engine crashed here; the new one
      // clamps the bubble into the viewport and still writes the style.
      mountTooltip({ content: 'x', show: true, placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      expect(s.position).toBe('fixed');
      const top = Number.parseFloat(s.top);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top + POPOVER_RECT.height).toBeLessThanOrEqual(800);
      void previous;
    });

    it('should place a bottom tooltip entirely below the trigger, with no gap', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'bottom' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      const triggerBottom = TRIGGER_RECT.top + TRIGGER_RECT.height;
      expect(Number.parseFloat(s.top)).toBe(triggerBottom + ARROW_SIZE);
    });

    it('should place a left tooltip entirely left of the trigger, with no gap', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'left' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      expect(Number.parseFloat(s.left)).toBe(TRIGGER_RECT.left - POPOVER_RECT.width - ARROW_SIZE);
    });

    it('should place a right tooltip entirely right of the trigger, with no gap', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'right' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      const triggerRight = TRIGGER_RECT.left + TRIGGER_RECT.width;
      expect(Number.parseFloat(s.left)).toBe(triggerRight + ARROW_SIZE);
    });

    it('should centre a `top` tooltip on the trigger, keeping the bubble on screen', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      const popCenter = Number.parseFloat(s.left) + POPOVER_RECT.width / 2;
      const triggerCenter = TRIGGER_RECT.left + TRIGGER_RECT.width / 2;
      expect(popCenter).toBe(triggerCenter);
    });

    /**
     * Regression: an edge-aligned (`-start` / `-end`) bubble that cannot fit
     * inside the viewport must be nudged back in, not clipped. The bug this
     * guards against returned the raw, unclamped rect from the final "last
     * resort" branch — and, when *both* axes failed the probe, returned
     * `null` and crashed `recompute()` on `r.top`.
     */
    it('should clamp an edge-aligned bubble back inside the viewport', async () => {
      // Trigger inside the viewport but close to the right edge: a
      // `top-start` bubble would run 200px from 1150 → past 1280.
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value(this: HTMLElement) {
          const isPopover = this.classList?.contains('sn-tooltip');
          const r = isPopover ? POPOVER_RECT : { top: 384, left: 1150, width: 100, height: 32 };
          return {
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
            right: r.left + r.width,
            bottom: r.top + r.height,
            x: r.left,
            y: r.top,
            toJSON() {
              return {};
            },
          };
        },
      });

      mountTooltip({ content: 'x', show: true, placement: 'top-start' });
      await new Promise((r) => setTimeout(r, 10));

      const s = popoverStyle();
      const left = Number.parseFloat(s.left);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left + POPOVER_RECT.width).toBeLessThanOrEqual(1280);
    });

    /**
     * Regression: the arrow must *track the trigger's centre* along the cross
     * axis. The bug this guards against clamped the aim with the bubble's own
     * mid-point as a ceiling, which parked the arrow at the bubble's middle
     * whenever the bubble was wider than the trigger — visually detached from
     * the element it is supposed to point at.
     *
     * A `top-start` bubble starts flush with the trigger, so its 200px width
     * extends 150px *past* the trigger's centre (which sits 50px in). The
     * arrow must therefore land at 50px, not at the 100px bubble midpoint.
     */
    it('should aim a top arrow at the trigger centre, not the bubble centre', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'tl' });
      await new Promise((r) => setTimeout(r, 10));

      const a = arrowEl().style;
      const popLeft = Number.parseFloat(popoverStyle().left);
      const triggerCenter = TRIGGER_RECT.left + TRIGGER_RECT.width / 2;
      const arrowLeft = Number.parseFloat(a.left);

      // `left` anchors the 16px-wide triangle box; its visual centre (the
      // apex) must land on the trigger centre → left = centre - half box.
      expect(arrowLeft + ARROW_SIZE).toBe(triggerCenter - popLeft);
      // Inside the bubble, and deliberately *not* on its centre (100px).
      expect(arrowLeft).toBeGreaterThan(0);
      expect(arrowLeft).toBeLessThan(POPOVER_RECT.width);
      expect(arrowLeft + ARROW_SIZE).not.toBe(POPOVER_RECT.width / 2);
      // Vertical anchor: the arrow hangs in the reserved band at the bottom.
      expect(Number.parseFloat(a.bottom)).toBe(-ARROW_SIZE);
      expect(a.top).toBe('');
    });

    it('should anchor a bottom arrow inside the bubble band', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'bottom' });
      await new Promise((r) => setTimeout(r, 10));

      const a = arrowEl().style;
      const popLeft = Number.parseFloat(popoverStyle().left);
      const triggerCenter = TRIGGER_RECT.left + TRIGGER_RECT.width / 2;
      expect(Number.parseFloat(a.top)).toBe(-ARROW_SIZE);
      expect(a.bottom).toBe('');
      expect(Number.parseFloat(a.left) + ARROW_SIZE).toBe(triggerCenter - popLeft);
      expect(Number.parseFloat(a.left)).toBeGreaterThan(0);
      expect(Number.parseFloat(a.left)).toBeLessThan(POPOVER_RECT.width);
    });

    it('should anchor a left arrow inside the bubble band', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'left' });
      await new Promise((r) => setTimeout(r, 10));

      const a = arrowEl().style;
      const popTop = Number.parseFloat(popoverStyle().top);
      const triggerCenterY = TRIGGER_RECT.top + TRIGGER_RECT.height / 2;
      expect(Number.parseFloat(a.right)).toBe(-ARROW_SIZE);
      expect(a.left).toBe('');
      // Vertical centring: apex centre on the trigger's Y centre.
      expect(Number.parseFloat(a.top) + ARROW_SIZE).toBe(triggerCenterY - popTop);
      expect(Number.parseFloat(a.top)).toBeGreaterThan(0);
      expect(Number.parseFloat(a.top)).toBeLessThan(POPOVER_RECT.height);
      // Regression note: the colored border side must carry the non-zero
      // width — the previous `8px 8px 8px 0` + left-color pairing rendered a
      // zero-area triangle (arrow vanished → detached-gap look). That
      // constant lives in the scoped stylesheet and cannot be resolved by
      // happy-dom here; the visible-arrow correctness is covered by the
      // placement demo review.
      const arrow = arrowEl();
      expect(arrow.classList.contains('sn-tooltip__arrow--left')).toBe(true);
      expect(Number.parseFloat(a.top) + ARROW_SIZE).toBe(triggerCenterY - popTop);
    });

    it('should anchor a right arrow inside the bubble band', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'right' });
      await new Promise((r) => setTimeout(r, 10));

      const a = arrowEl().style;
      const popTop = Number.parseFloat(popoverStyle().top);
      const triggerCenterY = TRIGGER_RECT.top + TRIGGER_RECT.height / 2;
      expect(Number.parseFloat(a.left)).toBe(-ARROW_SIZE);
      expect(a.right).toBe('');
      expect(Number.parseFloat(a.top) + ARROW_SIZE).toBe(triggerCenterY - popTop);
      expect(Number.parseFloat(a.top)).toBeGreaterThan(0);
      expect(Number.parseFloat(a.top)).toBeLessThan(POPOVER_RECT.height);
      // Same visibility caveat as the left arrow: the border-width pairing
      // lives in the scoped stylesheet (see the left-arrow test note).
      const arrow = arrowEl();
      expect(arrow.classList.contains('sn-tooltip__arrow--right')).toBe(true);
      expect(Number.parseFloat(a.top) + ARROW_SIZE).toBe(triggerCenterY - popTop);
    });

    /** `placement` still names the requested side, per the public contract. */
    it('should keep the requested placement class on the bubble', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'br' });
      await new Promise((r) => setTimeout(r, 10));

      const pop = document.body.querySelector('.sn-tooltip') as HTMLElement;
      expect(pop.classList.contains('sn-tooltip--br')).toBe(true);
      // Legacy `-end` suffix values keep working (deprecated aliases) and
      // carry their own class for consumer styling hooks.
      mountTooltip({ content: 'x', show: true, placement: 'bottom-end' });
      await new Promise((r) => setTimeout(r, 10));
      const legacyPop = [
        ...(document.body.querySelectorAll('.sn-tooltip') as NodeListOf<HTMLElement>),
      ].at(-1) as HTMLElement;
      expect(legacyPop.classList.contains('sn-tooltip--bottom-end')).toBe(true);
    });

    /**
     * The Arco codes and the legacy naive-ui values are two spellings of
     * the same layout: `tl` ≡ `top-start` (side top, left edges flush).
     * Both must normalize to the identical popover rect.
     */
    it('should normalize legacy alias values to the same position as their Arco counterpart', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'tl' });
      await new Promise((r) => setTimeout(r, 10));
      const arco = popoverStyle();
      const arcoTop = arco.top;
      const arcoLeft = arco.left;

      mountTooltip({ content: 'x', show: true, placement: 'top-start' });
      await new Promise((r) => setTimeout(r, 10));
      // Two popovers are live now — read the LAST one (the legacy mount).
      const pops = document.body.querySelectorAll('.sn-tooltip');
      const legacy = (pops[pops.length - 1] as HTMLElement).style;
      expect(legacy.top).toBe(arcoTop);
      expect(legacy.left).toBe(arcoLeft);
    });

    /**
     * `flip` re-resolves the side, so the arrow direction and the enter
     * animation must follow the side the bubble actually landed on rather
     * than the one that was requested. Mirroring `placement` left a flipped
     * bubble animating (and pointing) at the wrong edge.
     */
    it('should follow the flipped side when flip reassigns the placement', async () => {
      // Trigger pinned to the top edge: a `top` bubble has nowhere to go.
      Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
        configurable: true,
        value(this: HTMLElement) {
          const isPopover = this.classList?.contains('sn-tooltip');
          const r = isPopover ? POPOVER_RECT : { top: 4, left: 500, width: 100, height: 32 };
          return {
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
            right: r.left + r.width,
            bottom: r.top + r.height,
            x: r.left,
            y: r.top,
            toJSON() {
              return {};
            },
          };
        },
      });

      mountTooltip({ content: 'x', show: true, placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      // Flipped below the trigger: the resolved side is published as an
      // extra modifier, and the arrow now points up from the bubble's top.
      const pop = document.body.querySelector('.sn-tooltip') as HTMLElement;
      expect(pop.classList.contains('sn-tooltip--bottom')).toBe(true);
      expect(Number.parseFloat(popoverStyle().top)).toBe(4 + 32 + ARROW_SIZE);

      const arrow = arrowEl();
      expect(arrow.classList.contains('sn-tooltip__arrow--bottom')).toBe(true);
      expect(arrow.classList.contains('sn-tooltip__arrow--top')).toBe(false);
      expect(Number.parseFloat(arrow.style.top)).toBe(-ARROW_SIZE);
    });

    /**
     * The arrow parks in a band *outside* the bubble's padding box, so the
     * bubble must never clip its own overflow — `overflow: hidden` here
     * slices the triangle off and re-creates the detached-arrow symptom.
     */
    it('should not clip the arrow at the bubble boundary', async () => {
      mountTooltip({ content: 'x', show: true, placement: 'top' });
      await new Promise((r) => setTimeout(r, 10));

      const pop = document.body.querySelector('.sn-tooltip') as HTMLElement;
      // Multi-line content (the default) must not become scrollable either —
      // `scrollable` is opt-in and is what legitimately sets `overflow: auto`.
      expect(pop.classList.contains('sn-tooltip--scrollable')).toBe(false);
    });
  });

  describe('onClickoutside', () => {
    it('should invoke the callback on an outside click', async () => {
      const onClickoutside = vi.fn();
      mountTooltip({ content: 'x', show: true, trigger: 'click', onClickoutside });
      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(onClickoutside).toHaveBeenCalledTimes(1);
    });

    it('should not fire when the click lands inside the popover', async () => {
      const onClickoutside = vi.fn();
      mountTooltip({ content: 'x', show: true, trigger: 'click', onClickoutside });
      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      const pop = document.body.querySelector('.sn-tooltip') as HTMLElement;
      pop.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

      expect(onClickoutside).not.toHaveBeenCalled();
    });
  });

  describe('scroll recompute coalescing', () => {
    /**
     * A scroll burst (capture listener fires for every container) must
     * collapse into at most one positioning pass per animation frame —
     * otherwise each event runs a full measure-and-write cycle and the
     * scroll thread thrashes layout. Recompute is observable as exactly one
     * getBoundingClientRect call (the trigger box; the bubble's size is
     * read from the layout box instead).
     */
    it('coalesces a scroll burst into one recompute per frame', async () => {
      // Defer rAF so queued recomputes only run when the frame is flushed.
      const frames: Array<FrameRequestCallback | undefined> = [];
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        frames.push(cb);
        return frames.length;
      });
      vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
        delete frames[handle - 1];
      });

      const w = mountTooltip({ content: 'x', show: true, trigger: 'click' });
      await nextTick();
      await new Promise((r) => setTimeout(r, 10));

      const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
      rectSpy.mockClear();

      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      // Nothing synchronously — the burst is parked on a single frame.
      expect(rectSpy).not.toHaveBeenCalled();
      expect(frames.length).toBe(1);

      const frame = frames.shift();
      frame?.(0);
      await nextTick();
      await Promise.resolve();
      // One recompute pass = one trigger getBoundingClientRect read (the
      // bubble's size comes from offsetWidth / offsetHeight, which the spy
      // does not track).
      expect(rectSpy).toHaveBeenCalledTimes(1);

      // After close, scroll events schedule no frame and read no layout.
      // `show` is controlled here, so closing goes through the prop.
      void w.setProps({ show: false });
      await nextTick();
      await new Promise((r) => setTimeout(r, 10));
      rectSpy.mockClear();
      window.dispatchEvent(new Event('scroll'));
      expect(frames.length).toBe(0);
      expect(rectSpy).not.toHaveBeenCalled();

      w.unmount();
      vi.unstubAllGlobals();
    });
  });
});
