<script setup lang="ts">
/**
 * 模板：商品详情页 —— 主图轮播 + 百亿补贴横幅 + 标题/优惠券 + 履约保障 +
 * 宝贝评价 + 问大家 + 店铺信息 + 图文详情，底部固定购买操作栏。
 *
 * 结构：sn-paging 根容器（#top 固定导航行与 Tab，#bottom 购买栏，默认插槽
 * 为整页详情内容；详情页无分页，故 auto / load-more / refresher 全关）。
 * 微信小程序端导航行按胶囊几何让位（common/capsule）。
 */
import { computed, ref } from 'vue';
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';
import SnSwiper from '@snui/uni-src/components/sn-swiper/sn-swiper.vue';
import { getCapsuleMetrics } from '../common/capsule';
import { BadgeCheckIcon, HeadsetIcon, StoreIcon } from '../common/icons';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MoreHorizontal,
  Search,
  Share2,
  Star,
  User,
  Zap,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';

const capsule = getCapsuleMetrics();
const navStyle = computed(() => ({
  height: `${capsule.navBarHeight}px`,
  paddingRight: capsule.hasCapsule ? `${capsule.capsulePadRight}px` : '16rpx',
}));
const statusStyle = computed(() => ({ height: `${capsule.statusBarHeight}px` }));

/* ── 顶部 Tab ─────────────────────────────────────────────────────────── */
const TABS = ['宝贝', '评价', '详情', '推荐'];
const activeTab = ref(0);

/* ── 主图轮播 ─────────────────────────────────────────────────────────── */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop&q=70',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&q=70',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=70',
];
const heroIndex = ref(0);
/** SnSwiper 的 slide 数据（`value` = 图片地址）。 */
const HERO_SLIDES = HERO_IMAGES.map((value) => ({ value }));
function onHeroSlideTap(payload: { index: number }): void {
  heroIndex.value = payload.index;
  previewHero(payload.index);
}

/* ── 静态内容 ─────────────────────────────────────────────────────────── */
const COUPONS = ['满1500减120', '消费券可叠', '淘金币抵¥41.97'];
const SERVICES = ['假一赔四', '极速退款', '7天无理由退货', '全国联保'];
const REVIEW_TAGS = ['降噪绝了(4,210)', '正品行货(3,180)', '音质震撼(2,090)', '佩戴舒适(940)'];
const REVIEW_IMAGES = [
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=320&h=320&fit=crop&q=70',
  'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=320&h=320&fit=crop&q=70',
  'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=320&h=320&fit=crop&q=70',
];
const QA_LIST = [
  {
    q: '降噪在嘈杂的高铁和地铁上效果明显吗？',
    a: '基本听不见车轮轰鸣声，只剩下极轻的人声广播，开降噪听播客超清晰！',
  },
  {
    q: '确定是正品国行吗？有没有保修凭证？',
    a: '官方自营的正品行货，随箱开具电子发票，全国联保无压力。',
  },
];
const STORE_METRICS = [
  { label: '宝贝描述', score: '4.9' },
  { label: '卖家服务', score: '4.9' },
  { label: '物流服务', score: '4.9' },
];
const DETAIL_BLOCKS = [
  {
    img: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=560&h=420&fit=crop&q=70',
    title: 'Apple 专属定制 H2 芯片',
    sub: '计算音频引擎打造出众的主动降噪表现与更强三维空间音频',
    accent: '#785a00',
    label: '2倍降噪能效提升',
    body: '协同麦克风与声学网罩在嘈杂环境里以极高频次监测外部杂音，精准发出反向抗噪声波，无论是机舱引擎还是城市街道轰鸣，一键开启即刻沉浸清净音乐空间。',
  },
  {
    img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=560&h=420&fit=crop&q=70',
    title: 'USB-C 通用接口升级',
    sub: '一根通用线缆兼容 iPhone、Mac 与 iPad 充放电',
    accent: '#bb0022',
    label: '单次充电聆听可达 6 小时',
    body: '开启主动降噪下单次续航可达6小时，配合 MagSafe 充电盒综合续航长达30小时。全新内置扬声器与挂绳孔，随时查找不丢失。',
  },
];
const SKU_IMAGE =
  'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120&h=120&fit=crop&q=70';

