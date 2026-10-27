<script setup lang="ts">
/** Demo: sn-rich-text (uni-end) — 图片：占位、预览、original-src、失败回退。 */
import SnRichText from '@snui/uni-src/components/sn-rich-text/sn-rich-text.vue';

const images = `
  <p>普通图片点击可预览，缩略图用 <code>original-src</code> 指定高清地址。</p>
  <img src="https://picsum.photos/id/1015/640/360" original-src="https://picsum.photos/id/1015/1280/720" alt="山湖风景" />
  <p>装饰图片退出预览列表，但仍触发 <code>image-click</code>：</p>
  <img src="https://picsum.photos/id/1025/320/320" data-preview="false" alt="装饰图片" />
  <p>地址无效时回退到 <code>alt</code> 文本：</p>
  <img src="" alt="这张照片暂时无法加载" />
`;

function onImageClick(payload: { src: string; index: number }): void {
  uni.showToast({ title: `图片 ${payload.index + 1}`, icon: 'none' });
}
</script>

<template>
  <view class="sn-demo">
    <SnRichText :content="images" @image-click="onImageClick" />
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
