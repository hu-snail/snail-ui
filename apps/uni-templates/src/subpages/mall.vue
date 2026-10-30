<script setup lang="ts">
/**
 * 模板：商城首页 —— 黄色沉浸头 + 金刚区 + 神券/秒杀营销区 + 频道胶囊 + 双列瀑布流。
 *
 * 结构：sn-paging 根容器（#top 固定「状态栏 + 导航行」，#bottom 底部标签栏，
 * 默认插槽滚动内容）。微信小程序端导航行按胶囊几何让位（common/capsule）：
 * 行高取胶囊居中带反推值，右侧留出胶囊宽度，右上角头像仅在无胶囊端渲染。
 */
import { computed, onUnmounted, ref } from 'vue';
import SnCountDown from '@snui/uni-src/components/sn-count-down/sn-count-down.vue';
import SnGrid from '@snui/uni-src/components/sn-grid/sn-grid.vue';
import SnGridItem from '@snui/uni-src/components/sn-grid/sn-grid-item.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';
import SnSticky from '@snui/uni-src/components/sn-sticky/sn-sticky.vue';
import SnTabbar from '@snui/uni-src/components/sn-tabbar/sn-tabbar.vue';
import SnTabbarItem from '@snui/uni-src/components/sn-tabbar/sn-tabbar-item.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
import {
  BedDoubleIcon,
  BikeIcon,
  CarIcon,
  ClapperboardIcon,
  CrossIcon,
  FlameIcon,
  LayoutGridIcon,
  QuoteIcon,
  ScanLineIcon,
  ScissorsIcon,
  SunIcon,
  TicketIcon,
  UtensilsIcon,
} from '../common/icons';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Star,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';
import { getCapsuleMetrics } from '../common/capsule';

/* ── 胶囊几何（H5 无胶囊：行高 44px、右侧不预留、头像正常渲染） ───────── */
const capsule = getCapsuleMetrics();
const navStyle = computed(() => ({
  height: `${capsule.navBarHeight}px`,
  paddingRight: capsule.hasCapsule ? `${capsule.capsulePadRight}px` : '24rpx',
}));
const statusStyle = computed(() => ({ height: `${capsule.statusBarHeight}px` }));

/* ── 顶部搜索热词轮播（3.2s 步进，与参考稿一致） ─────────────────────── */
const TICKER_WORDS = [
  '霸王茶姬买一送一 · 满30减15',
  '冰镇无籽麒麟西瓜 9.9元整颗',
  '海底捞外送全单立减20元',
];
const tickerIndex = ref(0);
const tickerTimer = setInterval(() => {
  tickerIndex.value = (tickerIndex.value + 1) % TICKER_WORDS.length;
}, 3200);
onUnmounted(() => clearInterval(tickerTimer));

const HOT_PILLS = ['瑞幸咖啡', '小龙虾烧烤', '汉堡王半价', '鲜花特惠', '24h急送药', '奈雪的茶'];
/** 搜索关键词（sn-search v-model）。 */
const keyword = ref('');

/* ── 金刚区 2×5 ───────────────────────────────────────────────────────── */
const CATS = [
  { label: '外卖', icon: BikeIcon, bg: '#ffc300', color: '#111111', badge: '热卖' },
  { label: '美食团购', icon: UtensilsIcon, bg: '#ffbf8a', color: '#834700', badge: '-15元' },
  { label: '酒店民宿', icon: BedDoubleIcon, bg: '#ffdf9a', color: '#251a00', badge: '' },
  { label: '休闲娱乐', icon: TicketIcon, bg: '#ffdad8', color: '#410006', badge: '' },
  { label: '电影演出', icon: ClapperboardIcon, bg: '#eae7e7', color: '#4f4632', badge: '' },
  { label: '美团买菜', icon: ShoppingBag, bg: '#ffdcc2', color: '#6d3a00', badge: '30分达' },
  { label: '看病买药', icon: CrossIcon, bg: '#ffdad8', color: '#930019', badge: '24h送' },
  { label: '丽人美发', icon: ScissorsIcon, bg: '#fff3c4', color: '#785a00', badge: '' },
  { label: '骑车打车', icon: CarIcon, bg: '#eae7e7', color: '#4f4632', badge: '' },
  { label: '全部分类', icon: LayoutGridIcon, bg: '#e5e2e1', color: '#4f4632', badge: '' },
];