/* ── 交互 ─────────────────────────────────────────────────────────────── */
const favorited = ref(true);
function toast(text: string): void {
  uni.showToast({ title: text, icon: 'none' });
}
function addToCart(): void {
  uni.showToast({ title: '已加入购物车', icon: 'success' });
}
function buyNow(): void {
  uni.showToast({ title: '跳转收银台', icon: 'none' });
}
function toggleFavorite(): void {
  favorited.value = !favorited.value;
  toast(favorited.value ? '已收藏宝贝' : '已取消收藏');
}
function previewHero(index: number): void {
  uni.previewImage({ urls: HERO_IMAGES, current: HERO_IMAGES[index] });
}
function previewReviews(index: number): void {
  uni.previewImage({ urls: REVIEW_IMAGES, current: REVIEW_IMAGES[index] });
}
function goBack(): void {
  uni.navigateBack();
}
</script>

<template>
  <view class="goods-page">
    <SnPaging
      :auto="false"
      :refresher-enabled="false"
      :load-more-enabled="false"
      custom-style="background-color: #f9f9fb;"
    >
      <!-- ═══ #top：状态栏 + 导航行 + 页内 Tab ═══ -->
      <template #top>
        <view class="goods-chrome">
          <view class="goods-status" :style="statusStyle" aria-hidden="true" />
          <view class="goods-nav">
            <view class="goods-nav__row" :style="navStyle">
              <view class="goods-nav__back" role="button" aria-label="返回" @tap="goBack">
                <SnIcon :icon="ChevronLeft" size="44rpx" color="#1a1c1d" />
              </view>
              <scroll-view class="goods-nav__tabs" scroll-x :show-scrollbar="false">
                <view class="goods-nav__tabs-track">
                  <view
                    v-for="(t, i) in TABS"
                    :key="t"
                    class="goods-tab"
                    :class="{ 'is-active': activeTab === i }"
                    @tap="activeTab = i"
                  >
                    <text class="goods-tab__text">{{ t }}</text>
                  </view>
                </view>
              </scroll-view>
              <view class="goods-nav__acts">
                <view class="goods-nav__act" role="button" aria-label="搜索" @tap="toast('搜索')">
                  <SnIcon :icon="Search" size="38rpx" color="#1a1c1d" />
                </view>
                <view class="goods-nav__act" role="button" aria-label="分享" @tap="toast('分享')">
                  <SnIcon :icon="Share2" size="38rpx" color="#1a1c1d" />
                </view>
                <view class="goods-nav__act" role="button" aria-label="更多" @tap="toast('更多')">
                  <SnIcon :icon="MoreHorizontal" size="38rpx" color="#1a1c1d" />
                </view>
                <view class="goods-nav__avatar">
                  <SnIcon :icon="User" size="32rpx" color="#ffffff" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <!-- ═══ 详情内容 ═══ -->
      <view class="goods-body">
        <!-- 主图轮播：SnSwiper（图片模式 / 循环 / 当前页 v-model 全走组件契约） -->
        <view class="goods-hero">
          <SnSwiper
            class="goods-hero__swiper"
            :list="HERO_SLIDES"
            image-mode="aspectFit"
            height="750rpx"
            :loop="true"
            :indicator="false"
            :current="heroIndex"
            custom-style="width: 100%; height: 100%;"
            @update:current="heroIndex = $event"
            @click="onHeroSlideTap"
          />
          <view class="goods-hero__video">
            <SnIcon :icon="Zap" size="28rpx" color="#ffffff" />
            <text class="goods-hero__video-text">3D全景视频</text>
          </view>
          <view class="goods-hero__auth">
            <SnIcon :icon="BadgeCheckIcon" size="24rpx" color="#bb0025" />
            <text class="goods-hero__auth-text">官方正品 · 假一赔四</text>
          </view>
          <view class="goods-hero__count">
            <text class="goods-hero__count-text">{{ heroIndex + 1 }} / {{ HERO_IMAGES.length }}</text>
          </view>
        </view>

        <!-- 百亿补贴横幅 -->
        <view class="goods-subsidy">
          <view class="goods-subsidy__left">
            <view class="goods-subsidy__tags">
              <view class="goods-subsidy__brand">
                <SnIcon :icon="Zap" size="26rpx" color="#bb0025" />
                <text class="goods-subsidy__brand-text">百亿补贴</text>
              </view>
              <view class="goods-subsidy__off">
                <text class="goods-subsidy__off-text">官方立减¥500</text>
              </view>
            </view>
            <view class="goods-subsidy__price">
              <text class="goods-subsidy__price-label">券后到手价</text>
              <text class="goods-subsidy__currency">¥</text>
              <text class="goods-subsidy__amount">1,399</text>
              <text class="goods-subsidy__orig">¥1899</text>
            </view>
          </view>
          <view class="goods-subsidy__right">
            <text class="goods-subsidy__timer-label">距结束仅剩</text>
            <view class="goods-subsidy__timer">
              <text class="goods-subsidy__timer-chip">05</text>
              <text class="goods-subsidy__timer-colon">:</text>
              <text class="goods-subsidy__timer-chip">24</text>
              <text class="goods-subsidy__timer-colon">:</text>
              <text class="goods-subsidy__timer-chip">18</text>
            </view>
            <SnProgress
              class="goods-subsidy__track"
              :percentage="86"
              hide-text
              color="#ffddb5"
              custom-style="width: 160rpx; margin-top: 12rpx; --sn-mp-color-background-subtle: rgba(47, 49, 50, 0.3);"
            />
            <text class="goods-subsidy__sold">已抢购86%</text>
          </view>
        </view>

        <!-- 标题 + 榜单 + 优惠券 -->
        <view class="goods-card">
          <view class="goods-title-row">
            <text class="goods-title">
              <text class="goods-title__badge">天猫自营</text>
              Apple/苹果 AirPods Pro (第二代) 配备USB-C接口 MagSafe无线充电盒 H2芯片 主动降噪入耳式蓝牙无线耳机
            </text>
            <view class="goods-help" @tap="toast('帮我选')">
              <SnIcon :icon="Star" size="40rpx" color="#a83200" />
              <text class="goods-help__text">帮我选</text>
            </view>
          </view>

          <view class="goods-rank">
            <view class="goods-rank__left">
              <SnIcon :icon="BadgeCheckIcon" size="30rpx" color="#a83200" />
              <text class="goods-rank__text">主动降噪耳机热卖榜 · 第1名</text>
            </view>
            <text class="goods-rank__sold">月销 5万+</text>
          </view>

          <view class="goods-coupons">
            <view class="goods-coupons__list">
              <view v-for="c in COUPONS" :key="c" class="goods-coupon">
                <text class="goods-coupon__text">{{ c }}</text>
              </view>
            </view>
            <view class="goods-coupons__more" @tap="toast('领券')">
              <text class="goods-coupons__more-text">领券</text>
              <SnIcon :icon="ChevronRight" size="28rpx" color="#a83200" />
            </view>
          </view>
        </view>

        <!-- 履约保障 -->
        <view class="goods-card">
          <view class="goods-row" @tap="toast('配送地址')">
            <text class="goods-row__label">发货</text>
            <view class="goods-row__main">
              <view class="goods-row__line">
                <text class="goods-row__strong">现货</text>
                <text class="goods-row__value">24小时内闪电发货 · 顺丰速运包邮次日达</text>
              </view>
              <text class="goods-row__sub">配送至 浙江省 杭州市 余杭区 文一西路969号</text>
            </view>
            <SnIcon :icon="ChevronRight" size="30rpx" color="#917065" />
          </view>
          <view class="goods-row" @tap="toast('服务保障')">
            <text class="goods-row__label">保障</text>
            <view class="goods-row__main goods-row__main--inline">
              <view v-for="s in SERVICES" :key="s" class="goods-service">
                <view class="goods-service__dot" />
                <text class="goods-service__text">{{ s }}</text>
              </view>
            </view>
            <SnIcon :icon="ChevronRight" size="30rpx" color="#917065" />
          </view>
          <view class="goods-row" @tap="toast('选择规格')">
            <text class="goods-row__label">选择</text>
            <view class="goods-row__main goods-row__main--inline">
              <view class="goods-sku-thumb">
                <SnImg :src="SKU_IMAGE" mode="aspectFit" width="100%" height="100%" />
              </view>
              <text class="goods-row__value">已选：USB-C充电盒版，白色，1件</text>
              <view class="goods-sku-count">
                <text class="goods-sku-count__text">共2种配置可选</text>
              </view>
            </view>
            <SnIcon :icon="ChevronRight" size="30rpx" color="#917065" />
          </view>
          <view class="goods-row" @tap="toast('参数')">
            <text class="goods-row__label">参数</text>
            <view class="goods-row__main">
              <text class="goods-row__value goods-row__value--truncate">
                蓝牙5.3 · H2芯片 · 主动降噪 · IP54抗汗抗水
              </text>
            </view>
            <SnIcon :icon="ChevronRight" size="30rpx" color="#917065" />
          </view>
        </view>

        <!-- 宝贝评价 -->
        <view class="goods-card">
          <view class="goods-sec-head">
            <view class="goods-sec-head__left">
              <text class="goods-sec-head__title">宝贝评价 (2.4万+)</text>
              <text class="goods-sec-head__accent">98.6% 好评</text>
            </view>
            <view class="goods-sec-head__more" @tap="toast('查看全部评价')">
              <text class="goods-sec-head__more-text">查看全部</text>
              <SnIcon :icon="ChevronRight" size="28rpx" color="#5c4037" />
            </view>
          </view>

          <scroll-view class="goods-review-tags" scroll-x :show-scrollbar="false">
            <view class="goods-review-tags__track">
              <view v-for="t in REVIEW_TAGS" :key="t" class="goods-review-tag">
                <text class="goods-review-tag__text">{{ t }}</text>
              </view>
            </view>
          </scroll-view>

          <view class="goods-review">
            <view class="goods-review__head">
              <view class="goods-review__user">
                <view class="goods-review__avatar">
                  <text class="goods-review__avatar-text">林*</text>
                </view>
                <view class="goods-review__meta">
                  <view class="goods-review__name-row">
                    <text class="goods-review__name">林***9</text>
                    <view class="goods-review__vip">
                      <text class="goods-review__vip-text">88VIP</text>
                    </view>
                  </view>
                  <text class="goods-review__spec">规格：白色 USB-C充电盒款</text>
                </view>
              </view>
              <SnRate
                class="goods-review__stars"
                :model-value="5"
                readonly
                size="28rpx"
                :space="4"
                active-color="#a83200"
                custom-style="flex-shrink: 0;"
              />
            </view>
            <text class="goods-review__text">
              天猫自营验过了确实是全新未激活国行正品！在苹果官网查序列号保修期一天不差。开盖秒弹窗，在早高峰地铁体验降噪简直进入了另一个静音世界，USB-C接口出门终于不用带Lighting线了，充电超方便！
            </text>
            <view class="goods-review__photos">
              <view
                v-for="(img, i) in REVIEW_IMAGES"
                :key="img"
                class="goods-review__photo"
                @tap="previewReviews(i)"
              >
                <SnImg :src="img" mode="aspectFill" width="100%" height="100%" radius="12" />
                <view v-if="i === REVIEW_IMAGES.length - 1" class="goods-review__photo-count">
                  <text class="goods-review__photo-count-text">共4张</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 问大家 -->
        <view class="goods-card">
          <view class="goods-sec-head">
            <view class="goods-sec-head__left">
              <text class="goods-sec-head__title">问大家 (890条)</text>
              <view class="goods-sec-head__hint">
                <text class="goods-sec-head__hint-text">真实买家解答</text>
              </view>
            </view>
            <view class="goods-sec-head__more" @tap="toast('全部问题')">
              <text class="goods-sec-head__more-text">全部问题</text>
              <SnIcon :icon="ChevronRight" size="28rpx" color="#5c4037" />
            </view>
          </view>
          <view class="goods-qa">
            <view v-for="item in QA_LIST" :key="item.q" class="goods-qa__item">
              <view class="goods-qa__badge goods-qa__badge--q">
                <text class="goods-qa__badge-text">问</text>
              </view>
              <view class="goods-qa__body">
                <text class="goods-qa__q">{{ item.q }}</text>
                <view class="goods-qa__answer">
                  <view class="goods-qa__badge goods-qa__badge--a">
                    <text class="goods-qa__badge-text goods-qa__badge-text--dark">答</text>
                  </view>
                  <text class="goods-qa__a">{{ item.a }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 店铺信息 -->
        <view class="goods-card">
          <view class="goods-store">
            <view class="goods-store__brand">
              <view class="goods-store__logo">
                <SnIcon :icon="StoreIcon" size="64rpx" color="#1a1c1d" />
              </view>
              <view class="goods-store__meta">
                <view class="goods-store__name-row">
                  <text class="goods-store__name">Apple 官方旗舰店</text>
                  <view class="goods-store__official">
                    <text class="goods-store__official-text">官方自营</text>
                  </view>
                </view>
                <view class="goods-store__sub">
                  <text class="goods-store__gold">天猫金牌好店</text>
                  <text class="goods-store__fans">粉丝 1,980万</text>
                </view>
              </view>
            </view>
            <view class="goods-store__acts">
              <view class="goods-store__act" @tap="toast('全部宝贝')">
                <text class="goods-store__act-text">全部宝贝</text>
              </view>
              <view class="goods-store__act goods-store__act--primary" @tap="toast('进店逛逛')">
                <text class="goods-store__act-text goods-store__act-text--on">进店逛逛</text>
              </view>
            </view>
          </view>
          <view class="goods-store__metrics">
            <view v-for="m in STORE_METRICS" :key="m.label" class="goods-store__metric">
              <text class="goods-store__metric-label">{{ m.label }}</text>
              <view class="goods-store__metric-score">
                <text class="goods-store__metric-value">{{ m.score }}</text>
                <text class="goods-store__metric-up">高</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 图文详情 -->
        <view class="goods-detail">
          <SnDivider
            content-position="center"
            color="#e5beb2"
            custom-style="padding: 8rpx 0; --sn-mp-color-text-secondary: #5c4037; --sn-mp-color-background-surface: #f9f9fb;"
          >图文详情</SnDivider>

          <view v-for="b in DETAIL_BLOCKS" :key="b.title" class="goods-detail__block">
            <view class="goods-detail__media">
              <SnImg :src="b.img" mode="aspectFill" width="100%" height="100%" />
              <view class="goods-detail__caption">
                <text class="goods-detail__caption-title">{{ b.title }}</text>
                <text class="goods-detail__caption-sub">{{ b.sub }}</text>
              </view>
            </view>
            <view class="goods-detail__body">
              <text class="goods-detail__label" :style="{ color: b.accent }">{{ b.label }}</text>
              <text class="goods-detail__text">{{ b.body }}</text>
            </view>
          </view>

          <text class="goods-detail__disclaimer">
            价格说明：标价为商品的专柜价、吊牌价或厂商指导价；到手价为扣减所有平台优惠、满减活动后的预估实付金额。
          </text>
        </view>
      </view>

      <!-- ═══ #bottom：购买操作栏 ═══ -->
      <template #bottom>
        <view class="goods-actionbar">
          <view class="goods-actionbar__icons">
            <view class="goods-actionbar__icon" @tap="toast('店铺')">
              <SnIcon :icon="StoreIcon" size="36rpx" color="#5c4037" />
              <text class="goods-actionbar__icon-text">店铺</text>
            </view>
            <view class="goods-actionbar__icon" @tap="toast('联系客服')">
              <SnIcon :icon="HeadsetIcon" size="36rpx" color="#5c4037" />
              <text class="goods-actionbar__icon-text">客服</text>
            </view>
            <view class="goods-actionbar__icon" @tap="toggleFavorite">
              <SnIcon :icon="Heart" size="36rpx" :color="favorited ? '#bb0025' : '#5c4037'" />
              <text
                class="goods-actionbar__icon-text"
                :class="{ 'goods-actionbar__icon-text--on': favorited }"
              >{{ favorited ? '已收藏' : '收藏' }}</text>
            </view>
          </view>
          <view class="goods-actionbar__buy">
            <view class="goods-actionbar__cart" @tap="addToCart">
              <text class="goods-actionbar__cart-text">加入购物车</text>
              <text class="goods-actionbar__cart-sub">券后立减¥20</text>
            </view>
            <view class="goods-actionbar__now" @tap="buyNow">
              <text class="goods-actionbar__now-text">立即购买</text>
              <text class="goods-actionbar__now-sub">到手价¥199</text>
            </view>
          </view>
        </view>
      </template>
    </SnPaging>
  </view>
</template>

<style scoped>
.goods-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9f9fb;
}

