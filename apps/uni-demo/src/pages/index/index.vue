<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改；demo 变更后重跑 `pnpm gen:pages`。
interface CompItem {
  key: string;
  group: string;
  title: string;
  desc: string;
  count: number;
}

interface GroupItem {
  key: string;
  label: string;
  comps: CompItem[];
}

const groups: GroupItem[] = [
  {
    key: 'basic',
    label: '基础组件',
    comps: [
      {
        key: 'avatar',
        group: 'basic',
        title: '头像',
        desc: '圆形 / 方形头像与徽标组合',
        count: 4,
      },
      {
        key: 'badge',
        group: 'basic',
        title: '徽标',
        desc: '角标 / 红点提示',
        count: 4,
      },
      {
        key: 'button',
        group: 'basic',
        title: '按钮',
        desc: '多种类型与变体的主操作按钮',
        count: 14,
      },
      {
        key: 'cell',
        group: 'basic',
        title: '单元格',
        desc: '列表行容器，可组合图标与箭头',
        count: 3,
      },
      {
        key: 'config-provider',
        group: 'basic',
        title: '全局配置',
        desc: '主题 / 风格包 / 变量注入',
        count: 3,
      },
      {
        key: 'divider',
        group: 'basic',
        title: '分割线',
        desc: '水平 / 垂直分隔线',
        count: 4,
      },
      {
        key: 'fab',
        group: 'basic',
        title: '悬浮按钮',
        desc: '可拖拽的悬浮操作按钮',
        count: 4,
      },
      {
        key: 'gap',
        group: 'basic',
        title: '间隔槽',
        desc: '固定高度的占位间隔',
        count: 3,
      },
    ],
  },
  {
    key: 'basic-2',
    label: '基础组件',
    comps: [
      {
        key: 'icon',
        group: 'basic-2',
        title: '图标',
        desc: 'SVG 数据 / iconfont 双路径图标',
        count: 6,
      },
      {
        key: 'layout',
        group: 'basic-2',
        title: '布局',
        desc: 'Row / Col 栅格布局',
        count: 3,
      },
      {
        key: 'resize',
        group: 'basic-2',
        title: '监听元素尺寸',
        desc: '元素尺寸变化回调',
        count: 2,
      },
      {
        key: 'root-portal',
        group: 'basic-2',
        title: '根节点传送',
        desc: '内容挂到页面根节点',
        count: 2,
      },
      {
        key: 'tag',
        group: 'basic-2',
        title: '标签',
        desc: '多色标记与可关闭标签',
        count: 5,
      },
      {
        key: 'text',
        group: 'basic-2',
        title: '文本',
        desc: '增强文本，支持省略与高亮',
        count: 4,
      },
      {
        key: 'transition',
        group: 'basic-2',
        title: '动画',
        desc: '出入场过渡动画封装',
        count: 4,
      },
    ],
  },
  {
    key: 'navigation',
    label: '导航组件',
    comps: [
      {
        key: 'backtop',
        group: 'navigation',
        title: '回到顶部',
        desc: '滚动回顶按钮',
        count: 3,
      },
      {
        key: 'collapse',
        group: 'navigation',
        title: '折叠面板',
        desc: '可展开收起的内容分组',
        count: 4,
      },
      {
        key: 'drop-menu',
        group: 'navigation',
        title: '下拉菜单',
        desc: '顶部下拉筛选',
        count: 3,
      },
      {
        key: 'grid',
        group: 'navigation',
        title: '宫格',
        desc: '功能入口宫格',
        count: 3,
      },
      {
        key: 'index-bar',
        group: 'navigation',
        title: '索引栏',
        desc: '字母索引快速定位',
        count: 3,
      },
      {
        key: 'navbar',
        group: 'navigation',
        title: '导航栏',
        desc: '页面顶部标题栏',
        count: 3,
      },
      {
        key: 'pagination',
        group: 'navigation',
        title: '分页',
        desc: '页码切换',
        count: 3,
      },
      {
        key: 'popover',
        group: 'navigation',
        title: '气泡',
        desc: '锚点弹出气泡卡片',
        count: 4,
      },
    ],
  },
  {
    key: 'navigation-2',
    label: '导航组件',
    comps: [
      {
        key: 'segmented',
        group: 'navigation-2',
        title: '分段器',
        desc: '分段选择控件',
        count: 4,
      },
      {
        key: 'sidebar',
        group: 'navigation-2',
        title: '侧边导航',
        desc: '垂直分类侧边栏',
        count: 3,
      },
      {
        key: 'steps',
        group: 'navigation-2',
        title: '步骤条',
        desc: '流程步骤指示',
        count: 3,
      },
      {
        key: 'sticky',
        group: 'navigation-2',
        title: '粘性布局',
        desc: '滚动吸顶容器',
        count: 3,
      },
      {
        key: 'tabbar',
        group: 'navigation-2',
        title: '标签栏',
        desc: '底部标签栏',
        count: 4,
      },
      {
        key: 'tabs',
        group: 'navigation-2',
        title: '标签页',
        desc: '可滚动标签页与内容联动',
        count: 4,
      },
      {
        key: 'tooltip',
        group: 'navigation-2',
        title: '文字提示',
        desc: '轻量气泡说明',
        count: 4,
      },
      {
        key: 'tour',
        group: 'navigation-2',
        title: '漫游',
        desc: '新手引导高亮',
        count: 3,
      },
    ],
  },
  {
    key: 'form',
    label: '录入组件',
    comps: [
      {
        key: 'calendar',
        group: 'form',
        title: '日历选择器',
        desc: '日期区间选择弹层',
        count: 5,
      },
      {
        key: 'calendar-view',
        group: 'form',
        title: '日历面板',
        desc: '内嵌日历面板',
        count: 4,
      },
      {
        key: 'cascader',
        group: 'form',
        title: '级联选择器',
        desc: '多级联动选择',
        count: 5,
      },
      {
        key: 'checkbox',
        group: 'form',
        title: '复选框',
        desc: '多选控件',
        count: 4,
      },
      {
        key: 'datetime-picker',
        group: 'form',
        title: '时间选择器',
        desc: '日期时间弹层选择',
        count: 4,
      },
      {
        key: 'datetime-picker-view',
        group: 'form',
        title: '时间选择器视图',
        desc: '内嵌时间滚轮',
        count: 5,
      },
      {
        key: 'form',
        group: 'form',
        title: '表单',
        desc: '校验与布局容器',
        count: 10,
      },
      {
        key: 'input',
        group: 'form',
        title: '输入框',
        desc: '单行文本输入',
        count: 16,
      },
      {
        key: 'input-number',
        group: 'form',
        title: '计数器',
        desc: '步进数值输入',
        count: 5,
      },
      {
        key: 'keyboard',
        group: 'form',
        title: '虚拟键盘',
        desc: '自定义数字键盘',
        count: 4,
      },
      {
        key: 'password-input',
        group: 'form',
        title: '密码输入框',
        desc: '密码 / 验证码输入',
        count: 3,
      },
      {
        key: 'picker',
        group: 'form',
        title: '选择器',
        desc: '弹层多列选择',
        count: 4,
      },
    ],
  },
  {
    key: 'form-2',
    label: '录入组件',
    comps: [
      {
        key: 'picker-view',
        group: 'form-2',
        title: '选择器视图',
        desc: '内嵌滚轮选择',
        count: 4,
      },
      {
        key: 'radio',
        group: 'form-2',
        title: '单选框',
        desc: '单选控件',
        count: 4,
      },
      {
        key: 'rate',
        group: 'form-2',
        title: '评分',
        desc: '星级评分',
        count: 4,
      },
      {
        key: 'search',
        group: 'form-2',
        title: '搜索框',
        desc: '搜索输入与联想',
        count: 5,
      },
      {
        key: 'select-picker',
        group: 'form-2',
        title: '单复选选择器',
        desc: '单选 / 多选弹层',
        count: 4,
      },
      {
        key: 'signature',
        group: 'form-2',
        title: '签名',
        desc: '手写签名板',
        count: 5,
      },
      {
        key: 'slide-verify',
        group: 'form-2',
        title: '滑动验证',
        desc: '滑块拼图验证',
        count: 3,
      },
      {
        key: 'slider',
        group: 'form-2',
        title: '滑块',
        desc: '拖拽取值滑块',
        count: 3,
      },
      {
        key: 'sort-button',
        group: 'form-2',
        title: '排序按钮',
        desc: '升降序切换按钮',
        count: 3,
      },
      {
        key: 'switch',
        group: 'form-2',
        title: '开关',
        desc: '布尔切换',
        count: 5,
      },
      {
        key: 'textarea',
        group: 'form-2',
        title: '文本域',
        desc: '多行文本输入',
        count: 7,
      },
      {
        key: 'upload',
        group: 'form-2',
        title: '上传',
        desc: '文件 / 图片上传',
        count: 7,
      },
    ],
  },
  {
    key: 'feedback',
    label: '反馈组件',
    comps: [
      {
        key: 'action-sheet',
        group: 'feedback',
        title: '动作面板',
        desc: '底部操作列表',
        count: 4,
      },
      {
        key: 'circle',
        group: 'feedback',
        title: '环形进度条',
        desc: '环形进度展示',
        count: 3,
      },
      {
        key: 'curtain',
        group: 'feedback',
        title: '幕帘',
        desc: '运营弹幕层',
        count: 4,
      },
      {
        key: 'dialog',
        group: 'feedback',
        title: '弹框',
        desc: '模态对话框',
        count: 4,
      },
      {
        key: 'empty',
        group: 'feedback',
        title: '缺省提示',
        desc: '空状态占位',
        count: 4,
      },
      {
        key: 'floating-panel',
        group: 'feedback',
        title: '浮动面板',
        desc: '可拖动高度面板',
        count: 3,
      },
      {
        key: 'loading',
        group: 'feedback',
        title: '加载指示器',
        desc: '多种形态加载动画',
        count: 3,
      },
      {
        key: 'loadmore',
        group: 'feedback',
        title: '加载更多',
        desc: '列表加载状态',
        count: 3,
      },
    ],
  },
  {
    key: 'feedback-2',
    label: '反馈组件',
    comps: [
      {
        key: 'notice-bar',
        group: 'feedback-2',
        title: '通知栏',
        desc: '滚动通知',
        count: 5,
      },
      {
        key: 'notify',
        group: 'feedback-2',
        title: '消息通知',
        desc: '顶部通知条',
        count: 3,
      },
      {
        key: 'overlay',
        group: 'feedback-2',
        title: '遮罩层',
        desc: '页面遮罩',
        count: 2,
      },
      {
        key: 'popup',
        group: 'feedback-2',
        title: '弹出层',
        desc: '四向弹出容器',
        count: 5,
      },
      {
        key: 'progress',
        group: 'feedback-2',
        title: '进度条',
        desc: '线性进度展示',
        count: 4,
      },
      {
        key: 'skeleton',
        group: 'feedback-2',
        title: '骨架屏',
        desc: '加载占位骨架',
        count: 5,
      },
      {
        key: 'swipe-action',
        group: 'feedback-2',
        title: '滑动操作',
        desc: '侧滑菜单',
        count: 3,
      },
      {
        key: 'toast',
        group: 'feedback-2',
        title: '轻提示',
        desc: '轻量消息提示',
        count: 3,
      },
    ],
  },
  {
    key: 'display',
    label: '展示组件',
    comps: [
      {
        key: 'card',
        group: 'display',
        title: '卡片',
        desc: '内容卡片容器',
        count: 2,
      },
      {
        key: 'count-down',
        group: 'display',
        title: '倒计时',
        desc: '秒 / 时间戳倒计时',
        count: 3,
      },
      {
        key: 'count-to',
        group: 'display',
        title: '数字滚动',
        desc: '数字滚动动画',
        count: 3,
      },
      {
        key: 'image-preview',
        group: 'display',
        title: '图片预览',
        desc: '图片放大预览',
        count: 3,
      },
      {
        key: 'img',
        group: 'display',
        title: '图片',
        desc: '增强图片，多填充模式',
        count: 4,
      },
      {
        key: 'img-cropper',
        group: 'display',
        title: '图片裁剪',
        desc: '裁剪几何交互',
        count: 2,
      },
      {
        key: 'qr-code',
        group: 'display',
        title: '二维码',
        desc: '二维码生成与导出',
        count: 4,
      },
      {
        key: 'swiper',
        group: 'display',
        title: '轮播',
        desc: '内容轮播',
        count: 9,
      },
      {
        key: 'table',
        group: 'display',
        title: '表格',
        desc: '数据表格',
        count: 3,
      },
      {
        key: 'video-preview',
        group: 'display',
        title: '视频预览',
        desc: '视频弹层播放',
        count: 3,
      },
      {
        key: 'watermark',
        group: 'display',
        title: '水印',
        desc: '页面水印层',
        count: 3,
      },
    ],
  },
  {
    key: 'business',
    label: '业务组件',
    comps: [
      {
        key: 'barcode',
        group: 'business',
        title: '条形码',
        desc: 'EAN-13 条码渲染',
        count: 1,
      },
      {
        key: 'dialer',
        group: 'business',
        title: '大转盘',
        desc: '抽奖转盘，run 指定落点',
        count: 1,
      },
      {
        key: 'liquid',
        group: 'business',
        title: '水波进度球',
        desc: '水波动画的进度展示',
        count: 1,
      },
      {
        key: 'lucky',
        group: 'business',
        title: '抽奖九宫格',
        desc: 'play / stop 两段式抽奖',
        count: 1,
      },
      {
        key: 'scratchcard',
        group: 'business',
        title: '刮刮乐',
        desc: '刮层擦除与阈值回调',
        count: 1,
      },
      {
        key: 'typing',
        group: 'business',
        title: '输入中',
        desc: '聊天输入中跳动圆点',
        count: 1,
      },
    ],
  },
  {
    key: 'more',
    label: '更多组件',
    comps: [
      {
        key: 'ai-chat',
        group: 'more',
        title: 'ai-chat',
        desc: '',
        count: 1,
      },
      {
        key: 'ai-message-list',
        group: 'more',
        title: 'ai-message-list',
        desc: '',
        count: 1,
      },
      {
        key: 'paging',
        group: 'more',
        title: 'paging',
        desc: '',
        count: 4,
      },
    ],
  },
];

