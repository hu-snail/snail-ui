#!/usr/bin/env node
/**
 * gen-pages —— 由 src/demos/ 生成 uni-app 页面结构（生成物提交入库）。
 *
 * 产出：
 *   - src/pages.json                 首页 + 按组件分组的 subPackages
 *   - src/pages/index/home-data.ts   首页目录数据（含英文字段；首页页面本体
 *                                     index.vue 为手写代码，消费该数据）
 *   - src/pages/<group>/<comp>.vue   组件聚合页：静态展开该组件全部场景
 *   - src/demos-manifest.json        目录清单（docs 消费：分组 / 标题 / 英文影子）
 *
 * demo 源物理位于 src/pages/<group>/demos/（fork-demos.mjs 迁入），MP 组件
 * chunk 随文件位置归入对应 subPackage。
 *
 * 设计约束（ADR-0005）：
 *   - 生成而非手写：demo 变更后重跑 `pnpm gen:pages`
 *   - 静态展开每个 demo（<DemoN />），不用 component :is —— MP 编译器对动态
 *     组件支持不全
 *   - 微信小程序主包限 2MB：组件页按 docs 总览分组拆 subPackage，主包只留
 *     首页；分组与标题以 docs 的 overview-data.ts 为单源（正则抽取，避免在
 *     node 侧引入 TS 运行时）
 *   - 场景标题从 demo 文件名单源派生，并通过 demos-manifest.json 与 docs 共享
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GROUP_LABELS_EN, parseOverviewData, splitSubpackages, titleEnOf } from './subpackages.mjs';

const pagesDir = fileURLToPath(new URL('../src/pages/', import.meta.url));
const manifestOut = fileURLToPath(new URL('../src/demos-manifest.json', import.meta.url));

const COMP_RE = /^(.*?)-mp(?:-(.+))?$/;

/** 场景标题映射：高频场景给中文标题，其余回退为场景 key 本身。 */
const SCENARIO_LABELS = {
  basic: '基础用法',
  behavior: '行为',
  size: '尺寸',
  sizes: '尺寸',
  shape: '形状',
  state: '状态',
  states: '状态',
  status: '状态',
  group: '头像组',
  card3d: '3D 卡片',
  custom: '自定义',
  'custom-class': '自定义类名',
  'custom-style': '自定义样式',
  variant: '变体',
  config: '配置',
  slots: '插槽',
  type: '类型',
  types: '类型',
  vertical: '垂直模式',
  color: '颜色',
  icon: '图标',
  icons: '图标',
  iconfont: '图标按钮',
  'icon-font': '字体图标',
  'icon-button': '图标按钮',
  gallery: '图标总览',
  string: '目录用法',
  iconify: 'Iconify 按需',
  disabled: '禁用',
  style: '样式',
  scroll: '滚动',
  cell: '单元格',
  layout: '布局',
  guard: '拦截',
  position: '位置',
  fan: '扇形展开',
  drag: '拖拽',
  label: '标签',
  export: '导出',
  text: '文本',
  placement: '弹出位置',
  badge: '徽标',
  header: '标题与描述',
  panels: '多列面板',
  sheet: '动作面板',
  fields: '字段',
  'form-type': '表单类型',
  fallback: '回退',
  threshold: '阈值',
  visibility: '可见性',
  hover: '悬停',
  'image-tap': '点图片关闭',
  lunar: '农历',
  card: '卡片',
  direction: '方向',
  theme: '主题',
  page: '整页演示',
  contacts: '通讯录',
  verify: '验证',
  popup: '弹窗',
  height: '高度',
  interaction: '交互',
  trigger: '触发',
  expand: '展开',
  connector: '连接线',
  node: '节点',
  swiper: '轮播联动',
  paging: '分页联动',
  prefix: '前缀',
  options: '选项',
  range: '日期范围',
  formatter: '自定义文案',
  nav: '导航按钮',
  'no-border': '无边框',
  radius: '圆角',
  decimal: '小数点',
  idcard: '身份证',
  'align-compact': '对齐与紧凑',
  'bordered-bg-radius': '边框与背景',
  'clear-focus': '清空与聚焦',
  'clearable-count': '清空与字数',
  'native-attrs': '原生属性',
  'password-toggle': '密码显隐',
  'prefix-suffix': '前后图标',
  shape: '形状',
  background: '格子背景',
  'error-gutter': '明文与错误态',
  playground: '完整演示',
  'new-energy': '新能源车牌',
  runtime: '运行时属性',
  'word-limit': '字数统计',
  'lazy-load': '懒加载',
  responsive: '响应式',
  'masonry-off': '关闭瀑布流',
  kingkong: '金刚区',
};

/**
 * 组件级场景标题覆盖：key 为 `<comp>-<scenario>`。同一 scenario key 在不同
 * 组件下语义不同（input 的 states 是禁用/只读、status 是校验状态），全局
 * 映射表无法表达时在这里按组件消歧。
 */