/* ── 频道胶囊 ─────────────────────────────────────────────────────────── */
const CHANNELS = ['为你推荐', '附近美食', '30分钟即达', '爆品特惠', '周末去哪', '优选好物'];
const activeChannel = ref(0);

/* ── 底部标签栏 ───────────────────────────────────────────────────────── */
const TABS = [
  { label: '首页', icon: 'home', badge: '' },
  { label: '逛逛', icon: 'circle-play', badge: '' },
  { label: '消息', icon: 'message-circle', badge: '3' },
  { label: '购物车', icon: 'shopping-cart', badge: '8' },
  { label: '我的', icon: 'user', badge: '' },
];

/* ── 商品流数据源（sn-paging 分页） ───────────────────────────────────── */
interface FeedBadge {
  text: string;
  tone: 'yellow' | 'red' | 'gray';
}
interface FeedCard {
  id: number;
  img: string;
  /** 左上角促销角标。 */
  corner: string;
  /** 图上履约信息胶囊；amber 为橙底深字。 */
  deliver: string;
  deliverAmber: boolean;
  title: string;
  sub: string;
  /** 买家口碑引用条。 */
  quote: string;
  rating: string;
  sold: string;
  badges: FeedBadge[];
  price: string;
  orig: string;
  action: 'plus' | 'cart' | 'buy';
}

const IMG = {
  chicken: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=480&h=480&fit=crop&q=70',
  grape: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=480&h=480&fit=crop&q=70',
  hotpot: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=480&h=480&fit=crop&q=70',
  tea: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=480&h=480&fit=crop&q=70',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=480&h=480&fit=crop&q=70',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=480&h=480&fit=crop&q=70',
};

const FEED_POOL: FeedCard[] = [
  {
    id: 1,
    img: IMG.chicken,
    corner: '',
    deliver: '美团专送 · 28分',
    deliverAmber: false,
    title: '肯德基（陆家嘴中心店）',
    sub: '',
    quote: '',
    rating: '4.8',
    sold: '月售3000+',
    badges: [
      { text: '起送¥20 免配', tone: 'yellow' },
      { text: '满38减8', tone: 'red' },
    ],
    price: '¥29.9',
    orig: '¥42',
    action: 'plus',
  },
  {
    id: 2,
    img: IMG.grape,
    corner: '特惠秒杀',
    deliver: '最快29分达',
    deliverAmber: true,
    title: '美团买菜 · 优质阳光玫瑰青提 500g',
    sub: '果肉脆甜 · 玫瑰芳香',
    quote: '',
    rating: '',
    sold: '',
    badges: [
      { text: '产地直采', tone: 'gray' },
      { text: '5折限购', tone: 'red' },
    ],
    price: '¥12.9',
    orig: '¥25.8',
    action: 'cart',
  },
  {
    id: 3,
    img: IMG.hotpot,
    corner: '',
    deliver: '国金中心商场 · 680m',
    deliverAmber: false,
    title: '西贝莜面村（国金中心店）',
    sub: '双人经典招牌牛大骨套餐',
    quote: '',
    rating: '4.9',
    sold: '半年售1.2万份',
    badges: [
      { text: '免预约', tone: 'gray' },
      { text: '随时退', tone: 'gray' },
    ],
    price: '¥168',
    orig: '¥248',
    action: 'buy',
  },
  {
    id: 4,
    img: IMG.tea,
    corner: '',
    deliver: '22分钟送达',
    deliverAmber: false,
    title: '霸王茶姬 · 伯牙绝弦大杯',
    sub: '',
    quote: '奶香浓郁，回甘极为明显',
    rating: '',
    sold: '月售2000+',
    badges: [{ text: '冰度自选', tone: 'gray' }],
    price: '¥16.0',
    orig: '¥20',
    action: 'plus',
  },
  {
    id: 5,
    img: IMG.coffee,
    corner: '瑞幸新品',
    deliver: '瑞幸专送 · 19分',
    deliverAmber: false,
    title: '瑞幸咖啡 · 冰吸生椰拿铁',
    sub: '',
    quote: '咖啡浓度刚好，冰块化得慢',
    rating: '',
    sold: '月售6800+',
    badges: [{ text: '9.9元尝新', tone: 'red' }],
    price: '¥9.9',
    orig: '¥26',
    action: 'plus',
  },
  {
    id: 6,
    img: IMG.hotpot,
    corner: '',
    deliver: '3公里内 · 40分',
    deliverAmber: false,
    title: '海底捞外送 · 番茄自助火锅',
    sub: '双人套餐 · 含锅底小料',
    quote: '',
    rating: '4.9',
    sold: '月售1200+',
    badges: [{ text: '满99减20', tone: 'red' }],
    price: '¥158',
    orig: '¥208',
    action: 'buy',
  },
  {
    id: 7,
    img: IMG.burger,
    corner: '',
    deliver: '美团专送 · 35分',
    deliverAmber: false,
    title: '华莱士 · 全鸡汉堡三件套',
    sub: '',
    quote: '',
    rating: '4.6',
    sold: '月售900+',
    badges: [{ text: '满30减6', tone: 'red' }],
    price: '¥25.8',
    orig: '¥48',
    action: 'plus',
  },
  {
    id: 8,
    img: IMG.grape,
    corner: '午后鲜果',
    deliver: '30分钟送达',
    deliverAmber: true,
    title: '喜茶 · 多肉葡萄冰沙',
    sub: '',
    quote: '葡萄果肉超多，微糖少冰',
    rating: '',
    sold: '月售3400+',
    badges: [{ text: '会员9折', tone: 'yellow' }],
    price: '¥19.0',
    orig: '¥29',
    action: 'plus',
  },
];

