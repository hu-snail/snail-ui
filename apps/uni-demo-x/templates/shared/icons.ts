/**
 * Built-in template icons — framework-neutral SVG path data.
 *
 * Why path data instead of Vue components: this module is shared by BOTH ends.
 * The web `SnIcon` consumes a Vue component (`IconComponent`), while the uni
 * `sn-icon` consumes plain `{ viewBox, paths }` data. Holding the paths as data
 * here keeps the shared layer free of any web-only import — a uni consumer
 * never pulls `@snui/vue-web` into its bundle just to draw a paperclip — and
 * `toIconComponent` (web side) adapts the same source for `<SnIcon :icon>`.
 *
 * Per AGENTS.md §113: emoji-as-UI-icon is forbidden. Every glyph the templates
 * render ships here as stroked 24×24 path data, so it inherits `currentColor`
 * and the token-driven stroke width.
 */

/** Lucide-compatible icon data: a viewBox plus one or more `<path d>` strings. */
export interface SnIconData {
  viewBox: string;
  paths: string[];
}

/** Build a frozen icon-data object on the standard 24×24 grid. */
function d(paths: string[], viewBox = '0 0 24 24'): SnIconData {
  return Object.freeze({ viewBox, paths });
}

/* ── Prompt toolbar ─────────────────────────────────────────────────────── */

/** Paperclip — the attachment button. */
export const PaperclipIcon = d([
  'm21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48',
]);

/** Arrow-up — the send button. */
export const SendIcon = d(['m5 12 7-7 7 7', 'M12 19V5']);

/** Filled square — the stop button shown while a turn is active. */
export const StopIcon = d(['M6 6h12v12H6z']);

/** Sparkle — the agent selector trigger. */
export const AgentIcon = d([
  'M12 3v3',
  'M12 18v3',
  'M3 12h3',
  'M18 12h3',
  'M12 8.5 13.2 11l2.3 1-2.3 1L12 15.5 10.8 13l-2.3-1 2.3-1z',
]);

/** Shield — the permission selector trigger. */
export const ShieldIcon = d(['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4']);

/** Chip — the model selector trigger. */
export const ModelIcon = d([
  'M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2',
  'M7 7h10v10H7z',
]);

/** Brain — the thinking-budget slider. */
export const ThinkingIcon = d([
  'M12 5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3 3 0 0 0 9.5 18H12z',
  'M12 5a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2A3 3 0 0 1 14.5 18H12z',
  'M12 5v13',
]);

/** Chevron-down — menu disclosure affordance. */
export const ChevronDownIcon = d(['m6 9 6 6 6-6']);

/** Chevron-right — collapsed reasoning disclosure. */
export const ChevronRightIcon = d(['m9 18 6-6-6-6']);

/* ── Message module ─────────────────────────────────────────────────────── */

/** Clock — the "thinking for 12 秒" duration line. */
export const ClockIcon = d(['M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z', 'M12 7v5l3 2']);

/** Warning triangle — the error card. */
export const WarningIcon = d([
  'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  'M12 9v4M12 17h.01',
]);

/** Refresh — the retry affordance. */
export const RetryIcon = d(['M21 12a9 9 0 1 1-3-6.7', 'M21 3v5h-5']);

/** Copy — the copy-message affordance. */
export const CopyIcon = d(['M8 8h11v11H8z', 'M5 16V5h11']);

/** Check — the copied confirmation. */
export const CheckIcon = d(['m5 13 4 4 10-10']);

/** File — a generic attachment chip glyph. */
export const FileIcon = d([
  'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z',
  'M14 3v5h5',
]);

/** Image — the image-attachment chip glyph. */
export const ImageIcon = d(['M4 4h16v16H4z', 'm4 16 4.5-4.5 3.5 3.5 3-3L20 16', 'M15 9h.01']);

/** Trash — the remove-attachment affordance. */
export const TrashIcon = d(['M4 7h16', 'M9 7V5h6v2', 'M6 7l1 13h10l1-13']);

/** X — close / clear affordances. */
export const CloseIcon = d(['M6 6l12 12M18 6 6 18']);

/** Wrench — the tool-call row. */
export const ToolIcon = d(['M15.5 4.5a4 4 0 0 1 5 5L9 21H4v-5z', 'm13 7 4 4']);

/** User — the user-turn avatar fallback. */
export const UserIcon = d(['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21a8 8 0 0 1 16 0']);

/* ── Model config page ──────────────────────────────────────────────────── */

/** Server — a vendor / endpoint card glyph. */
export const ServerIcon = d(['M4 4h16v6H4zM4 14h16v6H4z', 'M8 7h.01M8 17h.01']);

/** Plus — add a vendor / model. */
export const PlusIcon = d(['M12 5v14M5 12h14']);

/** Key — the credential field. */
export const KeyIcon = d([
  'M15.5 3a5.5 5.5 0 1 0-4.4 8.8L4 19v2h4v-2h2v-2h2l1.6-1.6A5.5 5.5 0 0 0 15.5 3z',
  'M17 7h.01',
]);

/** Sliders — the parameters section. */
export const ParamsIcon = d([
  'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0',
  'M14 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM8 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM16 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0z',
]);
