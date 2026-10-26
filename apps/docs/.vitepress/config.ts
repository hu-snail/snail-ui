import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import type { Options as MiniSearchOptions } from 'minisearch'
import { rawDocSource } from './utils/raw-doc-source'
import { demoGrid } from './utils/demo-grid'
import { EDIT_BASE } from './utils/edit-link'

/**
 * uni-demo 部署站（docs 预览 iframe 的目标，见 utils/uni-demo-base.ts）。
 * 本地联调：UNI_DEMO_PREVIEW_BASE=http://localhost:5173 pnpm dev
 */
const UNI_DEMO_BASE = process.env.UNI_DEMO_PREVIEW_BASE ?? 'https://hu-snail.github.io/snail-ui/'

/**
 * VitePress config — bilingual (zh default + en) + multi-end (Web + uni-app).
 *
 * Per ADR-0001 + ADR-0002:
 *   AUI is an AI-Native component library with Style Pack + AI Layer.
 *   Docs describe real components and Style Packs.
 *
 * Local search (VitePress built-in minisearch) is configured below to
 * support Chinese content: we slice CJK characters into per-character
 * tokens + sliding bigrams so substring searches like '按钮' or '分割'
 * hit pages whose content contains those characters. ASCII words are
 * tokenized on whitespace + punctuation.
 */

const nav = [
  { text: '指南', link: '/guide/web/intro' },
  { text: '组件 · Web', link: '/components/web/button' },
  { text: '组件 · uni-app', link: '/components/uni/button' },
  { text: '风格包', link: '/style-packs/overview' },
  { text: '主题', link: '/theme/overview' },
  { text: 'AI 生态', link: '/ai/overview' },
  { text: '模板', link: '/templates/overview' },
]

