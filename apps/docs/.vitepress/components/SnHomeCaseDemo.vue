<script setup lang="ts">
/**
 * SnHomeCaseDemo — 首页「场景案例」的内容渲染器。
 *
 * 按 `id`（home-cases.ts 注册表）渲染对应的迷你场景组合：所有内容都是
 * 真实 @snui/vue-web 组件（可交互），文案跟随站点语言。样式辅助类
 * `sn-case-demo__*` 使用 SnHomeCaseCard 提供的玻璃面板变量（--sn-case-*），
 * 深浅主题自动适配。
 *
 * 演示数据全部确定性（固定时间戳 / 固定数组），保证 SSR 与客户端水合
 * 一致 —— 不用 Math.random / Date.now() 直接参与渲染。
 */
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import {
  ArrowRight,
  ArrowUp,
  CalendarClock,
  ChevronRight,
  GripVertical,
  RefreshCcw,
  RefreshCw,
  Settings,
} from 'lucide-vue-next';
import {
  SnAvatar,
  SnButton,
  SnCalendar,
  SnCarousel,
  SnCarouselItem,
  SnCheckbox,
  SnColorPicker,
  SnDataTable,
  SnDatePicker,
  SnDialog,
  SnDragSort,
  SnHeatmap,
  SnIcon,
  SnImage,
  SnInput,
  SnInputNumber,
  SnQrCode,
  SnSelect,
  SnSkeleton,
  SnStatistic,
  SnSteps,
  SnStep,
  SnSwitch,
  SnTag,
  SnTime,
  SnTimeline,
  SnTimelineItem,
  SnUpload,
  SnVideoPlayer,
} from '@snui/vue-web';
import type { DataTableColumns } from '@snui/vue-web';
import { caseCopy, type HomeCaseId } from '../utils/home-cases';

const props = defineProps<{ id: HomeCaseId }>();

/** 案例内容文案 —— 字典单一来源在 home-cases.ts（caseCopy）。 */
const { lang } = useData();
const isEn = computed(() => lang.value === 'en-US');
const t = computed(() => caseCopy(isEn.value ? "en" : "zh"));


/* ── 演示数据（确定性，无随机 / 无 Date.now 参与渲染） ── */
const ANCHOR_TS = new Date('2025-06-15T08:00:00').getTime();

/** 热力图：锚点日往前推 56 天的固定数据。 */
const heatmapData = Array.from({ length: 56 }, (_, i) => ({
  timestamp: ANCHOR_TS - (55 - i) * 86400_000,
  value: [0, 1, 2, 5, 3, 4, 1, 0, 2, 3][i % 10],
}));

/** 数据表格：三列四行。 */
const tableColumns: DataTableColumns = [
  { title: '任务', key: 'task' },
  { title: '负责人', key: 'owner' },
  { title: '状态', key: 'status' },
];
const tableData = computed(() => [
  { task: isEn.value ? 'Style Pack CLI' : '风格包 CLI', owner: '蜗蜗', status: t.value.statusDone },
  { task: isEn.value ? 'MCP Server v0.4' : 'MCP Server v0.4', owner: 'Aria', status: t.value.statusDoing },
  { task: isEn.value ? 'uni-x vapor demo' : 'uni-x 蒸汽模式示例', owner: 'Mo', status: t.value.statusTodo },
  { task: isEn.value ? 'Token cascade docs' : 'Token 级联文档', owner: 'Aria', status: t.value.statusDone },
]);

/** 拖拽排序：4 条队列任务。 */
const dragItems = ref([
  { key: 'q1', title: isEn.value ? 'Write release notes' : '撰写发布说明' },
  { key: 'q2', title: isEn.value ? 'Review token diff' : '评审 Token 变更' },
  { key: 'q3', title: isEn.value ? 'Sync style packs' : '同步风格包' },
  { key: 'q4', title: isEn.value ? 'Cut v0.4 tag' : '打 v0.4 标签' },
]);

/* ── 可交互控件的本地状态 ── */
const switchOn = ref(true);
const remember = ref(true);
const payoutCurrency = ref('usd');
const payoutAmount = ref(2500);
const notifyTx = ref(true);
const notifySecurity = ref(true);
const notifyMilestones = ref(false);
const dialogVisible = ref(false);
const colorValue = ref('#4f6ef7');