function open(comp: CompItem): void {
  uni.navigateTo({ url: `/pages/${comp.group}/${comp.key}` });
}
</script>

<template>
  <view class="home">
    <view v-for="group in groups" :key="group.key" class="home__group">
      <view class="home__group-title">{{ group.label }}</view>
      <view v-for="comp in group.comps" :key="comp.key" class="home__card" @tap="open(comp)">
        <view class="home__card-head">
          <text class="home__title">{{ comp.title }}</text>
          <text class="home__count">{{ comp.count }} 个场景</text>
        </view>
        <text class="home__desc">{{ comp.desc }}</text>
      </view>
    </view>
    <view class="home__foot">
      <text class="home__foot-text">snui · uni-app 端组件演示</text>
    </view>
  </view>
</template>

<style scoped>
.home {
  padding: 24rpx;
}

.home__group {
  margin-bottom: 32rpx;
}

.home__group-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f1f1f;
  padding: 8rpx 8rpx 16rpx;
}

.home__card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.home__card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.home__title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f1f1f;
}

.home__count {
  font-size: 22rpx;
  color: #999999;
}

.home__desc {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.6;
}

.home__foot {
  padding: 40rpx 0;
  display: flex;
  justify-content: center;
}

.home__foot-text {
  font-size: 22rpx;
  color: #bbbbbb;
}
</style>