const sidebar = {
  '/guide/': [
    {
      text: '快速开始',
      items: [
        { text: '介绍', link: '/guide/web/intro' },
        { text: '架构', link: '/guide/web/architecture' },
        { text: 'Web 快速开始', link: '/guide/web/quick-start' },
        { text: 'uni-app 快速开始', link: '/guide/uni/quick-start' },
        { text: 'uni-app x（蒸汽模式）', link: '/guide/uni/uni-app-x' },
      ],
    },
    {
      text: '进阶',
      items: [
        { text: 'SSR / Nuxt', link: '/guide/web/ssr-nuxt' },
        { text: '国际化 i18n', link: '/guide/web/i18n' },
        { text: '字体配置', link: '/guide/web/fonts' },
      ],
    },
  ],
  // Component categories — one entry per category. Each entry maps to one
  // or more component pages. Order matters (left-to-right in sidebar).
  // Categories with empty `items` are hidden from sidebar (VitePress collapses
  // empty sections). Add the first component page link to a category to make
  // it appear.
  //
  // Per Spec-02 v1.1 + WBS v3.1, the planned category taxonomy is:
  //   基础组件 / 表单组件 / 数据展示 / 导航组件 / 反馈组件 / 其他 / AI 组件
  // Currently shipped: Button + Divider (Basic) + ConfigProvider (Other).
  '/components/web/': [
    {
      text: 'Basic 基础组件',
      items: [
        { text: 'Button 按钮', link: '/components/web/button' },
        { text: 'Divider 分割线', link: '/components/web/divider' },
        { text: 'Icon 图标', link: '/components/web/icon' },
        { text: 'Text 排版', link: '/components/web/text' },
        { text: 'Avatar 头像', link: '/components/web/avatar' },
        { text: 'Tag 标签', link: '/components/web/tag' },
        { text: 'Dropdown 下拉菜单', link: '/components/web/dropdown' },
        { text: 'Popover 弹出层', link: '/components/web/popover' },
        { text: 'Popconfirm 气泡确认', link: '/components/web/popconfirm' },
        { text: 'Popselect 气泡选择', link: '/components/web/popselect' },
        { text: 'AvatarGroup 头像组', link: '/components/web/avatar-group' },
        { text: 'Link 链接', link: '/components/web/link' },
      ],
    },
    {
      text: 'Form 表单组件',
      items: [
        { text: 'Input 输入框', link: '/components/web/input' },
        { text: 'InputNumber 数字输入', link: '/components/web/input-number' },
        { text: 'AutoComplete 自动补全', link: '/components/web/auto-complete' },
        { text: 'Select 选择器', link: '/components/web/select' },
        { text: 'DynamicInput 动态输入', link: '/components/web/dynamic-input' },
        { text: 'DynamicTags 动态标签', link: '/components/web/dynamic-tags' },
        { text: 'Cascader 级联选择', link: '/components/web/cascader' },
        { text: 'TreeSelect 树选择', link: '/components/web/tree-select' },
        { text: 'TimePicker 时间选择', link: '/components/web/time-picker' },
        { text: 'DatePicker 日期选择', link: '/components/web/date-picker' },
        { text: 'ColorPicker 颜色选择', link: '/components/web/color-picker' },
        { text: 'Mention 提及', link: '/components/web/mention' },
        { text: 'Upload 上传', link: '/components/web/upload' },
        { text: 'Checkbox 多选框', link: '/components/web/checkbox' },
        { text: 'Radio 单选框', link: '/components/web/radio' },
        { text: 'Switch 开关', link: '/components/web/switch' },
        { text: 'Slider 滑块', link: '/components/web/slider' },
        { text: 'Rate 评分', link: '/components/web/rate' },
        { text: 'Form 表单', link: '/components/web/form' },
        { text: 'Transfer 穿梭框', link: '/components/web/transfer' },
      ],
    },
    {
      text: 'Layout 布局组件',
      items: [
        { text: 'Card 卡片', link: '/components/web/card' },
        { text: 'Grid 网格', link: '/components/web/grid' },
        { text: 'Collapse 折叠面板', link: '/components/web/collapse' },
        { text: 'Space 间距', link: '/components/web/space' },
        { text: 'Flex 弹性布局', link: '/components/web/flex' },
        { text: 'Layout 布局', link: '/components/web/layout' },
        { text: 'Splitter 分栏', link: '/components/web/splitter' },
        { text: 'Waterfall 瀑布流', link: '/components/web/waterfall' },
      ],
    },
    {
      text: 'Navigation 导航组件',
      items: [
        { text: 'Menu 菜单', link: '/components/web/menu' },
        { text: 'Breadcrumb 面包屑', link: '/components/web/breadcrumb' },
        { text: 'Tabs 标签页', link: '/components/web/tabs' },
        { text: 'Steps 步骤条', link: '/components/web/steps' },
        { text: 'Tooltip 工具提示', link: '/components/web/tooltip' },
        { text: 'Affix 固钉', link: '/components/web/affix' },
        { text: 'Anchor 锚点', link: '/components/web/anchor' },
        { text: 'BackTop 回到顶部', link: '/components/web/back-top' },
        { text: 'FloatButton 悬浮按钮', link: '/components/web/float-button' },
        { text: 'Pagination 分页', link: '/components/web/pagination' },
        { text: 'PageHeader 页头', link: '/components/web/page-header' },
      ],
    },
    {
      text: 'Feedback 反馈组件',
      items: [
        { text: 'Alert 提示', link: '/components/web/alert' },
        { text: 'Dialog 对话框', link: '/components/web/dialog' },
        { text: 'Drawer 抽屉', link: '/components/web/drawer' },
        { text: 'Loading 加载中', link: '/components/web/loading' },
        { text: 'Skeleton 骨架屏', link: '/components/web/skeleton' },
        { text: 'Notification 通知', link: '/components/web/notification' },
        { text: 'LoadingBar 加载条', link: '/components/web/loading-bar' },
        { text: 'Progress 进度条', link: '/components/web/progress' },
      ],
    },
    {
      text: 'Data Display 数据展示',
      items: [
        { text: 'Calendar 日历', link: '/components/web/calendar' },
        { text: 'Carousel 轮播图', link: '/components/web/carousel' },
        { text: 'Marquee 跑马灯', link: '/components/web/marquee' },
        { text: 'Countdown 倒计时', link: '/components/web/countdown' },
        { text: 'Code 代码', link: '/components/web/code' },
        { text: 'Comment 注释', link: '/components/web/comment' },
        { text: 'DataTable 数据表格', link: '/components/web/data-table' },
        { text: 'Descriptions 描述列表', link: '/components/web/descriptions' },
        { text: 'Empty 空状态', link: '/components/web/empty' },
        { text: 'Equation 公式', link: '/components/web/equation' },
        { text: 'Image 图片', link: '/components/web/image' },
        { text: 'VideoPreview 视频预览', link: '/components/web/video-preview' },
        { text: 'List 列表', link: '/components/web/list' },
        { text: 'Log 日志', link: '/components/web/log' },
        { text: 'NumberAnimation 数字动画', link: '/components/web/number-animation' },
        { text: 'QRCode 二维码', link: '/components/web/qr-code' },
        { text: 'Statistic 统计数值', link: '/components/web/statistic' },
        { text: 'Table 表格', link: '/components/web/table' },
        { text: 'Thing 单个物件', link: '/components/web/thing' },
        { text: 'Time 时间', link: '/components/web/time' },
        { text: 'Timeline 时间线', link: '/components/web/timeline' },
        { text: 'Tree 树', link: '/components/web/tree' },
        { text: 'InfiniteScroll 无限滚动', link: '/components/web/infinite-scroll' },
        { text: 'Highlight 高亮文本', link: '/components/web/highlight' },
        { text: 'Heatmap 热力图', link: '/components/web/heatmap' },
        { text: 'Watermark 水印', link: '/components/web/watermark' },
        { text: 'Ellipsis 文本省略', link: '/components/web/ellipsis' },
        { text: 'VirtualList 虚拟列表', link: '/components/web/virtual-list' },
      ],
    },
    // Other 其他 — empty until ConfigProvider page ships.
    // Feedback 反馈组件 — SnToast / SnModal pending.
    // AI 组件 — empty until SnippetPanel / StylePreview / RenderShot ship.
  ],
  '/components/uni/': [
    {
      text: 'Overview 总览',
      items: [
        { text: '组件总览'.trim(), link: '/components/uni/overview' },
      ],
    },
    {
      text: 'Basic 基础组件',
      items: [
        { text: 'sn-button 按钮'.trim(), link: '/components/uni/button' },
        { text: 'sn-icon 图标'.trim(), link: '/components/uni/icon' },
        { text: 'sn-text 文本'.trim(), link: '/components/uni/text' },
        { text: 'sn-layout 布局'.trim(), link: '/components/uni/layout' },
        { text: 'sn-cell 单元格'.trim(), link: '/components/uni/cell' },
        { text: 'sn-fab 悬浮按钮'.trim(), link: '/components/uni/fab' },
        { text: 'sn-transition 动画'.trim(), link: '/components/uni/transition' },
        { text: 'sn-resize 监听元素尺寸'.trim(), link: '/components/uni/resize' },
        { text: 'sn-config-provider 全局配置'.trim(), link: '/components/uni/config-provider' },
        { text: 'sn-root-portal 根节点传送'.trim(), link: '/components/uni/root-portal' },
        { text: 'sn-divider 分割线'.trim(), link: '/components/uni/divider' },
        { text: 'sn-gap 间隔槽'.trim(), link: '/components/uni/gap' },
        { text: 'sn-tag 标签'.trim(), link: '/components/uni/tag' },
        { text: 'sn-badge 徽标'.trim(), link: '/components/uni/badge' },
        { text: 'sn-avatar 头像'.trim(), link: '/components/uni/avatar' },
      ],
    },
    {
      text: 'Navigation 导航组件',
      items: [
        { text: 'sn-navbar 导航栏'.trim(), link: '/components/uni/navbar' },
        { text: 'sn-tabbar 标签栏'.trim(), link: '/components/uni/tabbar' },
        { text: 'sn-tabs 标签页'.trim(), link: '/components/uni/tabs' },
        { text: 'sn-segmented 分段器'.trim(), link: '/components/uni/segmented' },
        { text: 'sn-sidebar 侧边导航'.trim(), link: '/components/uni/sidebar' },
        { text: 'sn-pagination 分页'.trim(), link: '/components/uni/pagination' },
        { text: 'sn-index-bar 索引栏'.trim(), link: '/components/uni/index-bar' },
        { text: 'sn-backtop 回到顶部'.trim(), link: '/components/uni/backtop' },
        { text: 'sn-tour 漫游'.trim(), link: '/components/uni/tour' },
        { text: 'sn-steps 步骤条'.trim(), link: '/components/uni/steps' },
        { text: 'sn-collapse 折叠面板'.trim(), link: '/components/uni/collapse' },
        { text: 'sn-sticky 粘性布局'.trim(), link: '/components/uni/sticky' },
        { text: 'sn-grid 宫格'.trim(), link: '/components/uni/grid' },
        { text: 'sn-drop-menu 下拉菜单'.trim(), link: '/components/uni/drop-menu' },
        { text: 'sn-tooltip 文字提示'.trim(), link: '/components/uni/tooltip' },
        { text: 'sn-popover 气泡'.trim(), link: '/components/uni/popover' },
      ],
    },
    {
      text: 'Form 录入组件',
      items: [
        { text: 'sn-form 表单'.trim(), link: '/components/uni/form' },
        { text: 'sn-input 输入框'.trim(), link: '/components/uni/input' },
        { text: 'sn-textarea 文本域'.trim(), link: '/components/uni/textarea' },
        { text: 'sn-password-input 密码输入框'.trim(), link: '/components/uni/password-input' },
        { text: 'sn-keyboard 虚拟键盘'.trim(), link: '/components/uni/keyboard' },
        { text: 'sn-input-number 计数器'.trim(), link: '/components/uni/input-number' },
        { text: 'sn-search 搜索框'.trim(), link: '/components/uni/search' },
        { text: 'sn-checkbox 复选框'.trim(), link: '/components/uni/checkbox' },
        { text: 'sn-radio 单选框'.trim(), link: '/components/uni/radio' },
        { text: 'sn-switch 开关'.trim(), link: '/components/uni/switch' },
        { text: 'sn-rate 评分'.trim(), link: '/components/uni/rate' },
        { text: 'sn-slider 滑块'.trim(), link: '/components/uni/slider' },
        { text: 'sn-picker 选择器'.trim(), link: '/components/uni/picker' },
        { text: 'sn-picker-view 选择器视图'.trim(), link: '/components/uni/picker-view' },
        { text: 'sn-select-picker 单复选选择器'.trim(), link: '/components/uni/select-picker' },
        { text: 'sn-cascader 级联选择器'.trim(), link: '/components/uni/cascader' },
        { text: 'sn-calendar 日历选择器'.trim(), link: '/components/uni/calendar' },
        { text: 'sn-calendar-view 日历面板'.trim(), link: '/components/uni/calendar-view' },
        { text: 'sn-datetime-picker 时间选择器'.trim(), link: '/components/uni/datetime-picker' },
        { text: 'sn-datetime-picker-view 时间选择器视图'.trim(), link: '/components/uni/datetime-picker-view' },
        { text: 'sn-upload 上传'.trim(), link: '/components/uni/upload' },
        { text: 'sn-sort-button 排序按钮'.trim(), link: '/components/uni/sort-button' },
        { text: 'sn-signature 签名'.trim(), link: '/components/uni/signature' },
        { text: 'sn-slide-verify 滑动验证'.trim(), link: '/components/uni/slide-verify' },
      ],
    },
    {
      text: 'Feedback 反馈组件',
      items: [
        { text: 'sn-popup 弹出层'.trim(), link: '/components/uni/popup' },
        { text: 'sn-overlay 遮罩层'.trim(), link: '/components/uni/overlay' },
        { text: 'sn-dialog 弹框'.trim(), link: '/components/uni/dialog' },
        { text: 'sn-action-sheet 动作面板'.trim(), link: '/components/uni/action-sheet' },
        { text: 'sn-loading 加载指示器'.trim(), link: '/components/uni/loading' },
        { text: 'sn-progress 进度条'.trim(), link: '/components/uni/progress' },
        { text: 'sn-circle 环形进度条'.trim(), link: '/components/uni/circle' },
        { text: 'sn-toast 轻提示'.trim(), link: '/components/uni/toast' },
        { text: 'sn-notify 消息通知'.trim(), link: '/components/uni/notify' },
        { text: 'sn-notice-bar 通知栏'.trim(), link: '/components/uni/notice-bar' },
        { text: 'sn-empty 缺省提示'.trim(), link: '/components/uni/empty' },
        { text: 'sn-skeleton 骨架屏'.trim(), link: '/components/uni/skeleton' },
        { text: 'sn-loadmore 加载更多'.trim(), link: '/components/uni/loadmore' },
        { text: 'sn-paging 分页列表'.trim(), link: '/components/uni/paging' },
        { text: 'sn-curtain 幕帘'.trim(), link: '/components/uni/curtain' },
        { text: 'sn-swipe-action 滑动操作'.trim(), link: '/components/uni/swipe-action' },
        { text: 'sn-floating-panel 浮动面板'.trim(), link: '/components/uni/floating-panel' },
      ],
    },
    {
      text: 'Display 展示组件',
      items: [
        { text: 'sn-avatar 头像'.trim(), link: '/components/uni/avatar' },
        { text: 'sn-card 卡片'.trim(), link: '/components/uni/card' },
        { text: 'sn-img 图片'.trim(), link: '/components/uni/img' },
        { text: 'sn-swiper 轮播'.trim(), link: '/components/uni/swiper' },
        { text: 'sn-count-down 倒计时'.trim(), link: '/components/uni/count-down' },
        { text: 'sn-count-to 数字滚动'.trim(), link: '/components/uni/count-to' },
        { text: 'sn-watermark 水印'.trim(), link: '/components/uni/watermark' },
        { text: 'sn-image-preview 图片预览'.trim(), link: '/components/uni/image-preview' },
        { text: 'sn-video-preview 视频预览'.trim(), link: '/components/uni/video-preview' },
        { text: 'sn-img-cropper 图片裁剪'.trim(), link: '/components/uni/img-cropper' },
        { text: 'sn-qr-code 二维码'.trim(), link: '/components/uni/qr-code' },
        { text: 'sn-table 表格'.trim(), link: '/components/uni/table' },
      ],
    },
    {
      text: 'Business 业务组件',
      items: [
        { text: 'sn-liquid 水波进度球'.trim(), link: '/components/uni/liquid' },
        { text: 'sn-barcode 条形码'.trim(), link: '/components/uni/barcode' },
        { text: 'sn-dialer 大转盘'.trim(), link: '/components/uni/dialer' },
        { text: 'sn-scratchcard 刮刮乐'.trim(), link: '/components/uni/scratchcard' },
        { text: 'sn-lucky 抽奖九宫格'.trim(), link: '/components/uni/lucky' },
        { text: 'sn-typing 输入中'.trim(), link: '/components/uni/typing' },
      ],
    },
  ],
  '/theme/': [
    {
      text: '主题与 Token',
      items: [
        { text: 'Token 总览', link: '/theme/overview' },
        { text: 'Theme（颜色）', link: '/theme/theme' },
        { text: 'Style（形状）', link: '/theme/style' },
        { text: 'Density（密度）', link: '/theme/density' },
        { text: 'Token 级联', link: '/theme/cascade' },
      ],
    },
  ],
  '/style-packs/': [
    {
      text: '风格包',
      items: [
        { text: '风格包总览', link: '/style-packs/overview' },
        { text: 'iOS 风格', link: '/style-packs/ios' },
        { text: '自定义风格包', link: '/style-packs/custom' },
      ],
    },
  ],
  '/ai/': [
    {
      text: 'AI 生态',
      items: [
        { text: 'AI 生态总览', link: '/ai/overview' },
        { text: 'Skill 文件', link: '/ai/skill' },
        { text: 'MCP Server', link: '/ai/mcp' },
        { text: '高保真原型', link: '/ai/prototype' },
      ],
    },
  ],
  // Templates 模板 — grouped by category. Web and uni-app share one message
  // contract and differ only in layout, so a template is one page with its ends
  // tagged inside it, rather than a separate page per end.
  '/templates/': [
    {
      text: '概览',
      items: [
        { text: '模板总览', link: '/templates/overview' },
      ],
    },
    {
      text: 'AI 套件',
      items: [
        { text: 'AI 助手', link: '/templates/ai/assistant' },
        { text: 'AI 对话页', link: '/templates/ai/chat' },
        { text: 'AI 输入框', link: '/templates/ai/prompt' },
        { text: '消息列表', link: '/templates/ai/message-list' },
        { text: '模型配置', link: '/templates/ai/model-config' },
      ],
    },
  ],
}

