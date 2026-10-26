<script setup lang="ts">
/**
 * Demo: SnVideoPlayer — multi-bitrate VOD via the sourceBridge boundary.
 *
 * hls.js parses the public Mux multi-variant stream and reports the level
 * ladder through `setQualities`; the settings menu switches levels with
 * `selectQuality`. Same quality menu as the progressive ladder demo —
 * the player does not care where the ladder came from.
 */
import { onBeforeUnmount, ref } from 'vue';
import { SnVideoPlayer } from '@snui/vue-web';
import type { SnVideoSourceBridge } from '@snui/vue-web';

/** Public multi-bitrate VOD test stream (Mux / Big Buck Bunny). */
const VOD_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const HLS_CDN = 'https://esm.sh/hls.js@1.5.13';

interface HlsLike {
  loadSource(url: string): void;
  attachMedia(media: HTMLMediaElement): void;
  destroy(): void;
  currentLevel: number;
  on(event: string, cb: (event: unknown, data: { levels: Array<{ height?: number; bitrate?: number }> }) => void): void;
}
type HlsConstructor = { new (): HlsLike; isSupported(): boolean };

const status = ref('正在加载 hls.js…');
let hlsInstance: HlsLike | null = null;

const hlsBridge: SnVideoSourceBridge = (ctx) => {
  if (ctx.video.canPlayType('application/vnd.apple.mpegurl')) {
    status.value = '使用 Safari 原生 HLS（清晰度列表不可用）';
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
        ctx.setQualities(
          levels
            .map((level, id) => ({
              id,
              label: level.height
                ? `${level.height}P${level.bitrate ? ` · ${Math.round(level.bitrate / 1000)}kbps` : ''}`
                : `#${id}`,
            }))
            .reverse(), // highest first, like mainstream players
        );
        status.value = `已解析 ${levels.length} 档清晰度，设置面板可切换`;
      });
      hls.on('hlsError', (_e, data: { fatal?: boolean }) => {
        if (data?.fatal) ctx.reportError(new Error('hls.js fatal error'));
      });
    } catch (err) {
      status.value = 'hls.js 加载失败（CDN 不可达？）——demo 页面需要联网';
      ctx.reportError(err);
    }
  })();

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
    <SnVideoPlayer :src="VOD_URL" :source-bridge="hlsBridge" title="多码率点播（Mux 公开测试流）" />
    <p class="demo-hint">
      {{ status }}。清晰度来自流本身（hls.js 上报），与渐进式 `qualities` 阶梯共用同一套菜单与切换逻辑。
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
