/**
 * SnDocPage — 组件详情页数据契约。
 *
 * 参考高保真原型（按钮详情页）的版式还原：头部（面包屑 / 徽章 / 描述 /
 * 快捷操作）→ 交互 Playground → 安装 → 代码用法 → 样式变体卡 → Token
 * 映射表 → Props 表 → AI 原生集成 → 上下页。配色不走原型自带的主题色，
 * 全部回落到站点 / UI 库变量（--vp-c-* / --sn-web-* / --sn-button-*），
 * 自动跟随暗色与 Style Pack。
 *
 * 数据必须来自组件的真实契约（SnButton.vue / @snui/tokens），不得虚构 API。
 */

export interface DocCrumb {
  text: string;
  link?: string;
}

export type DocBadgeTone = 'ok' | 'accent' | 'warn' | 'plain';

export interface DocBadge {
  label: string;
  tone: DocBadgeTone;
  icon?: 'stable' | 'dual' | 'ai';
}

/** 行内富文本片段：普通文本或行内 code。避免 v-html 注入面。 */
export type DocSeg = { t: 'text'; s: string } | { t: 'code'; s: string };

export type DocQuickIcon = 'copy' | 'link' | 'palette';

export interface DocQuickAction {
  icon: DocQuickIcon;
  label: string;
  /** 提供后点击复制该文本，并把按钮标签短暂切到 copiedLabel。 */
  copy?: string;
  copiedLabel?: string;
  href?: string;
}

export type DemoType =
  'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' | 'tertiary';

/** 变体卡内的真实 SnButton 演示描述（可序列化，不携带 VNode）。 */
export interface DocButtonDemo {
  label: string;
  type?: DemoType;
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge';
  text?: boolean;
  ghost?: boolean;
  dashed?: boolean;
  strong?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  quaternary?: boolean;
  round?: boolean;
  circle?: boolean;
}

export interface DocVariantCard {
  title: string;
  tag: string;
  tagTone: 'plain' | 'accent' | 'ai';
  copy: string;
  demos: DocButtonDemo[];
}

export interface DocTokenRow {
  /** Token 语义名（kebab）。 */
  name: string;
  /** @snui/tokens 原始级联变量（--aui-button-*）。 */
  raw: string;
  /** 品牌别名（--sn-button-*）。 */
  alias: string;
  /** 浅色基准默认值。 */
  value: string;
  /** 预览色块颜色（仅 color 类 token 提供）。 */
  swatch?: string;
  kind?: 'color' | 'blur' | 'curve';
}

/** A live playground control, bound to one prop of the previewed component. */
export interface DocPlaygroundControl {
  /** Prop name on the component (`modelValue` is the bound value). */
  prop: string;
  label: string;
  kind: 'range' | 'select' | 'switch' | 'text';
  /** range */
  min?: number;
  max?: number;
  step?: number;
  /** Initial value (also the reset target). */
  value: unknown;
  /** select */
  options?: Array<{ label: string; value: string | number }>;
  /** Short hint rendered under the label. */
  hint?: string;
}

export interface DocPropRow {
  name: string;
  type: string;
  default: string;
  desc: string;
}

export interface DocAiStat {
  key: string;
  value: string;
  tone: 'accent' | 'cyan' | 'ok';
}

export interface DocTocItem {
  id: string;
  text: string;
}

export interface DocPagerItem {
  text: string;
  link: string;
}

export interface SnDocPageData {
  crumbs: DocCrumb[];
  title: string;
  badges: DocBadge[];
  description: DocSeg[];
  quickActions: DocQuickAction[];
  playground: {
    fileLabel: string;
    stageLabel: string;
    /**
     * Component rendered live in the playground stage instead of the built-in
     * SnButton controls. Non-button components use this so the stage shows
     * their real API while the page keeps the same layout.
     */
    component?: string;
    /** Props passed to `component` on top of the playground bindings. */
    props?: Record<string, unknown>;
    /** Live controls — each one drives one prop of `component`. */
    controls?: DocPlaygroundControl[];
  };
  usage: {
    hint: DocSeg[];
    fileLabel: string;
    meta: string;
    code: string;
  };
  /** Style-variant cards — omit for components without a button-style matrix. */
  variants?: {
    hint: DocSeg[];
    cards: DocVariantCard[];
  };
  tokens: {
    hint: DocSeg[];
    note: string;
    rows: DocTokenRow[];
  };
  props: {
    hint: DocSeg[];
    rows: DocPropRow[];
  };
  ai: {
    badge: string;
    heading: string;
    copy: string;
    chip: string;
    chipCopy: string;
    stats: DocAiStat[];
  };
  pager: {
    prev?: DocPagerItem;
    next?: DocPagerItem;
  };
  toc: DocTocItem[];
}
/** demo 瀑布流条目 —— 复用 demo-loader 的活体渲染与源码。 */
export interface DocDemoItem {
  /** demo 文件名（demo/ 下，不含 .vue）。 */
  name: string;
  /** 卡片标题。 */
  title: string;
  /** 一句话说明。 */
  blurb: string;
}

export interface SnDocPageData {
  crumbs: DocCrumb[];
  title: string;
  badges: DocBadge[];
  description: DocSeg[];
  quickActions: DocQuickAction[];
  playground: {
    fileLabel: string;
    stageLabel: string;
    /**
     * Component rendered live in the playground stage instead of the built-in
     * SnButton controls. Non-button components use this so the stage shows
     * their real API while the page keeps the same layout.
     */
    component?: string;
    /** Props passed to `component` on top of the playground bindings. */
    props?: Record<string, unknown>;
    /** Live controls — each one drives one prop of `component`. */
    controls?: DocPlaygroundControl[];
  };
  usage: {
    hint: DocSeg[];
    fileLabel: string;
    meta: string;
    code: string;
  };
  /** Style-variant cards — omit for components without a button-style matrix. */
  variants?: {
    hint: DocSeg[];
    cards: DocVariantCard[];
  };
  /** 组件 demo 案例瀑布流（en 文档案例清单，活体渲染 + 预览/源码切换）。 */
  demos: DocDemoItem[];
  tokens: {
    hint: DocSeg[];
    note: string;
    rows: DocTokenRow[];
  };
  props: {
    hint: DocSeg[];
    rows: DocPropRow[];
  };
  ai: {
    badge: string;
    heading: string;
    copy: string;
    chip: string;
    chipCopy: string;
    stats: DocAiStat[];
  };
  pager: {
    prev?: DocPagerItem;
    next?: DocPagerItem;
  };
  toc: DocTocItem[];
}
