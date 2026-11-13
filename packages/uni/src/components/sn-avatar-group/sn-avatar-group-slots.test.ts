import { describe, expect, it } from 'vitest';
import { resolveSlotNodes } from './sn-avatar-group-slots';

/**
 * WeChat MP (uni-mp-vue) hands slot content over as an array of vnodes
 * instead of a render function. Calling it like a function lands on
 * `undefined.call` and takes the whole group render down — regression
 * for `_a.call is not a function` in the MP build.
 */
describe('sn-avatar-group slots', () => {
  it('calls the slot when the runtime provides a render function', () => {
    const vnode = { type: 'sn-avatar' };
    expect(resolveSlotNodes(() => [vnode])).toEqual([vnode]);
  });

  it('returns the pre-rendered array when the runtime provides one (MP)', () => {
    const vnodes = [{ type: 'sn-avatar' }, { type: 'sn-avatar' }];
    expect(resolveSlotNodes(vnodes)).toEqual(vnodes);
  });

  it('returns an empty array for a missing slot', () => {
    expect(resolveSlotNodes(undefined)).toEqual([]);
    expect(resolveSlotNodes(null)).toEqual([]);
  });

  it('returns an empty array when the slot function yields nothing', () => {
    expect(resolveSlotNodes(() => undefined)).toEqual([]);
    expect(resolveSlotNodes(() => null)).toEqual([]);
  });
});
