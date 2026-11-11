/**
 * Shared types for SnTree — internal to `src/tree/`.
 *
 * Mirrors naive-ui `n-tree`'s data contract (TreeOption key / label /
 * children / disabled / isLeaf / prefix / suffix) plus the render-prop
 * signatures (`render-prefix` / `render-suffix` receive
 * `{ option, checked, selected }`), and the `on-update:*` event payload
 * shapes (keys + options + `{ node, action }` meta).
 *
 * Kept in a plain `.ts` module (same convention as sn-select-types.ts /
 * sn-checkbox-types.ts) so no shared wiring (install.ts / index.ts /
 * resolver.ts) is touched.
 */

import type { Component, VNodeChild } from 'vue';

/** Node identifier — mirrors naive-ui Tree `Key`. */
export type SnTreeKey = string | number;

/**
 * Row-density preset (AUI additive — n-tree has no size prop).
 *
 * Uses the same five-step scale as SnSelect / SnTreeSelect so a tree can sit
 * inside a dense toolbar without hand-tuning CSS: the preset drives font-size
 * and the row height together (`medium` is the n-tree baseline: 14px / 24px,
 * so the default rendering is unchanged). Indentation stays controlled by the
 * independent `indent` prop.
 */
export type SnTreeSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large';

/** Connector-line stroke style (AUI additive — `showLine` is the reference prop). */
export type SnTreeLineStyle = 'solid' | 'dashed';

/**
 * Connector-line geometry (AUI additive):
 * `'branch'` = L-shaped parent→child connectors (default);
 * `'guide'` = indent-guide style — a full-height vertical at every ancestor
 * level and no horizontal segment. `lineStyle` / `lineColor` still apply;
 * `lineCorner` only affects `'branch'`.
 */
export type SnTreeLineMode = 'branch' | 'guide';

/**
 * Connector-line elbow shape (AUI additive):
 * `'square'` = right-angle L (default), `'rounded'` = compact quarter-arc elbow.
 * The corner radius (both axes) is tunable with `--sn-web-tree-line-radius`
 * (3px by default).
 */
export type SnTreeLineCorner = 'square' | 'rounded';

/**
 * Per-node icon (AUI additive, data-level):
 * a registered SnIcon name / plain text, a VNode (or array), an icon
 * component, or a zero-arg render fn.
 */
export type SnTreeIcon = VNodeChild | Component | (() => VNodeChild);

/**
 * Field override names (`key-field` / `label-field` / `children-field`
 * remap these defaults).
 */
export interface SnTreeFieldNames {
  keyField: string;
  labelField: string;
  childrenField: string;
}

/**
 * Raw entry accepted by the `data` prop. Mirrors naive-ui `TreeOption`:
 * known fields plus arbitrary extra data preserved on the node
 * (accessible in render fns via `option`).
 */
export interface SnTreeOptionBase {
  /** Node key — must be unique (auto-generated when missing). */
  key?: SnTreeKey;
  /** Node label text. */
  label?: string;
  /** Child nodes (empty/absent = leaf unless `isLeaf` says otherwise). */
  children?: SnTreeOption[];
  /** Disabled — no selection, no check, no expand via click. */
  disabled?: boolean;
  /** Force leaf rendering (no switcher) even with `children`. */
  isLeaf?: boolean;
  /** Per-node leading icon — name / text / VNode / component / render fn. */
  icon?: SnTreeIcon;
  /** Per-node prefix — text or render fn. */
  prefix?: string | (() => VNodeChild);
  /** Per-node suffix — text or render fn. */
  suffix?: string | (() => VNodeChild);
  /** Disable only the node's checkbox (selection still allowed). */
  checkboxDisabled?: boolean;
}

export type SnTreeOption = SnTreeOptionBase & Record<string, unknown>;

/** Info bag passed to tree-level render fns — mirrors naive-ui. */
export interface SnTreeRenderProps {
  option: SnTreeOption;
  checked: boolean;
  selected: boolean;
}

/** `render-prefix` / `render-suffix` signature — mirrors naive-ui. */
export type SnTreeRenderSidePart = (info: SnTreeRenderProps) => VNodeChild;

/** `meta.action` for `update:expandedKeys`. */
export type SnTreeExpandAction = 'expand' | 'collapse' | 'filter';

/** `meta.action` for `update:selectedKeys`. */
export type SnTreeSelectAction = 'select' | 'unselect';

/** `meta.action` for `update:checkedKeys`. */
export type SnTreeCheckAction = 'check' | 'uncheck';

/** Payload meta for the three `update:*` events — mirrors naive-ui. */
export interface SnTreeEventMeta<Action extends string> {
  node: SnTreeOption | null;
  action: Action;
}

/** Where a dragged node lands relative to the hovered row — mirrors naive-ui. */
export type SnTreeDropPosition = 'before' | 'inside' | 'after';

/** Info bag passed to the `allowDrop` callback — mirrors naive-ui. */
export interface SnTreeAllowDropInfo {
  node: SnTreeOption;
  dropPosition: SnTreeDropPosition;
  phase: 'drag' | 'drop';
}

/** Gate for drag & drop: return `false` to reject a hovered position. */
export type SnTreeAllowDrop = (info: SnTreeAllowDropInfo) => boolean;

/** Payload for `dragStart` / `dragEnter` / `dragLeave` / `dragEnd`. */
export interface SnTreeDragInfo {
  node: SnTreeOption;
  event: DragEvent;
}

/** Payload for the `drop` event — mirrors naive-ui's `on-drop`. */
export interface SnTreeDropInfo {
  node: SnTreeOption;
  dragNode: SnTreeOption;
  dropPosition: SnTreeDropPosition;
  event: DragEvent;
}

/**
 * Normalized internal node (one entry per node in `data`, visible or not).
 * Auto-generated keys use a `__sn_auto__` prefix so they can never collide
 * with user-provided string keys.
 */
export interface SnTreeNode {
  key: SnTreeKey;
  option: SnTreeOption;
  label: string;
  /** 0-based depth (roots are level 0). */
  level: number;
  parentKey: SnTreeKey | null;
  /** Direct children keys (data order). */
  childKeys: SnTreeKey[];
  /** Whether the node renders a switcher (non-leaf). */
  isLeaf: boolean;
  disabled: boolean;
  checkboxDisabled: boolean;
}

/** Internal flat map produced from `data` on each change. */
export interface SnTreeNormalizedData {
  /** All nodes by key (insertion order of a depth-first walk). */
  nodeMap: Map<SnTreeKey, SnTreeNode>;
  /** Root-level keys (data order). */
  rootKeys: SnTreeKey[];
  /** All descendants per node key (precomputed, depth-first order). */
  descendants: Map<SnTreeKey, SnTreeKey[]>;
}