/** 轮播渐变 slides（纯 CSS，无外部图片）。 */
const slides = [
  { key: 'a', label: 'slideA', from: '#6366f1', to: '#a855f7' },
  { key: 'b', label: 'slideB', from: '#0ea5e9', to: '#22d3ee' },
  { key: 'c', label: 'slideC', from: '#ec4899', to: '#f97316' },
] as const;
</script>

<template>
  <!-- 账号安全：双字段表单 + 主操作 -->
  <template v-if="props.id === 'account'">
    <span class="sn-case-demo__field">
      <span class="sn-case-demo__label">{{ t.email }}</span>
      <SnInput :placeholder="t.emailPlaceholder" size="small" />
    </span>
    <span class="sn-case-demo__field">
      <span class="sn-case-demo__label">{{ t.password }}</span>
      <SnInput type="password" :placeholder="t.passwordPlaceholder" size="small" />
    </span>
    <SnButton class="sn-case-block" variant="primary" size="small">{{ t.updateSecurity }}</SnButton>
  </template>

  <!-- 支付设置：图标列表（含弱化项） -->
  <template v-else-if="props.id === 'payments'">
    <span class="sn-case-demo__list-row">
      <span class="sn-case-demo__list-icon"><SnIcon :icon="Settings" /></span>
      <span class="sn-case-demo__list-text">
        <span class="sn-case-demo__list-title">{{ t.transferLimit }}</span>
        <span class="sn-case-demo__list-desc">{{ t.transferLimitDesc }}</span>
      </span>
      <SnIcon class="sn-case-demo__list-chevron" :icon="ChevronRight" />
    </span>
    <span class="sn-case-demo__list-row">
      <span class="sn-case-demo__list-icon"><SnIcon :icon="CalendarClock" /></span>
      <span class="sn-case-demo__list-text">
        <span class="sn-case-demo__list-title">{{ t.scheduled }}</span>
        <span class="sn-case-demo__list-desc">{{ t.scheduledDesc }}</span>
      </span>
      <SnIcon class="sn-case-demo__list-chevron" :icon="ChevronRight" />
    </span>
    <span class="sn-case-demo__list-row sn-case-demo__list-row--muted">
      <span class="sn-case-demo__list-icon"><SnIcon :icon="RefreshCcw" /></span>
      <span class="sn-case-demo__list-text">
        <span class="sn-case-demo__list-title">{{ t.recurring }}</span>
        <span class="sn-case-demo__list-desc">{{ t.recurringDesc }}</span>
      </span>
      <SnIcon class="sn-case-demo__list-chevron" :icon="ChevronRight" />
    </span>
  </template>

  <!-- 提现阈值：货币 + 金额 + 滑块 + 区间说明 -->
  <template v-else-if="props.id === 'payout'">
    <span class="sn-case-demo__field">
      <span class="sn-case-demo__label">{{ t.currency }}</span>
      <SnSelect
        v-model="payoutCurrency"
        size="small"
        :options="[
          { label: 'USD — United States Dollar', value: 'usd' },
          { label: 'EUR — Euro', value: 'eur' },
          { label: 'CNY — 人民币', value: 'cny' },
        ]"
      />
    </span>
    <span class="sn-case-demo__field">
      <span class="sn-case-demo__label">{{ t.minPayout }}</span>
      <SnInputNumber v-model="payoutAmount" :min="50" :max="10000" :step="50" size="small" />
    </span>
    <span class="sn-case-demo__row sn-case-demo__row--between sn-case-demo__caption">
      <span>$50 (MIN)</span>
      <span>$10,000 (MAX)</span>
    </span>
  </template>

  <!-- 快捷操作：按钮 + 徽标 + 迷你开关组 -->
  <template v-else-if="props.id === 'controls'">
    <span class="sn-case-demo__row">
      <SnButton variant="primary" size="small">
        {{ t.primaryAction }}
        <SnIcon :icon="ArrowRight" />
      </SnButton>
      <SnButton variant="default" size="small">{{ t.secondaryAction }}</SnButton>
      <SnButton variant="tertiary" size="small">{{ t.outlineAction }}</SnButton>
    </span>
    <span class="sn-case-demo__row">
      <SnTag type="primary" size="small">{{ t.badge }}</SnTag>
      <SnTag size="small">{{ t.secondaryAction }}</SnTag>
      <SnSwitch v-model="switchOn" size="small" />
      <SnCheckbox v-model="remember" size="small" />
    </span>
  </template>

  <!-- 储蓄目标：数值 + 进度 -->
  <template v-else-if="props.id === 'savings'">
    <span class="sn-case-demo__save">
      <span class="sn-case-demo__label">{{ t.retirement }}</span>
      <SnStatistic value="$420,000" tabular-nums />
      <SnProgress type="line" :percentage="65" indicator-placement="none" />
      <span class="sn-case-demo__caption">{{ t.achieved('65%', '$273,000') }}</span>
    </span>
    <span class="sn-case-demo__save">
      <span class="sn-case-demo__label">{{ t.realEstate }}</span>
      <SnStatistic value="$85,000" tabular-nums />
      <SnProgress type="line" :percentage="32" indicator-placement="none" color="#98a2b3" />
      <span class="sn-case-demo__caption">{{ t.achieved('32%', '$27,200') }}</span>
    </span>
  </template>

  <!-- 通知偏好：勾选组 + 保存 -->
  <template v-else-if="props.id === 'notify'">
    <span class="sn-case-demo__notify-row">
      <SnCheckbox v-model="notifyTx" :label="t.notifyTx" />
      <span class="sn-case-demo__list-desc">{{ t.notifyTxDesc }}</span>
    </span>
    <span class="sn-case-demo__notify-row">
      <SnCheckbox v-model="notifySecurity" :label="t.notifySecurity" />
      <span class="sn-case-demo__list-desc">{{ t.notifySecurityDesc }}</span>
    </span>
    <span class="sn-case-demo__notify-row">
      <SnCheckbox v-model="notifyMilestones" :label="t.notifyMilestones" />
      <span class="sn-case-demo__list-desc">{{ t.notifyMilestonesDesc }}</span>
    </span>
    <SnButton class="sn-case-block" variant="primary" size="small">{{ t.savePrefs }}</SnButton>
  </template>

  <!-- 新建目标：名称 + 金额/日期 + 主/次操作 -->
  <template v-else-if="props.id === 'milestone'">
    <span class="sn-case-demo__field">
      <span class="sn-case-demo__label">{{ t.goalName }}</span>
      <SnInput :placeholder="t.goalNamePlaceholder" size="small" />
    </span>
    <span class="sn-case-demo__grid2">
      <span class="sn-case-demo__field">
        <span class="sn-case-demo__label">{{ t.targetAmount }}</span>
        <SnInput placeholder="$15,000" size="small" />
      </span>
      <span class="sn-case-demo__field">
        <span class="sn-case-demo__label">{{ t.targetDate }}</span>
        <SnInput placeholder="2025 / 12" size="small" />
      </span>
    </span>
    <SnButton class="sn-case-block" variant="primary" size="small">{{ t.createGoal }}</SnButton>
    <SnButton class="sn-case-block" variant="default" size="small">{{ t.cancel }}</SnButton>
  </template>

  <!-- 发货进度：时间线 -->
  <template v-else-if="props.id === 'timeline'">
    <SnTimeline>
      <SnTimelineItem
        type="success"
        :title="t.orderPlaced"
        :time="t.orderPlacedTime"
        :content="t.orderPlacedDesc"
      />
      <SnTimelineItem type="info" :title="t.shipped" :time="t.shippedTime" :content="t.shippedDesc" />
      <SnTimelineItem :title="t.inTransit" :time="t.inTransitTime" :content="t.inTransitDesc" />
    </SnTimeline>
  </template>

  <!-- 新对话：问候 + 输入条 -->
  <template v-else-if="props.id === 'chat'">
    <span class="sn-case-demo__chat-head">
      <span class="sn-case-demo__chat-title">{{ t.chatTitle }}</span>
      <SnButton variant="ghost" size="tiny" aria-label="refresh">
        <SnIcon :icon="RefreshCw" />
      </SnButton>
    </span>
    <span class="sn-case-demo__chat-body">
      <span class="sn-case-demo__chat-greet">{{ t.chatGreeting }}</span>
      <span class="sn-case-demo__chat-hint">{{ t.chatHint }}</span>
    </span>
    <span class="sn-case-demo__composer">
      <SnInput :placeholder="t.chatPlaceholder" size="small" />
      <SnButton variant="primary" size="small" :aria-label="t.chatSend">
        <SnIcon :icon="ArrowUp" />
      </SnButton>
    </span>
  </template>

  <!-- 团队成员：头像 + 角色 -->
  <template v-else-if="props.id === 'members'">
    <span
      v-for="member in [
        { name: '蜗蜗', role: t.memberOwner, type: 'primary', tone: '#4f6ef7' },
        { name: 'Aria', role: t.memberAdmin, type: 'info', tone: '#7c5cf0' },
        { name: 'Mo', role: t.memberViewer, type: 'default', tone: '#f04f7b' },
      ]"
      :key="member.name"
      class="sn-case-demo__member"
    >
      <SnAvatar :size="34" round :color="member.tone">{{ member.name.slice(0, 1) }}</SnAvatar>
      <span class="sn-case-demo__member-name">{{ member.name }}</span>
      <SnTag :type="member.type as 'primary' | 'info' | 'default'" size="small">{{ member.role }}</SnTag>
    </span>
  </template>

  <!-- 可领余额：统计 + 明细行 -->
  <template v-else-if="props.id === 'balance'">
    <span class="sn-case-demo__stat-row">
      <SnStatistic :label="t.balanceTitle" value="$1,211.29" tabular-nums />
      <SnTag type="warning" size="small" round>{{ t.pendingSetup }}</SnTag>
    </span>
    <span class="sn-case-demo__kv">
      <span>{{ t.netRoyalties }}</span>
      <span>$1,248.75</span>
    </span>
    <span class="sn-case-demo__kv">
      <span>{{ t.processingFee }}</span>
      <span>-$37.46</span>
    </span>
    <span class="sn-case-demo__kv sn-case-demo__kv--strong">
      <span>{{ t.totalReady }}</span>
      <span>$1,211.29 USD</span>
    </span>
    <span class="sn-case-demo__caption">{{ t.balanceNote }}</span>
  </template>

  <!-- 贡献趋势：迷你柱状图 + 概要 + 主操作 -->
  <template v-else-if="props.id === 'chart'">
    <span class="sn-case-demo__bars" aria-hidden="true">
      <span
        v-for="bar in [
          { h: 46, dark: false, label: 'Jul' },
          { h: 78, dark: false, label: 'Aug' },
          { h: 58, dark: true, label: 'Sep' },
          { h: 92, dark: false, label: 'Oct' },
          { h: 40, dark: false, label: 'Nov' },
          { h: 70, dark: true, label: 'Dec' },
        ]"
        :key="bar.label"
        class="sn-case-demo__bar-col"
      >
        <span
          class="sn-case-demo__bar"
          :class="{ 'sn-case-demo__bar--dark': bar.dark }"
          :style="{ height: `${bar.h}px` }"
        />
        <span class="sn-case-demo__bar-label">{{ bar.label }}</span>
      </span>
    </span>
    <span class="sn-case-demo__grid2">
      <span class="sn-case-demo__mini">
        <span class="sn-case-demo__label">{{ t.upcoming }}</span>
        <strong>{{ t.scheduledMay }}</strong>
        <span class="sn-case-demo__list-desc">{{ t.scheduledState }}</span>
      </span>
      <span class="sn-case-demo__mini">
        <span class="sn-case-demo__label">{{ t.plan }}</span>
        <strong>{{ t.planState }}</strong>
        <span class="sn-case-demo__list-desc">{{ t.planRecurring }}</span>
      </span>
    </span>
    <SnButton class="sn-case-block" variant="primary" size="small">{{ t.viewReport }}</SnButton>
  </template>

  <!-- 二维码 -->
  <template v-else-if="props.id === 'qr'">
    <span class="sn-case-demo__center">
      <SnQrCode value="https://snail-aui.dev" :size="124" />
      <span class="sn-case-demo__caption">{{ t.qrDesc }}</span>
    </span>
  </template>

  <!-- 骨架屏 -->
  <template v-else-if="props.id === 'skeleton'">
    <span class="sn-case-demo__panel-row">
      <SnSkeleton circle height="34" width="34" />
      <span class="sn-case-demo__panel-col">
        <SnSkeleton text height="12" width="62%" />
        <SnSkeleton text height="10" width="88%" />
      </span>
    </span>
    <SnSkeleton text :repeat="2" />
    <SnSkeleton round height="28" width="42%" />
  </template>

  <!-- 确认对话框：按钮唤起 + 遮罩内的 SnDialog -->
  <template v-else-if="props.id === 'dialog'">
    <span class="sn-case-demo__center">
      <SnButton variant="primary" size="small" @click="dialogVisible = true">
        {{ t.dialogOpen }}
      </SnButton>
      <span class="sn-case-demo__caption">{{ t.dialogDesc }}</span>
    </span>
    <Teleport to="body">
      <div v-if="dialogVisible" class="sn-case-demo__dialog-mask" @click.self="dialogVisible = false">
        <SnDialog
          type="warning"
          :title="t.dialogHeading"
          :content="t.dialogBody"
          :negative-text="t.dialogNegative"
          :positive-text="t.dialogPositive"
          @positive-click="dialogVisible = false"
          @negative-click="dialogVisible = false"
          @close="dialogVisible = false"
        />
      </div>
    </Teleport>
  </template>

  <!-- 轮播：渐变 slides -->
  <template v-else-if="props.id === 'carousel'">
    <SnCarousel autoplay dot-type="line" dot-placement="bottom">
      <SnCarouselItem v-for="slide in slides" :key="slide.key">
        <div
          class="sn-case-demo__slide"
          :style="{ background: `linear-gradient(135deg, ${slide.from}, ${slide.to})` }"
        >
          {{ t[slide.label as keyof typeof t] }}
        </div>
      </SnCarouselItem>
    </SnCarousel>
  </template>

  <!-- 数据表格 -->
  <template v-else-if="props.id === 'table'">
    <SnDataTable :columns="tableColumns" :data="tableData" striped size="small" />
  </template>

  <!-- 热力图 -->
  <template v-else-if="props.id === 'heatmap'">
    <SnHeatmap :data="heatmapData" color-theme="blue" />
  </template>

  <!-- 图片 -->
  <template v-else-if="props.id === 'image'">
    <SnImage
      src="https://picsum.photos/seed/snail-aui/640/360"
      :alt="t.imageTitle"
      width="100%"
      height="150"
      object-fit="cover"
      lazy
    />
  </template>

  <!-- 视频播放 -->
  <template v-else-if="props.id === 'video'">
    <SnVideoPlayer
      src="https://www.w3schools.com/html/mov_bbb.mp4"
      :title="t.videoTitle"
      :autoplay="false"
    />
  </template>

  <!-- 日期时间：选择器 + 相对时间 -->
  <template v-else-if="props.id === 'datetime'">
    <SnDatePicker type="datetime" :placeholder="t.datetimePlaceholder" size="small" clearable />
    <span class="sn-case-demo__row sn-case-demo__caption">
      <SnTime :time="ANCHOR_TS" type="relative" />
      <SnTime :time="ANCHOR_TS" type="datetime" />
    </span>
  </template>

  <!-- 日历 -->
  <template v-else-if="props.id === 'calendar'">
    <SnCalendar :default-value="ANCHOR_TS" />
  </template>

  <!-- 颜色面板 -->
  <template v-else-if="props.id === 'color'">
    <SnColorPicker
      v-model="colorValue"
      panel-only
      :modes="['hex']"
      :swatches="['#4f6ef7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9']"
    />
    <span class="sn-case-demo__caption">{{ colorValue }}</span>
  </template>

  <!-- 上传 -->
  <template v-else-if="props.id === 'upload'">
    <SnUpload accept="image/*" :max="3" :show-file-list="false">
      <template #trigger>
        <SnButton variant="default" size="small">{{ t.uploadCta }}</SnButton>
      </template>
    </SnUpload>
    <span class="sn-case-demo__caption">{{ t.uploadDesc }}</span>
  </template>

  <!-- 拖拽排序 -->
  <template v-else-if="props.id === 'drag'">
    <SnDragSort v-model="dragItems">
      <template #item="{ item }">
        <span class="sn-case-demo__drag-row">
          <SnIcon class="sn-case-demo__drag-grip" :icon="GripVertical" />
          <span class="sn-case-demo__drag-title">{{ item.title }}</span>
        </span>
      </template>
    </SnDragSort>
  </template>

  <!-- 步骤条 -->
  <template v-else-if="props.id === 'steps'">
    <SnSteps :current="2" size="small">
      <SnStep :title="t.stepAccount" />
      <SnStep :title="t.stepProfile" />
      <SnStep :title="t.stepDone" />
    </SnSteps>
    <span class="sn-case-demo__caption">{{ t.stepsDesc }}</span>
  </template>
