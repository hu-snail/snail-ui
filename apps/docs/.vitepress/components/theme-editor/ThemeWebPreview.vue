<script setup lang="ts">
/**
 * ThemeWebPreview — 主题编辑器的 Web 端预览区。
 *
 * 渲染的是 `@snui/vue-web` 的**真实组件**（dist 产物），变量来自
 * `buildWebVars()`（`--sn-web-*`）。因此预览里看到的就是用户把同一份变量注入
 * 自己站点后组件的样子 —— 不是示意图。
 *
 * ## 分区（对照 veanui 主题编辑器）
 *
 *   品牌色    —— 按钮全变体、标签、头像、开关/勾选/滑块/进度/评分/分页、色阶带
 *   状态色    —— 四条反馈 Alert + Badge/Tag/Progress 语义组合
 *   表单控件  —— Input / Select / Textarea / InputNumber / 勾选 / 单选 / 开关 /
 *              评分 / 滑块 / 分段 / 加粗组 / 复选组 / 标签输入 / 焦点环
 *   数据展示  —— Card + 表格
 *   表面与阴影 —— 高度阶梯（background → card → popover → carbon）、嵌套、阴影阶梯
 *   描边与焦点 —— 细线 token、控件描边、分隔线、焦点环
 *   浮层      —— Dialog / Drawer / Sheet / Dropdown / Popover / Tooltip / Popconfirm
 *   尺寸      —— 6 档 size 阶梯（按钮 / 标签 / 徽标 / 输入 / 开关 / 滑块 / 分段）
 *   圆角      —— 9 档圆角阶梯 + 组件在各档下的样子 + 嵌套
 *   间距      —— padding 阶梯 + gap 阶梯 + Alert 栈 + Card 内边距
 *   字体      —— 四个字体角色 + 实际排版样张
 *   对比度    —— 实心填充与其 foreground 配对
 *   图表色    —— chart-1…5 派生色阶
 *
 * ## 为什么用 `:style` 而不是注入 `<style>`
 *
 * 变量必须落在预览容器上，组件才继承得到；容器上还叠了「预览专用」的
 * 局部变量（`--sn-preview-*`），避免污染全站 `:root`。全站生效由
 * `state.ts` 注入 `:root` 完成，这里只管预览块内部。
 */

import { computed, ref } from 'vue';
import {
  SnAlert,
  SnAvatar,
  SnButton,
  SnCard,
  SnCheckbox,
  SnCheckboxGroup,
  SnDivider,
  SnDynamicTags,
  SnInput,
  SnInputNumber,
  SnPagination,
  SnProgress,
  SnRadioGroup,
  SnRate,
  SnSelect,
  SnSlider,
  SnSwitch,
  SnTag,
} from '@snui/vue-web';
import type { SnRadioOption, SnSelectOption } from '@snui/vue-web';
import { SCALE_STEPS } from '../../utils/theme-editor/palette';
import type { SemanticColors, ThemeEditorConfig, VarMap } from '../../utils/theme-editor/vars';

interface Props {
  config: ThemeEditorConfig;
  colors: SemanticColors;
  vars: VarMap;
  english?: boolean;
}
const props = withDefaults(defineProps<Props>(), { english: false });

const t = (zh: string, en: string): string => (props.english ? en : zh);

/** 分区筛选。 */
type Section = 'all' | 'color' | 'size' | 'font' | 'shape';
const activeSection = ref<Section>('all');

const sections = computed<Array<{ value: Section; label: string }>>(() => [
  { value: 'all', label: t('全部', 'All') },
  { value: 'color', label: t('颜色', 'Color') },
  { value: 'size', label: t('尺寸', 'Size') },
  { value: 'font', label: t('字体', 'Font') },
  { value: 'shape', label: t('结构', 'Shape') },
]);

/** 当前分区是否包含某张卡。 */
function shows(...names: Array<Exclude<Section, 'all'>>): boolean {
  return (
    activeSection.value === 'all' || names.includes(activeSection.value as Exclude<Section, 'all'>)
  );
}

// ─── 交互状态（纯 UI） ────────────────────────────────────────────────────
const switchOn = ref(true);
const checkboxOn = ref(true);
const sliderValue = ref(56);
const rateValue = ref(3);
const page = ref(2);
const inputValue = ref('');
const numberValue = ref(2);
const progressValue = ref(62);
const selectValue = ref<string | number | null>(null);
const radioValue = ref<string | number | null>('team');
const tags = ref<string[]>(['Vue', 'UnoCSS']);
const focusInput = ref('');

const selectOptions: SnSelectOption[] = [
  { label: t('苹果', 'Apple'), value: 'apple' },
  { label: t('香蕉', 'Banana'), value: 'banana' },
  { label: t('樱桃', 'Cherry'), value: 'cherry' },
];

const radioOptions: SnRadioOption[] = [
  { label: 'Starter', value: 'starter' },
  { label: 'Team', value: 'team' },
  { label: 'Enterprise', value: 'enterprise' },
];

// ─── 色阶 ────────────────────────────────────────────────────────────────

/** 品牌色阶（色带 + 档位标签）。 */
const scale = computed<Array<{ step: number; color: string }>>(() =>
  SCALE_STEPS.map((step) => ({ step, color: props.colors.primary[step] })),
);

/** 图表色阶（由 primary 派生 5 档）。 */
const chartSteps = [600, 500, 400, 300, 200] as const;
const chartColors = computed<Array<{ name: string; color: string }>>(() =>
  chartSteps.map((step, i) => ({ name: `chart-${i + 1}`, color: props.colors.primary[step] })),
);

/** 实心填充 ↔ foreground 配对（对比度卡）。 */
const fillPairs = computed<
  Array<{ token: string; fill: string; foreground: string; soft?: string }>
>(() => [
  { token: '--primary', fill: props.colors.primary[500], foreground: props.colors.text.onPrimary },
  {
    token: '--secondary',
    fill: props.colors.secondary[500],
    foreground: props.colors.semantics.secondaryForeground,
  },
  {
    token: '--accent',
    fill: props.colors.accent[500],
    foreground: props.colors.semantics.accentForeground,
  },
  {
    token: '--carbon',
    fill: props.colors.carbon[500],
    foreground: props.colors.semantics.carbonForeground,
  },
  {
    token: '--destructive',
    fill: props.colors.semantics.danger,
    foreground: props.colors.semantics.dangerForeground,
    soft: props.colors.semantics.dangerSoft,
  },
  {
    token: '--success',
    fill: props.colors.semantics.success,
    foreground: props.colors.semantics.successForeground,
    soft: props.colors.semantics.successSoft,
  },
  {
    token: '--warning',
    fill: props.colors.semantics.warning,
    foreground: props.colors.semantics.warningForeground,
    soft: props.colors.semantics.warningSoft,
  },
  {
    token: '--info',
    fill: props.colors.semantics.info,
    foreground: props.colors.semantics.infoForeground,
    soft: props.colors.semantics.infoSoft,
  },
]);

/** 尺寸阶梯（6 档，按比例缩放）。 */
const sizeLadder = computed<Array<{ name: string; scale: number }>>(() => [
  { name: 'xs', scale: 0.7 },
  { name: 'sm', scale: 0.85 },
  { name: 'md', scale: 1 },
  { name: 'lg', scale: 1.15 },
  { name: 'xl', scale: 1.3 },
  { name: '2xl', scale: 1.5 },
]);

