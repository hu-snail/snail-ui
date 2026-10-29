/**
 * sn-icon 内置图标目录 — 111 个常用图标 × 7 个分类。
 *
 * 数据来源：lucide v0.460.0（ISC License，https://lucide.dev），由一次性
 * 提取脚本从 lucide-vue-next dist 转换生成后提交为静态资产。所有元素形状
 * （circle / rect / line / polyline / polygon）已折算为纯 path d 字符串，
 * 运行时渲染只需 <path>，跨端（H5 / MP / App）安全。stroke 样式在渲染层
 * 统一施加（currentColor / stroke-width / round caps），与 lucide 默认
 * 渲染一致。
 *
 * 用法：
 *   <SnIcon icon="arrow-down" />          // 目录查找（string icon API）
 *   searchSnIconCatalog('箭头')           // 搜索（name / zh / keywords）
 *   SN_ICON_CATEGORIES                    // 分类元数据（showcase 分区）
 *
 * 扩展：优先用 `registerSnIcons()` 注册自定义 IconData（同名可覆盖目录）。
 */
import type { IconData } from './sn-icon.vue';

/** 内置目录分类 key。 */
export type SnIconCategory = keyof typeof SN_ICON_CATEGORY_LABELS;

/** 分类元数据：key → 中英文标题（showcase 分区标题 / 筛选 chips 用）。 */
export const SN_ICON_CATEGORY_LABELS = {
  direction: { zh: '方向类图标', en: 'Direction' },
  operation: { zh: '操作类图标', en: 'Operation' },
  alert: { zh: '提示类图标', en: 'Alert' },
  edit: { zh: '编辑类图标', en: 'Edit' },
  general: { zh: '界面类图标', en: 'General' },
  file: { zh: '文件类图标', en: 'File' },
  chart: { zh: '数据类图标', en: 'Chart' },
} as const;

/** 单个目录条目。 */
export interface SnIconCatalogEntry {
  /** 目录名（kebab-case，与 lucide 同名）。 */
  name: string;
  /** 所属分类。 */
  category: SnIconCategory;
  /** 中文名（搜索 + showcase 展示）。 */
  zh: string;
  /** 搜索关键词（同义词，逗号分隔存储）。 */
  keywords: string[];
  /** SVG 渲染数据（纯 path d）。 */
  data: IconData;
}

/** 方向类图标（Direction）。 */
export const arrowDown: SnIconCatalogEntry = {
  name: 'arrow-down',
  category: 'direction',
  zh: '向下箭头',
  keywords: '下箭头,向下'.split(','),
  data: {
    paths: [
    'M12 5v14',
    'm19 12-7 7-7-7',
    ],
  },
};

export const arrowUp: SnIconCatalogEntry = {
  name: 'arrow-up',
  category: 'direction',
  zh: '向上箭头',
  keywords: '上箭头,向上'.split(','),
  data: {
    paths: [
    'm5 12 7-7 7 7',
    'M12 19V5',
    ],
  },
};

export const arrowLeft: SnIconCatalogEntry = {
  name: 'arrow-left',
  category: 'direction',
  zh: '向左箭头',
  keywords: '左箭头,向左,返回'.split(','),
  data: {
    paths: [
    'm12 19-7-7 7-7',
    'M19 12H5',
    ],
  },
};

export const arrowRight: SnIconCatalogEntry = {
  name: 'arrow-right',
  category: 'direction',
  zh: '向右箭头',
  keywords: '右箭头,向右,前进'.split(','),
  data: {
    paths: [
    'M5 12h14',
    'm12 5 7 7-7 7',
    ],
  },
};

export const arrowUpRight: SnIconCatalogEntry = {
  name: 'arrow-up-right',
  category: 'direction',
  zh: '右上箭头',
  keywords: '跳转,外链,右上'.split(','),
  data: {
    paths: [
    'M7 7h10v10',
    'M7 17 17 7',
    ],
  },
};

export const arrowDownRight: SnIconCatalogEntry = {
  name: 'arrow-down-right',
  category: 'direction',
  zh: '右下箭头',
  keywords: '右下'.split(','),
  data: {
    paths: [
    'm7 7 10 10',
    'M17 7v10H7',
    ],
  },
};

export const arrowUpLeft: SnIconCatalogEntry = {
  name: 'arrow-up-left',
  category: 'direction',
  zh: '左上箭头',
  keywords: '左上'.split(','),
  data: {
    paths: [
    'M7 17V7h10',
    'M17 17 7 7',
    ],
  },
};

export const arrowDownLeft: SnIconCatalogEntry = {
  name: 'arrow-down-left',
  category: 'direction',
  zh: '左下箭头',
  keywords: '左下'.split(','),
  data: {
    paths: [
    'M17 7 7 17',
    'M17 17H7V7',
    ],
  },
};

export const chevronDown: SnIconCatalogEntry = {
  name: 'chevron-down',
  category: 'direction',
  zh: '下展开箭头',
  keywords: '展开,下拉,下箭头'.split(','),
  data: {
    paths: [
    'm6 9 6 6 6-6',
    ],
  },
};