const list = ref<FeedCard[]>([]);
const paging = ref<InstanceType<typeof SnPaging> | null>(null);

function query(pageNo: number, pageSize: number): void {
  setTimeout(() => {
    paging.value?.completeByTotal(
      FEED_POOL.slice((pageNo - 1) * pageSize, pageNo * pageSize),
      FEED_POOL.length,
    );
  }, 300);
}

/** 真瀑布流：按奇偶拆双列，两列高度互不牵制。 */
const feedColumns = computed<FeedCard[][]>(() => {
  const left: FeedCard[] = [];
  const right: FeedCard[] = [];
  list.value.forEach((card, i) => (i % 2 === 0 ? left : right).push(card));
  return [left, right];
});

/* ── 交互 ─────────────────────────────────────────────────────────────── */
function openGoods(): void {
  uni.navigateTo({ url: '/subpages/goods' });
}
function addCart(name: string): void {
  uni.showToast({ title: `已加购「${name.slice(0, 10)}」`, icon: 'none' });
}
function grabCoupon(): void {
  uni.showToast({ title: '已领取 15 元神券', icon: 'success' });
}
function tapFeature(word: string): void {
  uni.showToast({ title: `「${word}」演示入口`, icon: 'none' });
}
/** 金刚区点击（sn-grid 透出被点项的 index）。 */
function onCatTap(payload: { index: number }): void {
  const cat = CATS[payload.index];
  if (cat) tapFeature(cat.label);
}
/** 搜索确认（sn-search 键盘搜索 / 尾部按钮共用）。 */
function onSearch(value: string): void {
  tapFeature(value === '' ? '搜索' : `搜索 ${value}`);
}
/** 底部标签栏切换（演示页仅提示，不改变路由）。 */
function onTabChange(payload: { value: number | string }): void {
  const tab = TABS[Number(payload.value)];
  if (tab) tapFeature(tab.label);
}
</script>