/* ── 顶部导航 ─────────────────────────────────────────────────────────── */
.goods-chrome {
  flex-shrink: 0;
  background: rgba(249, 249, 251, 0.94);
  box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.04);
}
.goods-status {
  background: rgba(249, 249, 251, 0.94);
}
.goods-nav__row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-left: 8rpx;
  box-sizing: border-box;
}
.goods-nav__back {
  width: 76rpx;
  height: 76rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
}
.goods-nav__tabs {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
}
.goods-nav__tabs-track {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
}
.goods-tab {
  flex-shrink: 0;
  padding: 8rpx 16rpx;
}
.goods-tab__text {
  color: #5c4037;
  font-size: 26rpx;
  font-weight: 600;
}
.goods-tab.is-active .goods-tab__text {
  color: #a83200;
  font-weight: 700;
}
.goods-nav__acts {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}
.goods-nav__act {
  width: 76rpx;
  height: 76rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
}
.goods-nav__avatar {
  width: 60rpx;
  height: 60rpx;
  margin-left: 6rpx;
  border-radius: 50%;
  background: #a83200;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── 内容区 ───────────────────────────────────────────────────────────── */
.goods-body {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding-bottom: 24rpx;
}

/* 主图 */
.goods-hero {
  position: relative;
  width: 100%;
  height: 750rpx;
  background: #ffffff;
}
.goods-hero__swiper {
  width: 100%;
  height: 100%;
}
.goods-hero__video {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(47, 49, 50, 0.6);
}
.goods-hero__video-text {
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 700;
  letter-spacing: 0.06em;
}
.goods-hero__auth {
  position: absolute;
  bottom: 20rpx;
  left: 20rpx;
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.92);
}
.goods-hero__auth-text {
  color: #1a1c1d;
  font-size: 20rpx;
  font-weight: 700;
}
.goods-hero__count {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  padding: 6rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(47, 49, 50, 0.65);
}
.goods-hero__count-text {
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 600;
}