/** 圆角阶梯。 */
const radiusLadder = computed<Array<{ name: string; value: string }>>(() => [
  { name: 'none', value: '0px' },
  { name: '2xs', value: `calc(var(--sn-web-radius-md) * 0.2)` },
  { name: 'xs', value: `var(--sn-web-radius-xs)` },
  { name: 'sm', value: `var(--sn-web-radius-sm)` },
  { name: 'md', value: `var(--sn-web-radius-md)` },
  { name: 'lg', value: `var(--sn-web-radius-lg)` },
  { name: 'xl', value: `var(--sn-web-radius-xl)` },
  { name: '2xl', value: `calc(var(--sn-web-radius-xl) * 1.6)` },
  { name: 'full', value: '9999px' },
]);

/** 间距阶梯（padding 视觉）。 */
const spacingLadder = computed<Array<{ name: string; value: string }>>(() =>
  ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((name, i) => ({
    name,
    value: [
      'var(--sn-web-spacing-1)',
      'var(--sn-web-spacing-2)',
      'var(--sn-web-spacing-3)',
      'var(--sn-web-spacing-4)',
      'var(--sn-web-spacing-5)',
      'var(--sn-web-spacing-6)',
      'var(--sn-web-spacing-8)',
    ][i] as string,
  })),
);

/** 阴影阶梯。 */
const shadowLadder = ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

/** 字体角色。 */
const fontRoles = computed<Array<{ token: string; label: string; stack: string }>>(() => [
  {
    token: 'font-sans',
    label: t('无衬线', 'Sans'),
    stack: 'var(--sn-web-font-family-body)',
  },
  {
    token: 'font-heading',
    label: t('标题', 'Heading'),
    stack: 'var(--sn-web-font-family-heading)',
  },
  {
    token: 'font-mono',
    label: t('等宽', 'Mono'),
    stack: 'var(--sn-web-font-family-code)',
  },
]);

const alertTypes = ['danger', 'success', 'warning', 'info'] as const;
const alertTitles = computed<Record<(typeof alertTypes)[number], string>>(() => ({
  danger: t('危险', 'destructive'),
  success: t('成功', 'success'),
  warning: t('警告', 'warning'),
  info: t('信息', 'info'),
}));

/** 发票表格数据。 */
const invoices = computed(() => [
  { id: 'INV-001', status: t('已支付', 'Paid'), amount: '$250.00' },
  { id: 'INV-002', status: t('待支付', 'Pending'), amount: '$150.00' },
  { id: 'INV-003', status: t('已支付', 'Paid'), amount: '$350.00' },
  { id: 'INV-004', status: t('已退款', 'Refunded'), amount: '$450.00' },
]);
</script>