const SCENARIO_LABEL_OVERRIDES = {
  'input-states': '禁用与只读',
  'input-status': '校验状态',
  'barcode-format': '条码格式（format）',
  'barcode-layout': '布局方向（layout）',
  'barcode-style': '样式属性',
  'dialer-size': '尺寸（size）',
  'dialer-colors': '扇区配色',
  'dialer-pointer-slot': '自定义指针（pointer 插槽）',
  'dialer-spin': '圈数与时长（turns / duration）',
  'liquid-size': '尺寸（size）',
  'liquid-outline': '外圈（outline）',
  'liquid-radius': '容器圆角（radius）',
  'liquid-colors': '水波配色（waveColor / innerColor）',
  'lucky-grid': '网格规模（rows / cols）',
  'lucky-cell': '格子间距与高度（gutter / cellHeight）',
  'lucky-speed': '速度与高亮色（speed）',
  'lucky-button-slot': '自定义按钮（button 插槽）',
  'scratchcard-cover': '封面色（coverColor）',
  'scratchcard-ratio': '刮开阈值（ratio）',
  'scratchcard-watermark': '水印（watermark*）',
  'scratchcard-title-style': '标题样式（titleSize / titleColor）',
  'typing-text': '文案开关（text）',
  'typing-dot-count': '圆点数量（dotCount）',
  'typing-speed': '脉动速度（speed）',
  'typing-dot-color': '圆点颜色（activeDotColor）',
  'calendar-first-day-of-week': '周起始日（firstDayOfWeek）',
  'calendar-formatter': '单元格格式化（formatter）',
  'calendar-range-constraints': '区间约束（maxRange / allowSameDay / defaultTime）',
  'calendar-shortcuts-events': '快捷回调与确认拦截（onShortcutsClick / beforeConfirm）',
  'calendar-declared-props': '声明对齐参数（timeFilter / hideSecond 等）',
  'calendar-panel': '面板尺寸与切换（panelHeight / switchMode）',
  'calendar-immediate-change': '即时写回（immediateChange）',
  'calendar-sheet-chrome': '弹层外观与底栏插槽',
  'calendar-view-first-day-of-week': '周起始日',
  'calendar-view-formatter': '单元格格式化',
  'calendar-view-panel-title': '面板标题（showPanelTitle）',
  'calendar-view-range': '区间选择（type="daterange"）',
  'calendar-view-switch-mode': '月 / 年切换（switchMode）',
  'calendar-view-same-day': '起止同一天（allowSameDay）',
  'calendar-view-default-time': '默认时分与即时写回',
  'calendar-view-time-props': '时间列声明参数',
  'captcha-copy': '自定义文案（tips / successText）',
  'captcha-size-tolerance': '尺寸与容差（width / height / tolerance）',
  'cascader-fields': '字段映射（valueKey 等）',
  'cascader-lazy-load': '异步加载（lazyLoad）',
  'cascader-before-confirm': '确认拦截（beforeConfirm）',
  'cascader-indicator': '指示条形态（lineTheme）',
  'cascader-sheet-chrome': '弹层配置（遮罩 / 层级 / 自定义）',
  'checkbox-group-limits': '数量限制（min / max）',
  'checkbox-group-state': '组状态与半选',
  'checkbox-toggle-all': '全选 / 全不选（toggleAll）',
  'checkbox-standalone': '独立用法与自定义取值',
  'checkbox-colors': '选中颜色（checkedColor）',
  'checkbox-placement': '布局与标签（placement / maxWidth）',
  'checkbox-custom-style': '自定义样式',
  'code-input-mask': '明文显示（mask）',
  'code-input-error-info': '错误态（errorInfo）',
  'code-input-gutter': '格子间距（gutter）',
  'date-strip-nav': '导航按钮（show-nav）',
  'datetime-picker-roller-geometry': '滚筒几何（itemHeight / visibleItemCount）',
  'datetime-picker-time-bounds': '时分秒边界',
  'datetime-picker-column-format': '列文案与过滤（formatter / filter）',
  'datetime-picker-immediate-change': '即时写回（immediateChange）',
  'datetime-picker-sheet-chrome': '弹层外观（文案 / 遮罩 / 层级）',
  'datetime-picker-time-type': '时间类型（type="time"）',
  'datetime-picker-before-confirm': '确认拦截（beforeConfirm）',
  'datetime-picker-view-roller-geometry': '滚筒几何',
  'datetime-picker-view-keys': '字段映射（valueKey / labelKey）',
  'datetime-picker-view-column-formatter': '列改写（columnFormatter）',
  'datetime-picker-view-boundary': '区间联动（boundaryMinDate / boundaryMaxDate）',
  'datetime-picker-view-immediate-change': '即时 change（immediateChange）',
  'datetime-picker-view-time-type': '时间类型写回',
  'datetime-picker-view-formatter': '列文案格式化（formatter）',
  'form-cell-border': '单元格分隔与截断',
  'form-cell-clickable': '可点击行（clickable / isLink）',
  'form-cell-text': '占位与副文案',
  'form-size': '尺寸（size）',
  'form-value-align': '值对齐（valueAlign）',
  'form-asterisk': '必填星号（asteriskPosition / hideAsterisk）',
  'form-title-width': '标签列宽（titleWidth）',
  'form-layout': '排布（layout / center）',
  'form-schema': '表单 schema',
  'form-status-icon': '状态图标（statusIcon）',
  'form-message-display': '错误消息展示策略',
  'input-align': '右对齐（alignRight）',
  'input-compact': '紧凑行内形态（compact）',
  'input-inputmode': '软键盘提示（inputmode）',
  'input-border': '边框（border）',
  'input-bg': '背景（bg）',
  'input-clear-trigger': '清空按钮细节（clearTrigger / focusWhenClear）',
  'input-focus': '自动聚焦（focus）',
  'input-placeholder': '占位符样式（placeholderClass / placeholderStyle）',
  'input-clearable': '清空按钮（clearable）',
  'input-count': '字数计数（showCount）',
  'input-cursor-spacing': '光标间距（cursorSpacing）',
  'input-confirm-hold': '确认键保持键盘（confirmHold）',
  'input-composition': '输入合成（ignoreCompositionEvent）',
  'input-enable-native': '原生输入（enableNative）',
  'input-confirm-type': '确认键文案（confirmType）',
  'input-keyboard-hold': '键盘保持与页面上推',
  'input-cursor-selection': '光标与选区',
  'input-number-step-strictly': '步进吸附（stepStrictly）',
  'input-number-allow-null': '可空输入（allowNull）',
  'input-number-before-change': '提交拦截（beforeChange）',
  'input-number-commit-timing': '提交时机与输入属性',
  'input-number-theme': '主题（theme）',
  'input-number-round': '圆角（round）',
  'input-number-long-press': '长按连加（longPress）',
  'input-number-disabled': '禁用（disabled）',
  'keyboard-labels': '键位文案（deleteText / closeText）',
  'keyboard-delete-key': '删除键开关（showDeleteKey）',
  'keyboard-random-order': '随机键序（randomKeyOrder）',
  'keyboard-scrim': '遮罩与弹层行为',
  'keyboard-close-loading': '关闭键加载态（closeButtonLoading）',
  'picker-fields': '字段映射（`valueKey` / `labelKey` / `childrenKey`）',
  'picker-button-text': '按钮文案（`cancelButtonText` / `confirmButtonText`）',
  'picker-rows': '滚筒几何（`itemHeight` / `visibleItemCount`）',
  'picker-immediate': '滚动即写回（`immediateChange`）',
  'picker-sheet': '弹层行为（遮罩 / 层级 / 安全区）',
  'picker-view-cascade': '级联模式（`cascade`）',
  'picker-view-disabled': '禁用（`disabled`）',
  'picker-view-rows': '滚筒几何（`itemHeight` / `visibleItemCount`）',
  'picker-view-keys': '自定义字段名（`valueKey` / `labelKey` / `childrenKey`）',
  'picker-view-immediate': '拖动即时回写（`immediateChange`）',
  'picker-view-custom-style': '根节点样式（`customClass` / `customStyle`）',
  'plate-input-new-energy': '新能源车牌（`maxlength=8`）',
  'plate-input-disabled': '禁用态（`disabled`）',
  'radio-colors': '选中色（`checkedColor` / `uncheckedColor`）',
  'radio-custom-style': '自定义类名与样式',
  'radio-uncheck': '可反选（`allowUncheck`）',
  'radio-disabled-readonly': '禁用与只读（`disabled` / `readonly`）',
  'radio-placement': '标记位置（`placement`）',
  'rate-half': '半星（`allowHalf`）',
  'rate-clearable': '可清空（`clearable`）',
  'rate-color': '评分颜色（`activeColor`）',
  'rate-readonly': '只读（`readonly`）',
  'rate-space': '间距与铺满（`space` / `size` / `block`）',
  'rate-icon': '自定义图标（`icon` / `activeIcon`）',
  'rate-css-icon': 'CSS 类图标（`cssIcon`）',
  'rate-disabled': '禁用（`disabled`）',
  'rate-custom-style': '根节点样式（`customClass` / `customStyle`）',
  'search-cancel': '取消按钮（`cancelTxt` / `hideCancel`）',
  'search-placeholder-left': '占位符左对齐（`placeholderLeft`）',
  'search-disabled': '禁用（`disabled`）',
  'search-maxlength': '字数上限（`maxlength`）',
  'search-focus': '聚焦（`focus` / `focusWhenClear`）',
  'search-custom-style':
    '输入节点与根节点样式（`customInputClass` / `customClass` / `customStyle`)',
  'search-placeholder-style': '占位符样式（`placeholderStyle` / `placeholderClass`）',
  'select-picker-type-radio': '单选模式（`type=radio`）',
  'select-picker-filterable': '可搜索（`filterable`）',
  'select-picker-fields': '字段映射（`valueKey` / `labelKey`）',
  'select-picker-chip-size': 'chip 尺寸与确认（`selectSize` / `showConfirm`）',
  'select-picker-checked-color': '选中色（`checkedColor`）',
  'select-picker-loading': '加载态（`loading`）',
  'select-picker-before-confirm': '确认拦截（`beforeConfirm`）',
  'select-picker-sheet': '弹层行为与样式',
  'select-picker-scroll-into-view': '滚动定位（`scrollIntoView`）',
  'signature-history': '撤销与恢复（`enableHistory`）',
  'signature-pen': '笔迹外观（`penColor` / `lineWidth`）',
  'signature-disabled': '禁用（`disabled`）',
  'signature-size': '画板尺寸与底色',
  'signature-scroll': '画板滚动（`disableScroll`）',
  'signature-step': '撤回步长（`step`）',
  'signature-export': '导出参数（`fileType` / `quality` / `exportScale`）',
  'signature-stroke': '笔迹参数（`pressure` / `lineWidth`）',
  'slide-verify-text': '文案（`text` / `successText`）',
  'slide-verify-color': '轨道配色（`backgroundColor`）',
  'slide-verify-disabled': '禁用（`disabled`）',
  'slide-verify-icons': '图标字形（`icon` / `successIcon`）',
  'slide-verify-tolerance': '容差（`tolerance`）',
  'slide-verify-custom-style': '根节点样式',
  'slider-bar-basic': '基础用法',
  'slider-bar-range': '区间（`range`）',
  'slider-bar-theme': '主题（`theme`）',
  'slider-bar-size': '尺寸（`size`）',
  'slider-bar-variant': '竖排（`variant=column`）',
  'slider-range': '区间与刻度（`range` / `marks`）',
  'slider-theme': '主题（`theme`）',
  'slider-disabled': '禁用（`disabled`）',
  'slider-vertical': '竖排（`vertical`）',
  'slider-popover': '数值气泡（`popoverVisible`）',
  'slider-color': '轨道配色（`activeColor`）',
  'slider-custom-style': '根节点样式',
  'sort-button-cycle': '排序循环（`allowReset` / `descFirst`）',
  'sort-button-line': '下划线（`line`）',
  'switch-text': '轨道文案（`activeText` / `inactiveText`）',
  'switch-shape': '形状（`shape`）',
  'switch-size': '尺寸（`size`）',
  'switch-color': '开关配色（`activeColor`）',
  'switch-loading': '加载态（`loading`）',
  'switch-custom-style': '根节点样式',
  'textarea-word-limit': '字数统计（`showWordLimit`）',
  'textarea-clearable': '可清空（`clearable`）',
  'textarea-error': '错误态（`error`）',
  'textarea-prefix-icon': '前置图标（`prefixIcon`）',
  'textarea-placeholder': '占位符样式',
  'textarea-auto-height': '自动增高（`autoHeight`）',
  'textarea-disabled-readonly': '只读与禁用（`readonly` / `disabled`）',
  'textarea-compact': '紧凑模式（`compact`）',
  'upload-disabled': '禁用（`disabled`）',
  'upload-accept': '选择器类型（`accept`）',
  'upload-status': '文件状态渲染（`status`）',
  'upload-image-mode': '缩略图模式（`imageMode`）',
  'upload-custom-style': '三层样式挂载点',
  'avatar-css-icon': '字体图标（cssIcon / iconPrefix）',
  'avatar-mode': '图片裁切（mode）',
  'avatar-size': '尺寸（size）',
  'avatar-shape': '形状（shape）',
  'avatar-status': '在线状态（status）',
  'avatar-badge': '微标头像（badge 组合）',
  'badge-dot': '红点（is-dot）',
  'badge-shape': '形状与描边（shape / border）',
  'badge-offset': '偏移与颜色（top / right / bgColor）',
  'button-block': '块级按钮（block）',
  'button-round': '圆角按钮（round）',
  'button-color-override': '内联颜色覆盖（bgColor / color）',
  'button-loading-color': '加载 spinner 定制（loadingColor / loadingSize）',
  'button-loading-props': 'loading-props 对象写法',
  'button-hairline': '细边框（hairline）',
  'fab-expandable': '仅点击不展开（expandable）',
  'fab-disabled': '禁用（disabled）',
  'fab-trigger-icons': '触发图标双轨',
  'fab-type': '主题色（type）',
  'icon-size': '尺寸（size）',
  'icon-stroke-width': '描边粗细（strokeWidth）',
  'layout-gutter': '间距与偏移（gutter / offset）',
  'tag-closable': '可关闭标签（closable）',
  'tag-dynamic': '动态新增标签（dynamic）',
  'tag-color': '自定义颜色（bgColor / color）',
  'tag-css-icon': '字体图标（cssIcon）',
  'tag-size': '尺寸（size）',
  'tag-round-mark': '胶囊与标记形（round / mark）',
  'text-lines': '多行截断（lines）',
  'text-typography': '排版覆盖（size / lineHeight / color）',
  'transition-combined': '组合动画（name 数组）',
  'transition-duration': '分段时长（duration）',
  'transition-destroy': '保留节点（destroy）',
  'transition-lazy-render': '懒渲染（lazyRender）',
  'transition-touch-move': '阻止触摸滚动（disableTouchMove）',
  'count-down-control': '控制方法（start / pause / reset）',
  'count-down-millisecond': '毫秒渲染（millisecond）',
  'count-to-type': '主题色（type）',
  'count-to-control': '控制方法',
  'image-preview-selector': 'selector 命中区',
  'image-preview-close-behavior': '关闭与循环行为',
  'image-preview-longpress': '长按菜单与事件',
  'image-preview-close-position': '关闭按钮位置（closeIconPosition）',
  'image-preview-index': '页码与底部插槽',
  'img-cropper-frame': '预览框尺寸（imgWidth / imgHeight）',
  'img-cropper-max-scale': '缩放上限（maxScale）',
  'img-cropper-export-props': '导出声明参数',
  'img-cropper-ratio': '裁剪比例（aspectRatio）',
  'img-cropper-rotate': '禁止旋转与按钮文案（disabledRotate）',
  'img-mode': '裁剪模式（mode）',
  'img-shape': '圆形与圆角（round / radius）',
  'img-preview': '点击预览（enablePreview）',
  'img-lazy-load': '懒加载（lazyLoad）',
  'qr-code-gradient': '渐变码（enableGradient）',
  'qr-code-canvas-id': '画布 id（canvasId）',
  'qr-code-dot-type': '码点形状（dotType）',
  'qr-code-color': '自定义颜色（colorDark / colorLight）',
  'rich-text-style-map': '样式映射（tagStyle / classStyles）',
  'rich-text-anchor': '锚点目录（enableAnchor）',
  'rich-text-empty': '空状态插槽',
  'swiper-data-keys': '数据字段映射',
  'swiper-image-mode': '图片裁切（imageMode）',
  'table-index': '索引列（index）',
  'table-sort': '排序（sortable）',
  'table-fixed': '固定表头与固定列',
  'table-ellipsis': '单元格省略（ellipsis）',
  'table-cell-slot': '自定义单元格（value 插槽）',
  'table-empty': '空态',
  'table-border-stripe': '边框与斑马纹（border / stripe）',
  'table-header': '表头开关（showHeader）',
  'video-preview-selector': '实例标识（selector）',
  'video-preview-layer': '层级与样式（zIndex / customStyle）',
  'video-preview-fullscreen': '全屏模式（fullScreen）',
  'video-preview-close-position': '关闭按钮位置（closePosition）',
  'watermark-image': '图片水印（image）',
  'watermark-font': '文字字体（fontFamily 等）',
  'action-sheet-custom-style': '自定义样式',
  'action-sheet-render': '渲染时机与安全区',
  'action-sheet-header': '标题与关闭按钮',
  'action-sheet-action-icons': '行图标（icon）',
  'circle-speed': '动画速度（speed）',
  'circle-custom-style': '根节点样式',
  'curtain-custom-style': '自定义样式',
  'curtain-longpress': '长按识别菜单（showMenuByLongpress）',
  'dialog-icon': '状态图标（icon）',
  'dialog-theme': '按钮主题（theme）',
  'popup-custom-style': '面板与遮罩样式',
  'popup-render': '懒渲染与安全区',
  'notice-bar-prefix': '前缀图标（prefix）',
  'notice-bar-marquee': '跑马灯参数（delay / speed）',
  'notice-bar-type': '类型（type）',
  'notice-bar-closable': '可关闭（closable）',
  'toast-icon-style': '图标尺寸与颜色',
  'toast-cover': '遮罩阻挡（cover）',
  'toast-z-index': '层级与样式',
  'swipe-action-both-sides': '两侧操作区',
  'swipe-action-before-close': '关闭拦截（before-close）',
  'swipe-action-disabled': '禁用（disabled）',
  'swipe-action-custom-style': '根节点样式',
  'backtop-threshold': '显示阈值（top）',
  'backtop-icon-style': '图标样式与层级',
  'collapse-accordion': '手风琴模式（accordion）',
  'collapse-disabled': '禁用面板（disabled）',
  'collapse-more-slot': 'more 插槽',
  'collapse-before-expend': '展开拦截（before-expend）',
  'collapse-title-slot': 'title 插槽与内容样式',
  'drop-menu-guard': '开关拦截（beforeToggle）',
  'drop-menu-keys': '字段重命名（labelKey / valueKey）',
  'drop-menu-modal': '蒙层行为（modal）',
  'drop-menu-popup-height': '面板高度与样式',
  'drop-menu-disabled': '禁用（disabled）',
  'drop-menu-slot': '自定义面板插槽',
  'grid-clickable': '点击反馈（clickable）',
  'grid-look': '外观（bg-color / center / icon-size）',
  'navbar-slots': '左右插槽',
  'navbar-fixed': '固定定位（fixed / placeholder）',
  'navbar-disabled': '禁用侧按钮（left-disabled）',
  'navbar-safe-area': '安全区与层级',
  'navbar-capsule-slot': '胶囊插槽',
  'pagination-hide-on-one-page': '单页隐藏（hide-if-one-page）',
  'pagination-slots': '插槽自定义',
  'popover-icon-class': '兼容图标字段（iconClass）',
  'popover-content-slot': 'content 插槽',
  'popover-custom-style': '节点类名与偏移',
  'segmented-theme': '主题（theme）',
  'segmented-disabled': '禁用（disabled）',
  'segmented-value': 'value 别名（wot-ui 迁移）',
  'segmented-value-alias': '事件名差异（update:value）',
  'segmented-vibrate': '切换振动（vibrate-short）',
  'segmented-custom-style': '根节点样式',
  'sidebar-icon': '图标（icon）',
  'sidebar-badge': '徽标（badge / is-dot）',
  'sidebar-disabled': '禁用项（disabled）',
  'steps-vertical': '垂直步骤条（vertical）',
  'steps-dot': '点状步骤条（dot）',
  'steps-error': '错误状态（status=error）',
  'steps-space': '间距与对齐（space / align-center）',
  'steps-status': '显式状态（status）',
  'steps-slots': '内容插槽',
  'tabs-animate': '切换动画（animated）',
  'tabs-sticky': '吸顶（sticky）',
  'tabs-line': '底部条样式（line-theme）',
  'tabs-disabled': '禁用页签（disabled）',
  'tabs-icon': '页签图标（icon）',
  'tooltip-arrow': '箭头（visible-arrow）',
  'tooltip-close': '关闭按钮与偏移',
  'tooltip-disabled': '禁用（disabled）',
  'tour-mask': '蒙版（mask / mask-color）',
  'tour-panel-slot': '自定义面板与按钮',
  'tour-z-index': '层级与时长',
  'steps-custom-class': '根节点样式（customClass）',
  'radio-card': '卡片模式（variant=card）',
  'radio-icon': '图标模式（variant=icon）',
  'radio-indicator': '指示器位置与选中态',
  'checkbox-card': '卡片模式（variant=card）',
  'checkbox-indicator': '指示器位置与选中态',
};

