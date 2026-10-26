import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { Plus, FileText, Share2 } from 'lucide-vue-next';
import SnFloatButton from './SnFloatButton.vue';
import SnFloatButtonGroup from './SnFloatButtonGroup.vue';
import { expectIconRendered, expectNoMissingIcons } from '../test-utils/icon-assertions';

/**
 * SnFloatButton / SnFloatButtonGroup behaviour tests.
 *
 * Harness notes:
 *
 * 1. The group wraps its stack in `<Transition>`; @vue/test-utils stubs
 *    transitions by default and a `transition-stub` does not render its
 *    `v-show` child, so every group mount disables the stub
 *    (`global.stubs.transition = false`) — same convention as SnBackTop.
 *
 * 2. The stack is revealed with `v-show` (children stay mounted). Tests
 *    therefore assert the `--open` class / `aria-hidden` / `aria-expanded`
 *    state, not `display`, which only settles after the leave transition.
 *
 * 3. Offsets are read back from the inline `style` of the root, exactly like
 *    SnBackTop's positioning tests.
 */

const GROUP = '[data-snui-component="float-button-group"]';
const BUTTON = '[data-snui-component="float-button"]';
const TRIGGER = '.sn-float-button-group__trigger';
const ITEMS = '.sn-float-button-group__items';

function mountButton(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(SnFloatButton, { props, slots, attachTo: document.body });
}

function mountGroup(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(SnFloatButtonGroup, {
    props,
    slots,
    attachTo: document.body,
    global: { stubs: { transition: false } },
  });
}