<template>
  <div class="sn-theme-preview-web" :style="vars">
    <!-- 分区筛选 -->
    <div class="sn-preview__filters" role="tablist" :aria-label="t('预览分区', 'Preview sections')">
      <button
        v-for="s in sections"
        :key="s.value"
        type="button"
        role="tab"
        class="sn-preview__filter"
        :class="{ 'is-active': activeSection === s.value }"
        :aria-selected="activeSection === s.value"
        @click="activeSection = s.value"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- ══ 品牌色 ══ -->
    <section v-if="shows('color', 'size', 'shape')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('品牌色', 'Brand') }}</h3>
          <p class="sn-preview__desc">
            {{
              t(
                'primary 及其 foreground，以及由中性色派生出的整条色阶',
                'primary + foreground, plus the ramp derived from the neutral scale',
              )
            }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code
            v-for="c in [
              'primary',
              'primary-foreground',
              'primary-50…950',
              'ring',
              'secondary',
              'accent',
              'carbon',
            ]"
            :key="c"
            >{{ c }}</code
          >
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnButton</div>
        <div class="sn-preview__row">
          <SnButton type="primary">{{ t('主要', 'Solid') }}</SnButton>
          <SnButton type="primary" ghost>{{ t('幽灵', 'Ghost') }}</SnButton>
          <SnButton type="primary" secondary>{{ t('次要', 'Soft') }}</SnButton>
          <SnButton type="primary" text>{{ t('文字', 'Text') }}</SnButton>
          <SnButton type="primary" dashed>{{ t('虚线', 'Dashed') }}</SnButton>
          <SnButton>{{ t('默认', 'Default') }}</SnButton>
          <SnButton type="tertiary">{{ t('三级', 'Tertiary') }}</SnButton>
          <SnButton type="primary" loading>{{ t('载入', 'Loading') }}</SnButton>
          <SnButton type="primary" disabled>{{ t('禁用', 'Disabled') }}</SnButton>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnTag · SnAvatar</div>
        <div class="sn-preview__row">
          <SnTag type="primary" round>{{ t('主要', 'Primary') }}</SnTag>
          <SnTag round>{{ t('默认', 'Default') }}</SnTag>
          <SnTag type="success" round>{{ t('成功', 'Success') }}</SnTag>
          <SnTag type="warning" round>{{ t('警告', 'Warning') }}</SnTag>
          <SnTag type="error" round>{{ t('危险', 'Error') }}</SnTag>
          <SnAvatar :size="26" name="A" />
          <SnAvatar :size="26" name="B" />
          <SnAvatar :size="26" name="C" />
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnSwitch · SnCheckbox · SnSlider · SnProgress</div>
        <div class="sn-preview__row sn-preview__row--controls">
          <SnSwitch v-model:model-value="switchOn" />
          <SnSwitch v-model:model-value="checkboxOn" size="small" />
          <SnCheckbox v-model:model-value="checkboxOn" :label="t('已选择', 'Checked')" />
          <SnButton size="tiny">{{ t('小按钮', 'Small') }}</SnButton>
          <div class="sn-preview__slider"><SnSlider v-model:model-value="sliderValue" /></div>
        </div>
        <div class="sn-preview__row sn-preview__row--controls">
          <div class="sn-preview__progress"><SnProgress :percentage="progressValue" /></div>
          <SnRate v-model:model-value="rateValue" />
          <SnInput
            v-model:model-value="inputValue"
            :placeholder="t('输入框', 'Input')"
            class="sn-preview__input"
          />
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnPagination</div>
        <SnPagination v-model:page="page" :page-count="12" />
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">primary-50 → primary-950</div>
        <div class="sn-preview__scale">
          <span
            v-for="item in scale"
            :key="item.step"
            class="sn-preview__scale-chip"
            :style="{ background: item.color }"
            :title="`primary-${item.step} ${item.color}`"
          />
        </div>
        <div class="sn-preview__scale-labels">
          <span v-for="item in scale" :key="item.step">{{ item.step }}</span>
        </div>
      </div>
    </section>

    <!-- ══ 状态色 ══ -->
    <section v-if="shows('color')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('状态色', 'Feedback') }}</h3>
          <p class="sn-preview__desc">
            {{
              t(
                '反馈色：危险 / 成功 / 警告 / 信息，及其 soft 与 foreground',
                'feedback: danger, success, warning, info with soft + foreground',
              )
            }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code v-for="c in ['destructive', 'success', 'warning', 'info', 'foreground']" :key="c">{{
            c
          }}</code>
        </div>
      </header>

      <div class="sn-preview__alerts">
        <SnAlert
          v-for="type in alertTypes"
          :key="type"
          :type="type"
          :title="alertTitles[type]"
          closable
        >
          {{ t('反馈色语义槽位', 'Feedback scheme role') }}
        </SnAlert>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnTag · SnProgress（语义组合）</div>
        <div class="sn-preview__row">
          <SnTag type="error">{{ t('危险', 'Danger') }}</SnTag>
          <SnTag type="success">{{ t('成功', 'Success') }}</SnTag>
          <SnTag type="warning">{{ t('警告', 'Warning') }}</SnTag>
          <SnTag type="info">{{ t('信息', 'Info') }}</SnTag>
          <SnTag type="error" round>9</SnTag>
          <SnTag type="success" round>9</SnTag>
          <SnTag type="warning" round>9</SnTag>
          <SnTag type="info" round>9</SnTag>
        </div>
        <div class="sn-preview__progress-stack">
          <SnProgress :percentage="80" status="error" />
          <SnProgress :percentage="60" status="success" />
          <SnProgress :percentage="45" status="warning" />
          <SnProgress :percentage="30" status="info" />
        </div>
      </div>
    </section>

    <!-- ══ 表单控件 ══ -->
    <section v-if="shows('color', 'size', 'shape')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('表单控件', 'Form controls') }}</h3>
          <p class="sn-preview__desc">
            {{
              t('细线 token、控件填充与焦点环', 'hairline tokens, control fills and focus rings')
            }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code v-for="c in ['input', 'border', 'ring', 'muted', 'secondary', 'accent']" :key="c">{{
            c
          }}</code>
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnInput · SnSelect · Textarea · SnInputNumber</div>
        <div class="sn-preview__grid-4">
          <SnInput v-model:model-value="inputValue" :placeholder="t('项目名称', 'Project name')" />
          <SnSelect
            v-model:model-value="selectValue"
            :options="selectOptions"
            :placeholder="t('选择水果', 'Select a fruit')"
          />
          <SnInput
            v-model:model-value="inputValue"
            type="textarea"
            :placeholder="t('描述', 'Description')"
            :rows="2"
          />
          <SnInputNumber v-model:model-value="numberValue" :min="0" :max="99" />
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          SnCheckbox · SnRadioGroup · SnSwitch · SnRate · SnSlider
        </div>
        <div class="sn-preview__row sn-preview__row--controls">
          <SnCheckbox v-model:model-value="checkboxOn" :label="t('接受条款', 'Accept terms')" />
          <SnSwitch v-model:model-value="switchOn" />
          <SnRate v-model:model-value="rateValue" />
          <div class="sn-preview__slider"><SnSlider v-model:model-value="sliderValue" /></div>
          <SnRadioGroup
            v-model:model-value="radioValue"
            :options="radioOptions"
            name="sn-preview-radio"
          />
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnRadioGroup(button) · SnCheckboxGroup · SnDynamicTags</div>
        <div class="sn-preview__row">
          <SnRadioGroup
            button
            size="small"
            :model-value="'week'"
            :options="[
              { label: t('日', 'Day'), value: 'day' },
              { label: t('周', 'Week'), value: 'week' },
              { label: t('月', 'Month'), value: 'month' },
            ]"
            name="sn-preview-segment"
          />
        </div>
        <div class="sn-preview__row">
          <SnRadioGroup
            button
            size="small"
            :model-value="'italic'"
            :options="[
              { label: t('粗体', 'Bold'), value: 'bold' },
              { label: t('斜体', 'Italic'), value: 'italic' },
              { label: t('下划线', 'Underline'), value: 'underline' },
            ]"
            name="sn-preview-format"
          />
        </div>
        <div class="sn-preview__row">
          <SnCheckboxGroup
            :model-value="['email']"
            :options="[
              { label: t('邮件', 'Email'), value: 'email' },
              { label: t('短信', 'SMS'), value: 'sms' },
              { label: t('推送', 'Push'), value: 'push' },
            ]"
          />
        </div>
        <div class="sn-preview__row">
          <SnDynamicTags v-model:model-value="tags" :placeholder="t('添加标签', 'Add a tag')" />
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{
            t(
              '焦点环 · 禁用态（按 Tab 走一遍焦点）',
              'Focus ring · disabled — press Tab to walk the ring',
            )
          }}
        </div>
        <div class="sn-preview__row">
          <SnInput
            v-model:model-value="focusInput"
            :placeholder="t('聚焦我', 'Focus me')"
            class="sn-preview__input"
          />
          <SnButton type="primary">{{ t('聚焦我', 'Focus me') }}</SnButton>
          <SnButton type="primary" disabled>{{ t('禁用', 'Disabled') }}</SnButton>
          <SnButton disabled>{{ t('禁用', 'Disabled') }}</SnButton>
        </div>
      </div>
    </section>

    <!-- ══ 数据展示 ══ -->
    <section v-if="shows('color', 'shape')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('数据展示', 'Data display') }}</h3>
          <p class="sn-preview__desc">
            {{ t('表面、弱化填充与表格描边', 'surfaces, muted fills and table borders') }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code
            v-for="c in ['card', 'popover', 'muted', 'accent', 'border', 'muted-foreground']"
            :key="c"
            >{{ c }}</code
          >
        </div>
      </header>

      <div class="sn-preview__data">
        <SnCard :title="t('卡片标题', 'Card title')">
          <p class="sn-preview__card-note">
            {{ t('表面、描边、圆角与阴影 token', 'Surface, border, radius and shadow tokens') }}
          </p>
          <p class="sn-preview__card-note">
            {{
              t(
                '卡片内容坐在 --card 上，共享全局圆角种子。',
                'Card content sits on --card with the global radius seed.',
              )
            }}
          </p>
          <div class="sn-preview__row">
            <SnButton type="primary" size="small">{{ t('保存', 'Save') }}</SnButton>
            <SnButton size="small">{{ t('取消', 'Cancel') }}</SnButton>
          </div>
        </SnCard>

        <div class="sn-preview__table-wrap">
          <table class="sn-preview__table">
            <thead>
              <tr>
                <th>{{ t('发票', 'Invoice') }}</th>
                <th>{{ t('状态', 'Status') }}</th>
                <th class="is-right">{{ t('金额', 'Amount') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in invoices" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.status }}</td>
                <td class="is-right">{{ row.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="sn-preview__row">
        <SnTag v-for="tab in ['Overview', 'Activity', 'Settings']" :key="tab" round>{{
          tab
        }}</SnTag>
      </div>
    </section>

    <!-- ══ 表面与阴影 ══ -->
    <section v-if="shows('shape', 'color')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('表面与阴影', 'Surface & shadow') }}</h3>
          <p class="sn-preview__desc">
            {{
              t(
                '层次阶梯、嵌套的 card / popover 表面与 surfaceStyle',
                'elevation ladder, nested card / popover surfaces and surfaceStyle',
              )
            }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code
            v-for="c in ['background', 'card', 'popover', 'carbon', 'shadow-md', 'surfaceStyle']"
            :key="c"
            >{{ c }}</code
          >
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{
            t(
              '高度阶梯 — background → card → popover → carbon',
              'Elevation ladder — background → card → popover → carbon',
            )
          }}
        </div>
        <div class="sn-preview__ladder-4">
          <div class="sn-preview__ladder-item sn-preview__ladder-item--background">
            <strong>Aa</strong><span>--background</span>
          </div>
          <div class="sn-preview__ladder-item sn-preview__ladder-item--card">
            <strong>Aa</strong><span>--card</span>
          </div>
          <div class="sn-preview__ladder-item sn-preview__ladder-item--popover">
            <strong>Aa</strong><span>--popover</span>
          </div>
          <div class="sn-preview__ladder-item sn-preview__ladder-item--carbon">
            <strong>Aa</strong><span>--carbon</span>
          </div>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{ t('嵌套 — 表面里的表面', 'Nesting — a surface inside a surface') }}
        </div>
        <div class="sn-preview__nest">
          <div class="sn-preview__nest-label">{{ t('表面面板', 'Surface panel') }}</div>
          <div class="sn-preview__nest-inner">
            <strong>{{ t('浮起弹层', 'Elevated popup') }}</strong>
            <SnTag size="small">{{ t('弱化块', 'muted chip') }}</SnTag>
            <SnTag size="small" type="primary">{{ t('强调块', 'accent chip') }}</SnTag>
          </div>
        </div>
      </div>

      <div class="sn-preview__grid-2">
        <div class="sn-preview__block">
          <div class="sn-preview__family">{{ t('阴影阶梯', 'Shadow ladder') }}</div>
          <div class="sn-preview__shadow-row">
            <div
              v-for="s in shadowLadder"
              :key="s"
              class="sn-preview__shadow-item"
              :style="{ boxShadow: `var(--sn-web-shadow-${s})` }"
            >
              <span>{{ s === 'none' ? 'shadow' : `shadow-${s}` }}</span>
            </div>
          </div>
        </div>
        <div class="sn-preview__block">
          <div class="sn-preview__family">
            {{ t('页面表面上的文字角色', 'Text roles on the page surface') }}
          </div>
          <div class="sn-preview__text-roles">
            <div class="sn-preview__text-role sn-preview__text-role--fg">
              --foreground — {{ t('敏捷的棕色狐狸', 'the quick brown fox') }}
            </div>
            <div class="sn-preview__text-role sn-preview__text-role--muted">
              --muted-foreground — {{ t('敏捷的棕色狐狸', 'the quick brown fox') }}
            </div>
            <div class="sn-preview__text-role sn-preview__text-role--tertiary">
              {{
                t(
                  '次级文字再压一层不透明度就掉到 3.55:1，低于 AA 的 4.5:1 —— 这一档已经是下限。',
                  'One more opacity step on secondary text drops to 3.55:1, below AA 4.5:1 — this tier is the floor.',
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 描边与焦点 ══ -->
    <section v-if="shows('shape', 'color')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('描边与焦点', 'Border & focus') }}</h3>
          <p class="sn-preview__desc">
            {{ t('细线 token、焦点环与模态遮罩', 'hairline tokens, focus rings and modal masks') }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code
            v-for="c in ['border', 'input', 'ring', 'border-alpha', 'borderOpacity']"
            :key="c"
            >{{ c }}</code
          >
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">{{ t('细线 token', 'Hairline tokens') }}</div>
        <div class="sn-preview__hairlines">
          <div class="sn-preview__hairline sn-preview__hairline--border">--border</div>
          <div class="sn-preview__hairline sn-preview__hairline--input">--input</div>
          <div class="sn-preview__hairline sn-preview__hairline--primary">--primary</div>
          <div class="sn-preview__hairline sn-preview__hairline--alpha">border-border/40</div>
          <div class="sn-preview__hairline sn-preview__hairline--dashed">dashed</div>
        </div>
      </div>

      <div class="sn-preview__grid-2">
        <div class="sn-preview__block">
          <div class="sn-preview__family">
            {{
              t(
                '控件描边 — SnInput · SnSelect · Textarea',
                'Control outlines — SnInput · SnSelect · Textarea',
              )
            }}
          </div>
          <div class="sn-preview__stack">
            <SnInput v-model:model-value="inputValue" :placeholder="t('名称', 'Name')" />
            <SnSelect
              v-model:model-value="selectValue"
              :options="selectOptions"
              :placeholder="t('选项一', 'Option one')"
            />
            <SnInput
              v-model:model-value="inputValue"
              type="textarea"
              :placeholder="t('备注', 'Notes')"
              :rows="2"
            />
          </div>
        </div>
        <div class="sn-preview__block">
          <div class="sn-preview__family">SnCheckbox · SnRadioGroup · SnSwitch · SnTag</div>
          <div class="sn-preview__stack">
            <SnCheckbox
              :model-value="'indeterminate'"
              indeterminate
              :label="t('半选', 'Indeterminate')"
            />
            <SnRadioGroup
              :model-value="'one'"
              :options="[
                { label: 'One', value: 'one' },
                { label: 'Two', value: 'two' },
              ]"
              name="sn-preview-border-radio"
            />
            <SnSwitch v-model:model-value="switchOn" />
            <div class="sn-preview__row">
              <SnTag>{{ t('描边', 'outline') }}</SnTag>
              <SnTag type="primary">{{ t('主要', 'primary') }}</SnTag>
              <SnTag type="error">{{ t('危险', 'destructive') }}</SnTag>
            </div>
          </div>
        </div>
      </div>

      <div class="sn-preview__grid-2">
        <div class="sn-preview__block">
          <div class="sn-preview__family">SnDivider</div>
          <div class="sn-preview__divider-box">
            <strong>{{ t('卡片描边', 'Card border') }}</strong>
            <p class="sn-preview__card-note">
              {{ t('卡片轮廓读取同一组细线 token', 'Card outlines read the same hairline tokens') }}
            </p>
            <SnDivider />
            <div class="sn-preview__row">
              <span class="sn-preview__meta">Blog</span>
              <SnDivider direction="vertical" />
              <span class="sn-preview__meta">Docs</span>
              <SnDivider direction="vertical" />
              <span class="sn-preview__meta">Source</span>
            </div>
            <SnDivider dashed />
          </div>
        </div>
        <div class="sn-preview__block">
          <div class="sn-preview__family">{{ t('焦点环', 'Focus rings') }}</div>
          <div class="sn-preview__rings">
            <div class="sn-preview__ring sn-preview__ring--ring">--ring</div>
            <div class="sn-preview__ring sn-preview__ring--soft">ring-ring/50</div>
            <div class="sn-preview__ring sn-preview__ring--width">--ring-width</div>
          </div>
          <p class="sn-preview__hint">
            {{
              t(
                '描边透明度与焦点环宽度是全局量：上面那排细线就是同一个 token 的不同 alpha。',
                'Border opacity and ring width are global: the hairline row above is the same token at different alpha.',
              )
            }}
          </p>
        </div>
      </div>
    </section>

    <!-- ══ 浮层 ══ -->
    <section v-if="shows('shape')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('浮层', 'Overlays') }}</h3>
          <p class="sn-preview__desc">
            {{
              t(
                '对话框与弹层所在的 popover 表面，以及遮罩',
                'the popover surface dialogs and popovers sit on, plus masks',
              )
            }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code v-for="c in ['popover', 'mask', 'border', 'shadow-md', 'z-base']" :key="c">{{
            c
          }}</code>
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          SnDialog · SnDrawer · Sheet · Dropdown · Popover · Tooltip · Popconfirm
        </div>
        <div class="sn-preview__row">
          <SnButton size="small">{{ t('对话框', 'Dialog') }}</SnButton>
          <SnButton size="small">{{ t('抽屉', 'Drawer') }}</SnButton>
          <SnButton size="small">{{ t('工作表', 'Sheet') }}</SnButton>
          <SnButton size="small">{{ t('下拉', 'Dropdown') }}</SnButton>
          <SnButton size="small">{{ t('气泡', 'Popover') }}</SnButton>
          <SnButton size="small">{{ t('提示', 'Tooltip') }}</SnButton>
          <SnButton size="small">{{ t('确认', 'Popconfirm') }}</SnButton>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">{{ t('弹层表面 token', 'Popup surface tokens') }}</div>
        <div class="sn-preview__popups">
          <div class="sn-preview__popup sn-preview__popup--plain">
            <span>--popover</span>{{ t('弹层', 'Popup') }}
          </div>
          <div class="sn-preview__popup sn-preview__popup--border">
            <span>--border</span>{{ t('弹层', 'Popup') }}
          </div>
          <div class="sn-preview__popup sn-preview__popup--mask">
            <span>--mask</span>{{ t('弹层', 'Popup') }}
          </div>
          <div class="sn-preview__popup sn-preview__popup--shadow">
            <span>shadow-md</span>{{ t('弹层', 'Popup') }}
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 尺寸 ══ -->
    <section v-if="shows('size')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('尺寸', 'Size') }}</h3>
          <p class="sn-preview__desc">
            {{
              t(
                '控件与文字档位共用的 size 刻度',
                'the size scale shared by controls and type tiers',
              )
            }}
          </p>
        </div>
        <div class="sn-preview__chips"><code>size</code><code>text-4xs…9xl</code></div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnButton · SnTag</div>
        <div class="sn-preview__row sn-preview__row--tight">
          <span
            v-for="s in sizeLadder"
            :key="s.name"
            :style="{ fontSize: `calc(1rem * ${s.scale})` }"
          >
            <SnButton size="small">{{ s.name }}</SnButton>
          </span>
        </div>
        <div class="sn-preview__row sn-preview__row--tight">
          <span v-for="s in sizeLadder" :key="s.name">
            <SnTag :style="{ transform: `scale(${s.scale})`, transformOrigin: 'left center' }">{{
              s.name
            }}</SnTag>
          </span>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnInput · SnSelect · Textarea · SnInputNumber</div>
        <div class="sn-preview__size-grid">
          <SnInput
            v-for="s in sizeLadder"
            :key="s.name"
            :model-value="s.name"
            :size="s.name === 'xs' || s.name === '2xl' ? 'medium' : 'small'"
            :style="{
              height: `calc(var(--sn-web-input-height-medium) * ${s.scale})`,
              fontSize: `calc(1rem * ${s.scale})`,
            }"
          />
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          SnCheckbox · SnSwitch · SnSlider · SnRadioGroup · SnRadioGroup(button)
        </div>
        <div class="sn-preview__row sn-preview__row--tight">
          <span
            v-for="s in sizeLadder"
            :key="s.name"
            :style="{ transform: `scale(${s.scale})`, transformOrigin: 'left center' }"
          >
            <SnSwitch v-model:model-value="switchOn" size="small" />
          </span>
        </div>
        <div class="sn-preview__slider-stack">
          <div v-for="s in sizeLadder" :key="s.name" class="sn-preview__slider-line">
            <span class="sn-preview__slider-tag">{{ s.name }}</span>
            <SnSlider v-model:model-value="sliderValue" />
          </div>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">SnProgress · SnAvatar</div>
        <div class="sn-preview__progress-stack">
          <SnProgress :percentage="progressValue" />
          <SnProgress :percentage="progressValue" :height="6" />
          <SnProgress :percentage="progressValue" :height="10" />
        </div>
      </div>
    </section>

    <!-- ══ 圆角 ══ -->
    <section v-if="shows('shape')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('圆角', 'Radius') }}</h3>
          <p class="sn-preview__desc">
            {{ t('一个种子驱动整条圆角刻度', 'one seed drives the whole radius scale') }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code>radius</code><code>radius-2xs…2xl</code><code>radius-none</code
          ><code>radius-full</code>
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{
            t(
              '圆角阶梯 — 每一档都是 --radius 的倍数',
              'Rung ladder — every rung is a multiple of --radius',
            )
          }}
        </div>
        <div class="sn-preview__radius-ladder">
          <div
            v-for="r in radiusLadder"
            :key="r.name"
            class="sn-preview__radius-rung"
            :style="{ borderRadius: r.value }"
          >
            {{ r.name }}
          </div>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{ t('同一组组件在五档圆角下', 'SnButton · SnInput · SnTag · Textarea at five rungs') }}
        </div>
        <div class="sn-preview__radius-rows">
          <div
            v-for="r in radiusLadder.filter((x) =>
              ['xs', 'sm', 'md', 'lg', 'full'].includes(x.name),
            )"
            :key="r.name"
            class="sn-preview__radius-row"
          >
            <span class="sn-preview__radius-label">{{ r.name }}</span>
            <SnButton type="primary" size="small" :style="{ borderRadius: r.value }">{{
              t('按钮', 'Button')
            }}</SnButton>
            <SnInput
              :model-value="t('输入', 'Input')"
              :style="{ borderRadius: r.value }"
              class="sn-preview__radius-input"
            />
            <SnTag :style="{ borderRadius: r.value }">{{ t('标签', 'Tag') }}</SnTag>
            <SnInput
              :model-value="t('文本域', 'Textarea')"
              type="textarea"
              :rows="1"
              :style="{ borderRadius: r.value }"
              class="sn-preview__radius-textarea"
            />
          </div>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{
            t('嵌套 — 内层圆角由外层推导', 'Nesting — inner radius derived from the outer panel')
          }}
        </div>
        <div class="sn-preview__grid-2">
          <div class="sn-preview__nest">
            <div class="sn-preview__row">
              <SnButton type="primary" size="small">{{ t('按钮', 'Button') }}</SnButton>
              <SnInput :model-value="t('输入', 'Input')" class="sn-preview__radius-input" />
            </div>
          </div>
          <SnCard :title="t('卡片', 'Card')">
            <p class="sn-preview__card-note">
              {{
                t('卡片与其中的控件共享同一颗种子', 'Card and controls inside it share the seed')
              }}
            </p>
            <div class="sn-preview__row">
              <SnButton type="primary" size="small">{{ t('按钮', 'Button') }}</SnButton>
              <SnInput :model-value="t('输入', 'Input')" class="sn-preview__radius-input" />
            </div>
          </SnCard>
        </div>
      </div>
    </section>

    <!-- ══ 间距 ══ -->
    <section v-if="shows('size', 'shape')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('间距', 'Spacing') }}</h3>
          <p class="sn-preview__desc">
            {{ t('一个变量驱动内外边距与 gap', 'one variable drives padding and gap') }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code>spacing-unit</code><code>spacing-3xs…9xl</code><code>p-4</code><code>gap-md</code>
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{
            t(
              '内边距阶梯 — 内块固定，外框随之移动',
              'Padding ladder — the inner block is fixed, the frame moves',
            )
          }}
        </div>
        <div class="sn-preview__padding-ladder">
          <div
            v-for="s in spacingLadder"
            :key="s.name"
            class="sn-preview__padding-frame"
            :style="{ padding: s.value }"
          >
            <div class="sn-preview__padding-inner">{{ s.name }}</div>
          </div>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{ t('间距阶梯 — 按钮组 · 工具条', 'Gap ladder — SnButtonGroup · SToolbar') }}
        </div>
        <div class="sn-preview__gap-ladder">
          <div v-for="s in spacingLadder" :key="s.name" class="sn-preview__gap-row">
            <span class="sn-preview__gap-label">{{ s.name }}</span>
            <div class="sn-preview__gap-set" :style="{ gap: s.value }">
              <SnButton size="tiny">Button 1</SnButton>
              <SnButton size="tiny">Button 2</SnButton>
              <SnButton size="tiny">Button 3</SnButton>
            </div>
          </div>
        </div>
      </div>

      <div class="sn-preview__grid-2">
        <div class="sn-preview__block">
          <div class="sn-preview__family">SnButtonGroup · SnDivider</div>
          <div class="sn-preview__row sn-preview__row--tight">
            <SnButton size="small">{{ t('左', 'Left') }}</SnButton>
            <SnButton size="small">{{ t('中', 'Center') }}</SnButton>
            <SnButton size="small">{{ t('右', 'Right') }}</SnButton>
          </div>
          <SnDivider />
        </div>
        <div class="sn-preview__block">
          <div class="sn-preview__family">SnAlert 栈 · SnCard 内边距</div>
          <div class="sn-preview__alert-stack">
            <SnAlert type="info" :title="t('堆叠提示', 'Stacked alert')">{{
              t('行间 gap 由同一颗种子派生', 'space-y between rows')
            }}</SnAlert>
            <SnAlert type="success" :title="t('堆叠提示', 'Stacked alert')">{{
              t('行间 gap 由同一颗种子派生', 'space-y between rows')
            }}</SnAlert>
          </div>
          <SnCard :title="t('卡片', 'Card')">
            <p class="sn-preview__card-note">
              {{ t('卡片用同一套网格留白', 'Cards pad their body with the same grid') }}
            </p>
          </SnCard>
        </div>
      </div>
    </section>

    <!-- ══ 字体 ══ -->
    <section v-if="shows('font')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('字体', 'Typography') }}</h3>
          <p class="sn-preview__desc">
            {{
              t(
                '三套字族角色：无衬线、标题与等宽 stack',
                'three family roles: sans, heading and mono stack',
              )
            }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code>font-sans</code><code>font-heading</code><code>font-mono</code>
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{
            t('实际字体栈 — 从 :root 的 --font-* 读取', 'Live stacks — read from --font-* on :root')
          }}
        </div>
        <div class="sn-preview__stacks">
          <div v-for="role in fontRoles" :key="role.token" class="sn-preview__stack-row">
            <span class="sn-preview__stack-token">{{ role.token }}</span>
            <span class="sn-preview__stack-value" :style="{ fontFamily: role.stack }">
              {{ role.stack }}
            </span>
          </div>
        </div>
      </div>

      <div class="sn-preview__grid-2">
        <div class="sn-preview__block">
          <div class="sn-preview__family">font-sans — {{ t('正文与控件', 'body & controls') }}</div>
          <div class="sn-preview__type-box">
            <h4 class="sn-preview__type-h">{{ t('正文', 'Body copy') }}</h4>
            <p class="sn-preview__type-p">
              {{
                t(
                  '无衬线栈驱动段落、标签与表单外观',
                  'The sans stack drives paragraphs, labels and form chrome',
                )
              }}
            </p>
            <p class="sn-preview__type-p">
              {{
                t(
                  '把方盒装进五个十二升酒壶 —— 这是 UI 文案、表格与长篇文档的默认阅读字体。',
                  'Pack my box with five dozen liquor jugs — the default reading face for UI copy, tables and long-form documentation.',
                )
              }}
            </p>
            <SnButton size="tiny">{{
              t('快捷键与提示继承无衬线栈', 'Shortcuts and hints inherit the sans stack')
            }}</SnButton>
          </div>
        </div>
        <div class="sn-preview__block">
          <div class="sn-preview__family">font-heading — {{ t('标题', 'titles') }}</div>
          <div class="sn-preview__type-box">
            <h4 class="sn-preview__type-h sn-preview__type-h--heading">
              {{ t('章节标题', 'Section heading') }}
            </h4>
            <p class="sn-preview__type-p">
              {{
                t(
                  '标题与展示文字使用 --font-heading',
                  'Headings and display text use --font-heading',
                )
              }}
            </p>
            <h3
              class="sn-preview__type-display"
              :style="{ fontFamily: 'var(--sn-web-font-family-heading)' }"
            >
              SoybeanUI Theme Engine
            </h3>
            <p class="sn-preview__type-p">
              {{
                t(
                  '一个 stack 管所有标题 —— 在定制器里换掉它，每个标题都跟着换。',
                  'One stack for titles — swap it from the customizer and every heading follows.',
                )
              }}
            </p>
          </div>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">font-mono — {{ t('代码与 token', 'code & tokens') }}</div>
        <div class="sn-preview__type-box">
          <h4 class="sn-preview__type-h">{{ t('行内代码', 'Inline code') }}</h4>
          <p class="sn-preview__type-p">
            {{
              t(
                '代码、kbd 与 token 片段读取 --font-mono',
                'Code, kbd and token chips read --font-mono',
              )
            }}
          </p>
          <pre class="sn-preview__code" :style="{ fontFamily: 'var(--sn-web-font-family-code)' }">
:root {
  --font-sans: …;
  --font-heading: …;
}</pre>
        </div>
      </div>
    </section>

    <!-- ══ 对比度 ══ -->
    <section v-if="shows('color')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('对比度', 'Contrast') }}</h3>
          <p class="sn-preview__desc">
            {{ t('填充与其前景的配对一览', 'fill ↔ foreground pairs at a glance') }}
          </p>
        </div>
        <div class="sn-preview__chips"><code>--foreground</code><code>--hairline</code></div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{ t('实心填充 — 按钮在每个语义角色上', 'Solid fills — SnButton on every role') }}
        </div>
        <div class="sn-preview__row">
          <SnButton type="primary">{{ t('主要', 'primary') }}</SnButton>
          <SnButton>{{ t('次要', 'secondary') }}</SnButton>
          <SnButton type="tertiary">{{ t('强调', 'accent') }}</SnButton>
          <SnButton type="info">{{ t('信息', 'info') }}</SnButton>
          <SnButton type="success">{{ t('成功', 'success') }}</SnButton>
          <SnButton type="warning">{{ t('警告', 'warning') }}</SnButton>
          <SnButton type="error">{{ t('危险', 'destructive') }}</SnButton>
        </div>
        <div class="sn-preview__row">
          <SnTag
            v-for="p in fillPairs"
            :key="p.token"
            :style="{ background: p.soft, color: p.fill, borderColor: p.fill }"
            :bordered="true"
          >
            {{ p.token.replace('--', '') }}
          </SnTag>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">
          {{
            t(
              '填充 ↔ 前景配对 — 每个填充都带上它声明的前景色',
              'Fill ↔ foreground pairs — every fill with its declared text',
            )
          }}
        </div>
        <div class="sn-preview__pairs">
          <div
            v-for="p in fillPairs"
            :key="p.token"
            class="sn-preview__pair"
            :style="{ background: p.fill, color: p.foreground }"
          >
            <span class="sn-preview__pair-token">{{ p.token }}</span>
            <strong>{{ t('可读文字', 'Readable text') }}</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 图表色 ══ -->
    <section v-if="shows('color')" class="sn-preview__card">
      <header class="sn-preview__head">
        <div>
          <h3 class="sn-preview__title">{{ t('图表色', 'Chart palette') }}</h3>
          <p class="sn-preview__desc">
            {{
              t('由 primary 派生的 chart-1 至 chart-5', 'chart-1 … chart-5 derived from primary')
            }}
          </p>
        </div>
        <div class="sn-preview__chips">
          <code v-for="c in chartColors" :key="c.name">{{ c.name }}</code>
        </div>
      </header>

      <div class="sn-preview__block">
        <div class="sn-preview__family">{{ t('分组柱状', 'Grouped bars') }}</div>
        <div class="sn-preview__chart">
          <div v-for="q in ['Q1', 'Q2', 'Q3', 'Q4']" :key="q" class="sn-preview__chart-group">
            <div class="sn-preview__chart-bars">
              <span
                v-for="(c, i) in chartColors"
                :key="c.name"
                class="sn-preview__chart-bar"
                :style="{ background: c.color, height: `${[78, 56, 40, 26, 16][i]}%` }"
              />
            </div>
            <span class="sn-preview__chart-label">{{ q }}</span>
          </div>
        </div>
      </div>

      <div class="sn-preview__block">
        <div class="sn-preview__family">{{ t('堆叠条 · 图例', 'Stacked bar · legend') }}</div>
        <div class="sn-preview__stacked">
          <span v-for="c in chartColors" :key="c.name" :style="{ background: c.color }" />
        </div>
        <div class="sn-preview__row sn-preview__row--legend">
          <span v-for="c in chartColors" :key="c.name" class="sn-preview__legend">
            <i :style="{ background: c.color }" />{{ c.name }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/*
 * 预览画布。变量通过 `:style` 的内联 custom properties 落到这一层，因此
 * 下面所有 --sn-web-* 读取都命中当前主题；背景/文字色也显式读它们，
 * 保证深色模式下整块画布跟着翻而不是白底黑字。
 */
.sn-theme-preview-web {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: var(--sn-web-font-family-body, inherit);
  font-size: var(--sn-web-font-size-md, 14px);
  color: var(--sn-web-color-text-primary);
  /* 预览专用局部变量：把语义色再包一层，便于下面直接写 --sn-preview-* */
  --sn-preview-surface: var(--sn-web-color-background-surface);
  --sn-preview-muted: var(--sn-web-color-background-subtle);
  --sn-preview-border: var(--sn-web-color-border-default);
  --sn-preview-hairline: var(--sn-web-color-border-subtle);
  --sn-preview-fg: var(--sn-web-color-text-primary);
  --sn-preview-muted-fg: var(--sn-web-color-text-secondary);
  --sn-preview-primary: var(--sn-web-color-action-primary);
  --sn-preview-ring: var(--sn-web-focus-ring);
}

/* ── 筛选 ── */
.sn-preview__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.sn-preview__filter {
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--sn-preview-border);
  border-radius: 999px;
  background: var(--sn-preview-surface);
  color: var(--sn-preview-muted-fg);
  font-size: 12.5px;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}
.sn-preview__filter:hover {
  color: var(--sn-preview-fg);
}
.sn-preview__filter.is-active {
  background: var(--sn-preview-fg);
  border-color: var(--sn-preview-fg);
  color: var(--sn-preview-surface);
}

/* ── 卡片 ── */
.sn-preview__card {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-card-radius, 10px);
  background: var(--sn-preview-surface);
  box-shadow: var(--sn-web-card-shadow, none);
}
.sn-preview__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.sn-preview__title {
  margin: 0;
  font-family: var(--sn-web-font-family-heading, inherit);
  font-size: 14px;
  font-weight: 600;
  color: var(--sn-preview-fg);
}
.sn-preview__desc {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-preview__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.sn-preview__chips code {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--sn-preview-muted);
  color: var(--sn-preview-muted-fg);
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11px;
}

/* ── 区块 ── */
.sn-preview__block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-preview__family {
  font-size: 11.5px;
  color: var(--sn-preview-muted-fg);
  font-family: var(--sn-web-font-family-code, monospace);
}
.sn-preview__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.sn-preview__row--tight {
  gap: 4px;
}
.sn-preview__row--controls {
  gap: 12px;
}
.sn-preview__row--legend {
  gap: 14px;
}
.sn-preview__stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-preview__grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.sn-preview__grid-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
@media (max-width: 900px) {
  .sn-preview__grid-2,
  .sn-preview__grid-4 {
    grid-template-columns: minmax(0, 1fr);
  }
}

.sn-preview__slider {
  width: 180px;
}
.sn-preview__progress {
  width: 160px;
}
.sn-preview__input {
  width: 180px;
}

/* ── 色阶 ── */
.sn-preview__scale {
  display: flex;
  height: 26px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--sn-preview-hairline);
}
.sn-preview__scale-chip {
  flex: 1 1 0;
}
.sn-preview__scale-labels {
  display: flex;
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 10.5px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-preview__scale-labels span {
  flex: 1 1 0;
  text-align: center;
}

/* ── 状态色 ── */
.sn-preview__alerts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.sn-preview__progress-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
@media (max-width: 900px) {
  .sn-preview__alerts {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ── 数据展示 ── */
.sn-preview__data {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  align-items: start;
}
@media (max-width: 900px) {
  .sn-preview__data {
    grid-template-columns: minmax(0, 1fr);
  }
}
.sn-preview__card-note {
  margin: 0 0 6px;
  font-size: 12.5px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__table-wrap {
  overflow: hidden;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-card-radius, 8px);
}
.sn-preview__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
.sn-preview__table th,
.sn-preview__table td {
  padding: 9px 12px;
  text-align: left;
  border-bottom: 1px solid var(--sn-preview-hairline);
}
.sn-preview__table th {
  background: var(--sn-preview-muted);
  color: var(--sn-preview-fg);
  font-weight: 600;
}
.sn-preview__table tbody tr:last-child td {
  border-bottom: 0;
}
.sn-preview__table td {
  color: var(--sn-preview-muted-fg);
}
.sn-preview__table .is-right {
  text-align: right;
}

/* ── 表面与阴影 ── */
.sn-preview__ladder-4 {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
@media (max-width: 900px) {
  .sn-preview__ladder-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.sn-preview__ladder-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  min-height: 96px;
  padding: 12px;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-card-radius, 8px);
}
.sn-preview__ladder-item strong {
  font-size: 16px;
}
.sn-preview__ladder-item span {
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11px;
  opacity: 0.75;
}
.sn-preview__ladder-item--background {
  background: var(--sn-preview-muted);
  color: var(--sn-preview-fg);
}
.sn-preview__ladder-item--card {
  background: var(--sn-preview-surface);
  color: var(--sn-preview-fg);
}
.sn-preview__ladder-item--popover {
  background: var(--sn-web-color-background-elevated);
  color: var(--sn-preview-fg);
  box-shadow: var(--sn-web-shadow-sm, none);
}
.sn-preview__ladder-item--carbon {
  background: var(--sn-preview-fg);
  color: var(--sn-preview-surface);
  border-color: transparent;
}

.sn-preview__nest {
  padding: 14px;
  border: 1px solid var(--sn-preview-border);
  border-radius: calc(var(--sn-web-radius-lg, 8px) * 1.4);
  background: var(--sn-preview-surface);
}
.sn-preview__nest-label {
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--sn-preview-fg);
}
.sn-preview__nest-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-radius-lg, 8px);
  background: var(--sn-web-color-background-elevated);
  box-shadow: var(--sn-web-shadow-sm, none);
  font-size: 12.5px;
}