/**
 * 组件页画布底色覆盖：输入框页用纯白画布对比深浅组件底色（仅浅色主题，
 * 深色维持暗色画布）。空缺 = 默认中性灰。同步写入 pages.json 的
 * backgroundColor（滚动过界后的窗口底色）。
 */
const PAGE_BG_OVERRIDES = {
  input: '#ffffff',
};

/**
 * 组件页场景模块样式覆盖：列出的组件页 `.module` 卡片转透明（无边框无影）。
 * 下拉菜单的面板是组件自身坐标系内的 absolute 层、遮罩是 fixed 全屏层——
 * 白底卡片会把白色面板吞进卡片里，去掉卡底让面板直接浮在页面画布上。
 */
const MODULE_BARE_PAGES = new Set(['drop-menu', 'tabbar']);

/**
 * 组件页场景模块头部覆盖：列出的组件页不渲染场景标题行（DemoModuleHead），
 * 整页就是 demo 本体。tabbar 的整页 playground（栏固定在屏幕底部、其余
 * 全部是设置项）不需要「完整演示」标题占一行。
 */
const MODULE_HEADLESS_PAGES = new Set(['tabbar']);

/**
 * 场景标题 → 模板属性安全字面量：生成页把标题嵌入
 * `:title="t('zh', 'en')"`——外层是 HTML 双引号属性、内层是 JS 单引号
 * 字符串。`"` 用 `&quot;`（Vue 先做 HTML 实体解码再解析表达式，落进 JS
 * 字符串后无歧义），`'` 与反斜杠用 JS 转义；换行直接抹掉（标题单行）。
 */