function itemChildren(wrapper: ReturnType<typeof mount>) {
  return wrapper.find(ITEMS).findAll('.sn-float-button');
}

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('SnFloatButton', () => {
  describe('rendering', () => {
    it('should render a real button with the component marker by default', () => {
      const wrapper = mountButton();
      const root = wrapper.find(BUTTON);

      expect(root.exists()).toBe(true);
      expect(root.element.tagName).toBe('BUTTON');
      expect(root.attributes('type')).toBe('button');
      expect(root.attributes('data-snui-component')).toBe('float-button');
    });

    it('should render an anchor instead of a button when href is given', () => {
      const wrapper = mountButton({ href: '/docs', target: '_blank' });
      const root = wrapper.find('a.sn-float-button');

      expect(root.exists()).toBe(true);
      expect(wrapper.find('button.sn-float-button').exists()).toBe(false);
      expect(root.attributes('href')).toBe('/docs');
      expect(root.attributes('target')).toBe('_blank');
      expect(root.attributes('type')).toBeUndefined();
    });

    it('should render nothing when visible is false', () => {
      const wrapper = mountButton({ visible: false });
      expect(wrapper.find(BUTTON).exists()).toBe(false);
    });

    it('should apply the type and shape classes', () => {
      const wrapper = mountButton({ type: 'primary', shape: 'square' });
      const classes = wrapper.find(BUTTON).classes();

      expect(classes).toContain('sn-float-button--primary');
      expect(classes).toContain('sn-float-button--square');
    });

    it('should default to a default-type circle button', () => {
      const classes = mountButton().find(BUTTON).classes();
      expect(classes).toContain('sn-float-button--default');
      expect(classes).toContain('sn-float-button--circle');
    });

    it('should render the icon through SnIcon', () => {
      // Regression guard against the `:component="X"` misuse documented in
      // `test-utils/icon-assertions.ts`: an unresolved SnIcon renders a
      // placeholder with no <svg> and the button appears blank.
      const wrapper = mountButton({ icon: Plus });
      expectIconRendered(wrapper.find(BUTTON), '.sn-icon');
      expectNoMissingIcons(wrapper, 'SnFloatButton');
    });

    it('should render no icon element at all when neither icon nor slot is given', () => {
      const wrapper = mountButton();
      expect(wrapper.find('.sn-icon').exists()).toBe(false);
      expect(wrapper.find('.sn-float-button__icon').exists()).toBe(true);
    });

    it('should replace the icon through the icon slot', () => {
      const wrapper = mountButton(
        { icon: Plus },
        { icon: '<span class="custom-slot-icon">i</span>' },
      );

      expect(wrapper.find('.custom-slot-icon').exists()).toBe(true);
      expect(wrapper.find('.sn-icon').exists()).toBe(false);
    });

    it('should replace the whole content through the default slot', () => {
      const wrapper = mountButton(
        { icon: Plus, shape: 'square', description: '帮助' },
        { default: '<span class="custom-content">自定义</span>' },
      );

      expect(wrapper.find('.custom-content').exists()).toBe(true);
      expect(wrapper.find('.sn-float-button__description').exists()).toBe(false);
      expect(wrapper.find('.sn-icon').exists()).toBe(false);
    });

    it('should render the description line for the square shape', () => {
      const wrapper = mountButton({ shape: 'square', description: '帮助' });
      expect(wrapper.find('.sn-float-button__description').text()).toBe('帮助');
    });

    it('should ignore the description for the circle shape', () => {
      const wrapper = mountButton({ shape: 'circle', description: '帮助' });
      expect(wrapper.find('.sn-float-button__description').exists()).toBe(false);
    });

    it('should replace the description through the description slot', () => {
      const wrapper = mountButton(
        { shape: 'square' },
        { description: '<span class="custom-desc">说明</span>' },
      );

      expect(wrapper.find('.custom-desc').exists()).toBe(true);
    });
  });

  describe('positioning', () => {
    it('should pin to the bottom-right corner by default', () => {
      const el = mountButton().find(BUTTON).element as HTMLElement;
      expect(el.style.position).toBe('fixed');
      expect(el.style.right).toBe('24px');
      expect(el.style.bottom).toBe('24px');
      expect(el.style.zIndex).toBe('1000');
    });

    it('should honour the placement corner', () => {
      const el = mountButton({ placement: 'top-left' }).find(BUTTON).element as HTMLElement;
      expect(el.style.top).toBe('24px');
      expect(el.style.left).toBe('24px');
      expect(el.style.right).toBe('');
      expect(el.style.bottom).toBe('');
    });

    it('should let explicit offsets win over the placement corner', () => {
      const el = mountButton({ placement: 'bottom-right', top: 8 }).find(BUTTON)
        .element as HTMLElement;
      expect(el.style.top).toBe('8px');
      expect(el.style.bottom).toBe('');
      // The horizontal axis still falls back to the placement corner.
      expect(el.style.right).toBe('24px');
    });

    it('should centre on an edge for the four edge anchors', () => {
      // `top` / `bottom` centre horizontally; `left` / `right` vertically.
      const top = mountButton({ placement: 'top' }).find(BUTTON).element as HTMLElement;
      expect(top.style.top).toBe('24px');
      expect(top.style.left).toBe('50%');
      expect(top.style.transform).toBe('translate(-50%, 0)');

      const right = mountButton({ placement: 'right' }).find(BUTTON).element as HTMLElement;
      expect(right.style.right).toBe('24px');
      expect(right.style.top).toBe('50%');
      expect(right.style.transform).toBe('translate(0, -50%)');
    });

    it('should not translate when the caller offsets the centred axis', () => {
      // An explicit `left` replaces the `50%` centring, so the translate goes away.
      const el = mountButton({ placement: 'top', left: 40 }).find(BUTTON).element as HTMLElement;
      expect(el.style.left).toBe('40px');
      expect(el.style.top).toBe('24px');
      expect(el.style.transform).toBe('');
    });

    it('should centre a corner-free edge on both axes correctly', () => {
      const bottom = mountButton({ placement: 'bottom' }).find(BUTTON).element as HTMLElement;
      expect(bottom.style.bottom).toBe('24px');
      expect(bottom.style.left).toBe('50%');
      expect(bottom.style.transform).toBe('translate(-50%, 0)');

      const left = mountButton({ placement: 'left' }).find(BUTTON).element as HTMLElement;
      expect(left.style.left).toBe('24px');
      expect(left.style.top).toBe('50%');
      expect(left.style.transform).toBe('translate(0, -50%)');
    });

    it('should accept numeric and string offsets', () => {
      const el = mountButton({ right: 40, bottom: '10%' }).find(BUTTON).element as HTMLElement;
      expect(el.style.right).toBe('40px');
      expect(el.style.bottom).toBe('10%');
    });

    it('should apply a custom z-index', () => {
      const el = mountButton({ zIndex: 1200 }).find(BUTTON).element as HTMLElement;
      expect(el.style.zIndex).toBe('1200');
    });
  });

  describe('badge', () => {
    it('should render the count bubble', () => {
      const wrapper = mountButton({ badge: 5 });
      expect(wrapper.find('.sn-float-button__badge').text()).toBe('5');
    });

    it('should render a string badge', () => {
      const wrapper = mountButton({ badge: 'new' });
      expect(wrapper.find('.sn-float-button__badge').text()).toBe('new');
    });

    it('should hide the badge for 0 and the empty string', () => {
      expect(mountButton({ badge: 0 }).find('.sn-float-button__badge').exists()).toBe(false);
      expect(mountButton({ badge: '' }).find('.sn-float-button__badge').exists()).toBe(false);
      expect(mountButton().find('.sn-float-button__badge').exists()).toBe(false);
    });

    it('should render a dot without a number when badgeDot is set', () => {
      const wrapper = mountButton({ badgeDot: true });
      const badge = wrapper.find('.sn-float-button__badge');

      expect(badge.exists()).toBe(true);
      expect(badge.classes()).toContain('sn-float-button__badge--dot');
      expect(badge.text()).toBe('');
    });

    it('should prefer the count over the dot', () => {
      const badge = mountButton({ badge: 3, badgeDot: true }).find('.sn-float-button__badge');
      expect(badge.text()).toBe('3');
      expect(badge.classes()).not.toContain('sn-float-button__badge--dot');
    });
  });

  describe('interaction', () => {
    it('should emit click with the native event', async () => {
      const wrapper = mountButton();
      await wrapper.find(BUTTON).trigger('click');

      const events = wrapper.emitted('click');
      expect(events).toHaveLength(1);
      expect(events?.[0]?.[0]).toBeInstanceOf(MouseEvent);
    });

    it('should not emit click while disabled and should mark aria-disabled', async () => {
      const wrapper = mountButton({ disabled: true });
      const root = wrapper.find(BUTTON);

      expect(root.attributes('aria-disabled')).toBe('true');
      expect(root.classes()).toContain('sn-float-button--disabled');

      await root.trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('should not navigate a disabled link', async () => {
      const wrapper = mountButton({ href: '/docs', disabled: true });
      await wrapper.find('a.sn-float-button').trigger('click');
      expect(wrapper.emitted('click')).toBeUndefined();
    });
  });

  describe('accessibility', () => {
    it('should set title and aria-label from tooltip', () => {
      const root = mountButton({ tooltip: '新建' }).find(BUTTON);
      expect(root.attributes('title')).toBe('新建');
      expect(root.attributes('aria-label')).toBe('新建');
    });

    it('should fall back to the description as the accessible name', () => {
      const root = mountButton({ shape: 'square', description: '帮助' }).find(BUTTON);
      expect(root.attributes('aria-label')).toBe('帮助');
      expect(root.attributes('title')).toBeUndefined();
    });
  });

  describe('standalone versus group', () => {
    it('should position itself when no group is present', () => {
      const root = mountButton().find(BUTTON);
      expect(root.classes()).not.toContain('sn-float-button--in-group');
      expect((root.element as HTMLElement).style.position).toBe('fixed');
    });
  });
});

describe('SnFloatButtonGroup', () => {
  describe('rendering', () => {
    it('should render the group shell with role="group"', () => {
      const wrapper = mountGroup();
      const root = wrapper.find(GROUP);

      expect(root.exists()).toBe(true);
      expect(root.attributes('role')).toBe('group');
      expect(root.attributes('data-snui-component')).toBe('float-button-group');
    });

    it('should pin the group to the bottom-right corner by default', () => {
      const el = mountGroup({ fixed: true }).find(GROUP).element as HTMLElement;
      expect(el.style.position).toBe('fixed');
      expect(el.style.right).toBe('24px');
      expect(el.style.bottom).toBe('24px');
      expect(el.style.zIndex).toBe('1000');
    });

    it('should stay inside its positioning context when fixed is off', () => {
      const wrapper = mountGroup({ fixed: false });
      const el = wrapper.find(GROUP).element as HTMLElement;
      // No container given: absolute positioning resolves against the parent.
      expect(el.style.position).toBe('absolute');
      expect(el.style.right).toBe('24px');
      expect(el.style.bottom).toBe('24px');
      expect(el.parentElement).not.toBe(document.body);
    });

    it('should move into a container element and leave no stray host', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const anchor = document.createElement('div');
      document.body.appendChild(anchor);

      const wrapper = mount(SnFloatButtonGroup, {
        props: { fixed: false, container: host },
        slots: { default: () => h(SnFloatButton, { icon: FileText, tooltip: '文档' }) },
        attachTo: anchor,
      });

      const el = wrapper.find(GROUP).element as HTMLElement;
      expect(el.parentElement).toBe(host);
      wrapper.unmount();
      // Unmount restores the root next to its placeholder, then drops it.
      expect(host.contains(el)).toBe(false);
      expect(document.body.contains(el)).toBe(false);

      host.remove();
      anchor.remove();
    });

    it('should derive the opening direction from the anchor', () => {
      // A bottom anchor opens upwards, a top anchor downwards, and the edge
      // anchors open towards the viewport centre.
      const bottom = mountGroup({ placement: 'bottom-right' });
      expect(bottom.find(GROUP).classes()).toContain('sn-float-button-group--dir-up');

      const top = mountGroup({ placement: 'top-left' });
      expect(top.find(GROUP).classes()).toContain('sn-float-button-group--dir-down');

      const left = mountGroup({ placement: 'left' });
      expect(left.find(GROUP).classes()).toContain('sn-float-button-group--dir-right');

      const right = mountGroup({ placement: 'right' });
      expect(right.find(GROUP).classes()).toContain('sn-float-button-group--dir-left');
    });

    it('should let an explicit direction win over the anchor', () => {
      const wrapper = mountGroup({ placement: 'bottom-right', direction: 'left' });
      const root = wrapper.find(GROUP);
      expect(root.classes()).toContain('sn-float-button-group--dir-left');
      expect(root.classes()).not.toContain('sn-float-button-group--dir-up');
    });

    it('should treat direction=auto as "derive from the anchor"', () => {
      const wrapper = mountGroup({ placement: 'top-right', direction: 'auto' });
      expect(wrapper.find(GROUP).classes()).toContain('sn-float-button-group--dir-down');
    });

    it('should mark vertical stacks so the axis can be styled', () => {
      expect(mountGroup({ direction: 'up' }).find(GROUP).classes()).toContain(
        'sn-float-button-group--vertical',
      );
      expect(mountGroup({ direction: 'left' }).find(GROUP).classes()).not.toContain(
        'sn-float-button-group--vertical',
      );
    });

    it('should honour placement and explicit offsets for the group', () => {
      const el = mountGroup({ placement: 'top-right', top: 48, right: 8 }).find(GROUP)
        .element as HTMLElement;
      expect(el.style.top).toBe('48px');
      expect(el.style.right).toBe('8px');
      expect(el.style.bottom).toBe('');
    });

    it('should render the stacked children inside the group', () => {
      const wrapper = mountGroup(
        {},
        {
          default: () => [
            h(SnFloatButton, { icon: FileText, tooltip: '文档' }),
            h(SnFloatButton, { icon: Share2, tooltip: '分享' }),
          ],
        },
      );

      expect(itemChildren(wrapper)).toHaveLength(2);
      expect(itemChildren(wrapper)[0]?.attributes('title')).toBe('文档');
      expect(itemChildren(wrapper)[1]?.attributes('title')).toBe('分享');
      expect(wrapper.findAll('.sn-icon').length).toBeGreaterThanOrEqual(3); // 2 children + trigger
      expectNoMissingIcons(wrapper, 'SnFloatButtonGroup');
    });

    it('should apply the gap between the stacked children', () => {
      const wrapper = mountGroup({ gap: 20 });
      const root = wrapper.find(GROUP).element as HTMLElement;

      expect(root.style.rowGap).toBe('20px');
      expect((wrapper.find(ITEMS).element as HTMLElement).style.gap).toBe('20px');
    });

    it('should default the gap to 12px', () => {
      const root = mountGroup().find(GROUP).element as HTMLElement;
      expect(root.style.rowGap).toBe('12px');
    });
  });

  describe('trigger', () => {
    it('should render the built-in Plus glyph through SnIcon', () => {
      const wrapper = mountGroup();
      expect(wrapper.find(TRIGGER).exists()).toBe(true);
      expectIconRendered(wrapper.find(TRIGGER), '.sn-icon');
      expectNoMissingIcons(wrapper, 'SnFloatButtonGroup');
    });

    it('should accept a custom trigger icon', () => {
      const wrapper = mountGroup({ triggerIcon: Share2 });
      expect(wrapper.find(TRIGGER).exists()).toBe(true);
      expectIconRendered(wrapper.find(TRIGGER), '.sn-icon');
    });

    it('should set the trigger tooltip as title and accessible name', () => {
      const trigger = mountGroup({ triggerTooltip: '展开更多' }).find(TRIGGER);
      expect(trigger.attributes('title')).toBe('展开更多');
      expect(trigger.attributes('aria-label')).toBe('展开更多');
    });

    it('should replace the trigger through the trigger slot', () => {
      const wrapper = mountGroup(
        {},
        {
          trigger: '<button type="button" class="custom-trigger">t</button>',
        },
      );

      expect(wrapper.find('.custom-trigger').exists()).toBe(true);
      expect(wrapper.find(TRIGGER).exists()).toBe(false);
    });
  });

  describe('open state', () => {
    it('should be closed by default', () => {
      const wrapper = mountGroup();
      expect(wrapper.find(TRIGGER).attributes('aria-expanded')).toBe('false');
      expect(wrapper.find(ITEMS).classes()).not.toContain('sn-float-button-group__items--open');
      expect(wrapper.find(ITEMS).attributes('aria-hidden')).toBe('true');
    });

    it('should toggle on trigger click and emit both events', async () => {
      const wrapper = mountGroup();
      await wrapper.find(TRIGGER).trigger('click');

      expect(wrapper.find(TRIGGER).attributes('aria-expanded')).toBe('true');
      expect(wrapper.find(ITEMS).classes()).toContain('sn-float-button-group__items--open');
      expect(wrapper.find(ITEMS).attributes('aria-hidden')).toBeUndefined();
      expect(wrapper.find('.sn-float-button-group__trigger-icon').classes()).toContain(
        'sn-float-button-group__trigger-icon--open',
      );
      expect(wrapper.emitted('update:open')).toEqual([[true]]);
      expect(wrapper.emitted('openChange')).toEqual([[true]]);

      await wrapper.find(TRIGGER).trigger('click');
      expect(wrapper.emitted('update:open')).toEqual([[true], [false]]);
      expect(wrapper.emitted('openChange')).toEqual([[true], [false]]);
    });

    it('should keep the stacked children mounted while collapsed (v-show)', async () => {
      const wrapper = mountGroup(
        {},
        {
          default: () => h(SnFloatButton, { icon: FileText, tooltip: '文档' }),
        },
      );

      expect(itemChildren(wrapper)).toHaveLength(1);
      expect(wrapper.find(ITEMS).exists()).toBe(true);
    });

    it('should stay closed while controlled and emit the requested value', async () => {
      const wrapper = mountGroup({ open: false });
      await wrapper.find(TRIGGER).trigger('click');

      expect(wrapper.find(TRIGGER).attributes('aria-expanded')).toBe('false');
      expect(wrapper.emitted('update:open')).toEqual([[true]]);
    });

    it('should render open when controlled open is true', () => {
      const wrapper = mountGroup({ open: true });
      expect(wrapper.find(TRIGGER).attributes('aria-expanded')).toBe('true');
      expect(wrapper.find(ITEMS).classes()).toContain('sn-float-button-group__items--open');
    });

    it('should treat an omitted open prop as uncontrolled, not as closed', async () => {
      // Regression: Vue's boolean-prop casting turns an absent `Boolean` prop
      // into `false`, which would make the group permanently controlled-closed.
      // The `open: undefined` default in `withDefaults` exists to prevent that.
      const wrapper = mountGroup();
      await wrapper.find(TRIGGER).trigger('click');

      expect(wrapper.find(TRIGGER).attributes('aria-expanded')).toBe('true');
      expect(wrapper.emitted('update:open')).toEqual([[true]]);
    });

    it('should not emit while the requested state does not change', async () => {
      const wrapper = mountGroup({ trigger: 'hover' });
      const root = wrapper.find(GROUP);

      await root.trigger('mouseenter');
      // Already open: the second enter must not re-emit.
      await root.trigger('mouseenter');

      expect(wrapper.emitted('update:open')).toEqual([[true]]);
    });
  });

  describe('hover trigger', () => {
    it('should open on mouseenter and close on mouseleave', async () => {
      const wrapper = mountGroup({ trigger: 'hover' });
      const root = wrapper.find(GROUP);

      await root.trigger('mouseenter');
      expect(wrapper.find(ITEMS).classes()).toContain('sn-float-button-group__items--open');

      await root.trigger('mouseleave');
      expect(wrapper.find(ITEMS).classes()).not.toContain('sn-float-button-group__items--open');
    });

    it('should ignore hover gestures when the trigger is click', async () => {
      const wrapper = mountGroup({ trigger: 'click' });
      await wrapper.find(GROUP).trigger('mouseenter');
      expect(wrapper.find(ITEMS).classes()).not.toContain('sn-float-button-group__items--open');
    });

    it('should close when the pointer moves outside the group', async () => {
      const wrapper = mountGroup({ trigger: 'hover' });
      await wrapper.find(GROUP).trigger('mouseenter');
      expect(wrapper.find(ITEMS).classes()).toContain('sn-float-button-group__items--open');

      // The dismiss evaluates on the next animation frame — run frames
      // synchronously so the test observes the settled state.
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
      // happy-dom reports a zero-sized rect, so any point is "outside".
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 500 }));
      await nextTick();
      vi.unstubAllGlobals();

      expect(wrapper.find(ITEMS).classes()).not.toContain('sn-float-button-group__items--open');
    });

    it('coalesces a mousemove burst into one rect read per frame', async () => {
      const wrapper = mountGroup({ trigger: 'hover' });
      await wrapper.find(GROUP).trigger('mouseenter');
      expect(wrapper.find(ITEMS).classes()).toContain('sn-float-button-group__items--open');

      // Defer frames so queued evaluations only run when flushed.
      const frames: Array<FrameRequestCallback | undefined> = [];
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        frames.push(cb);
        return frames.length;
      });
      vi.stubGlobal('cancelAnimationFrame', (handle: number) => {
        delete frames[handle - 1];
      });

      const rectSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect');
      rectSpy.mockClear();
      for (let i = 0; i < 5; i++) {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 500 + i, clientY: 500 }));
      }
      // No layout reads until the frame runs; five events → one queued frame.
      expect(rectSpy).not.toHaveBeenCalled();
      expect(frames.length).toBe(1);

      const frame = frames.shift();
      frame?.(0);
      await nextTick();
      // One evaluation pass = exactly one rect read.
      expect(rectSpy).toHaveBeenCalledTimes(1);

      wrapper.unmount();
      vi.unstubAllGlobals();
    });

    it('should not install the document guard for the click trigger', () => {
      const addSpy = vi.spyOn(document, 'addEventListener');
      mountGroup({ trigger: 'click' });
      expect(addSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should install the document guard only while an open hover stack exists', async () => {
      const addSpy = vi.spyOn(document, 'addEventListener');
      const removeSpy = vi.spyOn(document, 'removeEventListener');

      const wrapper = mountGroup({ trigger: 'hover' });
      expect(addSpy).not.toHaveBeenCalledWith('mousemove', expect.any(Function));

      await wrapper.find(GROUP).trigger('mouseenter');
      expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));

      await wrapper.find(GROUP).trigger('mouseleave');
      expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });

    it('should remove the document guard on unmount', () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener');
      const wrapper = mountGroup({ trigger: 'hover', open: true });

      wrapper.unmount();
      expect(removeSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
  });

  describe('children inherit the group context', () => {
    it('should override the child shape with the group shape', () => {
      const wrapper = mountGroup(
        { shape: 'square' },
        {
          default: () => h(SnFloatButton, { shape: 'circle', description: '文档', icon: FileText }),
        },
      );

      const child = itemChildren(wrapper)[0];
      expect(child?.classes()).toContain('sn-float-button--square');
      // The description line is a square-shape feature, so it appears too.
      expect(wrapper.find('.sn-float-button__description').text()).toBe('文档');
    });

    it('should keep the child shape when the group does not override it', () => {
      const wrapper = mountGroup(
        { shape: 'circle' },
        {
          default: () => h(SnFloatButton, { shape: 'circle', icon: FileText }),
        },
      );

      expect(itemChildren(wrapper)[0]?.classes()).toContain('sn-float-button--circle');
    });

    it('should let the group own the position of its children', () => {
      const wrapper = mountGroup(
        {},
        {
          default: () => h(SnFloatButton, { icon: FileText, placement: 'top-left', zIndex: 5000 }),
        },
      );

      const child = itemChildren(wrapper)[0];
      expect(child?.classes()).toContain('sn-float-button--in-group');
      const el = child?.element as HTMLElement;
      // No inline fixed positioning and no z-index on a grouped child.
      expect(el.style.position).toBe('');
      expect(el.style.top).toBe('');
      expect(el.style.left).toBe('');
      expect(el.style.zIndex).toBe('');
    });

    it('should keep the children interactive', async () => {
      const onClick = vi.fn();
      const wrapper = mountGroup(
        {},
        {
          default: () => h(SnFloatButton, { icon: FileText, tooltip: '文档', onClick }),
        },
      );

      await itemChildren(wrapper)[0]?.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
