import { describe, it, expect } from 'vitest';
import { isEditableTarget, resolveVideoShortcut } from './video-shortcuts';

const key = (k: string, mods: Partial<{ ctrl: boolean; meta: boolean; alt: boolean }> = {}) => ({
  key: k,
  ctrlKey: mods.ctrl === true,
  metaKey: mods.meta === true,
  altKey: mods.alt === true,
});

describe('resolveVideoShortcut', () => {
  it('maps space and K to toggle', () => {
    expect(resolveVideoShortcut(key(' '))).toBe('toggle');
    expect(resolveVideoShortcut(key('k'))).toBe('toggle');
    expect(resolveVideoShortcut(key('K'))).toBe('toggle');
  });

  it('maps arrow keys to seek and volume', () => {
    expect(resolveVideoShortcut(key('ArrowRight'))).toBe('seek-forward');
    expect(resolveVideoShortcut(key('ArrowLeft'))).toBe('seek-back');
    expect(resolveVideoShortcut(key('ArrowUp'))).toBe('volume-up');
    expect(resolveVideoShortcut(key('ArrowDown'))).toBe('volume-down');
  });

  it('maps M / F / D feature toggles', () => {
    expect(resolveVideoShortcut(key('m'))).toBe('toggle-mute');
    expect(resolveVideoShortcut(key('f'))).toBe('toggle-fullscreen');
    expect(resolveVideoShortcut(key('d'))).toBe('toggle-danmu');
  });

  it('maps P to pip only when the platform supports it', () => {
    expect(resolveVideoShortcut(key('p'), { pipAvailable: true })).toBe('toggle-pip');
    expect(resolveVideoShortcut(key('p'))).toBeNull();
    expect(resolveVideoShortcut(key('p'), { pipAvailable: false })).toBeNull();
  });

  it('declines every shortcut under Ctrl / Meta / Alt', () => {
    expect(resolveVideoShortcut(key(' ', { ctrl: true }))).toBeNull();
    expect(resolveVideoShortcut(key(' ', { meta: true }))).toBeNull();
    expect(resolveVideoShortcut(key(' ', { alt: true }))).toBeNull();
    expect(resolveVideoShortcut(key('f', { meta: true }))).toBeNull();
  });

  it('returns null for unrelated keys', () => {
    expect(resolveVideoShortcut(key('a'))).toBeNull();
    expect(resolveVideoShortcut(key('Enter'))).toBeNull();
  });
});

describe('isEditableTarget', () => {
  it('treats inputs, textareas and contenteditable as editable', () => {
    const input = document.createElement('input');
    const textarea = document.createElement('textarea');
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    const div = document.createElement('div');
    expect(isEditableTarget(input)).toBe(true);
    expect(isEditableTarget(textarea)).toBe(true);
    expect(isEditableTarget(editable)).toBe(true);
    expect(isEditableTarget(div)).toBe(false);
    expect(isEditableTarget(null)).toBe(false);
  });
});