function titleAttr(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;')
    .replace(/[\r\n]+/g, ' ');
}

/**
 * 组件内 demo 展示顺序：字母序会把「基础用法」夹在中间，列出的 demo 按
 * 值升序排（基础 → 变体 → 图标 → 状态 → 进阶属性），未列出的保持字母序。
 */
const DEMO_ORDER = {
  'keyboard-mp-basic': 1,
  'keyboard-mp-decimal': 2,
  'keyboard-mp-idcard': 3,
  'keyboard-mp-car-custom': 4,
  'keyboard-mp-labels': 5,
  'keyboard-mp-scrim': 6,
  'button-mp-basic': 1,
  'button-mp-size': 2,
  'button-mp-shape': 3,
  'button-mp-variant': 4,
  'button-mp-state': 5,
  'button-mp-icon-button': 6,
  'button-mp-cell': 7,
  'button-mp-hover': 8,
  'button-mp-loading-props': 9,
  'button-mp-custom': 10,
  'button-mp-form-type': 11,
  'button-mp-open-type': 12,
  'button-mp-mp-open-type': 13,
  'input-mp-basic': 1,
  'input-mp-types': 2,
  'input-mp-sizes': 3,
  'input-mp-radius': 4,
  'input-mp-bordered-bg-radius': 5,
  'input-mp-prefix-suffix': 6,
  'input-mp-slots': 7,
  'input-mp-clearable-count': 8,
  'input-mp-clear-focus': 9,
  'input-mp-password-toggle': 10,
  'input-mp-word-limit': 11,
  'input-mp-status': 12,
  'input-mp-states': 13,
  'input-mp-align-compact': 14,
  'input-mp-native-attrs': 15,
  'input-mp-runtime': 16,
  'input-mp-custom-class': 17,
  'code-input-mp-basic': 1,
  'code-input-mp-shape': 2,
  'code-input-mp-background': 3,
  'code-input-mp-no-border': 4,
  'code-input-mp-error-gutter': 5,
  'code-input-mp-custom-style': 6,
  'plate-input-mp-basic': 1,
  'plate-input-mp-new-energy': 2,
  'waterfall-mp-basic': 1,
  'waterfall-mp-lazy-load': 2,
  'waterfall-mp-responsive': 3,
  'waterfall-mp-masonry-off': 4,
  'tabbar-mp-playground': 1,
};

const SCENARIO_LABELS_EN = {
  basic: 'Basic usage',
  behavior: 'Behavior',
  size: 'Size',
  sizes: 'Sizes',
  shape: 'Shape',
  state: 'State',
  states: 'State',
  custom: 'Custom',
  'custom-class': 'Custom class',
  'custom-style': 'Custom style',
  variant: 'Variants',
  config: 'Configuration',
  slots: 'Slots',
  type: 'Type',
  types: 'Type',
  vertical: 'Vertical',
  color: 'Color',
  icon: 'Icon',
  icons: 'Icons',
  iconfont: 'Icon Button',
  'icon-font': 'Iconfont',
  'icon-button': 'Icon Button',
  gallery: 'Gallery',
  string: 'Catalog names',
  iconify: 'Iconify on demand',
  disabled: 'Disabled',
  style: 'Style',
  scroll: 'Scroll',
  cell: 'Cell',
  layout: 'Layout',
  guard: 'Guard',
  position: 'Position',
  label: 'Label',
  export: 'Export',
  text: 'Text',
  placement: 'Placement',
  badge: 'Badge',
  header: 'Title & description',
  panels: 'Panels',
  sheet: 'Action sheet',
  fields: 'Fields',
  'form-type': 'Form type',
  fallback: 'Fallback',
  threshold: 'Threshold',
  visibility: 'Visibility',
  hover: 'Hover',
  lunar: 'Lunar',
  card: 'Card',
  direction: 'Direction',
  theme: 'Theme',
  page: 'Full page',
  contacts: 'Contacts',
  verify: 'Verification',
  popup: 'Popup',
  height: 'Height',
  interaction: 'Interaction',
  trigger: 'Trigger',
  expand: 'Expand',
  connector: 'Connector',
  node: 'Node',
  swiper: 'Swiper sync',
  paging: 'Paging sync',
  prefix: 'Prefix',
  options: 'Options',
  range: 'Date range',
  formatter: 'Custom text',
  nav: 'Navigation',
  'no-border': 'No border',
  radius: 'Radius',
  decimal: 'Decimal',
  idcard: 'ID number',
  'align-compact': 'Alignment & compact',
  'bordered-bg-radius': 'Border & background',
  'clear-focus': 'Clear & focus',
  'clearable-count': 'Clearable & count',
  'native-attrs': 'Native attributes',
  'password-toggle': 'Password toggle',
  'prefix-suffix': 'Prefix & suffix icons',
  shape: 'Shape',
  background: 'Cell background',
  'error-gutter': 'Plain text & error',
  playground: 'Full playground',
  'new-energy': 'New-energy plate',
  runtime: 'Runtime attributes',
  'word-limit': 'Word limit',
  'lazy-load': 'Lazy load',
  responsive: 'Responsive',
  'masonry-off': 'Masonry off',
  kingkong: 'Quick entry',
};

