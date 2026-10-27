<script setup lang="ts">
/** Demo: sn-rich-text (uni-end) — 链接与图片链接：link-click 由业务处理导航。 */
import SnRichText from '@snui/uni-src/components/sn-rich-text/sn-rich-text.vue';

const links = `
  <p>点击链接只触发 <code>link-click</code>，导航由业务决定。</p>
  <p><a href="https://uniapp.dcloud.net.cn">uni-app 官方文档</a> · <a href="tel:10086">客服电话</a> · <a href="mailto:hi@example.com">邮件联系</a></p>
  <p>有效链接包裹的图片也触发 <code>link-click</code>：</p>
  <a href="https://uniapp.dcloud.net.cn"><img src="https://picsum.photos/id/1043/640/360" alt="链接图片" /></a>
  <p>被过滤的地址按普通文本处理，不触发事件：</p>
  <p><a href="javascript:void(0)">无效链接</a></p>
`;

function onLinkClick(payload: { href: string }): void {
  uni.showToast({ title: payload.href, icon: 'none' });
}
</script>

<template>
  <view class="sn-demo">
    <SnRichText :content="links" @link-click="onLinkClick" />
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
