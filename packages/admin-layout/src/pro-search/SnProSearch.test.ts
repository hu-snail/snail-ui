import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { SnMenuOption } from '@snui/vue-web';
import SnProSearch from './SnProSearch.vue';

const menus: SnMenuOption[] = [
  { key: 'home', label: '首页' },
  {
    key: 'system',
    label: '系统管理',
    children: [
      { key: 'user', label: '用户管理' },
      { key: 'role', label: '角色权限' },
    ],
  },
];

const mountSearch = (props: Record<string, unknown> = {}) =>
  mount(SnProSearch, { props: { menus, ...props } });

/** Type into the field the way a user does (focus → native input event). */
async function typeQuery(wrapper: ReturnType<typeof mountSearch>, value: string) {
  await wrapper.find('input').trigger('focus');
  await wrapper.find('input').setValue(value);
}

const optionLabels = (wrapper: ReturnType<typeof mountSearch>) =>
  wrapper.findAll('.sn-pro-search__option-label').map((node) => node.text());

/** Text of the highlighted row's label (the row also hosts the trail). */
const activeLabel = (wrapper: ReturnType<typeof mountSearch>) =>
  wrapper.find('.sn-pro-search__option--active .sn-pro-search__option-label').text();

describe('SnProSearch · rendering', () => {
  it('should render the search field with the placeholder', () => {
    const wrapper = mountSearch();
    expect(wrapper.find('input').attributes('placeholder')).toBe('搜索菜单');
  });

  it('should use a custom placeholder', () => {
    const wrapper = mountSearch({ placeholder: 'Search menus' });
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search menus');
  });

  it('should keep the panel closed while the query is empty', async () => {
    const wrapper = mountSearch();
    await wrapper.find('input').trigger('focus');
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(false);
  });

  it('should open the panel on focus when a query is already bound', async () => {
    const wrapper = mountSearch({ modelValue: '用户' });
    await wrapper.find('input').trigger('focus');
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(true);
  });

  it('should not open while disabled', async () => {
    const wrapper = mountSearch({ disabled: true, modelValue: '用户' });
    await wrapper.find('input').trigger('focus');
    await wrapper.find('input').setValue('用户管理');
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(false);
  });
});

describe('SnProSearch · matching', () => {
  it('should list leaves matching their own label', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '用户');
    expect(optionLabels(wrapper)).toEqual(['用户管理']);
  });

  it('should surface leaves whose ancestor matches, with the ancestor trail', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '系统');
    expect(optionLabels(wrapper)).toEqual(['用户管理', '角色权限']);
    expect(wrapper.findAll('.sn-pro-search__option-path').map((n) => n.text())).toEqual([
      '系统管理',
      '系统管理',
    ]);
  });

  it('should omit the trail for top-level hits', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '首页');
    expect(optionLabels(wrapper)).toEqual(['首页']);
    expect(wrapper.find('.sn-pro-search__option-path').exists()).toBe(false);
  });

  it('should show the empty copy when nothing matches', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, 'zzz');
    expect(wrapper.findAll('.sn-pro-search__option')).toHaveLength(0);
    expect(wrapper.find('.sn-pro-search__empty').text()).toBe('没有匹配的菜单');
  });

  it('should honour a custom empty copy', async () => {
    const wrapper = mountSearch({ emptyText: 'No match' });
    await typeQuery(wrapper, 'zzz');
    expect(wrapper.find('.sn-pro-search__empty').text()).toBe('No match');
  });

  it('should keep the panel closed below minLength', async () => {
    const wrapper = mountSearch({ minLength: 2 });
    await typeQuery(wrapper, '系');
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(false);
    await wrapper.find('input').setValue('系统');
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(true);
  });

  it('should include group rows when includeGroups is set', async () => {
    const wrapper = mountSearch({ includeGroups: true });
    await typeQuery(wrapper, '系统');
    expect(optionLabels(wrapper)).toEqual(['系统管理', '用户管理', '角色权限']);
  });

  it('should apply a custom filter', async () => {
    const wrapper = mountSearch({
      filter: (_query: string, hit: { key: string | number }) => hit.key === 'role',
    });
    await typeQuery(wrapper, '系统');
    expect(optionLabels(wrapper)).toEqual(['角色权限']);
  });
});

describe('SnProSearch · events', () => {
  it('should emit update:modelValue and search while typing', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '用户');
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('用户');
    expect(wrapper.emitted('search')?.at(-1)?.[0]).toBe('用户');
  });

  it('should emit open and close around the panel lifecycle', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '用户');
    await wrapper.find('input').trigger('blur');
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('should emit select with the matched key and node when a row is clicked', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '系统');
    await wrapper.findAll('.sn-pro-search__option')[1]!.trigger('mousedown');
    const [key, item] = wrapper.emitted('select')?.[0] ?? [];
    expect(key).toBe('role');
    expect(item).toMatchObject({ key: 'role', label: '角色权限' });
  });

  it('should close the panel after choosing a row', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '系统');
    await wrapper.findAll('.sn-pro-search__option')[0]!.trigger('mousedown');
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(false);
  });

  it('should keep the panel open when closeOnSelect is false', async () => {
    const wrapper = mountSearch({ closeOnSelect: false });
    await typeQuery(wrapper, '系统');
    await wrapper.findAll('.sn-pro-search__option')[0]!.trigger('mousedown');
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(true);
  });

  it('should clear the query and stop emitting hits on clear', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '用户');
    await wrapper.find('.sn-input__clear').trigger('click');
    await wrapper.find('.sn-input__clear-btn').trigger('click');
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(false);
  });
});

describe('SnProSearch · keyboard', () => {
  it('should activate the first (auto-highlighted) row on Enter', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '系统');
    await wrapper.find('input').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('user');
  });

  it('should move the highlight with ArrowDown / ArrowUp and wrap around', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '系统');
    const active = () => activeLabel(wrapper);

    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' });
    expect(active()).toBe('角色权限');
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' });
    expect(active()).toBe('用户管理'); // wrapped back to the first row
    await wrapper.find('input').trigger('keydown', { key: 'ArrowUp' });
    expect(active()).toBe('角色权限');
  });

  it('should select the highlighted row on Enter after moving', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '系统');
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' });
    await wrapper.find('input').trigger('keydown', { key: 'Enter' });
    expect(wrapper.emitted('select')?.[0]?.[0]).toBe('role');
  });

  it('should dismiss the panel on Escape without clearing the query', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '系统');
    await wrapper.find('input').trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('.sn-pro-search__panel').exists()).toBe(false);
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('系统');
  });

  it('should highlight the first row again after the query changes', async () => {
    const wrapper = mountSearch();
    await typeQuery(wrapper, '系统');
    await wrapper.find('input').trigger('keydown', { key: 'ArrowDown' });
    await wrapper.find('input').setValue('角色');
    expect(activeLabel(wrapper)).toBe('角色权限');
  });
});