</template>

<style scoped>
/* 排版助手 —— 颜色全部走 SnHomeCaseCard 的玻璃变量（--sn-case-*），
 * 深浅主题自动适配。 */
.sn-case-demo__row {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.sn-case-demo__row--between {
  width: 100%;
  justify-content: space-between;
}
.sn-case-demo__field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}
.sn-case-demo__label {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--sn-case-ink-2);
}
.sn-case-demo__caption {
  font-size: 12px;
  line-height: 1.5;
  color: var(--sn-case-ink-3);
}
.sn-case-demo__grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
}
.sn-case-demo__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 0;
}

/* 图标列表行 */
.sn-case-demo__list-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  background: var(--sn-case-panel);
}
.sn-case-demo__list-row--muted {
  opacity: 0.55;
}
.sn-case-demo__list-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--sn-case-panel-strong);
  color: var(--sn-case-ink-2);
}
.sn-case-demo__list-icon :deep(svg) {
  width: 15px;
  height: 15px;
}
.sn-case-demo__list-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}
.sn-case-demo__list-title {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--sn-case-panel-ink);
}
.sn-case-demo__list-desc {
  font-size: 12px;
  line-height: 1.45;
  color: var(--sn-case-panel-ink-2);
}
.sn-case-demo__list-chevron {
  width: 14px;
  height: 14px;
  color: var(--sn-case-panel-ink-2);
}
.sn-case-demo__list-chevron :deep(svg) {
  width: 100%;
  height: 100%;
}

