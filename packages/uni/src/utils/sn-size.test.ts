import { describe, expect, it } from 'vitest';
import { toRpxSize } from './sn-size';

describe('toRpxSize', () => {
  it('should treat bare numbers as rpx design-canvas values', () => {
    expect(toRpxSize(48)).toBe('48rpx');
    expect(toRpxSize(48.5)).toBe('48.5rpx');
  });

  it('should normalize unitless numeric strings to rpx', () => {
    expect(toRpxSize('48')).toBe('48rpx');
    expect(toRpxSize('48.5')).toBe('48.5rpx');
  });

  it('should pass unit strings through verbatim', () => {
    expect(toRpxSize('32rpx')).toBe('32rpx');
    expect(toRpxSize('1.5em')).toBe('1.5em');
    expect(toRpxSize('28px')).toBe('28px');
  });

  it('should pass non-numeric strings through verbatim', () => {
    expect(toRpxSize('var(--sn-mp-icon-size-medium)')).toBe(
      'var(--sn-mp-icon-size-medium)',
    );
  });
});
