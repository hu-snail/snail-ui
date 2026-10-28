<script setup lang="ts">
/**
 * SnHomeUniTemplate — 首页 uni-templates：真实模板的引流卡。
 *
 * 外观与上一代手机模拟器一致（大圆角、无边框），但屏幕内容是
 * **真实 uni-app 模板**：通过 iframe 加载 uni-demo 部署站的 H5 页面
 * （ADR-0005：uni 端唯一事实源），所见即真实运行效果。
 *
 * 性能：iframe 只在卡片进入视口后才开始加载（IntersectionObserver），
 * 加载完成前显示骨架 —— 12 张卡不会同时拉起 12 个页面。
 *
 * 引流：悬停 / 键盘聚焦浮现二维码卡（微信扫码预览 + H5 直达链接）。
 * 二维码当前以 H5 链接生成（SnQrCode）；小程序码发布后把 `qrValue`
 * 换成小程序码图片或 wxacode 链接即可（见 home-uni-templates.ts 注释）。
 *
 * 深浅主题：机身/骨架走 `--sn-uni-*` 变量（html.dark 切换），与画布联动。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useData } from 'vitepress';
import { ExternalLink } from 'lucide-vue-next';
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
    <div class="sn-uni-t__phone" :style="{ height: `${height}px` }">
      <!-- 加载骨架（iframe 未就绪时） -->
      <div v-if="!frameLoaded" class="sn-uni-t__skeleton" aria-hidden="true">
        <i class="sn-uni-t__sk-bar" style="width: 46%" />
        <i class="sn-uni-t__sk-bar" style="width: 88%" />
        <i class="sn-uni-t__sk-bar" style="width: 72%" />
        <i class="sn-uni-t__sk-block" />
        <i class="sn-uni-t__sk-bar" style="width: 82%" />
        <i class="sn-uni-t__sk-bar" style="width: 58%" />
      </div>

      <!-- 真实模板：uni-demo H5（进入视口才加载） -->
      <iframe
        v-if="inView"
        class="sn-uni-t__frame"
        :src="h5Url"
        :title="`${title} · ${t.iframeTitle}`"
        loading="lazy"
        @load="frameLoaded = true"
      />

      <!-- 悬停引流卡：小程序二维码 + H5 直达 -->
      <div class="sn-uni-t__hover">
        <div class="sn-uni-t__qr-card">
          <SnQrCode :value="h5Url" :size="116" />
          <p class="sn-uni-t__qr-hint">{{ t.scanHint }}</p>
          <a class="sn-uni-t__qr-link" :href="h5Url" target="_blank" rel="noopener">
            {{ t.openH5 }}
            <ExternalLink />
          </a>
        </div>
      </div>
    </div>

    <figcaption class="sn-uni-t__caption">
      <span class="sn-uni-t__caption-title">{{ title }}</span>
      <span class="sn-uni-t__caption-desc">{{ desc }}</span>
      <span class="sn-uni-t__badges">
        <i class="sn-uni-t__badge sn-uni-t__badge--h5">{{ t.badgeH5 }}</i>
        <i class="sn-uni-t__badge">{{ t.badgeMp }}</i>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.sn-uni-t {
  --sn-uni-page: #ffffff;
  --sn-uni-ink: #101828;
  --sn-uni-ink-2: #667085;
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
  --sn-uni-panel: rgb(255 255 255 / 0.07);
}

/* 手机模拟器：大圆角、无边框 */
.sn-uni-t__phone {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 36px;
  background: var(--sn-uni-page);
  box-shadow:
    var(--sn-home-card-shadow, 0 10px 30px rgb(2 6 16 / 0.2)),
    inset 0 0 0 1px rgb(255 255 255 / 0.04);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.sn-uni-t__phone:hover {
  transform: translateY(-2px);
  box-shadow:
    var(--sn-home-card-shadow-hover, 0 18px 44px rgb(2 6 16 / 0.3)),
    inset 0 0 0 1px rgb(255 255 255 / 0.04);
}

/* 骨架 */
.sn-uni-t__skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 18px;
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

/* 真实模板 iframe：铺满机身屏幕 */
.sn-uni-t__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: var(--sn-uni-page);
}

/* 悬停引流卡 */
.sn-uni-t__hover {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  background: rgb(2 6 16 / 0.46);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}
.sn-uni-t__phone:hover .sn-uni-t__hover,
.sn-uni-t__phone:focus-within .sn-uni-t__hover {
  opacity: 1;
  pointer-events: auto;
}
.sn-uni-t__qr-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 20px 16px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgb(2 6 16 / 0.4);
}
.sn-uni-t__qr-hint {
  margin: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: #101828;
}
.sn-uni-t__qr-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  color: #ffffff;
  background: var(--sn-web-color-action-primary, #3b82f6);
}
.sn-uni-t__qr-link svg {
  width: 13px;
  height: 13px;
}

/* 触屏（无 hover）：引流卡常显 */
@media (hover: none) {
  .sn-uni-t__hover {
    opacity: 1;
  }
  .sn-uni-t__hover {
    background: linear-gradient(to top, rgb(2 6 16 / 0.55), transparent 42%);
    place-items: end center;
    padding-bottom: 12px;
  }
}

/* 底部案例名 + 发布徽标 */
.sn-uni-t__caption {
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
.sn-uni-t__badges {
  display: inline-flex;
  gap: 6px;
  margin-top: 3px;
}
.sn-uni-t__badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10.5px;
  font-style: normal;
  font-weight: 600;
  color: inherit;
  opacity: 0.55;
  background: rgb(255 255 255 / 0.08);
}
html.dark .sn-uni-t__badge {
  background: rgb(255 255 255 / 0.1);
}
.sn-uni-t__badge--h5 {
  color: #16a34a;
  opacity: 0.9;
}
html.dark .sn-uni-t__badge--h5 {
  color: #4ade80;
}
</style>
