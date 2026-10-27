/**
 * sn-loadmore unit tests — uni-end list footer (wd-loadmore parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - an empty `state` renders nothing
 *   - `loading` / `finished` / `error` each render their own text
 *   - the three `*-text` props override the defaults
 *   - the error state is tappable and emits `reload`; other states are inert
 *   - `loadingProps` forwards to sn-loading
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnLoadmore from './sn-loadmore.vue';

describe('sn-loadmore', () => {
  it('renders nothing when state is empty', () => {
    const wrapper = mount(SnLoadmore, { props: { state: '' } });
    expect(wrapper.find('.sn-loadmore').exists()).toBe(false);
  });

  it('renders the loading text and a spinner', () => {
    const wrapper = mount(SnLoadmore, { props: { state: 'loading' } });
    expect(wrapper.text()).toContain('正在努力加载中...');
    expect(wrapper.find('.sn-loading').exists()).toBe(true);
    expect(wrapper.attributes('aria-busy')).toBe('true');
  });

  it('renders the finished text', () => {
    const wrapper = mount(SnLoadmore, { props: { state: 'finished' } });
    expect(wrapper.find('.sn-loadmore__text--finished').text()).toBe('已加载完毕');
    expect(wrapper.attributes('aria-busy')).toBe('false');
  });

  it('renders the error text plus the retry hint', () => {
    const wrapper = mount(SnLoadmore, { props: { state: 'error' } });
    expect(wrapper.find('.sn-loadmore__text--error').text()).toBe('加载失败');
    expect(wrapper.text()).toContain('点击重试');
    expect(wrapper.classes()).toContain('sn-loadmore--error');
  });

  it('uses the custom texts', () => {
    const loading = mount(SnLoadmore, {
      props: { state: 'loading', loadingText: '加载中…' },
    });
    expect(loading.text()).toContain('加载中…');

    const finished = mount(SnLoadmore, {
      props: { state: 'finished', finishedText: '没有更多了' },
    });
    expect(finished.text()).toContain('没有更多了');

    const error = mount(SnLoadmore, {
      props: { state: 'error', errorText: '网络异常' },
    });
    expect(error.text()).toContain('网络异常');
  });

  it('emits reload when the error state is tapped', async () => {
    const wrapper = mount(SnLoadmore, { props: { state: 'error' } });
    await wrapper.trigger('tap');
    expect(wrapper.emitted('reload')).toHaveLength(1);
  });

  it('does not emit reload from the loading or finished states', async () => {
    const loading = mount(SnLoadmore, { props: { state: 'loading' } });
    await loading.trigger('tap');
    expect(loading.emitted('reload')).toBeUndefined();

    const finished = mount(SnLoadmore, { props: { state: 'finished' } });
    await finished.trigger('tap');
    expect(finished.emitted('reload')).toBeUndefined();
  });

  it('forwards loadingProps to the inner sn-loading', () => {
    const wrapper = mount(SnLoadmore, {
      props: { state: 'loading', loadingProps: { type: 'dots' } },
    });
    expect(wrapper.findAll('.sn-loading__dot')).toHaveLength(3);
  });

  it('renders the custom slots', () => {
    const loading = mount(SnLoadmore, {
      props: { state: 'loading' },
      slots: { loading: '<text>custom loading</text>' },
    });
    expect(loading.text()).toContain('custom loading');

    const finished = mount(SnLoadmore, {
      props: { state: 'finished' },
      slots: { finished: '<text>custom finished</text>' },
    });
    expect(finished.text()).toContain('custom finished');

    const error = mount(SnLoadmore, {
      props: { state: 'error' },
      slots: { error: '<text>custom error</text>' },
    });
    expect(error.text()).toContain('custom error');
  });

  it('forwards customClass and customStyle', () => {
    const wrapper = mount(SnLoadmore, {
      props: { state: 'finished', customClass: 'my-loadmore', customStyle: 'margin: 8px' },
    });
    expect(wrapper.classes()).toContain('my-loadmore');
    expect(wrapper.attributes('style')).toContain('margin: 8px');
  });

  /* ── Added coverage ──────────────────────────────────────────────────── */

  it('honours the size override from loadingProps', () => {
    // Regression: the hardcoded `size="28"` used to sit after the v-bind
    // spread, silently discarding the documented size override (and emitting
    // an invalid unitless `font-size: 28`).
    const wrapper = mount(SnLoadmore, {
      props: { state: 'loading', loadingProps: { size: '3em' } },
    });
    expect(wrapper.find('.sn-loading').attributes('style')).toContain('font-size: 3em');
  });

  it('honours the type override from loadingProps', () => {
    const wrapper = mount(SnLoadmore, {
      props: { state: 'loading', loadingProps: { type: 'spinner' } },
    });
    expect(wrapper.findAll('.sn-loading__spinner-bar')).toHaveLength(8);
  });

  it('keeps the inner spinner text suppressed even when loadingProps sets one', () => {
    const wrapper = mount(SnLoadmore, {
      props: { state: 'loading', loadingProps: { text: 'inner' } },
    });
    expect(wrapper.findAll('.sn-loading__text')).toHaveLength(0);
  });

  it('exposes the footer as a polite status live region', () => {
    const wrapper = mount(SnLoadmore, { props: { state: 'loading' } });
    expect(wrapper.attributes('role')).toBe('status');
    expect(wrapper.attributes('aria-live')).toBe('polite');
  });

  it('tags the root for the docs / AI component map', () => {
    expect(
      mount(SnLoadmore, { props: { state: 'finished' } }).attributes('data-snui-component'),
    ).toBe('loadmore');
  });
});
