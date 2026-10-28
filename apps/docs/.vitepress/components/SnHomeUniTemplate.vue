<script setup lang="ts">
/**
 * SnHomeUniTemplate — 首页 uni-templates：真实模板的引流卡。
 *
 * 机身：手机比例（瀑布流窄列 ~260-300px 宽 × 460-660px 高）、大圆角、
 * 无边框；顶部是模拟系统状态条（时间 / 灵动岛 / 信号 · 电量），屏幕为
 * iframe 实时加载的 uni-templates H5 模板（ADR-0005：uni 端唯一事实源）。
 *
 * 性能：iframe 只在卡片进入视口后才开始加载（IntersectionObserver），
 * 加载完成前显示骨架 —— 12 张卡不会同时拉起 12 个页面。
 *
 * 引流：机身**不**做遮罩 —— 二维码挂在机身下方的「小程序码」标签上，
 * 悬停 / 键盘聚焦标签时在标签上方弹出二维码气泡（微信扫码预览 + H5
 * 直达）。小程序码接入微信 API 后把气泡里的 SnQrCode 换成官方码图即可。
 *
 * 深浅主题：机身 / 状态条 / 骨架走 `--sn-uni-*` 变量（html.dark 切换）。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { BatteryMedium, ExternalLink, Signal, Wifi } from 'lucide-vue-next';
import { SnQrCode } from '@snui/vue-web';
import { uniTemplatesPageUrl } from '../utils/uni-templates-base';
import {
  uniTemplateCopy,
  uniTemplateDesc,
  uniTemplateTitle,
  type UniTemplateLocale,
} from '../utils/home-uni-templates';

const props = defineProps<{
  /** 模板标识（home-uni-templates.ts 注册表）。 */
  id: string;
  /** uni-templates 分包页面路由（如 `subpages/login`）。 */
  route: string;
  /** 手机高度（px，瀑布流错落）。 */
  height: number;
  /** 站点语言。 */
  locale: UniTemplateLocale;
}>();

const t = computed(() => uniTemplateCopy(props.locale));
const title = computed(() => uniTemplateTitle(props.id, props.locale));
const desc = computed(() => uniTemplateDesc(props.id, props.locale));

/** H5 模板地址（独立部署站 hash 路由）——iframe 源 + 二维码内容 + 直达链接。 */
const h5Url = computed(() => uniTemplatesPageUrl(props.route));

/* ── 懒加载：进入视口才挂 iframe ── */
const rootRef = ref<HTMLElement | null>(null);
const inView = ref(false);
const frameLoaded = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    inView.value = true; // 无 IO 的环境直接加载（SSR 不执行到这里）
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        inView.value = true;
        observer?.disconnect();
        observer = null;
      }
    },
    { rootMargin: '240px' },
  );
  if (rootRef.value) observer.observe(rootRef.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<template>
  <figure ref="rootRef" class="sn-uni-t">
    <!-- 手机模拟器：大圆角、无边框、系统状态条 + 实时模板屏 -->
    <div class="sn-uni-t__phone" :style="{ height: `${height}px` }">
      <div class="sn-uni-t__status" aria-hidden="true">
        <span class="sn-uni-t__status-time">9:41</span>
        <span class="sn-uni-t__island" />
        <span class="sn-uni-t__status-icons">
          <Signal />
          <Wifi />
          <BatteryMedium />
        </span>
      </div>

      <div class="sn-uni-t__screen">
        <!-- 加载骨架（iframe 未就绪时） -->
        <div v-if="!frameLoaded" class="sn-uni-t__skeleton" aria-hidden="true">
          <i class="sn-uni-t__sk-bar" style="width: 46%" />
          <i class="sn-uni-t__sk-bar" style="width: 88%" />
          <i class="sn-uni-t__sk-bar" style="width: 72%" />
          <i class="sn-uni-t__sk-block" />
          <i class="sn-uni-t__sk-bar" style="width: 82%" />
          <i class="sn-uni-t__sk-bar" style="width: 58%" />
        </div>

        <!-- 真实模板：uni-templates H5（进入视口才加载） -->
        <iframe
          v-if="inView"
          class="sn-uni-t__frame"
          :src="h5Url"
          :title="`${title} · ${t.iframeTitle}`"
          loading="lazy"
          @load="frameLoaded = true"
        />
      </div>

      <!-- 底部安全区 + Home 横条 -->
      <div class="sn-uni-t__home" aria-hidden="true">
        <i class="sn-uni-t__home-bar" />
      </div>
    </div>

    <!-- 机身下方：标题 / 描述 / 小程序码标签（悬停出二维码气泡） -->
    <figcaption class="sn-uni-t__caption">
      <span class="sn-uni-t__caption-title">{{ title }}</span>
      <span class="sn-uni-t__caption-desc">{{ desc }}</span>
      <span class="sn-uni-t__mp" tabindex="0">
        <span class="sn-uni-t__mp-tag">{{ t.badgeMp }}</span>

        <!-- 二维码气泡：锚定在标签上方 -->
        <span class="sn-uni-t__qr-pop">
          <span class="sn-uni-t__qr-card">
            <SnQrCode :value="h5Url" :size="112" />
            <span class="sn-uni-t__qr-hint">{{ t.scanHint }}</span>
            <a class="sn-uni-t__qr-link" :href="h5Url" target="_blank" rel="noopener">
              {{ t.openH5 }}
              <ExternalLink />
            </a>
          </span>
          <i class="sn-uni-t__qr-arrow" aria-hidden="true" />
        </span>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.sn-uni-t {
  --sn-uni-page: #ffffff;
  --sn-uni-ink: #101828;
  --sn-uni-ink-2: #667085;
  --sn-uni-ink-3: #98a2b3;
  --sn-uni-panel: #f4f5f7;

  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
html.dark .sn-uni-t {
  --sn-uni-page: #141b2c;
  --sn-uni-ink: #eef1f8;
  --sn-uni-ink-2: rgb(226 232 244 / 0.66);
  --sn-uni-ink-3: rgb(226 232 244 / 0.42);
  --sn-uni-panel: rgb(255 255 255 / 0.07);
}

/* 手机模拟器：大圆角、无边框 */
.sn-uni-t__phone {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 34px;
  background: var(--sn-uni-page);
  box-shadow:
    var(--sn-home-card-shadow, 0 10px 30px rgb(2 6 16 / 0.2)),
    inset 0 0 0 1px rgb(255 255 255 / 0.04);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.sn-uni-t__phone:hover {
  transform: translateY(-2px);
  box-shadow:
    var(--sn-home-card-shadow-hover, 0 18px 44px rgb(2 6 16 / 0.3)),
    inset 0 0 0 1px rgb(255 255 255 / 0.04);
}

/* 系统状态条：时间 / 灵动岛 / 信号 · 电量 */
.sn-uni-t__status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px 8px;
  flex-shrink: 0;
  background: var(--sn-uni-page);
  color: var(--sn-uni-ink);
}
.sn-uni-t__status-time {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.sn-uni-t__island {
  flex: 1;
  height: 16px;
  max-width: 76px;
  margin: 0 auto;
  border-radius: 999px;
  background: rgb(2 6 16 / 0.85);
}
html.dark .sn-uni-t__island {
  background: rgb(255 255 255 / 0.16);
}
.sn-uni-t__status-icons {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--sn-uni-ink);
}
.sn-uni-t__status-icons svg {
  width: 12px;
  height: 12px;
}

/* 屏幕：状态条以下全部交给真实模板 iframe */
.sn-uni-t__screen {
  position: relative;
  flex: 1;
  min-height: 0;
}

/* 骨架 */
.sn-uni-t__skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 18px;
}
.sn-uni-t__sk-bar {
  height: 12px;
  border-radius: 6px;
  background: var(--sn-uni-panel);
}
.sn-uni-t__sk-block {
  height: 150px;
  border-radius: 12px;
  background: var(--sn-uni-panel);
}

/* 真实模板 iframe：铺满屏幕区 */
.sn-uni-t__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: var(--sn-uni-page);
}