const SCENARIO_LABEL_OVERRIDES_EN = {
  'input-states': 'Disabled & readonly',
  'input-status': 'Validation status',
  'barcode-format': 'Barcode formats',
  'barcode-layout': 'Layout direction',
  'barcode-style': 'Style props',
  'dialer-size': 'Size',
  'dialer-colors': 'Sector colors',
  'dialer-pointer-slot': 'Custom pointer',
  'dialer-spin': 'Turns & duration',
  'liquid-size': 'Size',
  'liquid-outline': 'Outline ring',
  'liquid-radius': 'Container radius',
  'liquid-colors': 'Wave colors',
  'lucky-grid': 'Grid size',
  'lucky-cell': 'Cell gap & height',
  'lucky-speed': 'Speed & highlight',
  'lucky-button-slot': 'Custom button slot',
  'scratchcard-cover': 'Cover color',
  'scratchcard-ratio': 'Scratch threshold',
  'scratchcard-watermark': 'Watermark',
  'scratchcard-title-style': 'Title styling',
  'typing-text': 'Label toggle',
  'typing-dot-count': 'Dot count',
  'typing-speed': 'Pulse speed',
  'typing-dot-color': 'Dot color',
  'calendar-first-day-of-week': 'First day of week (firstDayOfWeek)',
  'calendar-formatter': 'Cell formatting (formatter)',
  'calendar-range-constraints': 'Range constraints (maxRange / allowSameDay / defaultTime)',
  'calendar-shortcuts-events':
    'Shortcut callback & confirm veto (onShortcutsClick / beforeConfirm)',
  'calendar-declared-props': 'Declared parity props (timeFilter / hideSecond etc.)',
  'calendar-panel': 'Panel size & switching (panelHeight / switchMode)',
  'calendar-immediate-change': 'Immediate write-back (immediateChange)',
  'calendar-sheet-chrome': 'Sheet chrome & footer slot',
  'calendar-view-first-day-of-week': 'First day of week',
  'calendar-view-formatter': 'Cell formatting',
  'calendar-view-panel-title': 'Panel title (showPanelTitle)',
  'calendar-view-range': 'Range selection (type="daterange")',
  'calendar-view-switch-mode': 'Month / year switching (switchMode)',
  'calendar-view-same-day': 'Same start & end day (allowSameDay)',
  'calendar-view-default-time': 'Default time & immediate write-back',
  'calendar-view-time-props': 'Declared time-column props',
  'captcha-copy': 'Custom copy (tips / successText)',
  'captcha-size-tolerance': 'Size & tolerance (width / height / tolerance)',
  'cascader-fields': 'Field mapping (valueKey etc.)',
  'cascader-lazy-load': 'Lazy loading (lazyLoad)',
  'cascader-before-confirm': 'Confirm veto (beforeConfirm)',
  'cascader-indicator': 'Indicator shape (lineTheme)',
  'cascader-sheet-chrome': 'Sheet settings (scrim / stacking / custom)',
  'checkbox-group-limits': 'Count limits (min / max)',
  'checkbox-group-state': 'Group state & half-check',
  'checkbox-toggle-all': 'Select all / clear all (toggleAll)',
  'checkbox-standalone': 'Standalone usage & custom values',
  'checkbox-colors': 'Checked colors (checkedColor)',
  'checkbox-placement': 'Layout & label (placement / maxWidth)',
  'checkbox-custom-style': 'Custom style',
  'code-input-mask': 'Plain display (mask)',
  'code-input-error-info': 'Error state (errorInfo)',
  'code-input-gutter': 'Cell gap (gutter)',
  'date-strip-nav': 'Navigation buttons (show-nav)',
  'datetime-picker-roller-geometry': 'Roller geometry (itemHeight / visibleItemCount)',
  'datetime-picker-time-bounds': 'Hour-minute-second bounds',
  'datetime-picker-column-format': 'Column copy & filtering (formatter / filter)',
  'datetime-picker-immediate-change': 'Immediate write-back (immediateChange)',
  'datetime-picker-sheet-chrome': 'Sheet chrome (labels / scrim / stacking)',
  'datetime-picker-time-type': 'Time type (type="time")',
  'datetime-picker-before-confirm': 'Confirm veto (beforeConfirm)',
  'datetime-picker-view-roller-geometry': 'Roller geometry',
  'datetime-picker-view-keys': 'Field mapping (valueKey / labelKey)',
  'datetime-picker-view-column-formatter': 'Column rewriting (columnFormatter)',
  'datetime-picker-view-boundary': 'Range linkage (boundaryMinDate / boundaryMaxDate)',
  'datetime-picker-view-immediate-change': 'Immediate change (immediateChange)',
  'datetime-picker-view-time-type': 'Time type write-back',
  'datetime-picker-view-formatter': 'Column label formatting (formatter)',
  'form-cell-border': 'Cell dividers & truncation',
  'form-cell-clickable': 'Tappable rows (clickable / isLink)',
  'form-cell-text': 'Placeholder & helper copy',
  'form-size': 'Size',
  'form-value-align': 'Value alignment (valueAlign)',
  'form-asterisk': 'Required asterisk (asteriskPosition / hideAsterisk)',
  'form-title-width': 'Label column width (titleWidth)',
  'form-layout': 'Arrangement (layout / center)',
  'form-schema': 'Form schema',
  'form-status-icon': 'Status icon (statusIcon)',
  'form-message-display': 'Error message display strategies',
  'input-align': 'Right alignment (alignRight)',
  'input-compact': 'Compact inline form (compact)',
  'input-inputmode': 'Soft keyboard hint (inputmode)',
  'input-border': 'Border',
  'input-bg': 'Background',
  'input-clear-trigger': 'Clear button details (clearTrigger / focusWhenClear)',
  'input-focus': 'Autofocus (focus)',
  'input-placeholder': 'Placeholder styling (placeholderClass / placeholderStyle)',
  'input-clearable': 'Clear button (clearable)',
  'input-count': 'Character count (showCount)',
  'input-cursor-spacing': 'Cursor spacing (cursorSpacing)',
  'input-confirm-hold': 'Keyboard hold on confirm (confirmHold)',
  'input-composition': 'Composition input (ignoreCompositionEvent)',
  'input-enable-native': 'Native input (enableNative)',
  'input-confirm-type': 'Confirm button label (confirmType)',
  'input-keyboard-hold': 'Keyboard hold & page push',
  'input-cursor-selection': 'Caret & selection',
  'input-number-step-strictly': 'Step snapping (stepStrictly)',
  'input-number-allow-null': 'Nullable input (allowNull)',
  'input-number-before-change': 'Commit veto (beforeChange)',
  'input-number-commit-timing': 'Commit timing & input attrs',
  'input-number-theme': 'Theme (theme)',
  'input-number-round': 'Rounded (round)',
  'input-number-long-press': 'Long-press repeat (longPress)',
  'input-number-disabled': 'Disabled',
  'keyboard-labels': 'Key labels (deleteText / closeText)',
  'keyboard-delete-key': 'Delete key toggle (showDeleteKey)',
  'keyboard-random-order': 'Shuffled keys (randomKeyOrder)',
  'keyboard-scrim': 'Scrim & sheet behaviour',
  'keyboard-close-loading': 'Close-button loading (closeButtonLoading)',
  'picker-fields': 'Field mapping (`valueKey` / `labelKey` / `childrenKey`)',
  'picker-button-text': 'Button labels (`cancelButtonText` / `confirmButtonText`)',
  'picker-rows': 'Roller geometry (`itemHeight` / `visibleItemCount`)',
  'picker-immediate': 'Commit while scrolling (`immediateChange`)',
  'picker-sheet': 'Sheet behavior (scrim / stacking / safe area)',
  'picker-view-cascade': 'Cascade mode (`cascade`)',
  'picker-view-disabled': 'Disabled (`disabled`)',
  'picker-view-rows': 'Roller geometry (`itemHeight` / `visibleItemCount`)',
  'picker-view-keys': 'Custom field names (`valueKey` / `labelKey` / `childrenKey`)',
  'picker-view-immediate': 'Live commit while dragging (`immediateChange`)',
  'picker-view-custom-style': 'Root styling (`customClass` / `customStyle`)',
  'plate-input-new-energy': 'New-energy plates (`maxlength=8`)',
  'plate-input-disabled': 'Disabled (`disabled`)',
  'radio-colors': 'Checked colors (`checkedColor` / `uncheckedColor`)',
  'radio-custom-style': 'Custom class names & styles',
  'radio-uncheck': 'Uncheck on re-tap (`allowUncheck`)',
  'radio-disabled-readonly': 'Disabled & readonly (`disabled` / `readonly`)',
  'radio-placement': 'Marker placement (`placement`)',
  'rate-half': 'Half stars (`allowHalf`)',
  'rate-clearable': 'Clearable (`clearable`)',
  'rate-color': 'Rating colors (`activeColor`)',
  'rate-readonly': 'Readonly (`readonly`)',
  'rate-space': 'Gap & full-row spread (`space` / `size` / `block`)',
  'rate-icon': 'Custom icons (`icon` / `activeIcon`)',
  'rate-css-icon': 'CSS-class glyphs (`cssIcon`)',
  'rate-disabled': 'Disabled (`disabled`)',
  'rate-custom-style': 'Root styling (`customClass` / `customStyle`)',
  'search-cancel': 'Cancel button (`cancelTxt` / `hideCancel`)',
  'search-placeholder-left': 'Left-aligned placeholder (`placeholderLeft`)',
  'search-disabled': 'Disabled (`disabled`)',
  'search-maxlength': 'Character cap (`maxlength`)',
  'search-focus': 'Focus (`focus` / `focusWhenClear`)',
  'search-custom-style':
    'Inner-input & root styling (`customInputClass` / `customClass` / `customStyle`)',
  'search-placeholder-style': 'Placeholder styling (`placeholderStyle` / `placeholderClass`)',
  'select-picker-type-radio': 'Radio mode (`type=radio`)',
  'select-picker-filterable': 'Filterable (`filterable`)',
  'select-picker-fields': 'Field mapping (`valueKey` / `labelKey`)',
  'select-picker-chip-size': 'Chip size & confirm (`selectSize` / `showConfirm`)',
  'select-picker-checked-color': 'Checked color (`checkedColor`)',
  'select-picker-loading': 'Loading state (`loading`)',
  'select-picker-before-confirm': 'Confirm guard (`beforeConfirm`)',
  'select-picker-sheet': 'Sheet behavior & styling',
  'select-picker-scroll-into-view': 'Scroll into view (`scrollIntoView`)',
  'signature-history': 'Undo / redo (`enableHistory`)',
  'signature-pen': 'Pen look (`penColor` / `lineWidth`)',
  'signature-disabled': 'Disabled (`disabled`)',
  'signature-size': 'Pad size & background',
  'signature-scroll': 'Pad scrolling (`disableScroll`)',
  'signature-step': 'Undo step (`step`)',
  'signature-export': 'Export params (`fileType` / `quality` / `exportScale`)',
  'signature-stroke': 'Stroke params (`pressure` / `lineWidth`)',
  'slide-verify-text': 'Copy (`text` / `successText`)',
  'slide-verify-color': 'Track colors (`backgroundColor`)',
  'slide-verify-disabled': 'Disabled (`disabled`)',
  'slide-verify-icons': 'Icon glyphs (`icon` / `successIcon`)',
  'slide-verify-tolerance': 'Tolerance (`tolerance`)',
  'slide-verify-custom-style': 'Root styling',
  'slider-bar-basic': 'Basic usage',
  'slider-bar-range': 'Range (`range`)',
  'slider-bar-theme': 'Theme (`theme`)',
  'slider-bar-size': 'Size (`size`)',
  'slider-bar-variant': 'Vertical (`variant=column`)',
  'slider-range': 'Range & marks (`range` / `marks`)',
  'slider-theme': 'Theme (`theme`)',
  'slider-disabled': 'Disabled (`disabled`)',
  'slider-vertical': 'Vertical (`vertical`)',
  'slider-popover': 'Value bubble (`popoverVisible`)',
  'slider-color': 'Track colors (`activeColor`)',
  'slider-custom-style': 'Root styling',
  'sort-button-cycle': 'Sort cycle (`allowReset` / `descFirst`)',
  'sort-button-line': 'Underline (`line`)',
  'switch-text': 'Rail text (`activeText` / `inactiveText`)',
  'switch-shape': 'Shape (`shape`)',
  'switch-size': 'Size (`size`)',
  'switch-color': 'Switch colors (`activeColor`)',
  'switch-loading': 'Loading (`loading`)',
  'switch-custom-style': 'Root styling',
  'textarea-word-limit': 'Word limit (`showWordLimit`)',
  'textarea-clearable': 'Clearable (`clearable`)',
  'textarea-error': 'Error state (`error`)',
  'textarea-prefix-icon': 'Leading icon (`prefixIcon`)',
  'textarea-placeholder': 'Placeholder styling',
  'textarea-auto-height': 'Auto height (`autoHeight`)',
  'textarea-disabled-readonly': 'Readonly & disabled (`readonly` / `disabled`)',
  'textarea-compact': 'Compact (`compact`)',
  'upload-disabled': 'Disabled (`disabled`)',
  'upload-accept': 'Picker type (`accept`)',
  'upload-status': 'File status rendering (`status`)',
  'upload-image-mode': 'Thumbnail mode (`imageMode`)',
  'upload-custom-style': 'Three styling mount points',
  'avatar-css-icon': 'Font icons (`cssIcon` / `iconPrefix`)',
  'avatar-mode': 'Image fit (`mode`)',
  'avatar-size': 'Size (`size`)',
  'avatar-shape': 'Shape (`shape`)',
  'avatar-status': 'Presence status (`status`)',
  'avatar-badge': 'Badge avatars (badge composition)',
  'badge-dot': 'Dot badge (`is-dot`)',
  'badge-shape': 'Shape & border (`shape` / `border`)',
  'badge-offset': 'Offset & color (`top` / `right` / `bgColor`)',
  'button-block': 'Block button (`block`)',
  'button-round': 'Round button (`round`)',
  'button-color-override': 'Inline color overrides (`bgColor` / `color`)',
  'button-loading-color': 'Spinner customization (`loadingColor` / `loadingSize`)',
  'button-loading-props': 'The `loading-props` object',
  'button-hairline': 'Hairline border (`hairline`)',
  'fab-expandable': 'Click-only (`expandable`)',
  'fab-disabled': 'Disabled (`disabled`)',
  'fab-trigger-icons': 'Trigger icon dual-track',
  'fab-type': 'Theme color (`type`)',
  'icon-size': 'Sizes (`size`)',
  'icon-stroke-width': 'Stroke width (`strokeWidth`)',
  'layout-gutter': 'Gutters & offsets (`gutter` / `offset`)',
  'tag-closable': 'Closable tags (`closable`)',
  'tag-dynamic': 'Dynamic tags (`dynamic`)',
  'tag-color': 'Custom colors (`bgColor` / `color`)',
  'tag-css-icon': 'Font icons (`cssIcon`)',
  'tag-size': 'Size (`size`)',
  'tag-round-mark': 'Round & mark shapes (`round` / `mark`)',
  'text-lines': 'Line clamping (`lines`)',
  'text-typography': 'Typography overrides (`size` / `lineHeight` / `color`)',
  'transition-combined': 'Combined animations (`name` array)',
  'transition-duration': 'Per-leg durations (`duration`)',
  'transition-destroy': 'Keep node (`destroy`)',
  'transition-lazy-render': 'Lazy rendering (`lazyRender`)',
  'transition-touch-move': 'Block touch scroll (`disableTouchMove`)',
  'count-down-control': 'Controls (start / pause / reset)',
  'count-down-millisecond': 'Millisecond rendering (`millisecond`)',
  'count-to-type': 'Type colors (`type`)',
  'count-to-control': 'Controls',
  'image-preview-selector': '`selector` hit areas',
  'image-preview-close-behavior': 'Close & loop behaviour',
  'image-preview-longpress': 'Long-press menu & event',
  'image-preview-close-position': 'Close button position (`closeIconPosition`)',
  'image-preview-index': 'Page counter & footer slot',
  'img-cropper-frame': 'Preview frame size (`imgWidth` / `imgHeight`)',
  'img-cropper-max-scale': 'Zoom cap (`maxScale`)',
  'img-cropper-export-props': 'Declared export props',
  'img-cropper-ratio': 'Aspect ratio (`aspectRatio`)',
  'img-cropper-rotate': 'Disable rotation & button labels (`disabledRotate`)',
  'img-mode': 'Crop modes (`mode`)',
  'img-shape': 'Round & radius (`round` / `radius`)',
  'img-preview': 'Tap-to-preview (`enablePreview`)',
  'img-lazy-load': 'Lazy loading (`lazyLoad`)',
  'qr-code-gradient': 'Gradient codes (`enableGradient`)',
  'qr-code-canvas-id': 'Canvas id (`canvasId`)',
  'qr-code-dot-type': 'Module shapes (`dotType`)',
  'qr-code-color': 'Custom colors (`colorDark` / `colorLight`)',
  'rich-text-style-map': 'Style maps (`tagStyle` / `classStyles`)',
  'rich-text-anchor': 'Heading anchors (`enableAnchor`)',
  'rich-text-empty': 'Empty state slot',
  'swiper-data-keys': 'Data field mapping',
  'swiper-image-mode': 'Image fit (`imageMode`)',
  'table-index': 'Index column (`index`)',
  'table-sort': 'Sorting (`sortable`)',
  'table-fixed': 'Pinned header & columns',
  'table-ellipsis': 'Cell ellipsis (`ellipsis`)',
  'table-cell-slot': 'Custom cells (`value` slot)',
  'table-empty': 'Empty state',
  'table-border-stripe': 'Borders & stripes (`border` / `stripe`)',
  'table-header': 'Header toggle (`showHeader`)',
  'video-preview-selector': 'Instance id (`selector`)',
  'video-preview-layer': 'Stacking & style (`zIndex` / `customStyle`)',
  'video-preview-fullscreen': 'Full-screen mode (`fullScreen`)',
  'video-preview-close-position': 'Close button position (`closePosition`)',
  'watermark-image': 'Image watermark (`image`)',
  'watermark-font': 'Text font (`fontFamily` etc.)',
  'action-sheet-custom-style': 'Custom styles',
  'action-sheet-render': 'Render timing & safe area',
  'action-sheet-header': 'Header & close button',
  'action-sheet-action-icons': 'Row icons (`icon`)',
  'circle-speed': 'Animation speed (`speed`)',
  'circle-custom-style': 'Root styling',
  'curtain-custom-style': 'Custom styles',
  'curtain-longpress': 'Long-press menu (`showMenuByLongpress`)',
  'dialog-icon': 'Status icon (`icon`)',
  'dialog-theme': 'Button theme (`theme`)',
  'popup-custom-style': 'Panel & scrim styling',
  'popup-render': 'Lazy render & safe area',
  'notice-bar-prefix': 'Prefix icon (`prefix`)',
  'notice-bar-marquee': 'Marquee params (`delay` / `speed`)',
  'notice-bar-type': 'Types (`type`)',
  'notice-bar-closable': 'Closable (`closable`)',
  'toast-icon-style': 'Glyph size & colors',
  'toast-cover': 'Click-blocking scrim (`cover`)',
  'toast-z-index': 'Stacking & styling',
  'swipe-action-both-sides': 'Both sides',
  'swipe-action-before-close': 'Close guard (`before-close`)',
  'swipe-action-disabled': 'Disabled (`disabled`)',
  'swipe-action-custom-style': 'Root styling',
  'backtop-threshold': 'Visibility threshold (`top`)',
  'backtop-icon-style': 'Icon styling & stacking',
  'collapse-accordion': 'Accordion mode (`accordion`)',
  'collapse-disabled': 'Disabled panel (`disabled`)',
  'collapse-more-slot': 'The `more` slot',
  'collapse-before-expend': 'Expand guard (`before-expend`)',
  'collapse-title-slot': '`title` slot & content styling',
  'drop-menu-guard': 'Toggle guard (`beforeToggle`)',
  'drop-menu-keys': 'Field keys (`labelKey` / `valueKey`)',
  'drop-menu-modal': 'Scrim behavior (`modal`)',
  'drop-menu-popup-height': 'Panel height & styling',
  'drop-menu-disabled': 'Disabled (`disabled`)',
  'drop-menu-slot': 'Custom panel slot',
  'grid-clickable': 'Tap feedback (`clickable`)',
  'grid-look': 'Looks (`bg-color` / `center` / `icon-size`)',
  'navbar-slots': 'Left & right slots',
  'navbar-fixed': 'Fixed positioning (`fixed` / `placeholder`)',
  'navbar-disabled': 'Disabled sides (`left-disabled`)',
  'navbar-safe-area': 'Safe area & stacking',
  'navbar-capsule-slot': 'Capsule slot',
  'pagination-hide-on-one-page': 'Hide on single page (`hide-if-one-page`)',
  'pagination-slots': 'Slot customization',
  'popover-icon-class': 'Legacy icon field (`iconClass`)',
  'popover-content-slot': '`content` slot',
  'popover-custom-style': 'Node classes & offset',
  'segmented-theme': 'Theme (`theme`)',
  'segmented-disabled': 'Disabled (`disabled`)',
  'segmented-value': 'The `value` alias (wot-ui migration)',
  'segmented-value-alias': 'Event-name difference (`update:value`)',
  'segmented-vibrate': 'Switch haptics (`vibrate-short`)',
  'segmented-custom-style': 'Root styling',
  'sidebar-icon': 'Icons (`icon`)',
  'sidebar-badge': 'Badges (`badge` / `is-dot`)',
  'sidebar-disabled': 'Disabled items (`disabled`)',
  'steps-vertical': 'Vertical steps (`vertical`)',
  'steps-dot': 'Dot steps (`dot`)',
  'steps-error': 'Error state (`status=error`)',
  'steps-space': 'Spacing & alignment (`space` / `align-center`)',
  'steps-status': 'Explicit status (`status`)',
  'steps-slots': 'Content slots',
  'tabs-animate': 'Switch animation (`animated`)',
  'tabs-sticky': 'Sticky pinning (`sticky`)',
  'tabs-line': 'Bar styles (`line-theme`)',
  'tabs-disabled': 'Disabled tabs (`disabled`)',
  'tabs-icon': 'Tab icons (`icon`)',
  'tooltip-arrow': 'Arrow (`visible-arrow`)',
  'tooltip-close': 'Close button & offset',
  'tooltip-disabled': 'Disabled (`disabled`)',
  'tour-mask': 'Mask (`mask` / `mask-color`)',
  'tour-panel-slot': 'Custom panel & buttons',
  'tour-z-index': 'Stacking & duration',
  'steps-custom-class': 'Root styling (customClass)',
  'radio-card': 'Card variant',
  'radio-icon': 'Icon variant',
  'radio-indicator': 'Indicator placement & checked paint',
  'checkbox-card': 'Card variant',
  'checkbox-indicator': 'Indicator placement & checked paint',
};

