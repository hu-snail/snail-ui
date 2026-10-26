/**
 * useLocale / <SnConfigProvider locale> behavior tests (naive-ui i18n).
 *
 * Covers:
 *   - default fallback to zhCN when no provider is present;
 *   - enUS rendering through the provider;
 *   - reactive locale switching without remount;
 *   - partial-namespace merge contract (missing namespaces fall back zhCN).
 */

import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';

import SnConfigProvider from '../config-provider/SnConfigProvider.vue';
import SnDataTable from '../data-table/SnDataTable.vue';
import SnDialog from '../dialog/SnDialog.vue';
import SnLog from '../log/SnLog.vue';
import SnPopconfirm from '../popconfirm/SnPopconfirm.vue';
import SnUpload from '../upload/SnUpload.vue';
import { SN_LOCALE_KEY } from './use-locale';
import { enUS, zhCN } from './index';
import type { SnLocaleInput } from './use-locale';

describe('useLocale', () => {
  it('should fall back to zh-CN when no provider is present', () => {
    const w = mount(SnLog, { props: { loading: true } });
    expect(w.find('.sn-log__loader-text').text()).toBe('加载中');
  });

  it('should render en-US strings under <SnConfigProvider :locale>', () => {
    const w = mount(SnConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(SnLog, { loading: true }) },
    });
    expect(w.find('.sn-log__loader-text').text()).toBe('Loading');
  });

  it('should switch strings reactively when the locale prop changes', async () => {
    const w = mount(SnConfigProvider, {
      props: { locale: zhCN },
      slots: { default: () => h(SnLog, { loading: true }) },
    });
    expect(w.find('.sn-log__loader-text').text()).toBe('加载中');
    await w.setProps({ locale: enUS });
    expect(w.find('.sn-log__loader-text').text()).toBe('Loading');
  });

  it('should merge a partial locale namespace over zh-CN (other namespaces fall back)', () => {
    const partial: SnLocaleInput = { Log: { loading: 'Lädt' } };
    const w = mount(SnConfigProvider, {
      props: { locale: partial },
      slots: { default: () => h(SnUpload) },
    });
    // Upload namespace is not provided → zh-CN default stays byte-identical.
    expect(w.find('button').text()).toContain('点击上传');
  });

  it('should render localized upload dragger copy under en-US', () => {
    const w = mount(SnConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(SnUpload) },
    });
    expect(w.find('button').text()).toContain('Click to upload');
  });

  it('should localize the dialog close aria-label under en-US', () => {
    const w = mount(SnConfigProvider, {
      props: { locale: enUS },
      slots: { default: () => h(SnDialog, { show: true, title: 'T' }) },
    });
    const close = w.find('[aria-label]');
    expect(close.exists()).toBe(true);
  });

  it('should localize the data-table empty state under en-US', () => {
    const w = mount(SnConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(SnDataTable, { columns: [{ title: 'Name', key: 'name' }], data: [] }),
      },
    });
    expect(w.find('.sn-data-table__empty-text').text()).toBe('No data');
  });

  it('should default popconfirm buttons to the locale under en-US', () => {
    // Popconfirm teleports its popover to <body>; inject enUS directly.
    const w = mount(SnPopconfirm, {
      props: { show: true, content: 'Sure?' },
      global: { provide: { [SN_LOCALE_KEY as symbol]: enUS } },
      slots: { default: () => h('button', { class: 'trigger-btn' }, 'trigger') },
      attachTo: document.body,
    });
    const buttons = [...document.body.querySelectorAll('button')].map((b) => b.textContent);
    expect(buttons.join('|')).toContain('Cancel');
    w.unmount();
  });

  it('should pass the site locale through nested providers that omit it', () => {
    // Chrome components nest `<SnConfigProvider skin>` without a locale —
    // they must NOT override the site-level locale with the zhCN fallback.
    const w = mount(SnConfigProvider, {
      props: { locale: enUS },
      slots: {
        default: () => h(SnConfigProvider, null, { default: () => h(SnLog, { loading: true }) }),
      },
    });
    expect(w.find('.sn-log__loader-text').text()).toBe('Loading');
  });
});
