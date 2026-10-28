<script setup lang="ts">
/**
 * 模板中心（主包唯一页面）—— 场景模板目录，点击进入 subpages 分包模板页。
 * 主包只承载目录，保证小程序主包体积最小（分包按需下载）。
 */
const templates = [
  { id: 'login', title: '登录页', desc: '验证码登录 / 三方入口', from: '#6366f1', to: '#a855f7' },
  { id: 'mall', title: '商城首页', desc: '搜索 / 宫格 / 秒杀 / 底部导航', from: '#0ea5e9', to: '#22d3ee' },
  { id: 'goods', title: '商品详情页', desc: '主图 / 规格 / 底部操作栏', from: '#f97316', to: '#facc15' },
  { id: 'order', title: '订单页', desc: '状态分段 / 订单卡 / 去支付', from: '#8b5cf6', to: '#6366f1' },
  { id: 'xhs', title: '图文社区', desc: '双列笔记流 / 点赞互动', from: '#ec4899', to: '#f43f5e' },
  { id: 'news', title: '新闻首页', desc: '频道分段 / 图文列表', from: '#14b8a6', to: '#22c55e' },
  { id: 'address', title: '地址管理', desc: '地址卡 / 默认标签 / 新增', from: '#64748b', to: '#94a3b8' },
  { id: 'article', title: '文章详情', desc: '作者行 / 正文 / 互动栏', from: '#334155', to: '#64748b' },
  { id: 'stats', title: '数据统计', desc: '指标卡 / 柱状图 / 来源分布', from: '#7c3aed', to: '#c084fc' },
  { id: 'contacts', title: '通讯录', desc: '搜索 / 字母索引分组', from: '#2563eb', to: '#60a5fa' },
  { id: 'form', title: '步骤表单', desc: '分步入驻 / 字段校验', from: '#059669', to: '#34d399' },
] as const;

function open(id: string): void {
  uni.navigateTo({ url: `/subpages/${id}` });
}
</script>

<template>
  <view class="tpl-page index">
    <view class="index__hero">
      <text class="index__title">snui 场景模板</text>
      <text class="index__sub">基于 @snui/uni 的真实页面模板 · 支持 H5 与微信小程序发布</text>
    </view>

    <view
      v-for="tpl in templates"
      :key="tpl.id"
      class="tpl-card index__item"
      @tap="open(tpl.id)"
    >
      <view class="index__cover" :style="{ background: `linear-gradient(135deg, ${tpl.from}, ${tpl.to})` }" />
      <view class="index__meta">
        <text class="index__name">{{ tpl.title }}</text>
        <text class="index__desc">{{ tpl.desc }}</text>
      </view>
      <text class="index__arrow">›</text>
    </view>

    <view class="index__foot">
      <text>主包仅保留本目录页 · 模板全部位于 subpages 分包</text>
    </view>
  </view>
</template>

<style scoped>
.index {
  padding: 24rpx;
}
.index__hero {
  padding: 28rpx 8rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.index__title {
  font-size: 40rpx;
  font-weight: 800;
}
.index__sub {
  font-size: 24rpx;
  color: #667085;
  line-height: 1.5;
}
.index__item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}
.index__cover {
  width: 92rpx;
  height: 92rpx;
  border-radius: 20rpx;
  flex-shrink: 0;
}
.index__meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.index__name {
  font-size: 30rpx;
  font-weight: 700;
}
.index__desc {
  font-size: 22rpx;
  color: #98a2b3;
}
.index__arrow {
  color: #98a2b3;
  font-size: 36rpx;
}
.index__foot {
  padding: 16rpx 8rpx 40rpx;
  text-align: center;
  font-size: 20rpx;
  color: #b3bac6;
}
</style>