function scenarioLabel(comp, scenario) {
  if (scenario === undefined || scenario === '') return SCENARIO_LABELS.basic;
  return SCENARIO_LABEL_OVERRIDES[`${comp}-${scenario}`] ?? SCENARIO_LABELS[scenario] ?? scenario;
}

/** 场景英文标题：映射表优先，未收录的 key 用 Title Case 兜底。 */
function scenarioLabelEn(comp, scenario) {
  if (scenario === undefined || scenario === '') return SCENARIO_LABELS_EN.basic;
  return (
    SCENARIO_LABEL_OVERRIDES_EN[`${comp}-${scenario}`] ??
    SCENARIO_LABELS_EN[scenario] ??
    titleEnOf(scenario)
  );
}

// ── 扫描 demo 源（src/pages/<group>/demos/） ────────────────────────────────
/** @type {Map<string, Array<{name: string, scenario: string, hasEn: boolean}>>} */
const byComp = new Map();
const enNames = new Set();
const demoFiles = [];
const groupDirs = readdirSync(pagesDir).filter(
  (d) => !d.startsWith('.') && !d.startsWith('._') && d !== 'index' && d !== 'index.html',
);
for (const group of groupDirs) {
  const demosDir = `${pagesDir}${group}/demos`;
  let files = [];
  try {
    files = readdirSync(demosDir);
  } catch {
    continue;
  }
  for (const file of files) {
    if (!file.endsWith('.vue') || file.startsWith('._')) continue;
    demoFiles.push({ group, file });
  }
}
for (const { file } of demoFiles) {
  if (file.endsWith('.en.vue')) {
    enNames.add(file.slice(0, -'.en.vue'.length));
  }
}
for (const { file } of demoFiles) {
  if (file.endsWith('.en.vue')) continue;
  const name = file.slice(0, -'.vue'.length);
  const m = name.match(COMP_RE);
  if (m === null) continue;
  const comp = m[1];
  const scenario = m[2] ?? '';
  if (!byComp.has(comp)) byComp.set(comp, []);
  byComp.get(comp).push({ name, scenario, hasEn: enNames.has(name) });
}
for (const list of byComp.values()) {
  /** Demo 展示顺序：DEMO_ORDER 显式声明优先，未声明的回退字母序。 */
  const demoRank = (name) => DEMO_ORDER[name] ?? Number.MAX_SAFE_INTEGER;
  for (const list of byComp.values()) {
    list.sort((a, b) => demoRank(a.name) - demoRank(b.name) || a.name.localeCompare(b.name));
  }
}

