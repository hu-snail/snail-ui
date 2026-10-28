/**
 * SnDialogProvider + useDialog tests (AUI-WEB-FB-001).
 *
 * Behavior coverage, not implementation detail:
 *   - useDialog throws without a provider ancestor
 *   - the typed factories render a modal overlay with the matching type
 *   - the reactive handle mutates live (title)
 *   - positive click closes (and returning false / a Promise keeps it open,
 *     with the loading state while pending)
 *   - mask click closes by default
 *   - destroyAll hides everything
 */
import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnDialogProvider from './SnDialogProvider.vue';
import { useDialog, type DialogApiInjection } from './use-dialog';

/** Mount a provider with a consumer that captures the useDialog() API. */
function mountProvider(props: Record<string, unknown> = {}) {
  let api!: DialogApiInjection;
  const Consumer = defineComponent({
    setup() {
      api = useDialog();
      return () => h('div', { class: 'consumer' }, 'content');
    },
  });
  const wrapper = mount(SnDialogProvider, {
    props,
    slots: { default: () => h(Consumer) },
    attachTo: document.body,
  });
  return { wrapper, api };
}

function overlays(): HTMLElement[] {
  return Array.from(document.body.querySelectorAll('.sn-dialog-provider__overlay'));
}

async function settle(ms = 320): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

describe('useDialog', () => {
  it('throws when called without a SnDialogProvider ancestor', () => {
    expect(() =>
      mount(
        defineComponent({
          setup() {
            useDialog();
            return () => h('div');
          },
        }),
      ),
    ).toThrow(/SnDialogProvider/);
  });

  it('renders a modal overlay with the typed icon badge', async () => {
    const { wrapper, api } = mountProvider();
    api.success({ title: '成功', content: '厉害', positiveText: '哇' });
    await settle(30);

    expect(overlays()).toHaveLength(1);
    const card = overlays()[0].querySelector('.sn-dialog');
    expect(card).not.toBeNull();
    // success badge colour token rides on the inline background.
    expect(
      (card as HTMLElement).querySelector('.sn-dialog__icon')?.getAttribute('style'),
    ).toContain('--sn-web-dialog-icon-color-success');
    expect(card?.querySelector('.sn-dialog__title')?.textContent).toContain('成功');
    expect(card?.textContent).toContain('厉害');
    wrapper.unmount();
    await settle();
  });

  it('lets the reactive handle mutate the dialog live', async () => {
    const { wrapper, api } = mountProvider();
    const d = api.info({ title: 'first', content: 'x' });
    await settle(30);
    d.title = 'second';
    await settle(30);
    expect(overlays()[0].textContent).toContain('second');
    wrapper.unmount();
    await settle();
  });

  it('closes after the positive click and drops the node', async () => {
    const onPositiveClick = vi.fn();
    const { wrapper, api } = mountProvider();
    const d = api.warning({
      title: '警告',
      content: '你确定?',
      positiveText: '确定',
      negativeText: '不确定',
      onPositiveClick,
    });
    await settle(30);
    const positive = overlays()[0].querySelector('.sn-dialog__action button:last-child')!;
    (positive as HTMLButtonElement).click();
    expect(onPositiveClick).toHaveBeenCalledTimes(1);
    await settle();
    // Hidden + removed after the leave duration.
    expect(d.show).toBe(false);
    expect(overlays()).toHaveLength(0);
    wrapper.unmount();
    await settle();
  });

  it('keeps the dialog open when onPositiveClick returns false', async () => {
    const { wrapper, api } = mountProvider();
    api.error({
      title: '错误',
      content: '错了',
      positiveText: '嗯',
      onPositiveClick: () => false,
    });
    await settle(30);
    const positive = overlays()[0].querySelector('.sn-dialog__action button')!;
    (positive as HTMLButtonElement).click();
    await settle(30);
    expect(overlays()).toHaveLength(1);
    wrapper.unmount();
    await settle();
  });

  it('shows the loading state while an async confirm is pending', async () => {
    const { wrapper, api } = mountProvider();
    let resolvePending: (v: boolean | void) => void = () => {};
    const pending = new Promise<boolean | void>((resolve) => {
      resolvePending = resolve;
    });
    api.info({ title: '异步', positiveText: '确定', onPositiveClick: () => pending });
    await settle(30);
    const positive = overlays()[0].querySelector(
      '.sn-dialog__action button:last-child',
    ) as HTMLButtonElement;
    positive.click();
    await settle(30);
    // Loading keeps the dialog open with a disabled confirm button.
    expect(overlays()).toHaveLength(1);
    expect(positive.disabled).toBe(true);

    resolvePending();
    await settle();
    expect(overlays()).toHaveLength(0);
    wrapper.unmount();
    await settle();
  });

  it('closes on mask click by default and honours maskClosable=false', async () => {
    const { wrapper, api } = mountProvider();
    api.info({ title: 'mask', content: 'x' });
    await settle(30);
    overlays()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await settle();
    expect(overlays()).toHaveLength(0);
    wrapper.unmount();
    await settle();

    const locked = mountProvider({ maskClosable: false });
    locked.api.info({ title: 'locked', content: 'x' });
    await settle(30);
    overlays()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await settle(30);
    expect(overlays()).toHaveLength(1);
    locked.wrapper.unmount();
    await settle();
  });

  it('renders function content and destroyAll hides every dialog', async () => {
    const { wrapper, api } = mountProvider();
    api.info({ title: 'a', content: () => h('p', { class: 'fn-body' }, 'render fn body') });
    api.error({ title: 'b', content: 'x' });
    await settle(30);
    expect(overlays()).toHaveLength(2);
    expect(document.body.querySelector('.fn-body')?.textContent).toBe('render fn body');

    api.destroyAll();
    await settle();
    expect(overlays()).toHaveLength(0);
    wrapper.unmount();
    await settle();
  });
});