/* 底部安全区 + Home 横条 */
.sn-uni-t__home {
  flex-shrink: 0;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sn-uni-page);
}
.sn-uni-t__home-bar {
  width: 108px;
  height: 5px;
  border-radius: 999px;
  background: var(--sn-uni-ink);
  opacity: 0.85;
}

/* ── 机身下方 caption + 小程序码标签 ── */
.sn-uni-t__caption {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  margin: 0;
  text-align: center;
}
.sn-uni-t__caption-title {
  font-size: 13px;
  font-weight: 600;
  color: inherit;
  opacity: 0.9;
}
.sn-uni-t__caption-desc {
  font-size: 11.5px;
  line-height: 1.45;
  color: inherit;
  opacity: 0.55;
}

/* 「微信小程序」标签 —— 二维码气泡的锚点 */
.sn-uni-t__mp {
  position: relative;
  display: inline-flex;
  margin-top: 4px;
  cursor: pointer;
  outline: none;
}
.sn-uni-t__mp-tag {
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: inherit;
  opacity: 0.75;
  background: rgb(255 255 255 / 0.1);
  transition:
    opacity 0.2s,
    background-color 0.2s,
    color 0.2s;
}
html.dark .sn-uni-t__mp-tag {
  background: rgb(255 255 255 / 0.12);
}
.sn-uni-t__mp:hover .sn-uni-t__mp-tag,
.sn-uni-t__mp:focus-visible .sn-uni-t__mp-tag {
  opacity: 1;
  color: #ffffff;
  background: var(--sn-web-color-action-primary, #3b82f6);
}

/* 二维码气泡：默认隐藏，悬停 / 聚焦标签时浮现在标签上方 */
.sn-uni-t__qr-pop {
  position: absolute;
  bottom: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  z-index: 30;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.sn-uni-t__mp:hover .sn-uni-t__qr-pop,
.sn-uni-t__mp:focus-visible .sn-uni-t__qr-pop,
.sn-uni-t__qr-pop:hover {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}
/* 气泡太靠左 / 太靠右时避免被视口裁切（窄列下气泡比标签宽） */
.sn-uni-t__mp:first-of-type .sn-uni-t__qr-pop {
  left: 0;
  transform: translateY(4px);
}
.sn-uni-t__mp:first-of-type:hover .sn-uni-t__qr-pop,
.sn-uni-t__mp:first-of-type:focus-visible .sn-uni-t__qr-pop {
  transform: translateY(0);
}

.sn-uni-t__qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 18px 14px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgb(2 6 16 / 0.35);
}
.sn-uni-t__qr-arrow {
  position: absolute;
  left: 50%;
  bottom: -5px;
  width: 10px;
  height: 10px;
  transform: translateX(-50%) rotate(45deg);
  background: #ffffff;
}
.sn-uni-t__qr-hint {
  font-size: 12px;
  font-weight: 600;
  color: #101828;
  white-space: nowrap;
}
.sn-uni-t__qr-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  color: #ffffff;
  background: var(--sn-web-color-action-primary, #3b82f6);
}
.sn-uni-t__qr-link svg {
  width: 12px;
  height: 12px;
}
</style>