/* 百亿补贴 */
.goods-subsidy {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 28rpx;
  background: linear-gradient(90deg, #e90030 0%, #d34100 55%, #a83200 100%);
}
.goods-subsidy__left {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.goods-subsidy__tags {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.goods-subsidy__brand {
  display: flex;
  align-items: center;
  gap: 2rpx;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  background: #ffffff;
}
.goods-subsidy__brand-text {
  color: #bb0025;
  font-size: 20rpx;
  font-weight: 800;
}
.goods-subsidy__off {
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
  background: rgba(187, 0, 37, 0.4);
}
.goods-subsidy__off-text {
  color: #ffffff;
  font-size: 18rpx;
}
.goods-subsidy__price {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  margin-top: 8rpx;
}
.goods-subsidy__price-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 20rpx;
  font-weight: 700;
}
.goods-subsidy__currency {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
}
.goods-subsidy__amount {
  color: #ffffff;
  font-size: 56rpx;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}
.goods-subsidy__orig {
  margin-left: 8rpx;
  color: rgba(255, 255, 255, 0.75);
  font-size: 22rpx;
  text-decoration: line-through;
}
.goods-subsidy__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  padding-left: 16rpx;
}
.goods-subsidy__timer-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18rpx;
}
.goods-subsidy__timer {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-top: 4rpx;
}
.goods-subsidy__timer-chip {
  padding: 2rpx 8rpx;
  border-radius: 6rpx;
  background: rgba(47, 49, 50, 0.85);
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 700;
}
.goods-subsidy__timer-colon {
  color: #ffffff;
  font-size: 20rpx;
}
.goods-subsidy__sold {
  margin-top: 4rpx;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18rpx;
}

