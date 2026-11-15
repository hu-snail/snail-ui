import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import SnAvatarGroup from './sn-avatar-group.vue';
import SnAvatar from '../sn-avatar/sn-avatar.vue';

describe('registry debug 11', () => {
  it('count group instances and read all bubbles', async () => {
    const slot = () => Array.from({ length: 4 }, (_, i) => h(SnAvatar, { text: 'A' + (i + 1) }));
    const wrapper = mount(SnAvatarGroup, { slots: { default: slot } });
    await new Promise((r) => setTimeout(r, 300));
    await nextTick();
    console.log('group instances:', wrapper.findAllComponents({ name: 'SnAvatarGroup' }).length);
    console.log('group roots:', wrapper.findAll('.sn-avatar-group').length);
    console.log('bubbles:', wrapper.findAll('.sn-avatar-group__collapse').length);
    console.log('all bubble texts:', wrapper.findAll('.sn-avatar-group__collapse').map(b => b.text()));
    console.log('collapse v-show display:', wrapper.find('.sn-avatar-group__collapse').isVisible());
    expect(true).toBe(true);
  });
});
