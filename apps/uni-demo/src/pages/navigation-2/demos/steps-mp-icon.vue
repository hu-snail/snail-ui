<script setup lang="ts">
/**
 * Demo: sn-steps — 图标配置三源与尺寸 / 颜色。
 *
 * `icon` 走名称轨道（registry → 内置目录，kebab-case 名免注册直接可用）；
 * `iconData` 传入 IconData 对象（内置图标集具名导入，tree-shaking 友好），
 * 优先级最高；`iconUrl` 渲染 `<image>` 图片。`iconSize` 档位映射
 * `--sn-mp-icon-size-*`，`iconColor` 覆盖描边色（默认 currentColor 跟随状态）。
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
import { Home, ShoppingCart, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';

/** 图片图标：与矢量图标共用同一套尺寸档位。 */
const riderAvatar = 'https://picsum.photos/seed/snui-steps-rider/48/48';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">icon 名称（内置目录，免注册）</text>
    <SnSteps :active="1">
      <SnStep icon="clipboard" title="提交订单" description="09:00" />
      <SnStep icon="wallet" title="完成支付" description="09:05" />
      <SnStep icon="house" title="收货完成" description="待处理" />
    </SnSteps>

    <text class="sn-demo__label">iconData 对象 + iconSize 档位</text>
    <SnSteps :active="1">
      <SnStep :icon-data="ShoppingCart" icon-size="small" title="加入购物车" description="09:00" />
      <SnStep :icon-data="User" title="确认收货人" description="09:05" />
      <SnStep :icon-data="Home" icon-size="large" title="送货上门" description="待处理" />
    </SnSteps>

    <text class="sn-demo__label">iconUrl 图片（尺寸随图标档位）</text>
    <SnSteps :active="0">
      <SnStep :icon-url="riderAvatar" title="骑手接单" description="已接单" />
      <SnStep title="配送中" description="预计 20 分钟" />
      <SnStep title="已送达" description="待确认" />
    </SnSteps>

    <text class="sn-demo__label">iconColor 覆盖描边色</text>
    <SnSteps :active="1">
      <SnStep icon="bell" icon-color="var(--sn-mp-color-feedback-danger)" title="库存预警" />
      <SnStep icon="percent" icon-color="var(--sn-mp-color-action-primary)" title="限时折扣" />
      <SnStep title="恢复原价" status="wait" />
    </SnSteps>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.sn-demo__label {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
