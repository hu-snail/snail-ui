/**
 * 模板工程补充图标 —— lucide 路径数据，`sn-icon-set` 未收录的少量图标。
 * 页面通过 `SnIcon :icon` 直接消费；同时经 App.vue `registerSnIcons` 注册
 * 字符串名（sn-empty / sn-cell 的 registry 查找）。
 * Paths from https://lucide.dev/icons (ISC license)。
 */
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';

const d = (paths: string[]): IconData => ({ viewBox: '0 0 24 24', paths });

export const SparklesIcon = d([
  'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  'M20 3v4',
  'M22 5h-4',
  'M4 17v2',
  'M5 18H3',
]);
export const MicIcon = d([
  'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z',
  'M19 10v2a7 7 0 0 1-14 0v-2',
  'M12 19v3',
]);
export const ScanIcon = d([
  'M3 7V5a2 2 0 0 1 2-2h2',
  'M17 3h2a2 2 0 0 1 2 2v2',
  'M21 17v2a2 2 0 0 1-2 2h-2',
  'M7 21H5a2 2 0 0 1-2-2v-2',
  'M7 12h10',
]);
export const FlameIcon = d([
  'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
]);
export const SlidersIcon = d([
  'M21 4h-7',
  'M10 4H3',
  'M21 12h-9',
  'M8 12H3',
  'M21 20h-5',
  'M12 20H3',
  'M14 2v4',
  'M8 10v4',
  'M16 18v4',
]);
export const SmartphoneIcon = d([
  'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z',
  'M12 18h.01',
]);
export const ShoppingBagIcon = d([
  'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z',
  'M3 6h18',
  'M16 10a4 4 0 0 1-8 0',
]);
export const MapPinIcon = d([
  'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z',
  'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
]);
export const ChartColumnIcon = d([
  'M3 3v16a2 2 0 0 0 2 2h16',
  'M18 17V9',
  'M13 17V5',
  'M8 17v-3',
]);