<template>
  <view class="mall-page">
    <SnPaging
      ref="paging"
      v-model="list"
      :default-page-size="4"
      load-more-no-more-text="已经到底啦 · 下拉刷新探索更多身边超值好店"
      custom-style="background-color: #f7f7f7;"
      empty-text="附近暂无可抢优惠"
      @query="query"
    >
      <!-- ═══ #top：状态栏占位 + 导航行（胶囊让位） ═══ -->
      <template #top>
        <view class="mall-chrome">
          <view class="mall-status" :style="statusStyle" aria-hidden="true" />
          <view class="mall-nav">
            <view class="mall-nav__row" :style="navStyle">
              <view class="mall-nav__place" @tap="tapFeature('切换地址')">
                <SnIcon :icon="MapPin" size="40rpx" color="#111111" />
                <text class="mall-nav__place-text">上海</text>
                <SnIcon :icon="ChevronDown" size="30rpx" color="#111111" />
              </view>
              <view class="mall-nav__search" @tap="tapFeature('奶茶爆款半价')">
                <SnIcon :icon="Search" size="34rpx" color="#666666" />
                <text class="mall-nav__search-text">奶茶爆款半价 · 搜索</text>
              </view>
              <view v-if="!capsule.hasCapsule" class="mall-nav__avatar">
                <SnIcon :icon="User" size="34rpx" color="#ffffff" />
              </view>
            </view>
          </view>
        </view>
      </template>

      <!-- ═══ 滚动内容 ═══ -->
      <view class="mall-body">
        <!-- 黄色沉浸区：地址 / 天气 / 快捷入口 / 搜索 / 热搜 -->
        <view class="mall-hero">
          <view class="mall-hero__meta">
            <view class="mall-hero__addr" @tap="tapFeature('金茂大厦')">
              <SnIcon :icon="MapPin" size="36rpx" color="#111111" />
              <text class="mall-hero__addr-text">金茂大厦 (陆家嘴)</text>
              <SnIcon :icon="ChevronDown" size="28rpx" color="#111111" />
              <view class="mall-hero__weather">
                <SnIcon :icon="SunIcon" size="26rpx" color="#ff8f00" />
                <text class="mall-hero__weather-text">晴 24°C</text>
              </view>
            </view>
            <view class="mall-hero__acts">
              <view
                class="mall-hero__act"
                role="button"
                aria-label="扫一扫"
                @tap="tapFeature('扫一扫')"
              >
                <SnIcon :icon="ScanLineIcon" size="44rpx" color="#111111" />
              </view>
              <view
                class="mall-hero__act mall-hero__act--dot"
                role="button"
                aria-label="消息通知"
                @tap="tapFeature('消息通知')"
              >
                <SnIcon :icon="Bell" size="44rpx" color="#111111" />
              </view>
            </view>
          </view>

          <!-- 全局搜索：sn-search 承载输入与键盘确认，热词轮播作为 placeholder -->
          <SnSearch
            v-model="keyword"
            variant="filled"
            hide-cancel
            :placeholder="TICKER_WORDS[tickerIndex]"
            custom-style="background-color: #ffffff; border-radius: 999rpx; padding: 8rpx 8rpx 8rpx 24rpx;"
            @search="onSearch"
          >
            <template #input-suffix>
              <view class="mall-hero__bar-btn" @click.stop="onSearch(keyword)">
                <text class="mall-hero__bar-btn-text">搜索</text>
              </view>
            </template>
          </SnSearch>

          <scroll-view class="mall-hero__hots" scroll-x :show-scrollbar="false">
            <view class="mall-hero__hots-track">
              <SnTag
                v-for="(w, i) in HOT_PILLS"
                :key="w"
                round
                bg-color="rgba(255, 255, 255, 0.6)"
                :color="i === 0 ? '#e51932' : '#111111'"
                custom-style="margin-right: 16rpx; flex-shrink: 0;"
                @click="tapFeature(w)"
              >
                <template #icon>
                  <SnIcon v-if="i === 0" :icon="FlameIcon" size="26rpx" color="#e51932" />
                </template>
                {{ w }}
              </SnTag>
            </view>
          </scroll-view>
        </view>

        <!-- 金刚区 2×5：sn-grid 布局 + sn-grid-item（圆底与图标走 icon 插槽，角标走 value） -->
        <view class="mall-cats">
          <SnGrid :column="5" icon-size="52rpx" @click="onCatTap">
            <SnGridItem
              v-for="c in CATS"
              :key="c.label"
              :text="c.label"
              :value="c.badge || undefined"
            >
              <template #icon>
                <view class="mall-cat__icon" :style="{ background: c.bg }">
                  <SnIcon :icon="c.icon" size="52rpx" :color="c.color" />
                </view>
              </template>
            </SnGridItem>
          </SnGrid>
        </view>

        <!-- 营销区：天天神券 + 秒杀 / 大牌 -->
        <view class="mall-mkt">
          <view class="mall-mkt__coupon">
            <view class="mall-mkt__coupon-main">
              <view class="mall-mkt__coupon-head">
                <view class="mall-mkt__coupon-chip">
                  <text class="mall-mkt__coupon-chip-text">神券</text>
                </view>
                <text class="mall-mkt__coupon-title">天天神券</text>
              </view>
              <text class="mall-mkt__coupon-desc">全场无门槛立减</text>
              <view class="mall-mkt__coupon-price">
                <text class="mall-mkt__coupon-amount">¥15</text>
                <text class="mall-mkt__coupon-unit">最高立减</text>
              </view>
            </view>
            <view class="mall-mkt__coupon-foot">
              <view class="mall-mkt__countdown">
                <text class="mall-mkt__countdown-label">距结束</text>
                <SnCountDown :time="2 * 3600000 + 18 * 60000 + 45000">
                  <template #default="t">
                    <view class="mall-mkt__countdown-chips">
                      <text class="mall-mkt__countdown-chip">{{
                        String(t.hours).padStart(2, '0')
                      }}</text>
                      <text class="mall-mkt__countdown-colon">:</text>
                      <text class="mall-mkt__countdown-chip">{{
                        String(t.minutes).padStart(2, '0')
                      }}</text>
                      <text class="mall-mkt__countdown-colon">:</text>
                      <text class="mall-mkt__countdown-chip">{{
                        String(t.seconds).padStart(2, '0')
                      }}</text>
                    </view>
                  </template>
                </SnCountDown>
              </view>
              <view class="mall-mkt__grab" @tap="grabCoupon">
                <text class="mall-mkt__grab-text">立即抢券</text>
                <SnIcon :icon="ChevronRight" size="24rpx" color="#ffffff" />
              </view>
            </view>
          </view>

          <view class="mall-mkt__stack">
            <view class="mall-flash">
              <view class="mall-flash__head">
                <view class="mall-flash__title">
                  <SnIcon :icon="ShoppingCart" size="28rpx" color="#ff3141" />
                  <text class="mall-flash__title-text">限时秒杀</text>
                </view>
                <view class="mall-flash__cap">
                  <text class="mall-flash__cap-text">9.9元封顶</text>
                </view>
              </view>
              <view class="mall-flash__row">
                <view class="mall-flash__thumb">
                  <SnImg
                    :src="IMG.coffee"
                    mode="aspectFill"
                    width="100%"
                    height="100%"
                    radius="16"
                  />
                </view>
                <view class="mall-flash__info">
                  <view class="mall-flash__prices">
                    <text class="mall-flash__price">¥9.9</text>
                    <text class="mall-flash__orig">¥28</text>
                  </view>
                  <SnProgress
                    :percentage="86"
                    hide-text
                    color="#ff3141"
                    custom-style="margin-top: 12rpx; --sn-mp-color-background-subtle: #eae7e7;"
                  />
                  <text class="mall-flash__hint">已抢86% · 马上抢光</text>
                </view>
              </view>
            </view>

            <view class="mall-flash">
              <view class="mall-flash__head">
                <text class="mall-flash__title-text">大牌特价</text>
                <text class="mall-flash__save">超值省 ¥32.1</text>
              </view>
              <view class="mall-flash__row">
                <view class="mall-flash__thumb">
                  <SnImg
                    :src="IMG.burger"
                    mode="aspectFill"
                    width="100%"
                    height="100%"
                    radius="16"
                  />
                </view>
                <view class="mall-flash__info">
                  <text class="mall-flash__name">麦当劳 双人经典餐</text>
                  <view class="mall-flash__prices">
                    <text class="mall-flash__price">¥39.9</text>
                    <text class="mall-flash__orig">¥72</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 频道胶囊：sn-sticky 吸顶 + sn-tag 胶囊（active 态由 tag 配色表达） -->
        <SnSticky :offset-top="0" custom-class="mall-channels">
          <scroll-view class="mall-channels__scroll" scroll-x :show-scrollbar="false">
            <view class="mall-channels__track">
              <SnTag
                v-for="(name, i) in CHANNELS"
                :key="name"
                round
                :bg-color="activeChannel === i ? '#ffc300' : '#ffffff'"
                :color="activeChannel === i ? '#251a00' : '#4f4632'"
                custom-style="margin-right: 16rpx; flex-shrink: 0; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);"
                @click="activeChannel = i"
                >{{ name }}</SnTag
              >
            </view>
          </scroll-view>
        </SnSticky>

        <!-- 双列瀑布商品流 -->
        <view class="mall-waterfall">
          <view v-for="(column, col) in feedColumns" :key="col" class="mall-waterfall__col">
            <view v-for="card in column" :key="card.id" class="mall-card" @tap="openGoods">
              <view class="mall-card__media">
                <SnImg :src="card.img" mode="aspectFill" width="100%" height="100%" lazy-load />
                <view v-if="card.corner" class="mall-card__corner">
                  <text class="mall-card__corner-text">{{ card.corner }}</text>
                </view>
                <view
                  class="mall-card__deliver"
                  :class="{ 'mall-card__deliver--amber': card.deliverAmber }"
                >
                  <SnIcon :icon="Clock" size="22rpx" color="#ffffff" />
                  <text class="mall-card__deliver-text">{{ card.deliver }}</text>
                </view>
              </view>
              <view class="mall-card__body">
                <text class="mall-card__title">{{ card.title }}</text>
                <text v-if="card.sub" class="mall-card__sub">{{ card.sub }}</text>
                <view v-if="card.quote" class="mall-card__quote">
                  <SnIcon :icon="QuoteIcon" size="24rpx" color="#ff8f00" />
                  <text class="mall-card__quote-text">{{ card.quote }}</text>
                </view>
                <view v-if="card.rating" class="mall-card__rating">
                  <SnIcon :icon="Star" size="26rpx" color="#ffc300" />
                  <text class="mall-card__rating-score">{{ card.rating }}</text>
                  <text class="mall-card__rating-sold">{{ card.sold }}</text>
                </view>
                <view v-if="card.badges.length" class="mall-card__badges">
                  <view
                    v-for="b in card.badges"
                    :key="b.text"
                    class="mall-card__badge"
                    :class="`mall-card__badge--${b.tone}`"
                  >
                    <text class="mall-card__badge-text">{{ b.text }}</text>
                  </view>
                </view>
                <view class="mall-card__foot">
                  <view class="mall-card__prices">
                    <text class="mall-card__price">{{ card.price }}</text>
                    <text class="mall-card__orig">{{ card.orig }}</text>
                  </view>
                  <view
                    v-if="card.action === 'buy'"
                    class="mall-card__buy"
                    role="button"
                    aria-label="抢购"
                    @tap.stop="addCart(card.title)"
                  >
                    <text class="mall-card__buy-text">抢购</text>
                  </view>
                  <view
                    v-else
                    class="mall-card__plus"
                    role="button"
                    aria-label="加入购物车"
                    @tap.stop="addCart(card.title)"
                  >
                    <SnIcon
                      :icon="card.action === 'cart' ? ShoppingCart : Plus"
                      size="28rpx"
                      color="#251a00"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- ═══ #bottom：底部标签栏 ═══ -->
      <!-- ═══ #bottom：底部标签栏（sn-tabbar，角标由组件渲染） ═══ -->
      <template #bottom>
        <SnTabbar
          :model-value="0"
          safe-area-inset-bottom
          active-color="#111111"
          inactive-color="#9aa0a6"
          custom-style="background-color: #ffffff; box-shadow: 0 -4rpx 24rpx rgba(0, 0, 0, 0.04);"
          @change="onTabChange"
        >
          <SnTabbarItem
            v-for="tab in TABS"
            :key="tab.label"
            :title="tab.label"
            :icon="tab.icon"
            :value="tab.badge || undefined"
          />
        </SnTabbar>
      </template>
    </SnPaging>
  </view>