export const chevronUp: SnIconCatalogEntry = {
  name: 'chevron-up',
  category: 'direction',
  zh: '上收起箭头',
  keywords: '收起,上箭头'.split(','),
  data: {
    paths: [
    'm18 15-6-6-6 6',
    ],
  },
};

export const chevronLeft: SnIconCatalogEntry = {
  name: 'chevron-left',
  category: 'direction',
  zh: '左展开箭头',
  keywords: '返回,左箭头'.split(','),
  data: {
    paths: [
    'm15 18-6-6 6-6',
    ],
  },
};

export const chevronRight: SnIconCatalogEntry = {
  name: 'chevron-right',
  category: 'direction',
  zh: '右展开箭头',
  keywords: '进入,右箭头'.split(','),
  data: {
    paths: [
    'm9 18 6-6-6-6',
    ],
  },
};

export const chevronsDown: SnIconCatalogEntry = {
  name: 'chevrons-down',
  category: 'direction',
  zh: '双下箭头',
  keywords: '双下,底部'.split(','),
  data: {
    paths: [
    'm7 6 5 5 5-5',
    'm7 13 5 5 5-5',
    ],
  },
};

export const chevronsUp: SnIconCatalogEntry = {
  name: 'chevrons-up',
  category: 'direction',
  zh: '双上箭头',
  keywords: '双上,顶部,回顶部'.split(','),
  data: {
    paths: [
    'm17 11-5-5-5 5',
    'm17 18-5-5-5 5',
    ],
  },
};

export const chevronsLeft: SnIconCatalogEntry = {
  name: 'chevrons-left',
  category: 'direction',
  zh: '双左箭头',
  keywords: '双左,首页'.split(','),
  data: {
    paths: [
    'm11 17-5-5 5-5',
    'm18 17-5-5 5-5',
    ],
  },
};

export const chevronsRight: SnIconCatalogEntry = {
  name: 'chevrons-right',
  category: 'direction',
  zh: '双右箭头',
  keywords: '双右,末页'.split(','),
  data: {
    paths: [
    'm6 17 5-5-5-5',
    'm13 17 5-5-5-5',
    ],
  },
};

export const move: SnIconCatalogEntry = {
  name: 'move',
  category: 'direction',
  zh: '移动',
  keywords: '移动,拖拽,四向'.split(','),
  data: {
    paths: [
    'M12 2v20',
    'm15 19-3 3-3-3',
    'm19 9 3 3-3 3',
    'M2 12h20',
    'm5 9-3 3 3 3',
    'm9 5 3-3 3 3',
    ],
  },
};

export const cornerDownLeft: SnIconCatalogEntry = {
  name: 'corner-down-left',
  category: 'direction',
  zh: '拐角左下',
  keywords: '回车,拐角'.split(','),
  data: {
    paths: [
    'M9 10L4 15L9 20',
    'M20 4v7a4 4 0 0 1-4 4H4',
    ],
  },
};

export const cornerDownRight: SnIconCatalogEntry = {
  name: 'corner-down-right',
  category: 'direction',
  zh: '拐角右下',
  keywords: '拐角,下一级'.split(','),
  data: {
    paths: [
    'M15 10L20 15L15 20',
    'M4 4v7a4 4 0 0 0 4 4h12',
    ],
  },
};

/** 操作类图标（Operation）。 */
export const plus: SnIconCatalogEntry = {
  name: 'plus',
  category: 'operation',
  zh: '加号',
  keywords: '添加,新增,新建'.split(','),
  data: {
    paths: [
    'M5 12h14',
    'M12 5v14',
    ],
  },
};

export const minus: SnIconCatalogEntry = {
  name: 'minus',
  category: 'operation',
  zh: '减号',
  keywords: '减少'.split(','),
  data: {
    paths: [
    'M5 12h14',
    ],
  },
};

export const x: SnIconCatalogEntry = {
  name: 'x',
  category: 'operation',
  zh: '关闭',
  keywords: '关闭,叉,取消,close'.split(','),
  data: {
    paths: [
    'M18 6 6 18',
    'm6 6 12 12',
    ],
  },
};

export const check: SnIconCatalogEntry = {
  name: 'check',
  category: 'operation',
  zh: '对勾',
  keywords: '确认,完成,选中,success'.split(','),
  data: {
    paths: [
    'M20 6 9 17l-5-5',
    ],
  },
};

export const search: SnIconCatalogEntry = {
  name: 'search',
  category: 'operation',
  zh: '搜索',
  keywords: '搜索,放大镜,查找'.split(','),
  data: {
    paths: [
    'M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0',
    'm21 21-4.3-4.3',
    ],
  },
};

export const zoomIn: SnIconCatalogEntry = {
  name: 'zoom-in',
  category: 'operation',
  zh: '放大',
  keywords: '放大,缩放'.split(','),
  data: {
    paths: [
    'M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0',
    'M21 21L16.65 16.65',
    'M11 8L11 14',
    'M8 11L14 11',
    ],
  },
};

