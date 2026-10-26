import { describe, it, expect, vi } from 'vitest';
import { createNoopAppBridge, listCapabilities, type AppBridge } from './app-bridge.js';

describe('@snui/runtime — AppBridge', () => {
  it('listCapabilities returns all five when bridge has all five', () => {
    expect(listCapabilities(createNoopAppBridge())).toEqual([
      'router', 'storage', 'notify', 'analytics', 'event',
    ]);
  });

  it('listCapabilities returns only the present ones', () => {
    const partial: AppBridge = { router: createNoopAppBridge().router };
    expect(listCapabilities(partial)).toEqual(['router']);
  });

  it('listCapabilities returns [] for empty bridge', () => {
    expect(listCapabilities({})).toEqual([]);
  });

  it('createNoopAppBridge.router.push resolves without error', async () => {
    const bridge = createNoopAppBridge();
    await expect(bridge.router!.push('/home', { id: '1' })).resolves.toBeUndefined();
  });

  it('createNoopAppBridge.router.current returns a stable default', () => {
    const bridge = createNoopAppBridge();
    expect(bridge.router!.current()).toEqual({ path: '/', query: {} });
  });

  it('createNoopAppBridge.storage roundtrips null', async () => {
    const bridge = createNoopAppBridge();
    expect(await bridge.storage!.get('key')).toBeNull();
    await expect(bridge.storage!.set('k', 'v')).resolves.toBeUndefined();
    await expect(bridge.storage!.remove('k')).resolves.toBeUndefined();
    await expect(bridge.storage!.clear()).resolves.toBeUndefined();
  });

  it('createNoopAppBridge.notify.toast does nothing observable', () => {
    const bridge = createNoopAppBridge();
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    bridge.notify!.toast('hello', { level: 'info' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('createNoopAppBridge.notify.dialog returns false', async () => {
    const bridge = createNoopAppBridge();
    await expect(bridge.notify!.dialog({ message: 'ok?' })).resolves.toBe(false);
  });

  it('createNoopAppBridge.event.on returns an unsubscribe that does nothing', () => {
    const bridge = createNoopAppBridge();
    const fn = vi.fn();
    const unsub = bridge.event!.on('foo', fn);
    expect(typeof unsub).toBe('function');
    unsub();
    bridge.event!.emit('foo', { x: 1 });
    expect(fn).not.toHaveBeenCalled();
  });

  it('createNoopAppBridge.analytics methods are callable without side effects', () => {
    const bridge = createNoopAppBridge();
    expect(() => bridge.analytics!.track('ev')).not.toThrow();
    expect(() => bridge.analytics!.identify('u1')).not.toThrow();
  });
});