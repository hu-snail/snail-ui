<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— input 组件全部场景聚合页（静态展开）。
import Demo0 from './demos/input-mp-basic.vue';
import Demo1 from './demos/input-mp-types.vue';
import Demo2 from './demos/input-mp-sizes.vue';
import Demo3 from './demos/input-mp-radius.vue';
import Demo4 from './demos/input-mp-bordered-bg-radius.vue';
import Demo5 from './demos/input-mp-prefix-suffix.vue';
import Demo6 from './demos/input-mp-slots.vue';
import Demo7 from './demos/input-mp-clearable-count.vue';
import Demo8 from './demos/input-mp-clear-focus.vue';
import Demo9 from './demos/input-mp-password-toggle.vue';
import Demo10 from './demos/input-mp-word-limit.vue';
import Demo11 from './demos/input-mp-status.vue';
import Demo12 from './demos/input-mp-states.vue';
import Demo13 from './demos/input-mp-align-compact.vue';
import Demo14 from './demos/input-mp-native-attrs.vue';
import Demo15 from './demos/input-mp-runtime.vue';
import Demo16 from './demos/input-mp-custom-class.vue';
import DemoModuleHead from '../../components/DemoModuleHead.vue';
import DemoPageShell from '../../components/DemoPageShell.vue';
import { useDemoUi } from '../../state/demo-ui';

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'输入框'" :title-en="'Input'" :bg="'#ffffff'">
    <view class="page">
      <view class="module">
        <DemoModuleHead :title="t('基础用法', 'Basic usage')" badge="basic" :index="0" />
        <view class="module__body">
          <Demo0 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('类型', 'Type')" badge="types" :index="1" />
        <view class="module__body">
          <Demo1 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('尺寸', 'Sizes')" badge="sizes" :index="2" />
        <view class="module__body">
          <Demo2 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('圆角', 'Radius')" badge="radius" :index="3" />
        <view class="module__body">
          <Demo3 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('边框与背景', 'Border & background')"
          badge="bordered-bg-radius"
          :index="4"
        />
        <view class="module__body">
          <Demo4 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('前后图标', 'Prefix & suffix icons')"
          badge="prefix-suffix"
          :index="5"
        />
        <view class="module__body">
          <Demo5 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('插槽', 'Slots')" badge="slots" :index="6" />
        <view class="module__body">
          <Demo6 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('清空与字数', 'Clearable & count')"
          badge="clearable-count"
          :index="7"
        />
        <view class="module__body">
          <Demo7 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('清空与聚焦', 'Clear & focus')" badge="clear-focus" :index="8" />
        <view class="module__body">
          <Demo8 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('密码显隐', 'Password toggle')"
          badge="password-toggle"
          :index="9"
        />
        <view class="module__body">
          <Demo9 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('字数统计', 'Word limit')" badge="word-limit" :index="10" />
        <view class="module__body">
          <Demo10 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('校验状态', 'Validation status')" badge="status" :index="11" />
        <view class="module__body">
          <Demo11 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('禁用与只读', 'Disabled & readonly')"
          badge="states"
          :index="12"
        />
        <view class="module__body">
          <Demo12 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('对齐与紧凑', 'Alignment & compact')"
          badge="align-compact"
          :index="13"
        />
        <view class="module__body">
          <Demo13 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('原生属性', 'Native attributes')"
          badge="native-attrs"
          :index="14"
        />
        <view class="module__body">
          <Demo14 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead
          :title="t('运行时属性', 'Runtime attributes')"
          badge="runtime"
          :index="15"
        />
        <view class="module__body">
          <Demo15 />
        </view>
      </view>
      <view class="module">
        <DemoModuleHead :title="t('自定义类名', 'Custom class')" badge="custom-class" :index="16" />
        <view class="module__body">
          <Demo16 />
        </view>
      </view>
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx 24rpx 48rpx;
}

/* 场景模块：白底圆角卡片（组件规范视觉稿：浅灰渐变画布上的浮起分区卡）。
 * 刻意不设 overflow / transform / backdrop-filter——它们会把 position: fixed
 * 的后代变成卡片坐标系，弹窗类 demo（calendar / popup / dialog …）会被困在
 * 卡片内裁切显示不全；层级感由描边 + 柔影承担。 */
.module {
  margin-bottom: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  background: var(--demo-card-bg);
  border: 1px solid var(--demo-card-border);
  box-shadow: var(--demo-card-shadow);
}

.module__body {
  padding: 0;
}
</style>
