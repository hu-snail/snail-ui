<script setup lang="ts">
/**
 * Demo: sn-img-cropper (uni-end) — 真实裁剪：网络图片 / 本地图片 + canvas 栅格化。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-img-cropper from its SFC source.
 *
 * ## 为什么这里自己画 canvas
 *
 * `sn-img-cropper` 只报几何（AGENTS.md §112：uni 端元素白名单不含 `<canvas>`），
 * 栅格化由宿主完成。这个 demo 就是「宿主」：`confirm` 回来后把组件应用的
 * transform（offset / scale / rotate）与裁剪框尺寸重放到 canvas 上，裁出与预览
 * 完全一致的结果图，再显示出来。
 *
 * 上传走 `uni.chooseImage`：真机是系统相册，docs 预览由
 * `utils/uni-preview-shims.ts` 用隐藏的 file input 顶替 —— 同一份 demo 代码两端都能跑。
 */
import { computed, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnImgCropper from '@snui/uni-src/components/sn-img-cropper/sn-img-cropper.vue';

/** 组件 `confirm` 事件载荷（与 sn-img-cropper 的 SnImgCropperResult 同形）。 */
interface CropPayload {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotate: number;
  source: { x: number; y: number; width: number; height: number };
  frame: { width: number; height: number };
}

/** 设计稿 px → rpx 的固定比例（组件内部 RPX_PER_PX）。 */
const RPX_PER_PX = 2;

const visible = ref(false);
const result = ref('—');
/** 裁剪结果图（data URL）；空表示还没裁过。 */
const cropped = ref('');
const imgSrc = ref('/demo/snui-crop-square.jpg');

const meta = computed(() => (cropped.value === '' ? '未裁剪' : result.value));

function open(): void {
  visible.value = true;
}

/**
 * 把组件应用的变换重放到 canvas 上，导出与预览一致的裁剪结果。
 *
 * 预览里的变换链是 `translate(offset) scale(scale) rotate(rotate)`，作用在
 * 铺满裁剪框的 `<image>` 上；canvas 用同样的顺序（translate → scale → rotate）
 * 绘制，再按裁剪框尺寸导出即可。
 */
function rasterize(payload: CropPayload, source: HTMLImageElement): string {
  // rpx → px（750 设计稿 → 375px 视口，与 rpx-transform.ts 同一比例）。
  const toPx = (rpx: number): number => rpx / RPX_PER_PX;
  const frameW = toPx(payload.frame.width);
  const frameH = toPx(payload.frame.height);
  const scale = payload.scale;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(frameW * scale));
  canvas.height = Math.max(1, Math.round(frameH * scale));
  const ctx = canvas.getContext('2d');
  if (ctx === null) return '';

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Same order as the CSS transform chain in the component.
  ctx.translate(
    canvas.width / 2 + toPx(payload.offsetX) * scale,
    canvas.height / 2 + toPx(payload.offsetY) * scale,
  );
  ctx.rotate((payload.rotate * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.drawImage(source, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

  return canvas.toDataURL('image/jpeg', 0.92);
}

function onConfirm(payload: CropPayload): void {
  result.value = `scale ${payload.scale.toFixed(2)} · rotate ${payload.rotate}° · 源矩形 ${payload.source.width}×${payload.source.height} @ (${payload.source.x}, ${payload.source.y})`;

  const source = new Image();
  // 本地 / 同源图片不需要 CORS 授权；网络图片只要服务端允许即可。
  source.crossOrigin = 'anonymous';
  source.onload = () => {
    const dataUrl = rasterize(payload, source);
    if (dataUrl !== '') cropped.value = dataUrl;
  };
  source.onerror = () => {
    result.value = `${result.value} · 结果图导出失败（图片未加载完成）`;
  };
  source.src = imgSrc.value;
}

function onCancel(): void {
  result.value = '已取消';
}

/** `uni.chooseImage` → 真机相册 / 预览里的文件选择框。 */
function pickLocal(): void {
  const host = globalThis as {
    uni?: {
      chooseImage?: (options: {
        count?: number;
        success?: (result: { tempFilePaths: string[] }) => void;
        fail?: (error: unknown) => void;
      }) => void;
    };
  };
  const chooseImage = host.uni?.chooseImage;
  if (typeof chooseImage !== 'function') {
    result.value = '当前环境不支持 uni.chooseImage';
    return;
  }
  chooseImage({
    count: 1,
    success: (picked) => {
      const path = picked.tempFilePaths[0];
      if (path === undefined || path === '') return;
      imgSrc.value = path;
      cropped.value = '';
      result.value = `已选本地图片：${path.slice(0, 42)}…`;
      visible.value = true;
    },
    fail: () => {
      result.value = '未选择图片';
    },
  });
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__row">
      <SnButton size="small" type="primary" @tap="open">打开裁剪</SnButton>
      <SnButton size="small" @tap="pickLocal">上传本地图片</SnButton>
    </view>

    <text class="sn-demo__meta">结果：{{ meta }}</text>

    <image v-if="cropped !== ''" class="sn-demo__cropped" :src="cropped" />

    <SnImgCropper
      v-model="visible"
      :img-src="imgSrc"
      aspect-ratio="1:1"
      custom-class="sn-demo-contained"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: flex-start;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: 24rpx;
  word-break: break-all;
}
/* 导出结果：确认后直接看到真实裁剪图。 */
.sn-demo__cropped {
  width: 240rpx;
  height: 240rpx;
  border-radius: 12rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
}
/* Docs-preview only: the cropper root is `position: fixed`, which would cover the
 * whole docs page instead of the phone screen. Not needed in a real app. */
.sn-img-cropper.sn-demo-contained {
  position: absolute;
}
</style>
