<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
// 组件 token 样式（--sn-mp-* CSS 变量）。dist 产物，需先构建 @snui/uni。
import '@snui/uni/styles';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { Crown, Heart } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import {
  AppsIcon,
  ArrowBackIcon,
  ArrowDropDownIcon,
  ArrowForwardIcon,
  BedIcon,
  BoltFilledIcon,
  ChatBubbleIcon,
  ChevronRightIcon,
  ConfirmationNumberIcon,
  DescriptionIcon,
  ExpandMoreIcon,
  FavoriteFilledIcon,
  HomeIcon,
  LocationOnIcon,
  LocalFireDepartmentIcon,
  MedicalServicesIcon,
  MopedIcon,
  MovieIcon,
  NotificationsIcon,
  PedalBikeIcon,
  PersonIcon,
  PlayCircleIcon,
  QrCodeScannerIcon,
  RestaurantIcon,
  ScheduleIcon,
  SearchIcon,
  ShareIcon,
  ShoppingBagIcon as MaterialShoppingBagIcon,
  ShoppingCartIcon,
  SpaIcon,
  StarFilledIcon,
  StorefrontIcon,
  SupportAgentIcon,
  VerifiedFilledIcon,
  WbSunnyIcon,
  WorkspacePremiumFilledIcon,
  BrandingWatermarkIcon,
} from './common/material-icons';
import {
  CarIcon,
  ChartColumnIcon,
  ClapperboardIcon,
  CrossIcon,
  LayoutGridIcon,
  ScissorsIcon,
  SparklesIcon,
  TicketIcon,
  UtensilsIcon,
  BedDoubleIcon,
} from './common/icons';

/**
 * 注册模板工程用到的字符串名图标：sn-empty / sn-cell / sn-grid-item /
 * sn-tabbar-item 等组件按**名称**解析图标，模板页因此只需传 `icon="home"`。
 *
 * 图标集取自三个设计稿的 Material 字形（见 `common/material-icons.ts`）；
 * 名称保留设计稿的 glyph 名（snake_case → kebab-case），便于对照复核。
 */
registerSnIcons({
  // 底部标签栏（商城页 tabbar，设计稿 home / play_circle / chat_bubble /
  // shopping_cart / person）
  home: HomeIcon,
  'circle-play': PlayCircleIcon,
  'message-circle': ChatBubbleIcon,
  'shopping-cart': ShoppingCartIcon,
  user: PersonIcon,
  // 通用
  sparkles: SparklesIcon,
  heart: Heart,
  crown: Crown,
  search: SearchIcon,
  'map-pin': LocationOnIcon,
  'chart-column': ChartColumnIcon,
  // 商城金刚区（2×5 服务矩阵，FILL 1 字形）
  bike: MopedIcon,
  utensils: RestaurantIcon,
  bed: BedIcon,
  ticket: ConfirmationNumberIcon,
  clapperboard: MovieIcon,
  'shopping-bag': MaterialShoppingBagIcon,
  cross: MedicalServicesIcon,
  scissors: SpaIcon,
  car: PedalBikeIcon,
  'layout-grid': AppsIcon,
});

onLaunch(() => {});
onShow(() => {});
onHide(() => {});
</script>

<style>
/* 模板工程全局：浅色移动端页面基底 + 通用工具类（各模板页复用）。 */
page {
  background-color: #f4f6f9;
  color: #1d2129;
  font-size: 26rpx;
}

.tpl-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 模板商店调色板 —— tab 页共用；.sn-theme-dark 下整体翻转（§112.5 契约）。 */
.tpl-page {
  --tplh-accent: #35a257;
  --tplh-bg: #f6f7f9;
  --tplh-nav: #f6f7f9;
  --tplh-card: #ffffff;
  --tplh-field: #eef1f5;
  --tplh-line: #e5e9f0;
  --tplh-text: #17202e;
  --tplh-text-2: #5d6b7e;
  --tplh-text-3: #98a2b3;
  --tplh-shadow: 0 10rpx 30rpx rgba(15, 23, 42, 0.06);
}
.tpl-page.sn-theme-dark {
  --tplh-accent: #4cd088;
  --tplh-bg: #0b0f16;
  --tplh-nav: #0b0f16;
  --tplh-card: #131a24;
  --tplh-field: #10151d;
  --tplh-line: rgba(255, 255, 255, 0.09);
  --tplh-text: #e8ecf3;
  --tplh-text-2: #9aa6b6;
  --tplh-text-3: #5c6675;
  --tplh-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.45);
}

/* 通用卡片 / 分组面板 */
.tpl-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 24rpx;
  box-sizing: border-box;
}

.tpl-gap {
  height: 20rpx;
}

/* 原型填充条（灰阶笔触） */
.tpl-line {
  height: 16rpx;
  border-radius: 8rpx;
  background: #eef0f4;
}

/* 价格 */
.tpl-price {
  color: #e5484d;
  font-weight: 700;
}

/* 单元行 */
.tpl-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.tpl-row--between {
  justify-content: space-between;
}
</style>
