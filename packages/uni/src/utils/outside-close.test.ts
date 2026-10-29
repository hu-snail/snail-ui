import { describe, it, expect, vi } from 'vitest';
import {
  registerOutsideClosable,
  unregisterOutsideClosable,
  closeOutside,
  useQueue,
} from './outside-close';

describe('outside-close queue', () => {
  it('closes every registered overlay once per closeOutside call', () => {
    const a = vi.fn();
    const b = vi.fn();
    registerOutsideClosable(1, a);
    registerOutsideClosable(2, b);
    closeOutside();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
    unregisterOutsideClosable(1);
    unregisterOutsideClosable(2);
  });

  it('re-registering the same id replaces the close (dedup by id)', () => {
    const first = vi.fn();
    const second = vi.fn();
    registerOutsideClosable(7, first);
    registerOutsideClosable(7, second);
    closeOutside();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    unregisterOutsideClosable(7);
  });

  it('unregistered overlays are not closed', () => {
    const a = vi.fn();
    registerOutsideClosable(3, a);
    unregisterOutsideClosable(3);
    closeOutside();
    expect(a).not.toHaveBeenCalled();
  });

  it('exposes closeOutside through the useQueue hook', () => {
    const { closeOutside: dispatch } = useQueue();
    const a = vi.fn();
    registerOutsideClosable(4, a);
    dispatch();
    expect(a).toHaveBeenCalledTimes(1);
    unregisterOutsideClosable(4);
  });
});