/* 通知偏好行 */
.sn-case-demo__notify-row {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

/* 储蓄目标组 */
.sn-case-demo__save {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--sn-case-panel);
}
.sn-case-demo__save :deep(.sn-statistic__value) {
  font-size: 24px;
}

/* 统计行（可领余额） */
.sn-case-demo__stat-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.sn-case-demo__stat-row :deep(.sn-statistic__value) {
  font-size: 26px;
}
.sn-case-demo__kv {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--sn-case-panel-ink);
  padding: 7px 10px;
  border-radius: 8px;
  background: var(--sn-case-panel);
}
.sn-case-demo__kv--strong {
  font-weight: 600;
}

/* 聊天卡 */
.sn-case-demo__chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sn-case-demo__chat-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--sn-case-panel-ink);
}
.sn-case-demo__chat-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  padding: 14px 8px;
}
.sn-case-demo__chat-greet {
  font-size: 16px;
  font-weight: 700;
  color: var(--sn-case-ink);
}
.sn-case-demo__chat-hint {
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--sn-case-ink-3);
  max-width: 260px;
}
.sn-case-demo__composer {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sn-case-demo__composer :deep(.sn-input) {
  flex: 1;
}

/* 成员行 */
.sn-case-demo__member {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
}
.sn-case-demo__member-name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-case-ink);
}