.sn-preview__shadow-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.sn-preview__shadow-item {
  display: flex;
  align-items: flex-end;
  width: 84px;
  height: 72px;
  padding: 8px;
  border-radius: var(--sn-web-radius-md, 6px);
  background: var(--sn-preview-surface);
  border: 1px solid var(--sn-preview-hairline);
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 10.5px;
  color: var(--sn-preview-muted-fg);
}

.sn-preview__text-roles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-radius-md, 8px);
  background: var(--sn-preview-surface);
  font-size: 12.5px;
}
.sn-preview__text-role--fg {
  color: var(--sn-preview-fg);
}
.sn-preview__text-role--muted {
  color: var(--sn-preview-muted-fg);
}
.sn-preview__text-role--tertiary {
  color: var(--sn-web-color-text-tertiary);
  font-size: 11.5px;
}

/* ── 描边 ── */
.sn-preview__hairlines {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.sn-preview__hairline {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 108px;
  height: 48px;
  padding: 0 12px;
  border-radius: var(--sn-web-radius-sm, 4px);
  background: var(--sn-preview-surface);
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__hairline--border {
  border: 1px solid var(--sn-preview-border);
}
.sn-preview__hairline--input {
  border: 1px solid var(--sn-preview-border);
  background: var(--sn-preview-muted);
}
.sn-preview__hairline--primary {
  border: 1px solid var(--sn-preview-primary);
  color: var(--sn-preview-primary);
}
.sn-preview__hairline--alpha {
  border: 1px solid color-mix(in srgb, var(--sn-preview-border) 40%, transparent);
}
.sn-preview__hairline--dashed {
  border: 1px dashed var(--sn-preview-border);
}

.sn-preview__divider-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-card-radius, 8px);
  background: var(--sn-preview-surface);
  font-size: 12.5px;
}
.sn-preview__meta {
  font-size: 12px;
  color: var(--sn-preview-muted-fg);
}