export const zoomOut: SnIconCatalogEntry = {
  name: 'zoom-out',
  category: 'operation',
  zh: '缩小',
  keywords: '缩小,缩放'.split(','),
  data: {
    paths: [
    'M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0',
    'M21 21L16.65 16.65',
    'M8 11L14 11',
    ],
  },
};

export const refreshCw: SnIconCatalogEntry = {
  name: 'refresh-cw',
  category: 'operation',
  zh: '刷新',
  keywords: '刷新,重新加载,同步'.split(','),
  data: {
    paths: [
    'M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8',
    'M21 3v5h-5',
    'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16',
    'M8 16H3v5',
    ],
  },
};

export const rotateCw: SnIconCatalogEntry = {
  name: 'rotate-cw',
  category: 'operation',
  zh: '顺时针旋转',
  keywords: '旋转'.split(','),
  data: {
    paths: [
    'M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8',
    'M21 3v5h-5',
    ],
  },
};

export const rotateCcw: SnIconCatalogEntry = {
  name: 'rotate-ccw',
  category: 'operation',
  zh: '逆时针旋转',
  keywords: '旋转,撤销'.split(','),
  data: {
    paths: [
    'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8',
    'M3 3v5h5',
    ],
  },
};

export const download: SnIconCatalogEntry = {
  name: 'download',
  category: 'operation',
  zh: '下载',
  keywords: '下载,保存'.split(','),
  data: {
    paths: [
    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
    'M7 10L12 15L17 10',
    'M12 15L12 3',
    ],
  },
};

export const upload: SnIconCatalogEntry = {
  name: 'upload',
  category: 'operation',
  zh: '上传',
  keywords: '上传,提交'.split(','),
  data: {
    paths: [
    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
    'M17 8L12 3L7 8',
    'M12 3L12 15',
    ],
  },
};

export const share: SnIconCatalogEntry = {
  name: 'share',
  category: 'operation',
  zh: '分享',
  keywords: '分享,转发'.split(','),
  data: {
    paths: [
    'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8',
    'M16 6L12 2L8 6',
    'M12 2L12 15',
    ],
  },
};

export const externalLink: SnIconCatalogEntry = {
  name: 'external-link',
  category: 'operation',
  zh: '外链',
  keywords: '外部链接,跳转'.split(','),
  data: {
    paths: [
    'M15 3h6v6',
    'M10 14 21 3',
    'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
    ],
  },
};

export const filter: SnIconCatalogEntry = {
  name: 'filter',
  category: 'operation',
  zh: '筛选',
  keywords: '过滤,漏斗'.split(','),
  data: {
    paths: [
    'M22 3L2 3L10 12.46L10 19L14 21L14 12.46L22 3Z',
    ],
  },
};

export const slidersHorizontal: SnIconCatalogEntry = {
  name: 'sliders-horizontal',
  category: 'operation',
  zh: '设置滑杆',
  keywords: '筛选,调节,参数'.split(','),
  data: {
    paths: [
    'M21 4L14 4',
    'M10 4L3 4',
    'M21 12L12 12',
    'M8 12L3 12',
    'M21 20L16 20',
    'M12 20L3 20',
    'M14 2L14 6',
    'M8 10L8 14',
    'M16 18L16 22',
    ],
  },
};

/** 提示类图标（Alert）。 */
export const circleCheck: SnIconCatalogEntry = {
  name: 'circle-check',
  category: 'alert',
  zh: '成功',
  keywords: '成功,完成,通过,success'.split(','),
  data: {
    paths: [
    'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
    'm9 12 2 2 4-4',
    ],
  },
};

export const circleX: SnIconCatalogEntry = {
  name: 'circle-x',
  category: 'alert',
  zh: '错误',
  keywords: '错误,失败,error,关闭'.split(','),
  data: {
    paths: [
    'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
    'm15 9-6 6',
    'm9 9 6 6',
    ],
  },
};

export const circleAlert: SnIconCatalogEntry = {
  name: 'circle-alert',
  category: 'alert',
  zh: '警告',
  keywords: '警告,注意,warning'.split(','),
  data: {
    paths: [
    'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
    'M12 8L12 12',
    'M12 16L12.01 16',
    ],
  },
};

export const circleHelp: SnIconCatalogEntry = {
  name: 'circle-help',
  category: 'alert',
  zh: '帮助',
  keywords: '帮助,疑问,question'.split(','),
  data: {
    paths: [
    'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
    'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3',
    'M12 17h.01',
    ],
  },
};

export const info: SnIconCatalogEntry = {
  name: 'info',
  category: 'alert',
  zh: '信息',
  keywords: '信息,提示'.split(','),
  data: {
    paths: [
    'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
    'M12 16v-4',
    'M12 8h.01',
    ],
  },
};

export const triangleAlert: SnIconCatalogEntry = {
  name: 'triangle-alert',
  category: 'alert',
  zh: '三角警告',
  keywords: '警告,危险,warning'.split(','),
  data: {
    paths: [
    'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3',
    'M12 9v4',
    'M12 17h.01',
    ],
  },
};