/* 通用卡片 */
.goods-card {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin: 0 16rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

/* 标题 */
.goods-title-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}
.goods-title {
  flex: 1;
  min-width: 0;
  color: #1a1c1d;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.35;
}
.goods-title__badge {
  display: inline-block;
  margin-right: 8rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: #bb0025;
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 700;
  vertical-align: middle;
}
.goods-help {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.goods-help__text {
  margin-top: 2rpx;
  color: #a83200;
  font-size: 18rpx;
  font-weight: 700;
}

/* 榜单 */
.goods-rank {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
  background: #f3f3f5;
}
.goods-rank__left {
  display: flex;
  align-items: center;
  gap: 6rpx;
  min-width: 0;
}
.goods-rank__text {
  color: #a83200;
  font-size: 20rpx;
  font-weight: 700;
}
.goods-rank__sold {
  color: #5c4037;
  font-size: 20rpx;
  flex-shrink: 0;
}

/* 优惠券 */
.goods-coupons {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.goods-coupons__list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  min-width: 0;
}
.goods-coupon {
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: #ffdad8;
}
.goods-coupon__text {
  color: #bb0025;
  font-size: 18rpx;
  font-weight: 500;
}
.goods-coupons__more {
  display: flex;
  align-items: center;
  gap: 2rpx;
  flex-shrink: 0;
}
.goods-coupons__more-text {
  color: #a83200;
  font-size: 22rpx;
  font-weight: 600;
}

/* 履约行 */
.goods-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}
.goods-row__label {
  width: 72rpx;
  flex-shrink: 0;
  color: #5c4037;
  font-size: 22rpx;
  font-weight: 600;
  line-height: 1.5;
}
.goods-row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.goods-row__main--inline {
  flex-direction: row;
  align-items: center;
  gap: 8rpx;
  overflow: hidden;
}
.goods-row__line {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.goods-row__strong {
  color: #a83200;
  font-size: 22rpx;
  font-weight: 700;
}
.goods-row__value {
  flex: 1;
  min-width: 0;
  color: #1a1c1d;
  font-size: 22rpx;
  line-height: 1.5;
}
.goods-row__value--truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.goods-row__sub {
  color: #5c4037;
  font-size: 20rpx;
}
.goods-service {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}
.goods-service__dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #bb0025;
}
.goods-service__text {
  color: #1a1c1d;
  font-size: 20rpx;
}
.goods-sku-thumb {
  width: 56rpx;
  height: 56rpx;
  flex-shrink: 0;
  border-radius: 8rpx;
  background: #f3f3f5;
  overflow: hidden;
}
.goods-sku-count {
  flex-shrink: 0;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: #e8e8ea;
}
.goods-sku-count__text {
  color: #5c4037;
  font-size: 18rpx;
}

