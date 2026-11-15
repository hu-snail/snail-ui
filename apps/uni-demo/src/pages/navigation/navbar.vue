<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— navbar 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/navbar-mp-basic.vue';
import Demo1 from './demos/navbar-mp-capsule-slot.vue';
import Demo2 from './demos/navbar-mp-disabled.vue';
import Demo3 from './demos/navbar-mp-fixed.vue';
import Demo4 from './demos/navbar-mp-safe-area.vue';
import Demo5 from './demos/navbar-mp-slots.vue';
import Demo6 from './demos/navbar-mp-capsule.vue';
import Demo7 from './demos/navbar-mp-mp-capsule.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell
    :title-zh="'导航栏'"
    :title-en="'Navbar'"
    :desc="'页面顶部标题栏'"
    :bg="''"
    nav-style="native"
  >
    <view class="page">
      <view class="module">
        <view class="module__head">
          <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" />
        </view>
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <DemoModuleHead :title="t('胶囊插槽', 'Capsule slot')" badge="capsule-slot" />
        </view>
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <DemoModuleHead
            :title="t('禁用侧按钮（left-disabled）', 'Disabled sides (`left-disabled`)')"
            badge="disabled"
          />
        </view>
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <DemoModuleHead
            :title="
              t('固定定位（fixed / placeholder）', 'Fixed positioning (`fixed` / `placeholder`)')
            "
            badge="fixed"
          />
        </view>
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <DemoModuleHead :title="t('安全区与层级', 'Safe area & stacking')" badge="safe-area" />
        </view>
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <DemoModuleHead :title="t('左右插槽', 'Left & right slots')" badge="slots" />
        </view>
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <DemoModuleHead
            :title="t('胶囊样式 / 带搜索栏', 'Capsule style / search bar')"
            badge="capsule"
          />
        </view>
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <view class="module__head">
          <DemoModuleHead
            :title="t('微信小程序胶囊适配', 'WeChat mini-program capsule')"
            badge="mp-capsule"
          />
        </view>
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 0 0 48rpx;
}

/* navbar：按参考稿完整展开——场景模块去掉白底 / 圆角 / 描边 / 柔影 /
 * 内边距，导航栏示例通栏铺满整行；标题行单独留白铺底。刻意不设 overflow /
 * transform / backdrop-filter——它们会把 position: fixed 的后代变成卡片坐标系。 */
.module {
  margin-bottom: 24rpx;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}

.module__head {
  padding: 24rpx 32rpx 16rpx;
  background: var(--demo-card-bg);
}

.module__body {
  padding: 0;
}
</style>