export const bell: SnIconCatalogEntry = {
  name: 'bell',
  category: 'alert',
  zh: '铃铛',
  keywords: '通知,消息,提醒'.split(','),
  data: {
    paths: [
    'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9',
    'M10.3 21a1.94 1.94 0 0 0 3.4 0',
    ],
  },
};

export const bellOff: SnIconCatalogEntry = {
  name: 'bell-off',
  category: 'alert',
  zh: '静音铃铛',
  keywords: '免打扰,关闭通知'.split(','),
  data: {
    paths: [
    'M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5',
    'M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7',
    'M10.3 21a1.94 1.94 0 0 0 3.4 0',
    'm2 2 20 20',
    ],
  },
};

export const shieldAlert: SnIconCatalogEntry = {
  name: 'shield-alert',
  category: 'alert',
  zh: '安全警告',
  keywords: '安全,防护,警告'.split(','),
  data: {
    paths: [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    'M12 8v4',
    'M12 16h.01',
    ],
  },
};

export const shieldCheck: SnIconCatalogEntry = {
  name: 'shield-check',
  category: 'alert',
  zh: '安全通过',
  keywords: '安全,已验证'.split(','),
  data: {
    paths: [
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    'm9 12 2 2 4-4',
    ],
  },
};

export const badgeCheck: SnIconCatalogEntry = {
  name: 'badge-check',
  category: 'alert',
  zh: '认证徽章',
  keywords: '认证,徽章,已验证'.split(','),
  data: {
    paths: [
    'M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z',
    'm9 12 2 2 4-4',
    ],
  },
};

/** 编辑类图标（Edit）。 */
export const pencil: SnIconCatalogEntry = {
  name: 'pencil',
  category: 'edit',
  zh: '铅笔',
  keywords: '编辑,修改'.split(','),
  data: {
    paths: [
    'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
    'm15 5 4 4',
    ],
  },
};

export const penLine: SnIconCatalogEntry = {
  name: 'pen-line',
  category: 'edit',
  zh: '签名笔',
  keywords: '编辑,签名'.split(','),
  data: {
    paths: [
    'M12 20h9',
    'M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z',
    ],
  },
};

export const squarePen: SnIconCatalogEntry = {
  name: 'square-pen',
  category: 'edit',
  zh: '编辑',
  keywords: '编辑,修改,写'.split(','),
  data: {
    paths: [
    'M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
    'M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z',
    ],
  },
};

export const eraser: SnIconCatalogEntry = {
  name: 'eraser',
  category: 'edit',
  zh: '橡皮擦',
  keywords: '擦除,清除'.split(','),
  data: {
    paths: [
    'm7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21',
    'M22 21H7',
    'm5 11 9 9',
    ],
  },
};

export const scissors: SnIconCatalogEntry = {
  name: 'scissors',
  category: 'edit',
  zh: '剪刀',
  keywords: '剪切,裁剪'.split(','),
  data: {
    paths: [
    'M3 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
    'M8.12 8.12 12 12',
    'M20 4 8.12 15.88',
    'M3 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
    'M14.8 14.8 20 20',
    ],
  },
};

export const copy: SnIconCatalogEntry = {
  name: 'copy',
  category: 'edit',
  zh: '复制',
  keywords: '拷贝,复制'.split(','),
  data: {
    paths: [
    'M10 8H20A2 2 0 0 1 22 10V20A2 2 0 0 1 20 22H10A2 2 0 0 1 8 20V10A2 2 0 0 1 10 8Z',
    'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2',
    ],
  },
};

export const clipboard: SnIconCatalogEntry = {
  name: 'clipboard',
  category: 'edit',
  zh: '剪贴板',
  keywords: '粘贴板'.split(','),
  data: {
    paths: [
    'M9 2H15A1 1 0 0 1 16 3V5A1 1 0 0 1 15 6H9A1 1 0 0 1 8 5V3A1 1 0 0 1 9 2Z',
    'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2',
    ],
  },
};

export const clipboardPaste: SnIconCatalogEntry = {
  name: 'clipboard-paste',
  category: 'edit',
  zh: '粘贴',
  keywords: '粘贴'.split(','),
  data: {
    paths: [
    'M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z',
    'M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10',
    'm17 10 4 4-4 4',
    ],
  },
};

export const save: SnIconCatalogEntry = {
  name: 'save',
  category: 'edit',
  zh: '保存',
  keywords: '保存,软盘'.split(','),
  data: {
    paths: [
    'M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    'M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7',
    'M7 3v4a1 1 0 0 0 1 1h7',
    ],
  },
};

export const undo2: SnIconCatalogEntry = {
  name: 'undo-2',
  category: 'edit',
  zh: '撤销',
  keywords: '撤销,回退'.split(','),
  data: {
    paths: [
    'M9 14 4 9l5-5',
    'M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11',
    ],
  },
};