const enNav = [
  { text: 'Guide', link: '/en/guide/web/intro' },
  { text: 'Components · Web', link: '/en/components/web/button' },
  { text: 'Components · uni-app', link: '/en/components/uni/button' },
  { text: 'Style Packs', link: '/en/style-packs/overview' },
  { text: 'Theme', link: '/en/theme/overview' },
  { text: 'AI Ecosystem', link: '/en/ai/overview' },
  { text: 'Templates', link: '/en/templates/overview' },
]

const enSidebar = {
  '/en/guide/': [
    {
      text: 'Getting started',
      items: [
        { text: 'Introduction', link: '/en/guide/web/intro' },
        { text: 'Architecture', link: '/en/guide/web/architecture' },
        { text: 'Web Quick Start', link: '/en/guide/web/quick-start' },
        { text: 'uni-app Quick Start', link: '/en/guide/uni/quick-start' },
        { text: 'uni-app x (Vapor Mode)', link: '/en/guide/uni/uni-app-x' },
      ],
    },
    {
      text: 'Advanced',
      items: [
        { text: 'SSR / Nuxt', link: '/en/guide/web/ssr-nuxt' },
        { text: 'Internationalization (i18n)', link: '/en/guide/web/i18n' },
        { text: 'Fonts', link: '/en/guide/web/fonts' },
      ],
    },
  ],
  // Mirror of zh sidebar (per AUI-DOCS-002 + AUI-DOCS-013). Categories
  // hidden when empty.
  '/en/components/web/': [
    {
      text: 'Basic',
      items: [
        { text: 'Button', link: '/en/components/web/button' },
        { text: 'Divider', link: '/en/components/web/divider' },
        { text: 'Icon', link: '/en/components/web/icon' },
        { text: 'Text', link: '/en/components/web/text' },
        { text: 'Avatar', link: '/en/components/web/avatar' },
        { text: 'Tag', link: '/en/components/web/tag' },
        { text: 'Dropdown', link: '/en/components/web/dropdown' },
        { text: 'Popover', link: '/en/components/web/popover' },
        { text: 'Popconfirm', link: '/en/components/web/popconfirm' },
        { text: 'Popselect', link: '/en/components/web/popselect' },
        { text: 'AvatarGroup', link: '/en/components/web/avatar-group' },
        { text: 'Link', link: '/en/components/web/link' },
      ],
    },
    {
      text: 'Form',
      items: [
        { text: 'Input', link: '/en/components/web/input' },
        { text: 'InputNumber', link: '/en/components/web/input-number' },
        { text: 'AutoComplete', link: '/en/components/web/auto-complete' },
        { text: 'Select', link: '/en/components/web/select' },
        { text: 'DynamicInput', link: '/en/components/web/dynamic-input' },
        { text: 'DynamicTags', link: '/en/components/web/dynamic-tags' },
        { text: 'Cascader', link: '/en/components/web/cascader' },
        { text: 'TreeSelect', link: '/en/components/web/tree-select' },
        { text: 'TimePicker', link: '/en/components/web/time-picker' },
        { text: 'DatePicker', link: '/en/components/web/date-picker' },
        { text: 'ColorPicker', link: '/en/components/web/color-picker' },
        { text: 'Mention', link: '/en/components/web/mention' },
        { text: 'Upload', link: '/en/components/web/upload' },
        { text: 'Checkbox', link: '/en/components/web/checkbox' },
        { text: 'Radio', link: '/en/components/web/radio' },
        { text: 'Switch', link: '/en/components/web/switch' },
        { text: 'Slider', link: '/en/components/web/slider' },
        { text: 'Rate', link: '/en/components/web/rate' },
        { text: 'Form', link: '/en/components/web/form' },
        { text: 'Transfer', link: '/en/components/web/transfer' },
      ],
    },
    {
      text: 'Layout',
      items: [
        { text: 'Card', link: '/en/components/web/card' },
        { text: 'Grid', link: '/en/components/web/grid' },
        { text: 'Collapse', link: '/en/components/web/collapse' },
        { text: 'Space', link: '/en/components/web/space' },
        { text: 'Flex', link: '/en/components/web/flex' },
        { text: 'Layout', link: '/en/components/web/layout' },
        { text: 'Splitter', link: '/en/components/web/splitter' },
        { text: 'Waterfall', link: '/en/components/web/waterfall' },
      ],
    },
    {
      text: 'Navigation',
      items: [
        { text: 'Pagination', link: '/en/components/web/pagination' },
        { text: 'PageHeader', link: '/en/components/web/page-header' },
        { text: 'FloatButton', link: '/en/components/web/float-button' },
      ],
    },
    {
      text: 'Feedback',
      items: [
        { text: 'Notification', link: '/en/components/web/notification' },
        { text: 'LoadingBar', link: '/en/components/web/loading-bar' },
        { text: 'Progress', link: '/en/components/web/progress' },
      ],
    },
    {
      text: 'Data Display',
      items: [
        { text: 'Calendar', link: '/en/components/web/calendar' },
        { text: 'Carousel', link: '/en/components/web/carousel' },
        { text: 'Marquee', link: '/en/components/web/marquee' },
        { text: 'Tabs', link: '/en/components/web/tabs' },
        { text: 'Countdown', link: '/en/components/web/countdown' },
        { text: 'Code', link: '/en/components/web/code' },
        { text: 'Comment', link: '/en/components/web/comment' },
        { text: 'DataTable', link: '/en/components/web/data-table' },
        { text: 'Descriptions', link: '/en/components/web/descriptions' },
        { text: 'Empty', link: '/en/components/web/empty' },
        { text: 'Equation', link: '/en/components/web/equation' },
        { text: 'Image', link: '/en/components/web/image' },
        { text: 'VideoPreview', link: '/en/components/web/video-preview' },
        { text: 'List', link: '/en/components/web/list' },
        { text: 'Log', link: '/en/components/web/log' },
        { text: 'NumberAnimation', link: '/en/components/web/number-animation' },
        { text: 'QRCode', link: '/en/components/web/qr-code' },
        { text: 'Statistic', link: '/en/components/web/statistic' },
        { text: 'Table', link: '/en/components/web/table' },
        { text: 'Thing', link: '/en/components/web/thing' },
        { text: 'Time', link: '/en/components/web/time' },
        { text: 'Timeline', link: '/en/components/web/timeline' },
        { text: 'Tree', link: '/en/components/web/tree' },
        { text: 'InfiniteScroll', link: '/en/components/web/infinite-scroll' },
        { text: 'Highlight', link: '/en/components/web/highlight' },
        { text: 'Heatmap', link: '/en/components/web/heatmap' },
        { text: 'Watermark', link: '/en/components/web/watermark' },
        { text: 'Ellipsis', link: '/en/components/web/ellipsis' },
        { text: 'VirtualList', link: '/en/components/web/virtual-list' },
      ],
    },
    // Other — empty until ConfigProvider page ships.
  ],
  '/en/components/uni/': [
    {
      text: 'Overview',
      items: [
        { text: 'Component Overview', link: '/en/components/uni/overview' },
      ],
    },
    {
      text: 'Basic',
      items: [
        { text: 'sn-button', link: '/en/components/uni/button' },
        { text: 'sn-icon', link: '/en/components/uni/icon' },
        { text: 'sn-text', link: '/en/components/uni/text' },
        { text: 'sn-layout', link: '/en/components/uni/layout' },
        { text: 'sn-cell', link: '/en/components/uni/cell' },
        { text: 'sn-fab', link: '/en/components/uni/fab' },
        { text: 'sn-transition', link: '/en/components/uni/transition' },
        { text: 'sn-resize', link: '/en/components/uni/resize' },
        { text: 'sn-config-provider', link: '/en/components/uni/config-provider' },
        { text: 'sn-root-portal', link: '/en/components/uni/root-portal' },
        { text: 'sn-divider', link: '/en/components/uni/divider' },
        { text: 'sn-gap', link: '/en/components/uni/gap' },
        { text: 'sn-tag', link: '/en/components/uni/tag' },
        { text: 'sn-badge', link: '/en/components/uni/badge' },
        { text: 'sn-avatar', link: '/en/components/uni/avatar' },
      ],
    },
    {
      text: 'Navigation',
      items: [
        { text: 'sn-navbar', link: '/en/components/uni/navbar' },
        { text: 'sn-tabbar', link: '/en/components/uni/tabbar' },
        { text: 'sn-tabs', link: '/en/components/uni/tabs' },
        { text: 'sn-segmented', link: '/en/components/uni/segmented' },
        { text: 'sn-sidebar', link: '/en/components/uni/sidebar' },
        { text: 'sn-pagination', link: '/en/components/uni/pagination' },
        { text: 'sn-index-bar', link: '/en/components/uni/index-bar' },
        { text: 'sn-backtop', link: '/en/components/uni/backtop' },
        { text: 'sn-tour', link: '/en/components/uni/tour' },
        { text: 'sn-steps', link: '/en/components/uni/steps' },
        { text: 'sn-collapse', link: '/en/components/uni/collapse' },
        { text: 'sn-sticky', link: '/en/components/uni/sticky' },
        { text: 'sn-grid', link: '/en/components/uni/grid' },
        { text: 'sn-drop-menu', link: '/en/components/uni/drop-menu' },
        { text: 'sn-tooltip', link: '/en/components/uni/tooltip' },
        { text: 'sn-popover', link: '/en/components/uni/popover' },
      ],
    },
    {
      text: 'Form',
      items: [
        { text: 'sn-form', link: '/en/components/uni/form' },
        { text: 'sn-input', link: '/en/components/uni/input' },
        { text: 'sn-textarea', link: '/en/components/uni/textarea' },
        { text: 'sn-password-input', link: '/en/components/uni/password-input' },
        { text: 'sn-keyboard', link: '/en/components/uni/keyboard' },
        { text: 'sn-input-number', link: '/en/components/uni/input-number' },
        { text: 'sn-search', link: '/en/components/uni/search' },
        { text: 'sn-checkbox', link: '/en/components/uni/checkbox' },
        { text: 'sn-radio', link: '/en/components/uni/radio' },
        { text: 'sn-switch', link: '/en/components/uni/switch' },
        { text: 'sn-rate', link: '/en/components/uni/rate' },
        { text: 'sn-slider', link: '/en/components/uni/slider' },
        { text: 'sn-picker', link: '/en/components/uni/picker' },
        { text: 'sn-picker-view', link: '/en/components/uni/picker-view' },
        { text: 'sn-select-picker', link: '/en/components/uni/select-picker' },
        { text: 'sn-cascader', link: '/en/components/uni/cascader' },
        { text: 'sn-calendar', link: '/en/components/uni/calendar' },
        { text: 'sn-calendar-view', link: '/en/components/uni/calendar-view' },
        { text: 'sn-datetime-picker', link: '/en/components/uni/datetime-picker' },
        { text: 'sn-datetime-picker-view', link: '/en/components/uni/datetime-picker-view' },
        { text: 'sn-upload', link: '/en/components/uni/upload' },
        { text: 'sn-sort-button', link: '/en/components/uni/sort-button' },
        { text: 'sn-signature', link: '/en/components/uni/signature' },
        { text: 'sn-slide-verify', link: '/en/components/uni/slide-verify' },
      ],
    },
    {
      text: 'Feedback',
      items: [
        { text: 'sn-popup', link: '/en/components/uni/popup' },
        { text: 'sn-overlay', link: '/en/components/uni/overlay' },
        { text: 'sn-dialog', link: '/en/components/uni/dialog' },
        { text: 'sn-action-sheet', link: '/en/components/uni/action-sheet' },
        { text: 'sn-loading', link: '/en/components/uni/loading' },
        { text: 'sn-progress', link: '/en/components/uni/progress' },
        { text: 'sn-circle', link: '/en/components/uni/circle' },
        { text: 'sn-toast', link: '/en/components/uni/toast' },
        { text: 'sn-notify', link: '/en/components/uni/notify' },
        { text: 'sn-notice-bar', link: '/en/components/uni/notice-bar' },
        { text: 'sn-empty', link: '/en/components/uni/empty' },
        { text: 'sn-skeleton', link: '/en/components/uni/skeleton' },
        { text: 'sn-loadmore', link: '/en/components/uni/loadmore' },
        { text: 'sn-paging', link: '/en/components/uni/paging' },
        { text: 'sn-curtain', link: '/en/components/uni/curtain' },
        { text: 'sn-swipe-action', link: '/en/components/uni/swipe-action' },
        { text: 'sn-floating-panel', link: '/en/components/uni/floating-panel' },
      ],
    },
    {
      text: 'Display',
      items: [
        { text: 'sn-avatar', link: '/en/components/uni/avatar' },
        { text: 'sn-card', link: '/en/components/uni/card' },
        { text: 'sn-img', link: '/en/components/uni/img' },
        { text: 'sn-swiper', link: '/en/components/uni/swiper' },
        { text: 'sn-count-down', link: '/en/components/uni/count-down' },
        { text: 'sn-count-to', link: '/en/components/uni/count-to' },
        { text: 'sn-watermark', link: '/en/components/uni/watermark' },
        { text: 'sn-image-preview', link: '/en/components/uni/image-preview' },
        { text: 'sn-video-preview', link: '/en/components/uni/video-preview' },
        { text: 'sn-img-cropper', link: '/en/components/uni/img-cropper' },
        { text: 'sn-qr-code', link: '/en/components/uni/qr-code' },
        { text: 'sn-table', link: '/en/components/uni/table' },
      ],
    },
    {
      text: 'Business',
      items: [
        { text: 'sn-liquid', link: '/en/components/uni/liquid' },
        { text: 'sn-barcode', link: '/en/components/uni/barcode' },
        { text: 'sn-dialer', link: '/en/components/uni/dialer' },
        { text: 'sn-scratchcard', link: '/en/components/uni/scratchcard' },
        { text: 'sn-lucky', link: '/en/components/uni/lucky' },
        { text: 'sn-typing', link: '/en/components/uni/typing' },
      ],
    },
  ],
  '/en/theme/': [
    {
      text: 'Theme & Tokens',
      items: [
        { text: 'Tokens overview', link: '/en/theme/overview' },
        { text: 'Theme (color)', link: '/en/theme/theme' },
        { text: 'Style (shape)', link: '/en/theme/style' },
        { text: 'Density (size)', link: '/en/theme/density' },
        { text: 'Token cascade', link: '/en/theme/cascade' },
      ],
    },
  ],
  '/en/style-packs/': [
    {
      text: 'Style Packs',
      items: [
        { text: 'Overview', link: '/en/style-packs/overview' },
        { text: 'iOS Style', link: '/en/style-packs/ios' },
        { text: 'Custom Style Pack', link: '/en/style-packs/custom' },
      ],
    },
  ],
  '/en/ai/': [
    {
      text: 'AI Ecosystem',
      items: [
        { text: 'Overview', link: '/en/ai/overview' },
        { text: 'Skill file', link: '/en/ai/skill' },
        { text: 'MCP Server', link: '/en/ai/mcp' },
        { text: 'Hi-fi prototype', link: '/en/ai/prototype' },
      ],
    },
  ],
  '/en/templates/': [
    {
      text: 'Overview',
      items: [
        { text: 'Templates overview', link: '/en/templates/overview' },
      ],
    },
    {
      text: 'AI Suite',
      items: [
        { text: 'AI assistant', link: '/en/templates/ai/assistant' },
        { text: 'AI chat page', link: '/en/templates/ai/chat' },
        { text: 'AI prompt', link: '/en/templates/ai/prompt' },
        { text: 'Message list', link: '/en/templates/ai/message-list' },
        { text: 'Model config', link: '/en/templates/ai/model-config' },
      ],
    },
  ],
}

