/**
 * Capsule metrics — behavior tests (AUI-MP-002).
 *
 * The helper turns WeChat's capsule geometry into the two numbers a custom
 * navigation page needs: the status-bar inset and the capsule-safe right
 * padding. Non-WeChat hosts and malformed rects must degrade to the H5 rhythm
 * (no inset, 44px row) rather than throwing.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { getCapsuleMetrics, resetCapsuleMetrics } from './capsule';

afterEach(() => {
  delete (globalThis as { uni?: unknown }).uni;
  resetCapsuleMetrics();
});

describe('getCapsuleMetrics', () => {
  it('should keep the H5 rhythm when the platform exposes no system info', () => {
    expect(getCapsuleMetrics()).toEqual({
      statusBarHeight: 0,
      navBarHeight: 44,
      capsulePadRight: 0,
      hasCapsule: false,
    });
  });

  it('should derive the nav band and right padding from the capsule rect', () => {
    (globalThis as { uni?: unknown }).uni = {
      getSystemInfoSync: () => ({ statusBarHeight: 47, windowWidth: 390 }),
      getMenuButtonBoundingClientRect: () => ({ width: 87, height: 32, top: 53, left: 289 }),
    };

    expect(getCapsuleMetrics()).toEqual({
      statusBarHeight: 47,
      navBarHeight: 44,
      capsulePadRight: 109,
      hasCapsule: true,
    });
  });

  it('should grow the nav band when the capsule sits lower than the 44px rhythm', () => {
    (globalThis as { uni?: unknown }).uni = {
      getSystemInfoSync: () => ({ statusBarHeight: 40, windowWidth: 375 }),
      getMenuButtonBoundingClientRect: () => ({ width: 87, height: 32, top: 50, left: 278 }),
    };

    const metrics = getCapsuleMetrics();
    expect(metrics.navBarHeight).toBe(52); // gap 10 → 10 * 2 + 32
    expect(metrics.capsulePadRight).toBe(105);
  });

  it('should ignore a malformed capsule rect instead of reserving space', () => {
    (globalThis as { uni?: unknown }).uni = {
      getSystemInfoSync: () => ({ statusBarHeight: 44, windowWidth: 375 }),
      getMenuButtonBoundingClientRect: () => ({ width: 0, height: 0, top: 44, left: 375 }),
    };

    const metrics = getCapsuleMetrics();
    expect(metrics.hasCapsule).toBe(false);
    expect(metrics.capsulePadRight).toBe(0);
    expect(metrics.statusBarHeight).toBe(44);
  });

  it('should memoize the launch-stable measurement', () => {
    (globalThis as { uni?: unknown }).uni = {
      getSystemInfoSync: () => ({ statusBarHeight: 30, windowWidth: 360 }),
      getMenuButtonBoundingClientRect: () => null,
    };

    expect(getCapsuleMetrics()).toBe(getCapsuleMetrics());
  });
});
