<script setup lang="ts">
/**
 * Demo: sn-cell — 前导图标的三种来源与尺寸 / 颜色档位。
 *
 * 图标来源：名称解析链（内置目录 kebab 名零注册可用 / registerSnIcons
 * 注册名）、IconData 对象（sn-icon-set 具名导入，优先于名称）、图片 URL。
 * 尺寸档位映射 --sn-mp-icon-size-* token，颜色传 --sn-mp-color-* token。
 */
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Check, CircleAlert, Heart, Star, X } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

// IconData 内联样板（与 DemoPageShell 同源约定 — lucide, ISC）。
const MoonIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
};

// 注册表轨道：注册后即可按图标名引用（registerSnIcons 幂等，合并注册）。
registerSnIcons({ 'cell-moon': MoonIcon });
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">名称解析链（内置目录名零注册可用，注册表名自定义）</text>
    <SnCellGroup insert>
      <SnCell title="内置目录名" value="bell" prefix-icon="bell" />
      <SnCell title="注册表名" value="cell-moon" prefix-icon="cell-moon" />
    </SnCellGroup>

    <text class="sn-demo__label">IconData 对象（sn-icon-set 具名导入，优先于名称）</text>
    <SnCellGroup insert>
      <SnCell title="收藏" value="Star" :prefix-icon-data="Star" />
      <SnCell title="喜欢" value="Heart" :prefix-icon-data="Heart" />
    </SnCellGroup>

    <text class="sn-demo__label">尺寸档位（iconSize 映射 --sn-mp-icon-size-*）</text>
    <SnCellGroup insert>
      <SnCell title="tiny" :prefix-icon-data="Bell" icon-size="tiny" />
      <SnCell title="small" :prefix-icon-data="Bell" icon-size="small" />
      <SnCell title="medium" :prefix-icon-data="Bell" icon-size="medium" />
      <SnCell title="large" :prefix-icon-data="Bell" icon-size="large" />
      <SnCell title="xlarge" :prefix-icon-data="Bell" icon-size="xlarge" />
    </SnCellGroup>

    <text class="sn-demo__label">颜色 token（iconColor 传 --sn-mp-color-*）</text>
    <SnCellGroup insert>
      <SnCell
        title="通过验证"
        :prefix-icon-data="Check"
        icon-color="var(--sn-mp-color-feedback-success)"
      />
      <SnCell
        title="电量偏低"
        :prefix-icon-data="CircleAlert"
        icon-color="var(--sn-mp-color-feedback-warning)"
      />
      <SnCell
        title="登录异常"
        :prefix-icon-data="X"
        icon-color="var(--sn-mp-color-feedback-danger)"
      />
    </SnCellGroup>

    <text class="sn-demo__label">图片图标（prefixIconUrl / suffixIconUrl）</text>
    <SnCellGroup insert>
      <SnCell title="前置图片" value="头像" prefix-icon-url="https://picsum.photos/seed/snui-cell/96" />
      <SnCell title="后置图片" value="附件" suffix-icon-url="https://picsum.photos/seed/snui-cell-file/96" />
    </SnCellGroup>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