/* 柱状图 */
.sn-case-demo__bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
  height: 112px;
  padding: 0 4px;
}
.sn-case-demo__bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
}
.sn-case-demo__bar {
  width: 100%;
  max-width: 34px;
  border-radius: 7px;
  background: var(--sn-case-panel-strong);
}
.sn-case-demo__bar--dark {
  background: var(--sn-case-ink);
}
.sn-case-demo__bar-label {
  font-size: 11px;
  color: var(--sn-case-ink-3);
}

/* 迷你统计 */
.sn-case-demo__mini {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--sn-case-panel);
}
.sn-case-demo__mini strong {
  font-size: 15px;
  color: var(--sn-case-ink);
}

/* 轮播 slide */
.sn-case-demo__slide {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
  border-radius: 12px;
  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 6px rgb(2 6 16 / 0.3);
}

/* 对话框遮罩（Teleport 到 body，盖住整页） */
.sn-case-demo__dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgb(2 6 16 / 0.45);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
.sn-case-demo__dialog-mask :deep(.sn-dialog) {
  width: min(380px, calc(100vw - 48px));
}

/* 拖拽行 */
.sn-case-demo__drag-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border-radius: 10px;
  background: var(--sn-case-panel);
  cursor: grab;
}
.sn-case-demo__drag-row:active {
  cursor: grabbing;
}
.sn-case-demo__drag-grip {
  width: 14px;
  height: 14px;
  color: var(--sn-case-panel-ink-2);
}
.sn-case-demo__drag-grip :deep(svg) {
  width: 100%;
  height: 100%;
}
.sn-case-demo__drag-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--sn-case-panel-ink);
}

/* 面板组合 */
.sn-case-demo__panel-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.sn-case-demo__panel-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
</style>
