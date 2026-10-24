<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — `active-icon` / `inactive-icon` 切换 + `z-index` +
 * `custom-style`。
 *
 *   - `inactive-icon` 收起时的图标名（经 sn-icon registry 解析）
 *   - `active-icon`   展开时的图标名
 *   - `z-index`       根节点层级
 *   - `custom-style`  追加到根节点 inline style（z-index 之后写入，可覆盖）
 *
 * `plus` / `close` 是内置的两个默认名，其余名字走 `registerSnIcons()`。
 * 这里用内置名 + 注册名各演示一组。
 */
import { onBeforeUnmount, ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue'
import { registerSnIcons, clearSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry'
import { Heart, Star } from '@snui/uni-src/components/sn-icon/sn-icon-set'

registerSnIcons({ Heart, Star })
onBeforeUnmount(() => clearSnIcons())

const builtinActive = ref(false)
const customIconsActive = ref(false)
const lastAction = ref('—')

function pick(label: string): void {
  lastAction.value = label
  builtinActive.value = false
  customIconsActive.value = false
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <text class="sn-fab-demo__meta">已触发：{{ lastAction }}</text>
    <text class="sn-fab-demo__meta">
      左下：inactive-icon=plus / active-icon=close（内置名）；右下：heart / star（registry 名）+ z-index
    </text>

    <!-- 内置图标名：plus 收起、close 展开。 -->
    <SnFab
      v-model:active="builtinActive"
      inactive-icon="plus"
      active-icon="close"
      position="left-bottom"
      :gap="{ bottom: 16, left: 16 }"
      :z-index="10"
      custom-class="sn-demo-contained"
    >
      <SnButton round size="small" @tap="pick('内置 A')">A</SnButton>
      <SnButton round size="small" @tap="pick('内置 B')">B</SnButton>
    </SnFab>

    <!-- registry 图标名 + 更高层级 + custom-style 追加阴影。 -->
    <SnFab
      v-model:active="customIconsActive"
      inactive-icon="Heart"
      active-icon="Star"
      type="success"
      position="right-bottom"
      :gap="{ bottom: 16, right: 16 }"
      :z-index="200"
      custom-style="box-shadow: var(--sn-mp-shadow-lg);"
      custom-class="sn-demo-contained"
    >
      <SnButton type="primary" round size="small" @tap="pick('注册图标 A')">A</SnButton>
      <SnButton type="success" round size="small" @tap="pick('注册图标 B')">B</SnButton>
      <SnButton round size="small" @tap="pick('注册图标 C')">C</SnButton>
    </SnFab>
  </view>
</template>

<style scoped>
.sn-fab-demo__stage {
  position: relative;
  width: 100%;
  height: 520rpx;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-fab-demo__meta {
  padding: var(--sn-mp-spacing-3);
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-secondary);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
