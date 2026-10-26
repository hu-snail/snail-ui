import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, markRaw, nextTick } from 'vue';
import SnPopconfirm from './SnPopconfirm.vue';

const Trigger = defineComponent({
  name: 'Trigger',
  setup() {
    return () => h('button', { class: 'trigger-btn' }, 'trigger');
  },
});

/** Stub rect so the fixed-position engine has stable input (happy-dom). */
function stubRect() {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value(this: HTMLElement) {
      const isPanel = this.classList?.contains('sn-popconfirm');
      const r = isPanel
        ? { top: 0, left: 0, width: 220, height: 88 }
        : { top: 384, left: 500, width: 100, height: 32 };
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
}

function panelEl(): HTMLElement {
  const pop = document.body.querySelector('.sn-popconfirm') as HTMLElement | null;
  expect(pop).not.toBeNull();
  return pop!;
}

/** The two action buttons, in DOM order: negative (left), positive (right). */
function actionButtons(): HTMLElement[] {
  return Array.from(panelEl().querySelectorAll('.sn-button')) as HTMLElement[];
}

async function flush(times = 4): Promise<void> {
  for (let i = 0; i < times; i++) {
    await Promise.resolve();
    await nextTick();
  }
}

describe('SnPopconfirm (AUI-WEB-FB-010)', () => {
  /** Every mounted wrapper — unmounted in afterEach so a live component
   * never loses its teleported DOM to the manual body cleanup. */
  const wrappers: ReturnType<typeof mountPopconfirm>[] = [];

  beforeEach(() => stubRect());
  afterEach(async () => {
    vi.restoreAllMocks();
    for (const w of wrappers) {
      w.unmount();
      await nextTick();
    }
    wrappers.length = 0;
    document.body.querySelectorAll('.sn-popconfirm').forEach((el) => el.remove());
  });

  function mountPopconfirm(
    props: Record<string, unknown> = {},
    slots: Record<string, unknown> = {},
  ) {
    const w = mount(SnPopconfirm, {
      props,
      slots: { default: slots.default ?? (() => h(Trigger)), ...slots },
      attachTo: document.body,
    });
    wrappers.push(w);
    return w;
  }

  describe('rendering', () => {
    it('renders the default slot wrapped in span.sn-popconfirm-trigger', () => {
      const w = mountPopconfirm({ content: '确定删除吗？' });
      expect(w.find('.sn-popconfirm-trigger').exists()).toBe(true);
      expect(w.find('button.trigger-btn').exists()).toBe(true);
    });

    it('opens on trigger click (click is the default trigger)', async () => {
      const w = mountPopconfirm({ content: '确定删除吗？' });
      expect(document.body.querySelector('.sn-popconfirm')).toBeNull();
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await nextTick();
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).not.toBeNull();
    });

    it('marks the panel with data-snui-component="popconfirm" and dialog semantics', async () => {
      mountPopconfirm({ content: 'x', show: true });
      await new Promise((r) => setTimeout(r, 10));
      const panel = panelEl();
      expect(panel.getAttribute('data-snui-component')).toBe('popconfirm');
      expect(panel.getAttribute('role')).toBe('dialog');
      expect(panel.getAttribute('aria-modal')).toBe('false');
    });

    it('reflects aria-expanded on the trigger', async () => {
      const w = mountPopconfirm({ content: 'x' });
      expect(w.find('.sn-popconfirm-trigger').attributes('aria-expanded')).toBe('false');
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await nextTick();
      expect(w.find('.sn-popconfirm-trigger').attributes('aria-expanded')).toBe('true');
    });

    it('renders the content prop as the message', async () => {
      mountPopconfirm({ content: '确定删除该文件吗？', show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.sn-popconfirm__message')?.textContent).toContain(
        '确定删除该文件吗？',
      );
    });
  });

  describe('action buttons', () => {
    it('uses the default labels 取消 / 确定', async () => {
      mountPopconfirm({ content: 'x', show: true });
      await new Promise((r) => setTimeout(r, 10));
      const buttons = actionButtons();
      expect(buttons).toHaveLength(2);
      expect(buttons[0]!.textContent).toContain('取消');
      expect(buttons[1]!.textContent).toContain('确定');
    });

    it('accepts custom negativeText / positiveText', async () => {
      mountPopconfirm({
        content: 'x',
        show: true,
        negativeText: 'No',
        positiveText: 'Yes, delete',
      });
      await new Promise((r) => setTimeout(r, 10));
      const buttons = actionButtons();
      expect(buttons[0]!.textContent).toContain('No');
      expect(buttons[1]!.textContent).toContain('Yes, delete');
    });

    it('renders the positive button as primary by default', async () => {
      mountPopconfirm({ content: 'x', show: true });
      await new Promise((r) => setTimeout(r, 10));
      const buttons = actionButtons();
      expect(buttons[0]!.classList.contains('sn-button--primary')).toBe(false);
      expect(buttons[1]!.classList.contains('sn-button--primary')).toBe(true);
    });

    it('forwards negativeButtonProps / positiveButtonProps to the buttons', async () => {
      mountPopconfirm({
        content: 'x',
        show: true,
        negativeButtonProps: { type: 'primary' },
        positiveButtonProps: { disabled: true },
      });
      await new Promise((r) => setTimeout(r, 10));
      const buttons = actionButtons();
      expect(buttons[0]!.classList.contains('sn-button--primary')).toBe(true);
      expect((buttons[1] as HTMLButtonElement).disabled).toBe(true);
    });

    it('replaces the built-in buttons via the #action slot', async () => {
      mountPopconfirm(
        { content: 'x', show: true },
        { action: () => h('button', { class: 'custom-action' }, 'custom') },
      );
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.custom-action')).not.toBeNull();
      expect(panelEl().querySelector('.sn-button')).toBeNull();
    });
  });

  describe('positive / negative click semantics', () => {
    it('closes on positive click when no handler is given', async () => {
      const w = mountPopconfirm({ content: 'x' });
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).not.toBeNull();
      actionButtons()[1]!.click();
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).toBeNull();
    });

    it('calls onPositiveClick and closes when it returns undefined', async () => {
      const onPositiveClick = vi.fn();
      const w = mountPopconfirm({ content: 'x', onPositiveClick });
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      actionButtons()[1]!.click();
      await new Promise((r) => setTimeout(r, 10));
      expect(onPositiveClick).toHaveBeenCalledTimes(1);
      expect(document.body.querySelector('.sn-popconfirm')).toBeNull();
    });

    it('onPositiveClick returning false vetoes closing', async () => {
      const onPositiveClick = vi.fn(() => false);
      const w = mountPopconfirm({ content: 'x', onPositiveClick });
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      actionButtons()[1]!.click();
      await new Promise((r) => setTimeout(r, 10));
      expect(onPositiveClick).toHaveBeenCalledTimes(1);
      expect(document.body.querySelector('.sn-popconfirm')).not.toBeNull();
    });

    it('holds the bubble open while onPositiveClick Promise is pending, then closes on truthy resolve', async () => {
      let resolveFn: (v: boolean) => void = () => {};
      const onPositiveClick = vi.fn(
        () =>
          new Promise<boolean>((resolve) => {
            resolveFn = resolve;
          }),
      );
      const w = mountPopconfirm({ content: 'x', onPositiveClick });
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      actionButtons()[1]!.click();
      await flush();
      // Still pending → still open.
      expect(document.body.querySelector('.sn-popconfirm')).not.toBeNull();
      resolveFn(true);
      await flush();
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).toBeNull();
    });

    it('keeps the bubble open when onPositiveClick Promise resolves to false', async () => {
      let resolveFn: (v: boolean) => void = () => {};
      const onPositiveClick = vi.fn(
        () =>
          new Promise<boolean>((resolve) => {
            resolveFn = resolve;
          }),
      );
      const w = mountPopconfirm({ content: 'x', onPositiveClick });
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      actionButtons()[1]!.click();
      resolveFn(false);
      await flush();
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).not.toBeNull();
    });

    it('onNegativeClick returning false vetoes closing; otherwise closes', async () => {
      const onNegativeClick = vi.fn(() => false);
      const w = mountPopconfirm({ content: 'x', onNegativeClick });
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      actionButtons()[0]!.click();
      await new Promise((r) => setTimeout(r, 10));
      expect(onNegativeClick).toHaveBeenCalledTimes(1);
      expect(document.body.querySelector('.sn-popconfirm')).not.toBeNull();

      // Now let the negative handler pass → closes.
      onNegativeClick.mockImplementation(() => true);
      actionButtons()[0]!.click();
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).toBeNull();
    });

    it('emits update:show=false in controlled mode when confirmed', async () => {
      const seen: boolean[] = [];
      const w = mountPopconfirm({
        content: 'x',
        show: true,
        'onUpdate:show': (v: boolean) => seen.push(v),
      });
      await new Promise((r) => setTimeout(r, 10));
      actionButtons()[1]!.click();
      await new Promise((r) => setTimeout(r, 10));
      expect(seen).toEqual([false]);
      w.unmount();
    });
  });

  describe('icon', () => {
    it('renders the default warning icon when showIcon is true (default)', async () => {
      mountPopconfirm({ content: 'x', show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.sn-popconfirm__icon .sn-icon')).not.toBeNull();
    });

    it('omits the icon area when showIcon is false', async () => {
      mountPopconfirm({ content: 'x', show: true, showIcon: false });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.sn-popconfirm__icon')).toBeNull();
    });

    it('renders a custom icon component passed via the icon prop', async () => {
      const CustomIcon = defineComponent({
        name: 'CustomIcon',
        render: () => h('svg', { class: 'custom-icon-svg' }),
      });
      mountPopconfirm({ content: 'x', show: true, icon: markRaw(CustomIcon) });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.custom-icon-svg')).not.toBeNull();
    });

    it('#icon slot takes precedence over the icon prop', async () => {
      const CustomIcon = defineComponent({
        name: 'CustomIcon',
        render: () => h('svg', { class: 'custom-icon-svg' }),
      });
      mountPopconfirm(
        { content: 'x', show: true, icon: markRaw(CustomIcon) },
        { icon: () => h('span', { class: 'slot-icon' }, 'I') },
      );
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.slot-icon')).not.toBeNull();
      expect(panelEl().querySelector('.custom-icon-svg')).toBeNull();
    });
  });

  describe('popover-inherited props', () => {
    it('show=true mounts the panel on first render; show=false keeps it closed', async () => {
      const w1 = mountPopconfirm({ content: 'x', show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).not.toBeNull();
      w1.unmount();
      await nextTick();

      const w2 = mountPopconfirm({ content: 'x', show: false });
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).toBeNull();
      w2.unmount();
    });

    it('disabled suppresses opening', async () => {
      const w = mountPopconfirm({ content: 'x', disabled: true });
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      expect(document.body.querySelector('.sn-popconfirm')).toBeNull();
    });

    it('showArrow=true renders the arrow; default omits it', async () => {
      const w1 = mountPopconfirm({ content: 'x', show: true, showArrow: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.sn-popconfirm__arrow')).not.toBeNull();
      w1.unmount();
      await nextTick();

      const w2 = mountPopconfirm({ content: 'x', show: true });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().querySelector('.sn-popconfirm__arrow')).toBeNull();
      w2.unmount();
    });

    it('keeps the requested placement class on the panel', async () => {
      mountPopconfirm({ content: 'x', show: true, placement: 'bottom-end' });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().classList.contains('sn-popconfirm--bottom-end')).toBe(true);
    });

    it('applies zIndex to the panel style', async () => {
      mountPopconfirm({ content: 'x', show: true, zIndex: 31337 });
      await new Promise((r) => setTimeout(r, 10));
      expect(panelEl().style.zIndex).toBe('31337');
    });

    it('applies contentClass and contentStyle to the inner body', async () => {
      mountPopconfirm({
        content: 'x',
        show: true,
        contentClass: 'my-body',
        contentStyle: { color: 'red' },
      });
      await new Promise((r) => setTimeout(r, 10));
      const body = panelEl().querySelector('.sn-popconfirm__body') as HTMLElement;
      expect(body.classList).toContain('my-body');
      expect(body.style.color).toBe('red');
    });

    it('closes on outside click and calls onClickoutside', async () => {
      const onClickoutside = vi.fn();
      const seen: boolean[] = [];
      const w = mountPopconfirm({
        content: 'x',
        show: true,
        onClickoutside,
        'onUpdate:show': (v: boolean) => seen.push(v),
      });
      await new Promise((r) => setTimeout(r, 10));
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      expect(onClickoutside).toHaveBeenCalledTimes(1);
      expect(seen).toContain(false);
      w.unmount();
    });

    it('keeps the node mounted with displayDirective=show after hiding', async () => {
      const w = mountPopconfirm({ content: 'x', displayDirective: 'show' });
      await w.find('.sn-popconfirm-trigger').trigger('click');
      await new Promise((r) => setTimeout(r, 10));
      actionButtons()[1]!.click();
      await new Promise((r) => setTimeout(r, 10));
      const panel = document.body.querySelector('.sn-popconfirm') as HTMLElement | null;
      expect(panel).not.toBeNull();
      expect(panel?.style.display).toBe('none');
    });

    it('exposes imperative show / hide / isShown', async () => {
      const w = mountPopconfirm({ content: 'x' });
      const exposed = w.vm as unknown as {
        show: () => void;
        hide: () => void;
        isShown: () => boolean;
      };
      expect(exposed.isShown()).toBe(false);
      exposed.show();
      await new Promise((r) => setTimeout(r, 10));
      expect(exposed.isShown()).toBe(true);
      exposed.hide();
      await nextTick();
      expect(exposed.isShown()).toBe(false);
    });
  });
});
