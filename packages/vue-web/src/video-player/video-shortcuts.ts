/**
 * SnVideoPlayer — keyboard shortcut resolution (pure module, unit-tested).
 *
 * Benchmark: mainstream video players (B 站 / YouTube / 西瓜) share the same
 * shortcut grammar — Space/K play-pause, ←/→ seek, ↑/↓ volume, M mute,
 * F fullscreen, P PiP, D danmaku. Combinations with Ctrl/Meta/Alt are
 * always declined so browser and OS shortcuts stay intact.
 */

export type SnVideoShortcutAction =
  | 'toggle'
  | 'seek-forward'
  | 'seek-back'
  | 'volume-up'
  | 'volume-down'
  | 'toggle-mute'
  | 'toggle-fullscreen'
  | 'toggle-pip'
  | 'toggle-danmu';

/** Minimal key-event surface the resolver needs (keeps it DOM-free). */
export interface SnVideoShortcutKey {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export interface SnVideoShortcutOptions {
  /** PiP is only resolved when the browser supports it. */
  pipAvailable?: boolean;
}

/** Keys that must keep their native behaviour inside form controls. */
const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  if (EDITABLE_TAGS.has(el.tagName)) return true;
  // Attribute check (not `isContentEditable`) — happy-dom and other test
  // DOMs do not compute the property, the attribute is universally readable.
  const editableAttr = el.getAttribute?.('contenteditable');
  return editableAttr === '' || editableAttr === 'true' || editableAttr === 'plaintext-only';
}

export function resolveVideoShortcut(
  key: SnVideoShortcutKey,
  options: SnVideoShortcutOptions = {},
): SnVideoShortcutAction | null {
  if (key.ctrlKey || key.metaKey || key.altKey) return null;
  switch (key.key) {
    case ' ':
    case 'k':
    case 'K':
      return 'toggle';
    case 'ArrowRight':
      return 'seek-forward';
    case 'ArrowLeft':
      return 'seek-back';
    case 'ArrowUp':
      return 'volume-up';
    case 'ArrowDown':
      return 'volume-down';
    case 'm':
    case 'M':
      return 'toggle-mute';
    case 'f':
    case 'F':
      return 'toggle-fullscreen';
    case 'p':
    case 'P':
      return options.pipAvailable ? 'toggle-pip' : null;
    case 'd':
    case 'D':
      return 'toggle-danmu';
    default:
      return null;
  }
}