export const redo2: SnIconCatalogEntry = {
  name: 'redo-2',
  category: 'edit',
  zh: '重做',
  keywords: '重做,前进'.split(','),
  data: {
    paths: [
    'm15 14 5-5-5-5',
    'M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13',
    ],
  },
};

export const trash2: SnIconCatalogEntry = {
  name: 'trash-2',
  category: 'edit',
  zh: '垃圾桶',
  keywords: '删除,垃圾,清空'.split(','),
  data: {
    paths: [
    'M3 6h18',
    'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6',
    'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2',
    'M10 11L10 17',
    'M14 11L14 17',
    ],
  },
};

/** 界面类图标（General）。 */
export const house: SnIconCatalogEntry = {
  name: 'house',
  category: 'general',
  zh: '首页',
  keywords: '主页,房子,home'.split(','),
  data: {
    paths: [
    'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8',
    'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
    ],
  },
};

export const user: SnIconCatalogEntry = {
  name: 'user',
  category: 'general',
  zh: '用户',
  keywords: '个人,用户,头像'.split(','),
  data: {
    paths: [
    'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2',
    'M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
    ],
  },
};

export const users: SnIconCatalogEntry = {
  name: 'users',
  category: 'general',
  zh: '多用户',
  keywords: '成员,团队,群组'.split(','),
  data: {
    paths: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
    ],
  },
};

export const userPlus: SnIconCatalogEntry = {
  name: 'user-plus',
  category: 'general',
  zh: '添加用户',
  keywords: '加好友,邀请'.split(','),
  data: {
    paths: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0',
    'M19 8L19 14',
    'M22 11L16 11',
    ],
  },
};

export const settings: SnIconCatalogEntry = {
  name: 'settings',
  category: 'general',
  zh: '设置',
  keywords: '设置,齿轮,配置'.split(','),
  data: {
    paths: [
    'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    'M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
    ],
  },
};

export const menu: SnIconCatalogEntry = {
  name: 'menu',
  category: 'general',
  zh: '菜单',
  keywords: '菜单,汉堡,列表'.split(','),
  data: {
    paths: [
    'M4 12L20 12',
    'M4 6L20 6',
    'M4 18L20 18',
    ],
  },
};

