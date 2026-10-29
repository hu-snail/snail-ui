/**
 * 组件总览数据 —— 与 apps/docs/.vitepress/config.ts 的 uni sidebar 分组保持
 * 一致（新增组件时两边同步）。desc 为一句话定位，用于总览页行说明。
 */

export interface OverviewItem {
  /** 组件名（sn-xxx）。 */
  name: string;
  /** 中文名。 */
  title: string;
  /** 一句话定位。 */
  desc: string;
}

export interface OverviewGroup {
  /** 分组 key（chips 过滤用）。 */
  key: string;
  /** 分组标题（完整显示，不省略）。 */
  label: string;
  items: OverviewItem[];
}

export const OVERVIEW_GROUPS: OverviewGroup[] = [
  {
    key: 'basic',
    label: '基础组件',
    items: [
      { name: 'sn-button', title: '按钮', desc: '多种类型与变体的主操作按钮' },
      { name: 'sn-icon', title: '图标', desc: 'SVG 数据 / iconfont 双路径图标' },
      { name: 'sn-text', title: '文本', desc: '增强文本，支持省略与高亮' },
      { name: 'sn-layout', title: '布局', desc: 'Row / Col 栅格布局' },
      { name: 'sn-cell', title: '单元格', desc: '列表行容器，可组合图标与箭头' },
      { name: 'sn-fab', title: '悬浮按钮', desc: '可拖拽的悬浮操作按钮' },
      { name: 'sn-transition', title: '动画', desc: '出入场过渡动画封装' },
      { name: 'sn-resize', title: '监听元素尺寸', desc: '元素尺寸变化回调' },
      { name: 'sn-config-provider', title: '全局配置', desc: '主题 / 风格包 / 变量注入' },
      { name: 'sn-root-portal', title: '根节点传送', desc: '内容挂到页面根节点' },
      { name: 'sn-divider', title: '分割线', desc: '水平 / 垂直分隔线' },
      { name: 'sn-gap', title: '间隔槽', desc: '固定高度的占位间隔' },
      { name: 'sn-tag', title: '标签', desc: '多色标记与可关闭标签' },
      { name: 'sn-badge', title: '徽标', desc: '角标 / 红点提示' },
      { name: 'sn-avatar', title: '头像', desc: '圆形 / 方形头像与徽标组合' },
    ],
  },
  {
    key: 'navigation',
    label: '导航组件',
    items: [
      { name: 'sn-navbar', title: '导航栏', desc: '页面顶部标题栏' },
      { name: 'sn-tabbar', title: '标签栏', desc: '底部标签栏' },
      { name: 'sn-tabs', title: '标签页', desc: '可滚动标签页与内容联动' },
      { name: 'sn-segmented', title: '分段器', desc: '分段选择控件' },
      { name: 'sn-sidebar', title: '侧边导航', desc: '垂直分类侧边栏' },
      { name: 'sn-pagination', title: '分页', desc: '页码切换' },
      { name: 'sn-index-bar', title: '索引栏', desc: '字母索引快速定位' },
      { name: 'sn-backtop', title: '回到顶部', desc: '滚动回顶按钮' },
      { name: 'sn-tour', title: '漫游', desc: '新手引导高亮' },
      { name: 'sn-steps', title: '步骤条', desc: '流程步骤指示' },
      { name: 'sn-collapse', title: '折叠面板', desc: '可展开收起的内容分组' },
      { name: 'sn-sticky', title: '粘性布局', desc: '滚动吸顶容器' },
      { name: 'sn-grid', title: '宫格', desc: '功能入口宫格' },
      { name: 'sn-drop-menu', title: '下拉菜单', desc: '顶部下拉筛选' },
      { name: 'sn-tooltip', title: '文字提示', desc: '轻量气泡说明' },
      { name: 'sn-popover', title: '气泡', desc: '锚点弹出气泡卡片' },
    ],
  },
  {
    key: 'form',
    label: '录入组件',
    items: [
      { name: 'sn-form', title: '表单', desc: '校验与布局容器' },
      { name: 'sn-input', title: '输入框', desc: '单行文本输入' },
      { name: 'sn-textarea', title: '文本域', desc: '多行文本输入' },
      { name: 'sn-password-input', title: '密码输入框', desc: '密码 / 验证码输入' },
      { name: 'sn-keyboard', title: '虚拟键盘', desc: '自定义数字键盘' },
      { name: 'sn-input-number', title: '计数器', desc: '步进数值输入' },
      { name: 'sn-search', title: '搜索框', desc: '搜索输入与联想' },
      { name: 'sn-checkbox', title: '复选框', desc: '多选控件' },
      { name: 'sn-radio', title: '单选框', desc: '单选控件' },
      { name: 'sn-switch', title: '开关', desc: '布尔切换' },
      { name: 'sn-rate', title: '评分', desc: '星级评分' },
      { name: 'sn-slider', title: '滑块', desc: '拖拽取值滑块' },
      { name: 'sn-picker', title: '选择器', desc: '弹层多列选择' },
      { name: 'sn-picker-view', title: '选择器视图', desc: '内嵌滚轮选择' },
      { name: 'sn-select-picker', title: '单复选选择器', desc: '单选 / 多选弹层' },
      { name: 'sn-cascader', title: '级联选择器', desc: '多级联动选择' },
      { name: 'sn-calendar', title: '日历选择器', desc: '日期区间选择弹层' },
      { name: 'sn-calendar-view', title: '日历面板', desc: '内嵌日历面板' },
      { name: 'sn-date-strip', title: '日期条', desc: '横向日期快速选择条' },
      { name: 'sn-datetime-picker', title: '时间选择器', desc: '日期时间弹层选择' },
      { name: 'sn-datetime-picker-view', title: '时间选择器视图', desc: '内嵌时间滚轮' },
      { name: 'sn-upload', title: '上传', desc: '文件 / 图片上传' },
      { name: 'sn-sort-button', title: '排序按钮', desc: '升降序切换按钮' },
      { name: 'sn-signature', title: '签名', desc: '手写签名板' },
      { name: 'sn-slide-verify', title: '滑动验证', desc: '滑块拼图验证' },
      { name: 'sn-captcha', title: '拼图验证', desc: '拖动拼图对齐缺口' },
    ],
  },
  {
    key: 'feedback',
    label: '反馈组件',
    items: [
      { name: 'sn-popup', title: '弹出层', desc: '四向弹出容器' },
      { name: 'sn-overlay', title: '遮罩层', desc: '页面遮罩' },
      { name: 'sn-dialog', title: '弹框', desc: '模态对话框' },
      { name: 'sn-action-sheet', title: '动作面板', desc: '底部操作列表' },
      { name: 'sn-loading', title: '加载指示器', desc: '多种形态加载动画' },
      { name: 'sn-progress', title: '进度条', desc: '线性进度展示' },
      { name: 'sn-circle', title: '环形进度条', desc: '环形进度展示' },
      { name: 'sn-toast', title: '轻提示', desc: '轻量消息提示' },
      { name: 'sn-notify', title: '消息通知', desc: '顶部通知条' },
      { name: 'sn-notice-bar', title: '通知栏', desc: '滚动通知' },
      { name: 'sn-empty', title: '缺省提示', desc: '空状态占位' },
      { name: 'sn-skeleton', title: '骨架屏', desc: '加载占位骨架' },
      { name: 'sn-loadmore', title: '加载更多', desc: '列表加载状态' },
      { name: 'sn-curtain', title: '幕帘', desc: '运营弹幕层' },
      { name: 'sn-swipe-action', title: '滑动操作', desc: '侧滑菜单' },
      { name: 'sn-floating-panel', title: '浮动面板', desc: '可拖动高度面板' },
    ],
  },
  {
    key: 'display',
    label: '展示组件',
    items: [
      { name: 'sn-card', title: '卡片', desc: '内容卡片容器' },
      { name: 'sn-img', title: '图片', desc: '增强图片，多填充模式' },
      { name: 'sn-swiper', title: '轮播', desc: '内容轮播' },
      { name: 'sn-fit-swiper', title: '自适应轮播', desc: '贴合内容高度的金刚区轮播' },
      { name: 'sn-count-down', title: '倒计时', desc: '秒 / 时间戳倒计时' },
      { name: 'sn-count-to', title: '数字滚动', desc: '数字滚动动画' },
      { name: 'sn-watermark', title: '水印', desc: '页面水印层' },
      { name: 'sn-image-preview', title: '图片预览', desc: '图片放大预览' },
      { name: 'sn-video-preview', title: '视频预览', desc: '视频弹层播放' },
      { name: 'sn-img-cropper', title: '图片裁剪', desc: '裁剪几何交互' },
      { name: 'sn-qr-code', title: '二维码', desc: '二维码生成与导出' },
      { name: 'sn-table', title: '表格', desc: '数据表格' },
      { name: 'sn-rich-text', title: '富文本', desc: 'HTML 内容：图文、表格与媒体' },
    ],
  },
  {
    key: 'business',
    label: '业务组件',
    items: [
      { name: 'sn-liquid', title: '水波进度球', desc: '水波动画的进度展示' },
      { name: 'sn-barcode', title: '条形码', desc: 'EAN-13 条码渲染' },
      { name: 'sn-dialer', title: '大转盘', desc: '抽奖转盘，run 指定落点' },
      { name: 'sn-scratchcard', title: '刮刮乐', desc: '刮层擦除与阈值回调' },
      { name: 'sn-lucky', title: '抽奖九宫格', desc: 'play / stop 两段式抽奖' },
      { name: 'sn-typing', title: '输入中', desc: '聊天输入中跳动圆点' },
    ],
  },
];

export const OVERVIEW_TOTAL = OVERVIEW_GROUPS.reduce((sum, group) => sum + group.items.length, 0);