// ── 组件分组与元数据（分组/切分单源见 scripts/subpackages.mjs） ─────────────
const { comps: compMeta, groupOrder } = parseOverviewData();
const groups = new Map();
for (const comp of [...byComp.keys()].sort()) {
  const meta = compMeta.get(comp) ?? { title: comp, desc: '', group: 'more' };
  if (!groups.has(meta.group)) groups.set(meta.group, []);
  groups.get(meta.group).push({ key: comp, ...meta, demos: byComp.get(comp) });
}
const subpackages = splitSubpackages(groups, groupOrder);

// ── 生成 pages.json ────────────────────────────────────────────────────────
const pagesJson = {
  pages: [
    {
      path: 'pages/index/index',
      style: {
        navigationBarTitleText: 'snui 组件演示',
        // 通栏：画布渐变铺满视口，首页品牌区自行承担顶部（DemoPageShell blend）。
        navigationStyle: 'custom',
      },
    },
  ],
  subPackages: subpackages.map((sub) => ({
    root: `pages/${sub.root}`,
    pages: sub.comps.map((comp) => ({
      path: comp.key,
      style: {
        navigationBarTitleText: comp.title,
        // 通栏：原生导航栏退位，DemoPageShell 渲染毛玻璃悬浮头部（背景与
        // 内容区渐变一致）；个别页面需要原生栏时在此覆盖为 default。
        navigationStyle: 'custom',
        ...(PAGE_BG_OVERRIDES[comp.key] ? { backgroundColor: PAGE_BG_OVERRIDES[comp.key] } : {}),
      },
    })),
  })),
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'snui',
    // 与画布渐变顶色（--demo-page-canvas 起 #f8fafc）一致，导航栏不再以
    // 白条割裂页面顶部。
    navigationBarBackgroundColor: '#F8FAFC',
    backgroundColor: '#F8FAFC',
  },
};
writeFileSync(`${pagesDir}../pages.json`, `${JSON.stringify(pagesJson, null, 2)}\n`);

