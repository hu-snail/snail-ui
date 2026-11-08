/**
 * sn-keyboard / sn-keyboard-panel — shared key-model + delete-hold logic.
 *
 * Pure data + one timer factory, no Vue dependencies beyond the types, so both
 * the popup keypad (`sn-keyboard`) and the embedded panel (`sn-keyboard-panel`)
 * render the same grids and share the hold-to-repeat contract (§104: one
 * implementation, not two drifting copies).
 *
 * Layout contract (wd-keyboard parity):
 *   - default: 3×4 grid; bottom row = extra key / collapse glyph, `0`, delete.
 *   - custom: same grid, two extra slots; the aside action column lives in the
 *     components, not here.
 *   - car: province/letter plate, 10 keys per row, trailing short row.
 *
 * An unsupplied extra-key slot renders the collapse glyph instead of leaving a
 * hole; what "collapse" does (close the sheet / emit an event) is decided by
 * the consuming component.
 */
import type { CarKeyboardLang, KeyboardKey, KeyboardMode } from './sn-keyboard-types';

export const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

/** Press-feedback class applied through uni `hover-class` (§116.2). */
export const KEY_PRESSED = 'sn-keyboard__key--pressed';

/**
 * Bottom-row slot key when no `extraKey` fills it — the collapse-to-system
 * glyph. Tapping it is handled by the consuming component (close the panel /
 * emit `collapse`); wd-keyboard renders the same key for an empty extra slot.
 */
export const COLLAPSE_KEY: KeyboardKey = { text: '', value: '__collapse__' };

/** Value of the delete key inside a rendered row. */
export const DELETE_VALUE = '__delete__';

/** Deterministic Fisher-Yates — the seed is the render index, not Math.random. */
export function shuffleDigits(items: readonly string[]): string[] {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(((i + 1) * 7919) % (i + 1));
    const a = list[i];
    const b = list[j];
    if (a !== undefined && b !== undefined) {
      list[i] = b;
      list[j] = a;
    }
  }
  return list;
}

/** Digit rows for the default / custom layouts (3 columns). */
export function buildDigitRows(options: {
  mode: KeyboardMode;
  extraKeys: string[];
  showDeleteKey: boolean;
  randomKeyOrder: boolean;
}): KeyboardKey[][] {
  const { mode, extraKeys, showDeleteKey, randomKeyOrder } = options;
  const digits = randomKeyOrder ? shuffleDigits(DIGITS) : [...DIGITS];
  // wd-keyboard contract: one extra-key slot in the default grid, two in the
  // custom layout (which has the wider bottom row beside the action column).
  // Custom mode keeps three slots so the bottom row stays on the 3-column
  // grid — delete lives in the action column there, not under the grid.
  const slotCount = mode === 'custom' ? 2 : 1;
  const slots = Array.from({ length: slotCount }, (_, index) => extraKeys[index] ?? '');
  // Delete lives under the grid in default mode only; custom mode keeps it in
  // the action column.
  const hasDelete = mode !== 'custom' && showDeleteKey;
  const bottom: KeyboardKey[] = slots.map((slot) =>
    slot === '' ? COLLAPSE_KEY : { text: slot, value: slot },
  );
  bottom.push({
    text: '0',
    value: '0',
    // Fill every column the row did not consume — a bare hole is never right.
    span: 3 - bottom.length - (hasDelete ? 1 : 0),
  });
  if (hasDelete) bottom.push({ text: '', value: DELETE_VALUE });
  const rows: KeyboardKey[][] = [];
  for (let i = 0; i < digits.length; i += 3) {
    rows.push(digits.slice(i, i + 3).map((digit) => ({ text: digit, value: digit })));
  }
  rows.push(bottom);
  return rows;
}

/** Car-plate keys per language. */
const CAR_ZH = [
  '京',
  '沪',
  '粤',
  '津',
  '冀',
  '晋',
  '蒙',
  '辽',
  '吉',
  '黑',
  '苏',
  '浙',
  '皖',
  '闽',
  '赣',
  '鲁',
  '豫',
  '鄂',
  '湘',
  '桂',
  '琼',
  '川',
  '贵',
  '云',
  '陕',
  '甘',
  '青',
  '宁',
  '新',
  '渝',
  '藏',
  '使',
  '领',
  '警',
  '学',
  '港',
  '澳',
];
const CAR_EN = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

/** Keys per car-plate row — the 37 province keys fill 10 / 10 / 10 / 7. */
const CAR_COLUMNS = 10;

/** Car keys chunked into rows of `CAR_COLUMNS` (10 / 10 / 10 / 7 for zh). */
export function buildCarRows(lang: CarKeyboardLang): string[][] {
  const keys = lang === 'zh' ? CAR_ZH : CAR_EN;
  const rows: string[][] = [];
  for (let i = 0; i < keys.length; i += CAR_COLUMNS) {
    rows.push(keys.slice(i, i + CAR_COLUMNS));
  }
  return rows;
}

/* ── Delete key: hold to repeat ────────────────────────────────────────── */

export const REPEAT_DELAY = 420;
export const REPEAT_INTERVAL = 70;

export interface DeleteHold {
  /** Begin tracking a press; after `REPEAT_DELAY` it repeats every `REPEAT_INTERVAL`. */
  start(): void;
  /** Press released (or cancelled) — stop the repeat loop. */
  end(): void;
  /**
   * True when a completed hold already deleted — the trailing `tap` must be
   * skipped (touchend fires before tap and would eat one extra character).
   */
  consumeTap(): boolean;
  /** Drop both timers (on close, on invisible, on unmount — §41). */
  clear(): void;
}

/** Hold-to-repeat delete state shared by the popup keypad and the panel. */
export function createDeleteHold(canDelete: () => boolean, onDelete: () => void): DeleteHold {
  let delayTimer: ReturnType<typeof setTimeout> | null = null;
  let tickTimer: ReturnType<typeof setInterval> | null = null;
  let consumed = false;

  function clear(): void {
    if (delayTimer !== null) {
      clearTimeout(delayTimer);
      delayTimer = null;
    }
    if (tickTimer !== null) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  }

  return {
    start() {
      clear();
      consumed = false;
      delayTimer = setTimeout(() => {
        delayTimer = null;
        tickTimer = setInterval(() => {
          if (!canDelete()) {
            clear();
            return;
          }
          consumed = true;
          onDelete();
        }, REPEAT_INTERVAL);
      }, REPEAT_DELAY);
    },
    end: clear,
    consumeTap() {
      const skip = consumed;
      consumed = false;
      return skip;
    },
    clear,
  };
}