</template>

<style scoped>
.mall-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f7f7;
}

/* ── #top：状态栏 + 导航行（品牌黄） ──────────────────────────────────── */
.mall-chrome {
  flex-shrink: 0;
  background: #ffc300;
}
.mall-status {
  background: #ffc300;
}
.mall-nav {
  background: #ffc300;
  box-shadow: 0 2rpx 16rpx rgba(255, 195, 0, 0.18);
}
.mall-nav__row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding-left: 24rpx;
  box-sizing: border-box;
}
.mall-nav__place {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}
.mall-nav__place-text {
  color: #111111;
  font-size: 30rpx;
  font-weight: 700;
}
.mall-nav__search {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8rpx;
  height: 64rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.9);
}
.mall-nav__search-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #666666;
  font-size: 24rpx;
}
.mall-nav__avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #785a00;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── 黄色沉浸区 ───────────────────────────────────────────────────────── */
.mall-body {
  padding-bottom: 24rpx;
}
.mall-hero {
  background: #ffc300;
  padding: 8rpx 24rpx 24rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 195, 0, 0.18);
}
.mall-hero__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.mall-hero__addr {
  display: flex;
  align-items: center;
  gap: 6rpx;
  min-width: 0;
}
.mall-hero__addr-text {
  max-width: 290rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #111111;
  font-size: 30rpx;
  font-weight: 700;
}
.mall-hero__weather {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-left: 12rpx;
  padding: 4rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
}
.mall-hero__weather-text {
  color: #4f4632;
  font-size: 22rpx;
}
.mall-hero__acts {
  display: flex;
  align-items: center;
  gap: 32rpx;
  flex-shrink: 0;
}
.mall-hero__act {
  position: relative;
  display: flex;
}
.mall-hero__act--dot::after {
  content: '';
  position: absolute;
  top: 0;
  right: -2rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #ff3141;
}
.mall-hero__bar-btn {
  flex-shrink: 0;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  background: #ffc300;
}
.mall-hero__bar-btn-text {
  color: #251a00;
  font-size: 24rpx;
  font-weight: 700;
}
.mall-hero__hots {
  width: 100%;
  white-space: nowrap;
  padding-top: 20rpx;
}
.mall-hero__hots-track {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
}