.sn-preview__rings {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.sn-preview__ring {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  height: 56px;
  border-radius: var(--sn-web-radius-md, 6px);
  background: var(--sn-preview-surface);
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__ring--ring {
  border: 2px solid var(--sn-preview-ring);
}
.sn-preview__ring--soft {
  border: 2px solid color-mix(in srgb, var(--sn-preview-ring) 50%, transparent);
}
.sn-preview__ring--width {
  border: 3px solid color-mix(in srgb, var(--sn-preview-primary) 60%, transparent);
}
.sn-preview__hint {
  margin: 8px 0 0;
  font-size: 11.5px;
  color: var(--sn-web-color-text-tertiary);
}

/* ── 浮层 ── */
.sn-preview__popups {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
@media (max-width: 900px) {
  .sn-preview__popups {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.sn-preview__popup {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  min-height: 72px;
  padding: 12px;
  border-radius: var(--sn-web-radius-md, 8px);
  background: var(--sn-web-color-background-elevated);
  font-size: 12.5px;
  color: var(--sn-preview-fg);
}
.sn-preview__popup span {
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 10.5px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__popup--plain {
  border: 1px solid transparent;
}
.sn-preview__popup--border {
  border: 1px solid var(--sn-preview-border);
}
.sn-preview__popup--mask {
  background: color-mix(
    in srgb,
    var(--sn-web-color-background-overlay) 55%,
    var(--sn-preview-surface)
  );
}
.sn-preview__popup--shadow {
  box-shadow: var(--sn-web-shadow-md, none);
  border: 1px solid var(--sn-preview-hairline);
}

/* ── 尺寸 ── */
.sn-preview__size-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}
@media (max-width: 900px) {
  .sn-preview__size-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.sn-preview__slider-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sn-preview__slider-line {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.sn-preview__slider-tag {
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11px;
  color: var(--sn-preview-muted-fg);
}

/* ── 圆角 ── */
.sn-preview__radius-ladder {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 8px;
}
@media (max-width: 900px) {
  .sn-preview__radius-ladder {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
.sn-preview__radius-rung {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border: 1px solid var(--sn-preview-border);
  background: var(--sn-preview-muted);
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__radius-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sn-preview__radius-row {
  display: grid;
  grid-template-columns: 48px 90px 160px 72px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
@media (max-width: 900px) {
  .sn-preview__radius-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
.sn-preview__radius-label {
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__radius-input {
  width: 160px;
}
.sn-preview__radius-textarea {
  width: 100%;
}

/* ── 间距 ── */
.sn-preview__padding-ladder {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.sn-preview__padding-frame {
  border: 1px solid var(--sn-preview-hairline);
  border-radius: var(--sn-web-radius-sm, 4px);
  background: var(--sn-preview-surface);
}
.sn-preview__padding-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 24px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--sn-preview-primary) 16%, transparent);
  color: var(--sn-preview-primary);
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 10.5px;
}
.sn-preview__gap-ladder {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-preview__gap-row {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.sn-preview__gap-label {
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__gap-set {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.sn-preview__alert-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

/* ── 字体 ── */
.sn-preview__stacks {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sn-preview__stack-row {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-radius-sm, 4px);
  background: var(--sn-preview-surface);
}
.sn-preview__stack-token {
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 11.5px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__stack-value {
  font-size: 12px;
  color: var(--sn-preview-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sn-preview__type-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-card-radius, 8px);
  background: var(--sn-preview-surface);
}
.sn-preview__type-h {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--sn-preview-fg);
}
.sn-preview__type-h--heading {
  font-family: var(--sn-web-font-family-heading, inherit);
}
.sn-preview__type-p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__type-display {
  margin: 6px 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--sn-preview-fg);
}
.sn-preview__code {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--sn-web-radius-sm, 6px);
  background: var(--sn-preview-muted);
  color: var(--sn-preview-fg);
  font-size: 11.5px;
  line-height: 1.6;
  overflow-x: auto;
}

/* ── 对比度 ── */
.sn-preview__pairs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}
@media (max-width: 900px) {
  .sn-preview__pairs {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.sn-preview__pair {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  min-height: 76px;
  padding: 12px;
  border-radius: var(--sn-web-radius-md, 8px);
  font-size: 12.5px;
}
.sn-preview__pair-token {
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 10.5px;
  opacity: 0.85;
}
.sn-preview__pair strong {
  font-size: 13px;
}

/* ── 图表 ── */
.sn-preview__chart {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  padding: 14px;
  border: 1px solid var(--sn-preview-border);
  border-radius: var(--sn-web-radius-md, 8px);
  background: var(--sn-preview-surface);
}
.sn-preview__chart-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sn-preview__chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 96px;
}
.sn-preview__chart-bar {
  flex: 1 1 0;
  border-radius: 3px 3px 0 0;
}
.sn-preview__chart-label {
  text-align: center;
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 10.5px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__stacked {
  display: flex;
  height: 18px;
  border-radius: 999px;
  overflow: hidden;
}
.sn-preview__stacked span {
  flex: 1 1 0;
}
.sn-preview__legend {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--sn-web-font-family-code, monospace);
  font-size: 10.5px;
  color: var(--sn-preview-muted-fg);
}
.sn-preview__legend i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

/* ── 组件内部补齐 ── */
.sn-theme-preview-web :deep(.sn-alert) {
  margin: 0;
}
.sn-theme-preview-web :deep(.sn-tag) {
  margin: 0;
}
</style>
