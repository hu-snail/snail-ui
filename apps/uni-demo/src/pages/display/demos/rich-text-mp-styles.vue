<script setup lang="ts">
/** Demo: sn-rich-text (uni-end) — 样式映射、锚点目录与空状态插槽。 */
import { ref } from 'vue';
import SnRichText from '@snui/uni-src/components/sn-rich-text/sn-rich-text.vue';
import type {
  RichTextHeading,
  RichTextInstance,
} from '@snui/uni-src/components/sn-rich-text/sn-rich-text-types';

const styled = `
  <p class="eyebrow">YOU ARE INVITED</p>
  <h2>一起，去见山</h2>
  <p>把一整个下午<br>交给阳光、草地和好朋友。</p>
  <p class="ql-align-center">居中的邀请语</p>
`;

const tagStyle = { p: 'text-align:center;line-height:1.9;', h2: 'text-align:center;' };
const classStyles = {
  eyebrow: 'font-size:12px;letter-spacing:3px;color:var(--sn-mp-color-feedback-success);',
};

const outline = `
  <h2 id="intro">出发之前</h2>
  <p>带上饮水和轻食。</p>
  <h2 id="walk">沿湖慢走</h2>
  <p>让脚步慢下来。</p>
`;

const richText = ref<RichTextInstance>();
const headings = ref<RichTextHeading[]>([]);
const emptyContent = ref('<p><strong>周末来信</strong></p>');

function onLoad(): void {
  headings.value = richText.value?.getHeadings() ?? [];
}

async function jump(id: string): Promise<void> {
  try {
    await richText.value?.scrollToAnchor(id, { offset: 16, duration: 300 });
  } catch {
    uni.showToast({ title: '章节暂时无法定位', icon: 'none' });
  }
}

function clearContent(): void {
  emptyContent.value = '';
}
</script>

<template>
  <view class="sn-demo">
    <SnRichText :content="styled" :tag-style="tagStyle" :class-styles="classStyles" />

    <view class="sn-demo__actions">
      <view v-for="item in headings" :key="item.id" class="sn-demo__button" @click="jump(item.id)">
        <text class="sn-demo__button-text">{{ item.text }}</text>
      </view>
    </view>
    <SnRichText ref="richText" :content="outline" enable-anchor @load="onLoad" />

    <view class="sn-demo__actions">
      <view class="sn-demo__button" @click="clearContent">
        <text class="sn-demo__button-text">清空内容</text>
      </view>
    </view>
    <SnRichText :content="emptyContent">
      <text class="sn-demo__empty">还没有新的来信</text>
    </SnRichText>
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sn-demo__actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.sn-demo__button {
  padding: 8px 12px;
  border-radius: 6px;
  background-color: var(--sn-mp-color-action-primary);
}

.sn-demo__button-text {
  color: var(--sn-mp-color-text-on-primary);
  font-size: 12px;
}

.sn-demo__empty {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 13px;
}
</style>
