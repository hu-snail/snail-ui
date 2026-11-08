<script setup lang="ts">
/**
 * Demo: sn-collapse — 标题图标的三种来源、尺寸档位与配色。
 *
 * 图标来源（优先级：对象 > 图片 > 名称）：
 *   - `titleIconData`：内置图标集对象（sn-icon-set 具名导入），零注册
 *   - `titleIcon`：名称解析链（内置目录 kebab 名零注册 / registerSnIcons 名）
 *   - `titleIconUrl`：图片地址，按 `<image>` 渲染
 *
 * 尺寸：`iconSize` 档位名映射 `--sn-mp-icon-size-*`（容器统一设置，面板可覆盖）；
 * 颜色：`iconColor` 只传 `var(--sn-mp-color-*)` token。
 */
import { ref } from 'vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Gift, MapPin, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

// IconData 内联样板（lucide 路径数据，ISC）。
const MoonIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
};

// 注册表轨道：注册后即可按图标名引用（registerSnIcons 幂等，合并注册）。
registerSnIcons({ 'collapse-moon': MoonIcon });

const byData = ref(['a']);
const byName = ref(['a']);
const byUrl = ref([]);
const tiers = ref(['a']);
const colored = ref([]);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">内置图标集对象（titleIconData，优先级最高）</text>
    <SnCollapse v-model="byData">
      <SnCollapseItem name="a" title="收藏夹" :title-icon-data="Star">
        <text class="sn-demo__body">Star 具名导入后直接作为对象传递，无需注册。</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="附近门店" :title-icon-data="MapPin">
        <text class="sn-demo__body">同一套内置图标集覆盖常见业务语义。</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">名称解析链（内置目录名零注册 / 注册表名自定义）</text>
    <SnCollapse v-model="byName">
      <SnCollapseItem name="a" title="消息提醒" title-icon="bell">
        <text class="sn-demo__body">kebab-case 目录名直接可用。</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="夜间模式" title-icon="collapse-moon">
        <text class="sn-demo__body">registerSnIcons 注册过的名字同样可用。</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">图片图标（titleIconUrl，按 image 渲染）</text>
    <SnCollapse v-model="byUrl">
      <SnCollapseItem
        name="a"
        title="品牌头像"
        title-icon-url="https://picsum.photos/seed/snui-collapse/96"
      >
        <text class="sn-demo__body">图片图标与 SVG 图标共用同一个尺寸盒。</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">尺寸档位（容器 iconSize 统一，面板可覆盖）</text>
    <SnCollapse v-model="tiers" icon-size="medium">
      <SnCollapseItem name="a" title="tiny 档" :title-icon-data="Bell" icon-size="tiny">
        <text class="sn-demo__body">箭头与标题图标同步缩放。</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="small 档" :title-icon-data="Bell" icon-size="small">
        <text class="sn-demo__body">档位名映射 --sn-mp-icon-size-* token。</text>
      </SnCollapseItem>
      <SnCollapseItem name="c" title="large 档" :title-icon-data="Bell" icon-size="large">
        <text class="sn-demo__body">迁移到别的视口仍然等比。</text>
      </SnCollapseItem>
      <SnCollapseItem name="d" title="自定义 44rpx" :title-icon-data="Bell" icon-size="44rpx">
        <text class="sn-demo__body">数字 / 任意长度字符串原样透传。</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__label">配色（iconColor 传 --sn-mp-color-* token）</text>
    <SnCollapse v-model="colored" icon-color="var(--sn-mp-color-action-primary)">
      <SnCollapseItem name="a" title="品牌色图标" :title-icon-data="Gift">
        <text class="sn-demo__body">容器级配色，面板展开后仍保持主色。</text>
      </SnCollapseItem>
    </SnCollapse>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__body {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
</style>