/* 区块标题 */
.goods-sec-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods-sec-head__left {
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}
.goods-sec-head__title {
  color: #1a1c1d;
  font-size: 28rpx;
  font-weight: 700;
}
.goods-sec-head__accent {
  color: #bb0025;
  font-size: 20rpx;
  font-weight: 600;
}
.goods-sec-head__hint {
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: #f3f3f5;
}
.goods-sec-head__hint-text {
  color: #5c4037;
  font-size: 18rpx;
}
.goods-sec-head__more {
  display: flex;
  align-items: center;
  gap: 2rpx;
  flex-shrink: 0;
}
.goods-sec-head__more-text {
  color: #5c4037;
  font-size: 20rpx;
}

/* 评价 */
.goods-review-tags {
  width: 100%;
  white-space: nowrap;
}
.goods-review-tags__track {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
}
.goods-review-tag {
  flex-shrink: 0;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  background: #f3f3f5;
}
.goods-review-tag__text {
  color: #1a1c1d;
  font-size: 18rpx;
}
.goods-review {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.goods-review__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.goods-review__user {
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-width: 0;
}
.goods-review__avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #ffdbd0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.goods-review__avatar-text {
  color: #390b00;
  font-size: 20rpx;
  font-weight: 700;
}
.goods-review__meta {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  min-width: 0;
}
.goods-review__name-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.goods-review__name {
  color: #1a1c1d;
  font-size: 22rpx;
  font-weight: 600;
}
.goods-review__vip {
  padding: 0 6rpx;
  border-radius: 4rpx;
  background: #ffddb5;
}
.goods-review__vip-text {
  color: #633f01;
  font-size: 16rpx;
}
.goods-review__spec {
  color: #5c4037;
  font-size: 18rpx;
}
.goods-review__stars {
  flex-shrink: 0;
}
.goods-review__text {
  color: #1a1c1d;
  font-size: 24rpx;
  line-height: 1.6;
}
.goods-review__photos {
  display: flex;
  gap: 8rpx;
}
.goods-review__photo {
  position: relative;
  flex: 1;
  height: 200rpx;
  border-radius: 12rpx;
  background: #f3f3f5;
  overflow: hidden;
}
.goods-review__photo-count {
  position: absolute;
  right: 6rpx;
  bottom: 6rpx;
  padding: 0 8rpx;
  border-radius: 6rpx;
  background: rgba(47, 49, 50, 0.75);
}
.goods-review__photo-count-text {
  color: #ffffff;
  font-size: 16rpx;
}