/* ── 金刚区 ───────────────────────────────────────────────────────────── */
/* 金刚区：sn-grid 负责布局与文字，圆底与图标由 #icon 插槽渲染 */
.mall-cat__icon {
  width: 84rpx;
  height: 84rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mall-cats {
  display: flex;
  flex-wrap: wrap;
  margin: 24rpx 24rpx 0;
  padding: 24rpx 0 8rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

/* ── 营销区 ───────────────────────────────────────────────────────────── */
.mall-mkt {
  display: flex;
  gap: 16rpx;
  margin: 24rpx 24rpx 0;
}
.mall-mkt__coupon {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.mall-mkt__coupon::after {
  content: '';
  position: absolute;
  right: -48rpx;
  bottom: -48rpx;
  width: 192rpx;
  height: 192rpx;
  border-radius: 50%;
  background: rgba(255, 195, 0, 0.2);
  filter: blur(20rpx);
}
.mall-mkt__coupon-main {
  position: relative;
  z-index: 1;
}
.mall-mkt__coupon-head {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.mall-mkt__coupon-chip {
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: #ff3141;
}
.mall-mkt__coupon-chip-text {
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.mall-mkt__coupon-title {
  color: #111111;
  font-size: 30rpx;
  font-weight: 800;
}
.mall-mkt__coupon-desc {
  display: block;
  margin-top: 8rpx;
  color: #666666;
  font-size: 22rpx;
}
.mall-mkt__coupon-price {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  margin-top: 16rpx;
}
.mall-mkt__coupon-amount {
  color: #ff3141;
  font-size: 56rpx;
  font-weight: 800;
  line-height: 1;
}
.mall-mkt__coupon-unit {
  color: #ff3141;
  font-size: 22rpx;
  font-weight: 700;
}
.mall-mkt__coupon-foot {
  position: relative;
  z-index: 1;
  margin-top: 24rpx;
}
.mall-mkt__countdown {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 12rpx;
}
.mall-mkt__countdown-label {
  color: #81765f;
  font-size: 20rpx;
}
.mall-mkt__countdown-chips {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.mall-mkt__countdown-chip {
  padding: 4rpx 8rpx;
  border-radius: 6rpx;
  background: #303030;
  color: #f3f0ef;
  font-size: 20rpx;
  font-weight: 700;
}
.mall-mkt__countdown-colon {
  color: #81765f;
  font-size: 20rpx;
}
.mall-mkt__grab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  padding: 14rpx 0;
  border-radius: 999rpx;
  background: #ff3141;
}
.mall-mkt__grab-text {
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
}
.mall-mkt__stack {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.mall-flash {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.mall-flash__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mall-flash__title {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.mall-flash__title-text {
  color: #111111;
  font-size: 26rpx;
  font-weight: 700;
}
.mall-flash__cap {
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background: #ffdad8;
}
.mall-flash__cap-text {
  color: #930019;
  font-size: 18rpx;
  font-weight: 700;
}
.mall-flash__save {
  color: #8f4e00;
  font-size: 20rpx;
  font-weight: 700;
}
.mall-flash__row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 16rpx;
}
.mall-flash__thumb {
  width: 96rpx;
  height: 96rpx;
  flex-shrink: 0;
  border-radius: 16rpx;
  background: #f0eded;
  overflow: hidden;
}
.mall-flash__info {
  flex: 1;
  min-width: 0;
}
.mall-flash__name {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #111111;
  font-size: 22rpx;
  font-weight: 600;
}
.mall-flash__prices {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}
.mall-flash__price {
  color: #ff3141;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 1;
}
.mall-flash__orig {
  color: #81765f;
  font-size: 22rpx;
  text-decoration: line-through;
}
.mall-flash__hint {
  display: block;
  margin-top: 4rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #81765f;
  font-size: 18rpx;
}

/* ── 频道胶囊 ─────────────────────────────────────────────────────────── */
.mall-channels {
  margin-top: 24rpx;
  padding: 20rpx 24rpx 16rpx;
  background: #f7f7f7;
}
/* #ifdef H5 */
.mall-channels {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(247, 247, 247, 0.96);
}
/* #endif */
.mall-channels__scroll {
  width: 100%;
  white-space: nowrap;
}
.mall-channels__track {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
}

/* ── 双列瀑布 ─────────────────────────────────────────────────────────── */
.mall-waterfall {
  display: flex;
  gap: 16rpx;
  margin: 8rpx 24rpx 0;
}
.mall-waterfall__col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.mall-card {
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}
.mall-card__media {
  position: relative;
  width: 100%;
  height: 340rpx;
  background: #f0eded;
  overflow: hidden;
}
.mall-card__corner {
  position: absolute;
  top: 12rpx;
  left: 12rpx;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background: #ff3141;
}
.mall-card__corner-text {
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 700;
}
.mall-card__deliver {
  position: absolute;
  bottom: 12rpx;
  left: 12rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: rgba(0, 0, 0, 0.65);
}
.mall-card__deliver--amber {
  background: rgba(255, 191, 138, 0.92);
}
.mall-card__deliver-text {
  color: #ffffff;
  font-size: 20rpx;
}
.mall-card__deliver--amber .mall-card__deliver-text {
  color: #6d3a00;
  font-weight: 700;
}
.mall-card__body {
  display: flex;
  flex-direction: column;
  padding: 20rpx;
}
.mall-card__title {
  color: #111111;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.mall-card__sub {
  margin-top: 8rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #81765f;
  font-size: 22rpx;
}
.mall-card__quote {
  display: flex;
  align-items: center;
  gap: 6rpx;
  margin-top: 10rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  background: rgba(255, 223, 154, 0.35);
}
.mall-card__quote-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #5a4300;
  font-size: 20rpx;
}
.mall-card__rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 12rpx;
}
.mall-card__rating-score {
  color: #8f4e00;
  font-size: 22rpx;
  font-weight: 700;
}
.mall-card__rating-sold {
  color: #81765f;
  font-size: 22rpx;
}
.mall-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 12rpx;
}
.mall-card__badge {
  padding: 2rpx 8rpx;
  border-radius: 6rpx;
}
.mall-card__badge--yellow {
  background: rgba(255, 223, 154, 0.4);
}
.mall-card__badge--yellow .mall-card__badge-text {
  color: #5a4300;
}
.mall-card__badge--red {
  background: #ffdad8;
}
.mall-card__badge--red .mall-card__badge-text {
  color: #bb0022;
}
.mall-card__badge--gray {
  background: #eae7e7;
}
.mall-card__badge--gray .mall-card__badge-text {
  color: #4f4632;
}
.mall-card__badge-text {
  font-size: 18rpx;
  font-weight: 500;
}
.mall-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20rpx;
}
.mall-card__prices {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}
.mall-card__price {
  color: #ff3141;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 1;
}
.mall-card__orig {
  color: #81765f;
  font-size: 22rpx;
  text-decoration: line-through;
}
.mall-card__plus {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #ffc300;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(255, 195, 0, 0.38);
}
.mall-card__buy {
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  background: #ff3141;
}
.mall-card__buy-text {
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 700;
}

/* ── 底部标签栏 ───────────────────────────────────────────────────────── */
</style>