export const ellipsis: SnIconCatalogEntry = {
  name: 'ellipsis',
  category: 'general',
  zh: '更多',
  keywords: '更多,省略号,dot'.split(','),
  data: {
    paths: [
    'M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    ],
  },
};

export const ellipsisVertical: SnIconCatalogEntry = {
  name: 'ellipsis-vertical',
  category: 'general',
  zh: '竖向更多',
  keywords: '更多,竖排'.split(','),
  data: {
    paths: [
    'M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    'M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
    ],
  },
};

export const layoutGrid: SnIconCatalogEntry = {
  name: 'layout-grid',
  category: 'general',
  zh: '网格',
  keywords: '宫格,网格,布局'.split(','),
  data: {
    paths: [
    'M4 3H9A1 1 0 0 1 10 4V9A1 1 0 0 1 9 10H4A1 1 0 0 1 3 9V4A1 1 0 0 1 4 3Z',
    'M15 3H20A1 1 0 0 1 21 4V9A1 1 0 0 1 20 10H15A1 1 0 0 1 14 9V4A1 1 0 0 1 15 3Z',
    'M15 14H20A1 1 0 0 1 21 15V20A1 1 0 0 1 20 21H15A1 1 0 0 1 14 20V15A1 1 0 0 1 15 14Z',
    'M4 14H9A1 1 0 0 1 10 15V20A1 1 0 0 1 9 21H4A1 1 0 0 1 3 20V15A1 1 0 0 1 4 14Z',
    ],
  },
};

export const list: SnIconCatalogEntry = {
  name: 'list',
  category: 'general',
  zh: '列表',
  keywords: '清单,列表'.split(','),
  data: {
    paths: [
    'M3 12h.01',
    'M3 18h.01',
    'M3 6h.01',
    'M8 12h13',
    'M8 18h13',
    'M8 6h13',
    ],
  },
};

export const star: SnIconCatalogEntry = {
  name: 'star',
  category: 'general',
  zh: '星形',
  keywords: '收藏,评分,星星'.split(','),
  data: {
    paths: [
    'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
    ],
  },
};

export const heart: SnIconCatalogEntry = {
  name: 'heart',
  category: 'general',
  zh: '心形',
  keywords: '喜欢,点赞,收藏'.split(','),
  data: {
    paths: [
    'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
    ],
  },
};

export const bookmark: SnIconCatalogEntry = {
  name: 'bookmark',
  category: 'general',
  zh: '书签',
  keywords: '收藏,标记'.split(','),
  data: {
    paths: [
    'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z',
    ],
  },
};

export const calendar: SnIconCatalogEntry = {
  name: 'calendar',
  category: 'general',
  zh: '日历',
  keywords: '日期,日程'.split(','),
  data: {
    paths: [
    'M8 2v4',
    'M16 2v4',
    'M5 4H19A2 2 0 0 1 21 6V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20V6A2 2 0 0 1 5 4Z',
    'M3 10h18',
    ],
  },
};

export const clock: SnIconCatalogEntry = {
  name: 'clock',
  category: 'general',
  zh: '时钟',
  keywords: '时间,表'.split(','),
  data: {
    paths: [
    'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
    'M12 6L12 12L16 14',
    ],
  },
};

export const eye: SnIconCatalogEntry = {
  name: 'eye',
  category: 'general',
  zh: '眼睛',
  keywords: '可见,预览,密码可见'.split(','),
  data: {
    paths: [
    'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0',
    'M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
    ],
  },
};

export const eyeOff: SnIconCatalogEntry = {
  name: 'eye-off',
  category: 'general',
  zh: '闭眼',
  keywords: '隐藏,不可见,密码隐藏'.split(','),
  data: {
    paths: [
    'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49',
    'M14.084 14.158a3 3 0 0 1-4.242-4.242',
    'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143',
    'm2 2 20 20',
    ],
  },
};

export const lock: SnIconCatalogEntry = {
  name: 'lock',
  category: 'general',
  zh: '锁',
  keywords: '锁定,密码'.split(','),
  data: {
    paths: [
    'M5 11H19A2 2 0 0 1 21 13V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20V13A2 2 0 0 1 5 11Z',
    'M7 11V7a5 5 0 0 1 10 0v4',
    ],
  },
};

export const lockOpen: SnIconCatalogEntry = {
  name: 'lock-open',
  category: 'general',
  zh: '开锁',
  keywords: '解锁,未锁定'.split(','),
  data: {
    paths: [
    'M5 11H19A2 2 0 0 1 21 13V20A2 2 0 0 1 19 22H5A2 2 0 0 1 3 20V13A2 2 0 0 1 5 11Z',
    'M7 11V7a5 5 0 0 1 9.9-1',
    ],
  },
};

export const mail: SnIconCatalogEntry = {
  name: 'mail',
  category: 'general',
  zh: '邮件',
  keywords: '信封,邮箱,email'.split(','),
  data: {
    paths: [
    'M4 4H20A2 2 0 0 1 22 6V18A2 2 0 0 1 20 20H4A2 2 0 0 1 2 18V6A2 2 0 0 1 4 4Z',
    'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7',
    ],
  },
};

export const phone: SnIconCatalogEntry = {
  name: 'phone',
  category: 'general',
  zh: '电话',
  keywords: '手机,拨打'.split(','),
  data: {
    paths: [
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
    ],
  },
};

export const image: SnIconCatalogEntry = {
  name: 'image',
  category: 'general',
  zh: '图片',
  keywords: '图片,照片,相册'.split(','),
  data: {
    paths: [
    'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z',
    'M7 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
    'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21',
    ],
  },
};

export const camera: SnIconCatalogEntry = {
  name: 'camera',
  category: 'general',
  zh: '相机',
  keywords: '拍照,摄影'.split(','),
  data: {
    paths: [
    'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z',
    'M9 13a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
    ],
  },
};

export const link: SnIconCatalogEntry = {
  name: 'link',
  category: 'general',
  zh: '链接',
  keywords: '链接,超链接'.split(','),
  data: {
    paths: [
    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
    'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
    ],
  },
};

export const logOut: SnIconCatalogEntry = {
  name: 'log-out',
  category: 'general',
  zh: '退出登录',
  keywords: '登出,注销'.split(','),
  data: {
    paths: [
    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
    'M16 17L21 12L16 7',
    'M21 12L9 12',
    ],
  },
};

export const logIn: SnIconCatalogEntry = {
  name: 'log-in',
  category: 'general',
  zh: '登录',
  keywords: '登录,进入'.split(','),
  data: {
    paths: [
    'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4',
    'M10 17L15 12L10 7',
    'M15 12L3 12',
    ],
  },
};

export const thumbsUp: SnIconCatalogEntry = {
  name: 'thumbs-up',
  category: 'general',
  zh: '点赞',
  keywords: '赞,好评'.split(','),
  data: {
    paths: [
    'M7 10v12',
    'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z',
    ],
  },
};

export const messageCircle: SnIconCatalogEntry = {
  name: 'message-circle',
  category: 'general',
  zh: '评论',
  keywords: '消息,聊天,气泡'.split(','),
  data: {
    paths: [
    'M7.9 20A9 9 0 1 0 4 16.1L2 22Z',
    ],
  },
};

export const send: SnIconCatalogEntry = {
  name: 'send',
  category: 'general',
  zh: '发送',
  keywords: '发送,纸飞机'.split(','),
  data: {
    paths: [
    'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z',
    'm21.854 2.147-10.94 10.939',
    ],
  },
};

/** 文件类图标（File）。 */
export const file: SnIconCatalogEntry = {
  name: 'file',
  category: 'file',
  zh: '文件',
  keywords: '文档,文件'.split(','),
  data: {
    paths: [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
    ],
  },
};

export const fileText: SnIconCatalogEntry = {
  name: 'file-text',
  category: 'file',
  zh: '文本文件',
  keywords: '文档,说明'.split(','),
  data: {
    paths: [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
    'M10 9H8',
    'M16 13H8',
    'M16 17H8',
    ],
  },
};

export const filePlus: SnIconCatalogEntry = {
  name: 'file-plus',
  category: 'file',
  zh: '新建文件',
  keywords: '新建,添加文件'.split(','),
  data: {
    paths: [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
    'M9 15h6',
    'M12 18v-6',
    ],
  },
};

export const fileX: SnIconCatalogEntry = {
  name: 'file-x',
  category: 'file',
  zh: '失效文件',
  keywords: '文件删除,失效'.split(','),
  data: {
    paths: [
    'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
    'M14 2v4a2 2 0 0 0 2 2h4',
    'm14.5 12.5-5 5',
    'm9.5 12.5 5 5',
    ],
  },
};

export const folder: SnIconCatalogEntry = {
  name: 'folder',
  category: 'file',
  zh: '文件夹',
  keywords: '目录,夹子'.split(','),
  data: {
    paths: [
    'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
    ],
  },
};

export const folderOpen: SnIconCatalogEntry = {
  name: 'folder-open',
  category: 'file',
  zh: '打开文件夹',
  keywords: '展开目录'.split(','),
  data: {
    paths: [
    'm6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2',
    ],
  },
};

export const folderPlus: SnIconCatalogEntry = {
  name: 'folder-plus',
  category: 'file',
  zh: '新建文件夹',
  keywords: '添加目录'.split(','),
  data: {
    paths: [
    'M12 10v6',
    'M9 13h6',
    'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
    ],
  },
};

export const paperclip: SnIconCatalogEntry = {
  name: 'paperclip',
  category: 'file',
  zh: '附件',
  keywords: '回形针,附件'.split(','),
  data: {
    paths: [
    'm21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48',
    ],
  },
};

export const archive: SnIconCatalogEntry = {
  name: 'archive',
  category: 'file',
  zh: '归档',
  keywords: '档案'.split(','),
  data: {
    paths: [
    'M3 3H21A1 1 0 0 1 22 4V7A1 1 0 0 1 21 8H3A1 1 0 0 1 2 7V4A1 1 0 0 1 3 3Z',
    'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8',
    'M10 12h4',
    ],
  },
};

export const bookOpen: SnIconCatalogEntry = {
  name: 'book-open',
  category: 'file',
  zh: '打开的书',
  keywords: '书籍,阅读'.split(','),
  data: {
    paths: [
    'M12 7v14',
    'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z',
    ],
  },
};

export const hardDrive: SnIconCatalogEntry = {
  name: 'hard-drive',
  category: 'file',
  zh: '硬盘',
  keywords: '存储,磁盘'.split(','),
  data: {
    paths: [
    'M22 12L2 12',
    'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
    'M6 16L6.01 16',
    'M10 16L10.01 16',
    ],
  },
};

export const inbox: SnIconCatalogEntry = {
  name: 'inbox',
  category: 'file',
  zh: '收件箱',
  keywords: '收件'.split(','),
  data: {
    paths: [
    'M22 12L16 12L14 15L10 15L8 12L2 12',
    'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
    ],
  },
};

/** 数据类图标（Chart）。 */
export const chartBar: SnIconCatalogEntry = {
  name: 'chart-bar',
  category: 'chart',
  zh: '柱状图',
  keywords: '图表,柱图,统计'.split(','),
  data: {
    paths: [
    'M3 3v16a2 2 0 0 0 2 2h16',
    'M7 16h8',
    'M7 11h12',
    'M7 6h3',
    ],
  },
};

export const chartColumn: SnIconCatalogEntry = {
  name: 'chart-column',
  category: 'chart',
  zh: '柱形图',
  keywords: '图表,柱图'.split(','),
  data: {
    paths: [
    'M3 3v16a2 2 0 0 0 2 2h16',
    'M18 17V9',
    'M13 17V5',
    'M8 17v-3',
    ],
  },
};

export const chartLine: SnIconCatalogEntry = {
  name: 'chart-line',
  category: 'chart',
  zh: '折线图',
  keywords: '图表,曲线'.split(','),
  data: {
    paths: [
    'M3 3v16a2 2 0 0 0 2 2h16',
    'm19 9-5 5-4-4-3 3',
    ],
  },
};

export const chartPie: SnIconCatalogEntry = {
  name: 'chart-pie',
  category: 'chart',
  zh: '饼图',
  keywords: '图表,占比'.split(','),
  data: {
    paths: [
    'M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z',
    'M21.21 15.89A10 10 0 1 1 8 2.83',
    ],
  },
};

export const trendingUp: SnIconCatalogEntry = {
  name: 'trending-up',
  category: 'chart',
  zh: '上升趋势',
  keywords: '上涨,增长'.split(','),
  data: {
    paths: [
    'M22 7L13.5 15.5L8.5 10.5L2 17',
    'M16 7L22 7L22 13',
    ],
  },
};

export const trendingDown: SnIconCatalogEntry = {
  name: 'trending-down',
  category: 'chart',
  zh: '下降趋势',
  keywords: '下跌,下降'.split(','),
  data: {
    paths: [
    'M22 17L13.5 8.5L8.5 13.5L2 7',
    'M16 17L22 17L22 11',
    ],
  },
};

export const activity: SnIconCatalogEntry = {
  name: 'activity',
  category: 'chart',
  zh: '活动曲线',
  keywords: '心跳,监控,波动'.split(','),
  data: {
    paths: [
    'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
    ],
  },
};

export const database: SnIconCatalogEntry = {
  name: 'database',
  category: 'chart',
  zh: '数据库',
  keywords: '数据,存储'.split(','),
  data: {
    paths: [
    'M3 5a9 3 0 1 0 18 0a9 3 0 1 0 -18 0',
    'M3 5V19A9 3 0 0 0 21 19V5',
    'M3 12A9 3 0 0 0 21 12',
    ],
  },
};

export const table: SnIconCatalogEntry = {
  name: 'table',
  category: 'chart',
  zh: '表格',
  keywords: '表,行列'.split(','),
  data: {
    paths: [
    'M12 3v18',
    'M5 3H19A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3Z',
    'M3 9h18',
    'M3 15h18',
    ],
  },
};

export const wallet: SnIconCatalogEntry = {
  name: 'wallet',
  category: 'chart',
  zh: '钱包',
  keywords: '钱包,资金'.split(','),
  data: {
    paths: [
    'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1',
    'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4',
    ],
  },
};

export const banknote: SnIconCatalogEntry = {
  name: 'banknote',
  category: 'chart',
  zh: '钞票',
  keywords: '现金,金额'.split(','),
  data: {
    paths: [
    'M4 6H20A2 2 0 0 1 22 8V16A2 2 0 0 1 20 18H4A2 2 0 0 1 2 16V8A2 2 0 0 1 4 6Z',
    'M10 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
    'M6 12h.01M18 12h.01',
    ],
  },
};

export const percent: SnIconCatalogEntry = {
  name: 'percent',
  category: 'chart',
  zh: '百分比',
  keywords: '折扣,百分号'.split(','),
  data: {
    paths: [
    'M19 5L5 19',
    'M4 6.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0',
    'M15 17.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0',
    ],
  },
};

/** 目录条目清单（按分类 → 目录序）。 */
export const SN_ICON_CATALOG: SnIconCatalogEntry[] = [
  arrowDown,
  arrowUp,
  arrowLeft,
  arrowRight,
  arrowUpRight,
  arrowDownRight,
  arrowUpLeft,
  arrowDownLeft,
  chevronDown,
  chevronUp,
  chevronLeft,
  chevronRight,
  chevronsDown,
  chevronsUp,
  chevronsLeft,
  chevronsRight,
  move,
  cornerDownLeft,
  cornerDownRight,
  plus,
  minus,
  x,
  check,
  search,
  zoomIn,
  zoomOut,
  refreshCw,
  rotateCw,
  rotateCcw,
  download,
  upload,
  share,
  externalLink,
  filter,
  slidersHorizontal,
  circleCheck,
  circleX,
  circleAlert,
  circleHelp,
  info,
  triangleAlert,
  bell,
  bellOff,
  shieldAlert,
  shieldCheck,
  badgeCheck,
  pencil,
  penLine,
  squarePen,
  eraser,
  scissors,
  copy,
  clipboard,
  clipboardPaste,
  save,
  undo2,
  redo2,
  trash2,
  house,
  user,
  users,
  userPlus,
  settings,
  menu,
  ellipsis,
  ellipsisVertical,
  layoutGrid,
  list,
  star,
  heart,
  bookmark,
  calendar,
  clock,
  eye,
  eyeOff,
  lock,
  lockOpen,
  mail,
  phone,
  image,
  camera,
  link,
  logOut,
  logIn,
  thumbsUp,
  messageCircle,
  send,
  file,
  fileText,
  filePlus,
  fileX,
  folder,
  folderOpen,
  folderPlus,
  paperclip,
  archive,
  bookOpen,
  hardDrive,
  inbox,
  chartBar,
  chartColumn,
  chartLine,
  chartPie,
  trendingUp,
  trendingDown,
  activity,
  database,
  table,
  wallet,
  banknote,
  percent,
];

/**
 * 按关键词搜索目录：匹配 name / zh / keywords（不区分大小写，子串匹配）。
 * 空查询返回分类内全部条目。
 */
export function searchSnIconCatalog(query: string, category?: SnIconCategory): SnIconCatalogEntry[] {
  const q = query.trim().toLowerCase();
  return SN_ICON_CATALOG.filter((entry) => {
    if (category !== undefined && entry.category !== category) return false;
    if (q === '') return true;
    if (entry.name.toLowerCase().includes(q)) return true;
    if (entry.zh.includes(query.trim())) return true;
    return entry.keywords.some((kw) => kw.toLowerCase().includes(q));
  });
}