export default defineConfig({
  title: 'snail-aui — AI-Native UI 框架生态',
  description: 'Vue 3 + uni-app 多端 AI-Native UI 框架生态。Component First / Token First / Style Pack First / AI Native。',
  ignoreDeadLinks: true,

  /**
   * uni-app built-in elements are plain tags in the uni-end SFC templates.
   * Vue treats dash-containing unknown tags (`scroll-view`, `swiper-item`,
   * `picker-view`) as unregistered components and warns on every render;
   * registering them as custom elements keeps them inert host elements —
   * exactly what the uni H5 runtime makes of them. (`view` / `text` / `image`
   * are already silent, but listing them documents the contract.)
   */
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag: string): boolean =>
          [
            'view',
            'text',
            'image',
            'scroll-view',
            'swiper',
            'swiper-item',
            'picker-view',
            'picker-view-column',
            'canvas',
            'video',
          ].includes(tag),
      },
    },
  },

  themeConfig: {
    // Base URL for the title-row "edit this page" action. Branch-matched at
    // build time (see utils/edit-link.ts) and consumed by
    // components/SnDocsDocActions.vue; both locales inherit it.
    editBase: EDIT_BASE,
    // Per VitePress 1.6+: local search provider is read from
    // `site.themeConfig.search`, not from root-level `search`. When defined
    // here, the build-time constant `__VP_LOCAL_SEARCH__` becomes true and
    // VPNavBarSearch renders the LocalSearchBox + search-button.
    // Both locales (root + en) inherit this block (resolveSiteDataByRoute
    // merges root themeConfig into each locale's).
    //
    // Translations layout (see VPLocalSearchBox.vue:120):
    //   options.translations — default UI strings (used as fallback and by
    //                          the root locale)
    //   options.locales[<localeKey>].translations — per-locale overrides
    //
    // The root locale uses options.translations directly; the en locale
    // overrides via options.locales.en.translations.
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            backButtonTitle: '返回',
            footer: {
              selectText: '选择',
              navigateText: '导航',
              closeText: '关闭',
            },
          },
        },
        locales: {
          en: {
            translations: {
              button: {
                buttonText: 'Search docs',
                buttonAriaLabel: 'Search docs',
              },
              modal: {
                noResultsText: 'No results',
                resetButtonTitle: 'Clear query',
                backButtonTitle: 'Back',
                footer: {
                  selectText: 'select',
                  navigateText: 'navigate',
                  closeText: 'close',
                },
              },
            },
          },
        },
        miniSearch: {
          tokenize: ((text: string): string[] => {
            const lowered = text.toLowerCase()
            const tokens: string[] = []
            for (const word of lowered.split(/[\s\u2000-\u206f\u2e00-\u2e7f\\'!"#$%&()*+,\-./:;<=>?@[\]^`{|}~]+/g)) {
              if (word) tokens.push(word)
            }
            const chars = [...lowered]
            for (let i = 0; i < chars.length; i++) {
              const ch = chars[i] ?? ''
              if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(ch)) {
                tokens.push(ch)
                const next = chars[i + 1] ?? ''
                if (/[\u4e00-\u9fff]/.test(next)) {
                  tokens.push(ch + next)
                }
              }
            }
            return tokens
          }) as MiniSearchOptions['tokenize'],
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 1 },
          } as MiniSearchOptions['searchOptions'],
        },
      },
    },
  },

  // Publish each page's raw markdown so the "copy document" button can hand
  // the reader the exact source. See ./utils/raw-doc-source.ts.
  //
  // Group every demo section into a two-per-row card grid (`sn-demo-grid` /
  // `sn-demo-cell`), so the demo cards read like naive-ui's. See
  // ./utils/demo-grid.ts.
  markdown: {
    config: (md) => {
      rawDocSource(md)
      demoGrid(md)
    },
  },

  vite: {
    build: { target: 'es2022' },
    define: {
      // 构建期注入 uni-demo 部署站地址（hash 路由），客户端代码不读 process.env。
      __UNI_DEMO_BASE__: JSON.stringify(UNI_DEMO_BASE),
    },
    resolve: {
      // Web demo 源直接引用包源码，vite + @vitejs/plugin-vue 按请求重编译 SFC
      // 并注入 scopeId，保证 scoped CSS 命中（dist 产物仍是发布事实源）。
      // uni demo 不再由 docs 编译 —— 其源码单源于 apps/uni-demo，预览走部署站
      // iframe（ADR-0005），故 @snui/uni-src 别名与 rpx 转换插件已退役。
      alias: {
        '@snui/vue-web-src': fileURLToPath(new URL('../../../packages/vue-web/src', import.meta.url)),
        '@snui/templates-src': fileURLToPath(new URL('../../../packages/templates/src', import.meta.url)),
      },
    },
    ssr: {
      noExternal: [
        '@snui/vue-web',
        '@snui/uni',
        '@snui/tokens',
        '@snui/style-packs',
        '@snui/ai',
        '@snui/templates',
      ],
    },
    // Pre-bundle only `@snui/tokens` + `@snui/style-packs` (pure JS, safe to
    // inline). `@snui/vue-web` + `@snui/uni` are built with vite + @vue/
    // compiler-sfc (see packages/*/vite.config.js) and do NOT need vite
    // optimizeDeps pre-bundling — vite-plugin-vue compiles the .vue SFCs at
    // request time, which is what `@vue/compiler-sfc` does (transforms
    // `defineOptions` / `defineProps` / `withDefaults` / `defineEmits` /
    // `defineSlots` macros into runtime calls before the browser receives
    // the JS). The browser is the source of truth that proves the dist is
    // usable.
    optimizeDeps: {
      include: [
        '@snui/tokens',
        '@snui/style-packs',
        'lucide-vue-next',
        'vue',
      ],
    },
  },

  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    }],
  ],

  locales: {
    root: {
      label: '中文 / EN',
      lang: 'zh-CN',
      themeConfig: {
        nav,
        sidebar,
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 hu-snail',
        },
      },
    },
    en: {
      label: '中文 / EN',
      lang: 'en-US',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2026 hu-snail',
        },
      },
    },
  },

  /**
   * (Removed) Root-level `search` block.
   *
   * In VitePress <1.6 this lived at root level, but the 1.6 local-search
   * plugin reads `site.themeConfig.search.provider` (see
   * `node_modules/vitepress/dist/node/chunk-D3CUZ4fa.js:40427` and
   * `:44943`). With `search` at root, `__VP_LOCAL_SEARCH__` evaluates to
   * false at build time, the VPNavBarSearch template removes the LocalSearchBox
   * branch, and the navbar renders only logo + nav + theme-toggle — no search
   * button at all (verified against the live dev server).
   *
   * The same provider config has been added to `themeConfig.search` above
   * so both root and en locales inherit a working search.
   */
})