// ── 生成首页数据（首页页面本体 src/pages/index/index.vue 为手写代码） ──────
const homeGroups = subpackages.map((sub) => ({
  key: sub.root,
  label: sub.label,
  labelEn: GROUP_LABELS_EN[sub.group] ?? sub.label,
  comps: sub.comps.map((comp) => ({
    key: comp.key,
    group: sub.root,
    title: comp.title,
    titleEn: titleEnOf(comp.key),
    desc: comp.desc,
    count: comp.demos.length,
  })),
}));
const homeDataTs = `// 由 scripts/gen-pages.mjs 生成，勿手改；demo 变更后重跑 \`pnpm gen:pages\`。
export interface DemoHomeComp {
  key: string
  group: string
  title: string
  titleEn: string
  desc: string
  count: number
}

export interface DemoHomeGroup {
  key: string
  label: string
  labelEn: string
  comps: DemoHomeComp[]
}

export const HOME_GROUPS: DemoHomeGroup[] = ${JSON.stringify(homeGroups, null, 2)}
`;
mkdirSync(`${pagesDir}index`, { recursive: true });
writeFileSync(`${pagesDir}index/home-data.ts`, homeDataTs);

// ── 生成组件聚合页 ─────────────────────────────────────────────────────────
// 只清理聚合页 .vue 文件，保留 demos/（demo 源由 fork-demos.mjs 管理，
// 组件 chunk 依赖 demos 与聚合页同处一个 subPackage 目录）。
for (const sub of subpackages) {
  mkdirSync(`${pagesDir}${sub.root}`, { recursive: true });
  for (const f of readdirSync(`${pagesDir}${sub.root}`)) {
    if (f.endsWith('.vue') && !f.startsWith('._')) {
      rmSync(`${pagesDir}${sub.root}/${f}`);
    }
  }
  for (const comp of sub.comps) {
    const isHeadless = MODULE_HEADLESS_PAGES.has(comp.key);
    const imports = [
      ...comp.demos.map((demo, i) => `import Demo${i} from './demos/${demo.name}.vue'`),
      ...(isHeadless ? [] : [`import DemoModuleHead from '../../components/DemoModuleHead.vue'`]),
      `import DemoPageShell from '../../components/DemoPageShell.vue'`,
      ...(isHeadless ? [] : [`import { useDemoUi } from '../../state/demo-ui';`]),
    ].join('\n');
    const modules = comp.demos
      .map((demo, i) => {
        if (isHeadless) {
          // 无模块头页面：整页就是 demo 本体，不再包 .module 卡片与标题行。
          return `      <Demo${i} />`;
        }
        const badge = demo.scenario === '' ? '' : ` badge="${demo.scenario}"`;
        return `      <view class="module">
        <DemoModuleHead :title="t('${titleAttr(scenarioLabel(comp.key, demo.scenario))}', '${titleAttr(scenarioLabelEn(comp.key, demo.scenario))}')"${badge} />
        <view class="module__body">
          <Demo${i} />
        </view>
      </view>`;
      })
      .join('\n');
    const vue = `<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— ${comp.key} 组件全部场景聚合页（静态展开）。
${imports}
${
  isHeadless
    ? ''
    : `
// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();`
}
</script>

<template>
  <DemoPageShell :title-zh="'${titleAttr(comp.title)}'" :title-en="'${titleAttr(titleEnOf(comp.key))}'" :desc="'${titleAttr(comp.desc)}'" :bg="'${PAGE_BG_OVERRIDES[comp.key] ?? ''}'">
    <view class="page">
${modules}
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx 24rpx 48rpx;
}

/* 场景模块：白底圆角卡片（组件规范视觉稿：浅灰渐变画布上的浮起分区卡）。
 * 刻意不设 overflow / transform / backdrop-filter——它们会把 position: fixed
 * 的后代变成卡片坐标系，弹窗类 demo（calendar / popup / dialog …）会被困在
 * 卡片内裁切显示不全；层级感由描边 + 柔影承担。 */
.module {
  margin-bottom: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  background: var(--demo-card-bg);
  border: 1px solid var(--demo-card-border);
  box-shadow: var(--demo-card-shadow);
}
${
  !isHeadless && MODULE_BARE_PAGES.has(comp.key)
    ? `
/* ${comp.key}：场景模块透明变体——组件的面板是自身坐标系内的 absolute 层、
 * 遮罩是 fixed 全屏层，白底卡片会把白色面板吞进卡片；去掉卡底与描边，
 * 面板与遮罩直接浮在页面画布上，浮起感由遮罩 + 柔影承担。 */
.module {
  background: transparent;
  border: none;
  box-shadow: none;
}`
    : ''
}

.module__body {
  padding: 0;
}
</style>
`;
    writeFileSync(`${pagesDir}${sub.root}/${comp.key}.vue`, vue);
  }
}
const manifest = {
  note: '由 apps/uni-demo/scripts/gen-pages.mjs 生成，勿手改',
  components: Object.fromEntries(
    subpackages.flatMap((sub) =>
      sub.comps.map((comp) => [
        comp.key,
        {
          group: sub.root,
          title: comp.title,
          desc: comp.desc,
          page: `pages/${sub.root}/${comp.key}`,
          demos: comp.demos.map((demo) => ({
            name: demo.name,
            title: scenarioLabel(comp.key, demo.scenario),
            hasEn: demo.hasEn,
          })),
        },
      ]),
    ),
  ),
};
writeFileSync(manifestOut, `${JSON.stringify(manifest, null, 2)}\n`);

const totalDemos = [...byComp.values()].reduce((sum, list) => sum + list.length, 0);
console.log(
  `[gen-pages] comps: ${byComp.size}, demos: ${totalDemos}, subpackages: ${subpackages.map((s) => s.root).join(', ')}`,
);

// 生成物统一 prettier（幂等）：聚合页 / 首页 / pages.json / manifest。
// demos/ 不在范围内（fork 源保持与 docs 原文件一致的风格演进）。
try {
  execFileSync(
    'pnpm',
    [
      'exec',
      'prettier',
      '--write',
      '--log-level',
      'silent',
      manifestOut,
      `${pagesDir}../pages.json`,
      `${pagesDir}index/home-data.ts`,
      `${pagesDir}/*/*.vue`,
    ],
    { stdio: 'inherit', shell: false },
  );
} catch {
  console.warn('[gen-pages] prettier 不可用，跳过格式化（不影响产物正确性）');
}
