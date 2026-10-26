<script setup lang="ts">
/**
 * Demo: SnVideoPreview — `background` mode (banner / section background).
 *
 * Both stages are `position: relative` containers; the video is a `background`
 * SnVideoPreview dropped in as the first child, so it fills the stage
 * (`position: absolute; inset: 0`) and paints behind whatever is authored on
 * top of it. No controls, no play button, no hover toolbar, muted + autoplay +
 * loop, `object-fit: cover`, `aria-hidden` — the video is pure decoration.
 */
import { SnButton, SnVideoPreview } from '@snui/vue-web';

/**
 * 自包含视频源（data URI，Web Platform Tests media/2x2-green.mp4，BSD-3-Clause）。
 * demo 不依赖任何外网视频源。
 */
const videoSrc =
  'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACIhtZGF0//tQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAAAq4GBf//qtxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNDggcjI2NDMgNWM2NTcwNCAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTUgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz0xIGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0yNSBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAABRliIQAK//+2OfzLJOXereQdLvG0f/7UsRdg8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tSxKGDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1LEoYPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UsShg8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tSxKGDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+1LEoYPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQAABP9tb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAAtgABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAACEXRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAAtgAAAAAAAAAAAAAAAQEAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAAJwAAARRAAEAAAAAAYltZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAAKxEAAAfUVXEAAAAAAAtaGRscgAAAAAAAAAAc291bgAAAAAAAAAAAAAAAFNvdW5kSGFuZGxlcgAAAAE0bWluZgAAABBzbWhkAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAD4c3RibAAAAGBzdHNkAAAAAAAAAAEAAABQbXA0YQAAAAAAAAABAAAAAAAAAAAAAgAQAAAAAKxEAAAAAAAsZXNkcwAAAAADgICAGwABAASAgIANaxUAAAAAAPtRAAD7UQaAgIABAgAAACBzdHRzAAAAAAAAAAIAAAAGAAAEgAAAAAEAAARRAAAAKHN0c2MAAAAAAAAAAgAAAAEAAAABAAAAAQAAAAIAAAAGAAAAAQAAADBzdHN6AAAAAAAAAAAAAAAHAAAA0AAAANEAAADRAAAA0QAAANEAAADRAAAA0QAAABhzdGNvAAAAAAAAAAIAAAAwAAADygAAAhh0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAACAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAIAAAACAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAAoAAAAAAABAAAAAAGQbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAyAAAAAgBVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABO21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAPtzdGJsAAAAl3N0c2QAAAAAAAAAAQAAAIdhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAIAAgBIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAMWF2Y0MBZAAK/+EAGGdkAAqs2V+IiIQAAAMABAAAAwDIPEiWWAEABmjr48siwAAAABhzdHRzAAAAAAAAAAEAAAABAAACAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAALKAAAAAQAAABRzdGNvAAAAAAAAAAEAAAEAAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY1Ni40MC4xMDE=';

/** 第二段视频地址（同一份内联素材，演示“卡片背后的整段背景”）。 */
const sectionSrc = videoSrc;
</script>

<template>
  <div class="demo-col">
    <!-- 案例 1：Hero 横幅（16 / 9 舞台 + 渐变蒙层 + 文案 + CTA） -->
    <section class="demo-hero">
      <SnVideoPreview :src="videoSrc" background />
      <div class="demo-hero__scrim" />
      <div class="demo-hero__content">
        <p class="demo-hero__eyebrow">AUI · Spring 2025 Launch</p>
        <h3 class="demo-hero__title">Let the interface grow itself</h3>
        <p class="demo-hero__copy">
          A schema-driven multi-platform UI framework. The video is a purely decorative background:
          no controls, muted, autoplaying, and looping.
        </p>
        <SnButton type="primary" size="small">Try it now</SnButton>
      </div>
    </section>

    <!-- 案例 2：整段 Section 背景（视频铺满，卡片浮在上面） -->
    <section class="demo-section">
      <SnVideoPreview :src="sectionSrc" background />
      <div class="demo-section__scrim" />
      <div class="demo-card">
        <h4 class="demo-card__title">Full background video</h4>
        <p class="demo-card__copy">
          <code>background</code> turns the video into an absolutely-positioned decoration
          layer:<code>position: absolute</code> + flush to the parent on all sides,<code
            >object-fit: cover</code
          >、<code>aria-hidden</code>、 <code>pointer-events: none</code>. The parent only needs
          <code>position: relative</code>。
        </p>
      </div>
    </section>

    <p class="demo-note">
      Note: browsers only autoplay muted media, so this <code>background</code> forces
      <code>muted</code> + <code>autoplay</code> + <code>loop</code>; there is no option to turn it
      off — otherwise the video would freeze on its first frame.
    </p>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 台阶式舞台：视频 absolute inset 0 铺满这个 relative 容器。 */
.demo-hero {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
}

.demo-hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.28) 58%,
    rgba(0, 0, 0, 0) 100%
  );
}

.demo-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  height: 100%;
  padding: 24px 32px;
  color: #fff;
}

.demo-hero__eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.78;
}

.demo-hero__title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.25;
}

.demo-hero__copy {
  max-width: 38ch;
  margin: 0 0 8px;
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.9;
}

.demo-section {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  min-height: 240px;
  padding: 48px 24px;
  border-radius: 10px;
}

.demo-section__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(9, 88, 217, 0.55) 0%, rgba(0, 0, 0, 0.6) 100%);
}

.demo-card {
  position: relative;
  z-index: 1;
  max-width: 420px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.24);
}

.demo-card__title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.demo-card__copy {
  margin: 0;
  color: #595959;
  font-size: 13px;
  line-height: 1.7;
}

.demo-card__copy code,
.demo-note code {
  padding: 0 4px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.06);
  font-size: 12px;
}

.demo-note {
  margin: 0;
  color: #8c8c8c;
  font-size: 12px;
  line-height: 1.7;
}
</style>