/* 问大家 */
.goods-qa {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.goods-qa__item {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  padding: 14rpx;
  border-radius: 14rpx;
  background: #f9f9fb;
}
.goods-qa__badge {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4rpx;
}
.goods-qa__badge--q {
  background: #bb0025;
}
.goods-qa__badge--a {
  width: 28rpx;
  height: 28rpx;
  background: #ffddb5;
}
.goods-qa__badge-text {
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 700;
}
.goods-qa__badge-text--dark {
  color: #2a1800;
  font-size: 16rpx;
}
.goods-qa__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.goods-qa__q {
  color: #1a1c1d;
  font-size: 22rpx;
  font-weight: 600;
  line-height: 1.5;
}
.goods-qa__answer {
  display: flex;
  align-items: flex-start;
  gap: 6rpx;
}
.goods-qa__a {
  flex: 1;
  min-width: 0;
  color: #5c4037;
  font-size: 20rpx;
  line-height: 1.5;
}

/* 店铺 */
.goods-store {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}
.goods-store__brand {
  display: flex;
  align-items: center;
  gap: 16rpx;
  min-width: 0;
}
.goods-store__logo {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #e8e8ea;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.goods-store__meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}
.goods-store__name-row {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.goods-store__name {
  color: #1a1c1d;
  font-size: 26rpx;
  font-weight: 700;
}
.goods-store__official {
  padding: 0 6rpx;
  border-radius: 4rpx;
  background: #bb0025;
}
.goods-store__official-text {
  color: #ffffff;
  font-size: 16rpx;
}
.goods-store__sub {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.goods-store__gold {
  color: #7c5417;
  font-size: 20rpx;
  font-weight: 500;
}
.goods-store__fans {
  color: #5c4037;
  font-size: 20rpx;
}
.goods-store__acts {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex-shrink: 0;
}
.goods-store__act {
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  background: #f3f3f5;
}
.goods-store__act--primary {
  background: #a83200;
}
.goods-store__act-text {
  color: #1a1c1d;
  font-size: 22rpx;
}
.goods-store__act-text--on {
  color: #ffffff;
  font-weight: 600;
}
.goods-store__metrics {
  display: flex;
  padding: 12rpx 0;
  border-radius: 14rpx;
  background: #f9f9fb;
}
.goods-store__metric {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.goods-store__metric-label {
  color: #5c4037;
  font-size: 20rpx;
}
.goods-store__metric-score {
  display: flex;
  align-items: center;
  gap: 2rpx;
}
.goods-store__metric-value {
  color: #bb0025;
  font-size: 24rpx;
  font-weight: 700;
}
.goods-store__metric-up {
  color: #bb0025;
  font-size: 18rpx;
}

/* 图文详情 */
.goods-detail {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin: 8rpx 16rpx 0;
}
.goods-detail__block {
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.goods-detail__media {
  position: relative;
  width: 100%;
  height: 560rpx;
  background: #2f3132;
  overflow: hidden;
}
.goods-detail__caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  padding: 20rpx 24rpx;
  background: linear-gradient(0deg, rgba(47, 49, 50, 0.92) 0%, rgba(47, 49, 50, 0) 100%);
}
.goods-detail__caption-title {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
}
.goods-detail__caption-sub {
  color: rgba(255, 255, 255, 0.9);
  font-size: 22rpx;
}
.goods-detail__body {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  padding: 24rpx;
}
.goods-detail__label {
  font-size: 22rpx;
  font-weight: 700;
}
.goods-detail__text {
  color: #5c4037;
  font-size: 24rpx;
  line-height: 1.7;
}
.goods-detail__disclaimer {
  padding: 16rpx 24rpx 24rpx;
  color: #917065;
  font-size: 18rpx;
  line-height: 1.6;
  text-align: center;
}

/* ── 底部购买栏 ───────────────────────────────────────────────────────── */
.goods-actionbar {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 16rpx calc(12rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
.goods-actionbar__icons {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}
.goods-actionbar__icon {
  width: 88rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rpx;
}
.goods-actionbar__icon-text {
  color: #5c4037;
  font-size: 18rpx;
}
.goods-actionbar__icon-text--on {
  color: #bb0025;
}
.goods-actionbar__buy {
  flex: 1;
  min-width: 0;
  display: flex;
  height: 80rpx;
  border-radius: 999rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(168, 50, 0, 0.2);
}
.goods-actionbar__cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #ff9000 0%, #ff5000 100%);
}
.goods-actionbar__cart-text {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1.1;
}
.goods-actionbar__cart-sub {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16rpx;
  line-height: 1.2;
}
.goods-actionbar__now {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #ff5000 0%, #ff0036 100%);
}
.goods-actionbar__now-text {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1.1;
}
.goods-actionbar__now-sub {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16rpx;
  line-height: 1.2;
}
</style>
