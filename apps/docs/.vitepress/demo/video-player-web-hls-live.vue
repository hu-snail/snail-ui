<script setup lang="ts">
/**
 * Demo: SnVideoPlayer — HLS live stream via the sourceBridge plugin
 * boundary, using a PUBLIC live test stream (Akamai moctobpltc).
 *
 * hls.js is loaded on demand from a CDN **inside this demo page only** —
 * the component library source has zero streaming dependencies. In a real
 * app: `npm install hls.js` and import it locally (see the guide above the
 * demo).
 */
import { onBeforeUnmount, ref } from 'vue';
import { SnVideoPlayer } from '@snui/vue-web';
import type { SnVideoSourceBridge } from '@snui/vue-web';

/** Public live test stream (Akamai). */
const LIVE_URL = 'https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8';
const HLS_CDN = 'https://esm.sh/hls.js@1.5.13';

/** Minimal structural surface of hls.js used by the bridge. */
interface HlsLike {
  loadSource(url: string): void;
  attachMedia(media: HTMLMediaElement): void;
  destroy(): void;
  currentLevel: number;
  on(
    event: string,
    cb: (event: unknown, data: { levels: Array<{ height?: number }> }) => void,
  ): void;
}
type HlsConstructor = { new (): HlsLike; isSupported(): boolean };

const status = ref('正在加载 hls.js…');
let hlsInstance: HlsLike | null = null;

const hlsBridge: SnVideoSourceBridge = (ctx) => {
  // Safari plays HLS natively — decline and let the player use video.src.
  if (ctx.video.canPlayType('application/vnd.apple.mpegurl')) {
    status.value = '使用 Safari 原生 HLS';
    return;
  }
  void (async () => {
    try {
      const mod = (await import(/* @vite-ignore */ HLS_CDN)) as { default?: unknown };
      const Hls = mod.default as HlsConstructor | undefined;
      if (!Hls || typeof Hls.isSupported !== 'function' || !Hls.isSupported()) {
        status.value = '当前环境不支持 MSE，回退原生播放';
        return;
      }
      const hls = new Hls();
      hlsInstance = hls;
      hls.loadSource(ctx.source.src);
      hls.attachMedia(ctx.video);
      hls.on(Hls.Events?.MANIFEST_PARSED ?? 'hlsManifestParsed', (_e, data) => {
        const levels = data?.levels ?? [];
        // Live levels exist but switching is throttled by the encoder —
        // report them so the quality menu reflects the stream.
        ctx.setQualities(
          levels.map((level, id) => ({ id, label: level.height ? `${level.height}P` : `#${id}` })),
        );
        ctx.setIsLive(true);
        status.value = `hls.js 已接入公开直播流（${levels.length} 档）`;
      });
      hls.on('hlsError', (_e, data: { fatal?: boolean }) => {
        if (data?.fatal) ctx.reportError(new Error('hls.js fatal error'));
      });
    } catch (err) {
      status.value = 'hls.js 加载失败（CDN 不可达？）——demo 页面需要联网';
      ctx.reportError(err);
    }
  })();

  // The bridge returns a handle immediately; async loading continues above.
  return {
    destroy: () => {
      hlsInstance?.destroy();
      hlsInstance = null;
    },
    selectQuality: (id) => {
      if (hlsInstance) hlsInstance.currentLevel = id as number;
    },
  };
};

onBeforeUnmount(() => {
  hlsInstance?.destroy();
  hlsInstance = null;
});
</script>

<template>
  <div class="demo-stack">
    <SnVideoPlayer
      :src="LIVE_URL"
      :source-bridge="hlsBridge"
      title="公开 HLS 直播测试流（Akamai）"
      muted
      autoplay
    />
    <p class="demo-hint">
      {{ status }}。直播源：<code>Akamai moctobpltc 公开测试流</code>；组件库零流媒体依赖， hls.js
      由 demo 页按需动态引入（生产请 <code>npm install hls.js</code>）。
    </p>
  </div>
</template>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-hint {
  margin: 0;
  color: var(--sn-web-color-text-secondary, #666);
  font-size: 12px;
}
</style>
