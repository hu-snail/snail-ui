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

/** 头卡底部特性条的一项（参考稿的「翡翠云调色规范 / 触控反馈 / 零运行时」）。 */
export interface DocFeature {
  text: string;
  /** 图标语义：生态 / 交互 / 分层 / 无障碍 / 双端。 */
  icon?: 'eco' | 'touch' | 'layers' | 'a11y' | 'dual';
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
  /** 头卡底部的特性条，省略则不渲染。 */
  features?: DocFeature[];
  usage: {
    hint: DocSeg[];
    fileLabel: string;
    meta: string;
    code: string;
  };
  /** 案例清单 —— 复用 demo-loader 的活体渲染与源码面板。 */
  demos: DocDemoItem[];
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
