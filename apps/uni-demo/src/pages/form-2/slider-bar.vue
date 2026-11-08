<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— slider-bar 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/slider-bar-mp-basic.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'胶囊滑条'"
    :title-en="'SliderBar'"
    :desc="'胶囊 / 渐变星光滑条'"
    :bg="''"
  >
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>
