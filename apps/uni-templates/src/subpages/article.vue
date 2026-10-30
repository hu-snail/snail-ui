<script setup lang="ts">
/**
 * 模板：图文详情页（新闻阅读）—— 衬线大标题 + 媒体署名行 + 导读摘要 +
 * 长文正文（配图 / 视频 / 数据对比）+ 版权声明 + 话题标签 + 互动栏 +
 * 热门评论 + 相关推荐，底部评论操作栏。
 *
 * 结构：sn-paging 根容器（#top 固定导航行，#bottom 评论栏，默认插槽为
 * 整篇图文；文章无分页，故 auto / load-more / refresher 全关）。
 * 微信小程序端导航行按胶囊几何让位（common/capsule）。
 */
import { computed, ref } from 'vue';
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnCard from '@snui/uni-src/components/sn-card/sn-card.vue';
import SnBadge from '@snui/uni-src/components/sn-badge/sn-badge.vue';
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnImg from '@snui/uni-src/components/sn-img/sn-img.vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue';
import SnSegmented from '@snui/uni-src/components/sn-segmented/sn-segmented.vue';
import SnRichText from '@snui/uni-src/components/sn-rich-text/sn-rich-text.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
import SnVideoPreview from '@snui/uni-src/components/sn-video-preview/sn-video-preview.vue';
import { getCapsuleMetrics } from '../common/capsule';
import { MaximizeIcon, PenLineIcon, ThumbsDownIcon, Volume2Icon } from '../common/icons';
import {
  ChevronLeft,
  MessageCircle,
  Play,
  RefreshCw,
  Search,
  Share2,
  Star,
  ThumbsUp,
  User,
} from '@snui/uni-src/components/sn-icon/sn-icon-set';

const capsule = getCapsuleMetrics();
const navStyle = computed(() => ({
  height: `${capsule.navBarHeight}px`,
  paddingRight: capsule.hasCapsule ? `${capsule.capsulePadRight}px` : '16rpx',
}));
const statusStyle = computed(() => ({ height: `${capsule.statusBarHeight}px` }));

/* ── 文章元信息 ───────────────────────────────────────────────────────── */
const ARTICLE = {
  title: '我国新一代可重复使用火箭完成十公里级垂直起降试验：深度解析关键突破与空间站低成本货运未来',
  author: '科技前沿观察',
  meta: '05-18 10:24 · 北京 · 3.8万阅读',
  lead: '核心导读：这是我国目前起飞规模最大、飞行高度最高的可重复使用火箭垂直起降（VTVL）飞行试验，标志着重型可回收航天动力进入工程实用化攻坚阶段，为空间站常态化、低成本补给奠定关键基石。',
  p1: '北京时间5月18日清晨，西北戈壁腹地的酒泉卫星发射中心传来激荡人心的轰鸣。伴随着发动机矢量喷管喷出的炽热尾焰，我国自主研制的新一代可重复使用试验箭腾空而起，在空中平稳爬升至预定10公里高度后完成关机转向滑行，并在降落段精准点火反推，四支轻量化碳纤维着陆缓冲腿稳稳锚固于靶心着陆台。',
  p2: '相比此前数公里的低空悬停，十公里级跳跃试验是跨越低空风切变层、验证超声速大动压下高空精确制导律的关键节点。在整个试验周期内，箭上自研三冗余航电系统完成了多级变推力协同控制，节流深度低至35%，发动机深节流工况下的燃烧稳定性得到了充分验证。',
  quote:
    '航天动力工程总师在现地受访时指出：“不仅要把火箭送上去，关键在于低成本、高可靠性地收回来。此次验证的着陆缓冲吸能机构采用了新型蜂窝铝复合吸能芯体，不仅重量降低了42%，同时支持全箭免拆卸无损翻新，单次发射周转准备期预计可压缩至7天以内。”',
  p3: '展望2026年，我国将基于此项核心技术实施首飞入轨并回收，届时中国空间站将拥有更灵活的高频物资投送保障手段，各类空间科学实验样本和精密载荷实现“随叫随到”的常态化天地往返。',
  editor: '责任编辑：航天观察组 · 审校：李思远',
  copyright:
    '内容版权声明：本文系科技前沿观察独家报道，未经许可禁止转载。部分引据资料由酒泉试验场公报发布。',
};
const TAGS = ['#航天科技', '#商业火箭', '#空间站建设', '#中国科技前沿'];
const LAUNCH_IMAGE =
  'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1000&h=625&fit=crop&q=70';
const VIDEO_COVER =
  'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1024&h=576&fit=crop&q=70';
/** 演示视频源（公开样片；真实项目由宿主注入自有地址）。 */
const VIDEO_SRC = 'https://media.w3.org/2010/05/sintel/trailer.mp4';

/* ── 正文富文本（sn-rich-text 渲染；视频/数据卡保持组件插槽在前） ─────── */

/** tag 级排版：正文 34rpx/1.78 两端对齐，段落间距 28rpx。 */
const BODY_TAG_STYLES: Record<string, string> = {
  p: 'margin: 0 0 28rpx; text-align: justify;',
  figure: 'margin: 0 0 28rpx;',
  figcaption:
    'padding: 12rpx 12rpx 0; color: #8e706e; font-size: 22rpx; line-height: 1.5; text-align: center;',
  img: 'width: 100%; border-radius: 20rpx;',
};

/** class 级排版：导读盒 / 版权盒 / 分段首尾归零（避免与页面 gap 叠加）。 */
const BODY_CLASS_STYLES: Record<string, string> = {
  lead: 'margin: 0; padding: 20rpx 24rpx 20rpx 32rpx; border-left: 8rpx solid #b0242b; border-radius: 12rpx; background-color: #f6f3f2; color: #5a413f; font-size: 28rpx; font-style: italic; line-height: 1.65;',
  legal:
    'margin: 0; padding: 20rpx; border-radius: 12rpx; background-color: #f6f3f2; color: #8e706e; font-size: 22rpx; line-height: 1.6;',
  flush: 'margin: 0;',
};

/** 视频块之前：导读 + 段落一 + 发射图 + 段落二。 */
const BODY_TOP = [
  `<p class="lead">${ARTICLE.lead}</p>`,
  `<p>${ARTICLE.p1}</p>`,
  `<figure><img src="${LAUNCH_IMAGE}" /><figcaption>图注：可重复使用运载火箭在试验场成功实施垂直起飞与精准着陆（摄影：张扬 / 科技前沿）</figcaption></figure>`,
  `<p class="flush">${ARTICLE.p2}</p>`,
].join('');

/** 数据对比卡之前：受访引述。 */
const BODY_QUOTE = `<p class="flush">${ARTICLE.quote}</p>`;

/** 话题标签之前：展望段落 + 版权声明盒。 */
const BODY_TAIL = [
  `<p>${ARTICLE.p3}</p>`,
  `<p class="legal">${ARTICLE.editor}<br/>${ARTICLE.copyright}</p>`,
].join('');

/* ── 互动状态 ─────────────────────────────────────────────────────────── */
const following = ref(false);
const liked = ref(false);
const disliked = ref(false);
const starred = ref(false);
/** SnVideoPreview 实例（全屏播放层由组件托管）。 */
const videoPreview = ref<InstanceType<typeof SnVideoPreview> | null>(null);

const likeCount = computed(() => (liked.value ? 4299 : 4298));

function toggleFollow(): void {
  following.value = !following.value;
}
function toggleLike(): void {
  liked.value = !liked.value;
  if (liked.value) disliked.value = false;
}
function toggleDislike(): void {
  disliked.value = !disliked.value;
  if (disliked.value) liked.value = false;
}
function openVideo(): void {
  videoPreview.value?.open({
    src: VIDEO_SRC,
    poster: VIDEO_COVER,
    title: '实录：垂直起降10公里全流程多视角回传',
  });
}
function toast(text: string): void {
  uni.showToast({ title: text, icon: 'none' });
}
function goBack(): void {
  uni.navigateBack();
}

/** 评论排序（sn-segmented 选项）。 */
const COMMENT_SORTS = [
  { label: '最热', value: 'hot' },
  { label: '最新', value: 'latest' },
];

/* ── 热门评论 ─────────────────────────────────────────────────────────── */
interface CommentEntry {
  id: number;
  name: string;
  badge: string;
  initial: string;
  location: string;
  time: string;
  text: string;
  likes: number;
  liked: boolean;
  hot: number;
  reply?: { author: string; text: string; replies: number };
}
const COMMENTS = ref<CommentEntry[]>([
  {
    id: 1,
    name: '动力推进学徒',
    badge: '航天系统工程师',
    initial: '动',
    location: 'IP属地：陕西',
    time: '3小时前',
    text: '十公里跳跃的核心在于气动舵面与反作用姿控RCS的平滑交接。看视频回放最后50米的落点修正极其干脆，几乎没有过度摆动，这套控制律算法水平相当扎实！',
    likes: 1289,
    liked: false,
    hot: 3,
    reply: {
      author: '科技前沿观察',
      text: '：是的！总师特意提到了低延迟全数字伺服系统，响应周期到了毫秒级。',
      replies: 14,
    },
  },
  {
    id: 2,
    name: '逐梦苍穹2030',
    badge: '',
    initial: '逐',
    location: 'IP属地：广东',
    time: '4小时前',
    text: '终于看到我们自己的垂直回收火箭稳稳落地了，回想起几年前看低空百米悬停，今天直接拉到10公里，这种跨越式进步太振奋人心了！期待明年的入轨回收！',
    likes: 856,
    liked: false,
    hot: 2,
  },
  {
    id: 3,
    name: '星图观测员老陈',
    badge: '',
    initial: '星',
    location: 'IP属地：四川',
    time: '5小时前',
    text: '液氧甲烷发动机不仅燃烧后不结焦积碳，而且价格比传统航空煤油更低廉，是低成本重复利用的最佳路径之一。',
    likes: 312,
    liked: false,
    hot: 1,
  },
]);
const commentSort = ref<'hot' | 'latest'>('hot');
const sortedComments = computed(() =>
  [...COMMENTS.value].sort((a, b) => (commentSort.value === 'hot' ? b.hot - a.hot : b.id - a.id)),
);
function likeComment(c: CommentEntry): void {
  c.liked = !c.liked;
  c.likes += c.liked ? 1 : -1;
}

/* ── 相关推荐（换一换轮转） ───────────────────────────────────────────── */
interface RecEntry {
  id: number;
  title: string;
  kind: 'triple' | 'single' | 'video';
  images: string[];
  source: string;
  meta: string;
  badge: string;
  badgeTone: 'hot' | 'video';
  duration?: string;
}
const RECS: RecEntry[] = [
  {
    id: 1,
    title: '盘点全球可回收运载火箭全谱系：中美商业航天赛道迎来全方位大提速',
    kind: 'triple',
    images: [
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=320&h=240&fit=crop&q=70',
      'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=320&h=240&fit=crop&q=70',
      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=320&h=240&fit=crop&q=70',
    ],
    source: '环球航天洞察',
    meta: '168评论',
    badge: '热榜',
    badgeTone: 'hot',
  },
  {
    id: 2,
    title: '空间站低成本货运飞船竞标方案解密：民营力量如何融入国家工程？',
    kind: 'single',
    images: [
      'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=320&h=240&fit=crop&q=70',
    ],
    source: '新华科技',
    meta: '94评 · 1小时前',
    badge: '',
    badgeTone: 'hot',
  },
  {
    id: 3,
    title: '三维重演：10公里垂直起降火箭在下坠过程中如何克服强侧风？',
    kind: 'video',
    images: ['https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=320&h=240&fit=crop&q=70'],
    source: '硬核力学讲堂',
    meta: '5.2万次播放',
    badge: '视频',
    badgeTone: 'video',
    duration: '04:18',
  },
  {
    id: 4,
    title: '液氧甲烷发动机完成千秒级长程试车：复用寿命再上台阶',
    kind: 'single',
    images: [
      'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=320&h=240&fit=crop&q=70',
    ],
    source: '深空动力',
    meta: '72评 · 20分钟前',
    badge: '',
    badgeTone: 'hot',
  },
];
const recOffset = ref(0);
const visibleRecs = computed(() => {
  const n = RECS.length;
  return [0, 1, 2].map((i) => RECS[(i + recOffset.value) % n]);
});
function shuffleRecs(): void {
  recOffset.value = (recOffset.value + 1) % RECS.length;
}
</script>

<template>
  <view class="art-page">
    <SnPaging
      :auto="false"
      :refresher-enabled="false"
      :load-more-enabled="false"
      custom-style="background-color: #fcf9f8;"
    >
      <!-- ═══ #top：状态栏 + 导航行（胶囊让位） ═══ -->
      <template #top>
        <view class="art-chrome">
          <view class="art-status" :style="statusStyle" aria-hidden="true" />
          <view class="art-nav">
            <view class="art-nav__row" :style="navStyle">
              <view class="art-nav__back" role="button" aria-label="返回" @tap="goBack">
                <SnIcon :icon="ChevronLeft" size="48rpx" color="#1b1c1c" />
              </view>
              <view class="art-nav__brand">
                <view class="art-nav__logo">
                  <text class="art-nav__logo-text">头</text>
                </view>
                <text class="art-nav__title">News Article Detail</text>
              </view>
              <view class="art-nav__acts">
                <view class="art-nav__follow" @tap="toggleFollow">
                  <text class="art-nav__follow-text">{{ following ? '已关注' : '+ 关注' }}</text>
                </view>
                <view class="art-nav__act" role="button" aria-label="搜索" @tap="toast('搜索')">
                  <SnIcon :icon="Search" size="42rpx" color="#5a413f" />
                </view>
                <view class="art-nav__act" role="button" aria-label="分享" @tap="toast('分享')">
                  <SnIcon :icon="Share2" size="42rpx" color="#5a413f" />
                </view>
                <view class="art-nav__avatar">
                  <SnIcon :icon="User" size="32rpx" color="#ffffff" />
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>

      <!-- ═══ 图文内容 ═══ -->
      <view class="art-body">
        <text class="art-headline">{{ ARTICLE.title }}</text>

        <!-- 媒体署名行 -->
        <view class="art-byline">
          <view class="art-byline__author">
            <view class="art-byline__avatar-wrap">
              <SnAvatar text="科" :size="88" />
              <view class="art-byline__v">
                <text class="art-byline__v-text">V</text>
              </view>
            </view>
            <view class="art-byline__meta">
              <view class="art-byline__name-row">
                <text class="art-byline__name">{{ ARTICLE.author }}</text>
                <view class="art-byline__verified">
                  <text class="art-byline__verified-text">官方认证</text>
                </view>
              </view>
              <view class="art-byline__info">
                <text class="art-byline__info-text">{{ ARTICLE.meta }}</text>
              </view>
            </view>
          </view>
          <view class="art-byline__follow" @tap="toggleFollow">
            <text class="art-byline__follow-text">{{ following ? '已关注' : '+ 关注' }}</text>
          </view>
        </view>

        <!-- 核心导读 + 正文段落 + 发射配图（sn-rich-text 富文本渲染） -->
        <SnRichText
          :content="BODY_TOP"
          :tag-style="BODY_TAG_STYLES"
          :class-styles="BODY_CLASS_STYLES"
          selectable
          custom-style="--sn-mp-rich-text-color: #1b1c1c; --sn-mp-rich-text-font-size: 34rpx; --sn-mp-rich-text-line-height: 1.78;"
        />

        <!-- 视频块：封面 + 播放浮层（点击交给 SnVideoPreview 全屏播放） -->
        <view class="art-video">
          <SnVideoPreview ref="videoPreview" />
          <view class="art-video__stage" role="button" aria-label="播放视频" @tap="openVideo">
            <SnImg :src="VIDEO_COVER" mode="aspectFill" width="100%" height="100%" />
            <view class="art-video__overlay">
              <view class="art-video__play">
                <SnIcon :icon="Play" size="56rpx" color="#ffffff" />
              </view>
            </view>
            <view class="art-video__top">
              <text class="art-video__top-title">实录：垂直起降10公里全流程多视角回传</text>
              <view class="art-video__quality">
                <text class="art-video__quality-text">1080P 高清</text>
              </view>
            </view>
            <view class="art-video__bottom">
              <view class="art-video__controls-left">
                <SnIcon :icon="Play" size="34rpx" color="#ffffff" />
                <text class="art-video__time">01:12 / 03:45</text>
              </view>
              <view class="art-video__controls-right">
                <SnIcon :icon="Volume2Icon" size="34rpx" color="#ffffff" />
                <SnIcon :icon="MaximizeIcon" size="34rpx" color="#ffffff" />
              </view>
            </view>
          </view>
          <text class="art-figure__caption">视频回放：着陆腿展开瞬间多角度雷达与机载遥测全景</text>
        </view>

        <!-- 受访引述（富文本渲染） -->
        <SnRichText
          :content="BODY_QUOTE"
          :tag-style="BODY_TAG_STYLES"
          :class-styles="BODY_CLASS_STYLES"
          selectable
          custom-style="--sn-mp-rich-text-color: #1b1c1c; --sn-mp-rich-text-font-size: 34rpx; --sn-mp-rich-text-line-height: 1.78;"
        />

        <!-- 数据对比卡 -->
        <view class="art-stats">
          <view class="art-stats__head">
            <text class="art-stats__title">新旧货运方案效能指标对标</text>
            <view class="art-stats__badge">
              <text class="art-stats__badge-text">工程估算模型</text>
            </view>
          </view>

          <view class="art-metric">
            <view class="art-metric__row">
              <text class="art-metric__label">每公斤近地轨道货运成本</text>
              <text class="art-metric__delta">降幅 ~76%</text>
            </view>
            <SnProgress
              :percentage="100"
              hide-text
              color="#8e706e"
              custom-style="--sn-mp-color-background-subtle: #e5e2e1;"
            />
            <SnProgress
              :percentage="24"
              hide-text
              color="#b0242b"
              custom-style="--sn-mp-color-background-subtle: #e5e2e1;"
            />
            <view class="art-metric__legend">
              <text class="art-metric__legend-text">传统一次性载荷 (基准值: 100%)</text>
              <text class="art-metric__legend-text">本次可回收箭体目标 (24%)</text>
            </view>
          </view>

          <view class="art-metric">
            <view class="art-metric__row">
              <text class="art-metric__label">年度发射频次能力</text>
              <text class="art-metric__delta art-metric__delta--blue">提升至 36+ 次/年</text>
            </view>
            <view class="art-metric__freq">
              <view class="art-freq-card">
                <text class="art-freq-card__label">现役一次性运力</text>
                <text class="art-freq-card__value">6-8次</text>
              </view>
              <text class="art-freq-arrow">→</text>
              <view class="art-freq-card">
                <text class="art-freq-card__label art-freq-card__label--accent"
                  >可复用常态运力</text
                >
                <text class="art-freq-card__value art-freq-card__value--accent">36+次</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 展望段落 + 版权声明（富文本渲染） -->
        <SnRichText
          :content="BODY_TAIL"
          :tag-style="BODY_TAG_STYLES"
          :class-styles="BODY_CLASS_STYLES"
          selectable
          custom-style="--sn-mp-rich-text-color: #1b1c1c; --sn-mp-rich-text-font-size: 34rpx; --sn-mp-rich-text-line-height: 1.78;"
        />

        <!-- 话题标签 -->
        <view class="art-tags">
          <SnTag
            v-for="t in TAGS"
            :key="t"
            round
            bg-color="#f0eded"
            color="#5a413f"
            custom-style="margin: 0 12rpx 12rpx 0;"
            @click="toast(t)"
            >{{ t }}</SnTag
          >
        </view>

        <!-- 互动栏 -->
        <view class="art-engage">
          <view class="art-engage__item" @tap="toggleLike">
            <view class="art-engage__circle" :class="{ 'art-engage__circle--on': liked }">
              <SnIcon :icon="ThumbsUp" size="52rpx" :color="liked ? '#b0242b' : '#5a413f'" />
            </view>
            <text class="art-engage__label" :class="{ 'art-engage__label--on': liked }"
              >{{ likeCount }} 赞</text
            >
          </view>
          <view class="art-engage__item" @tap="toast('感谢您的赞赏')">
            <view class="art-engage__circle art-engage__circle--reward">
              <text class="art-engage__reward-text">赏</text>
            </view>
            <text class="art-engage__label art-engage__label--muted">赞赏作者</text>
          </view>
          <view class="art-engage__item" @tap="toggleDislike">
            <view class="art-engage__circle" :class="{ 'art-engage__circle--muted': disliked }">
              <SnIcon
                :icon="ThumbsDownIcon"
                size="48rpx"
                :color="disliked ? '#b0242b' : '#5a413f'"
              />
            </view>
            <text class="art-engage__label art-engage__label--muted">{{
              disliked ? '已反馈' : '不喜欢'
            }}</text>
          </view>
        </view>

        <!-- 热门评论 -->
        <view class="art-comments">
          <view class="art-comments__head">
            <view class="art-comments__title-row">
              <text class="art-comments__title">热门评论</text>
              <text class="art-comments__count">(1,842)</text>
            </view>
            <SnSegmented
              v-model="commentSort"
              :options="COMMENT_SORTS"
              custom-style="width: 220rpx; --sn-mp-font-size-md: 22rpx; --sn-mp-spacing-2: 6rpx; --sn-mp-spacing-3: 16rpx; --sn-mp-radius-md: 999rpx; --sn-mp-radius-sm: 999rpx; --sn-mp-color-background-subtle: #f0eded; --sn-mp-color-action-primary: #1b1c1c;"
            />
          </view>

          <view v-for="c in sortedComments" :key="c.id" class="art-comment">
            <SnAvatar :text="c.initial" :size="72" />
            <view class="art-comment__body">
              <view class="art-comment__head">
                <view class="art-comment__name-row">
                  <text class="art-comment__name">{{ c.name }}</text>
                  <view v-if="c.badge" class="art-comment__badge">
                    <text class="art-comment__badge-text">{{ c.badge }}</text>
                  </view>
                </view>
                <view class="art-comment__like" @tap="likeComment(c)">
                  <SnIcon :icon="ThumbsUp" size="30rpx" :color="c.liked ? '#b0242b' : '#8e706e'" />
                  <text class="art-comment__like-count" :class="{ 'is-on': c.liked }">{{
                    c.likes
                  }}</text>
                </view>
              </view>
              <text class="art-comment__meta">{{ c.location }} · {{ c.time }}</text>
              <text class="art-comment__text">{{ c.text }}</text>
              <view v-if="c.reply" class="art-comment__reply">
                <text class="art-comment__reply-text">
                  <text class="art-comment__reply-author">{{ c.reply.author }}</text>
                  <text class="art-comment__reply-badge">作者</text>
                  {{ c.reply.text }}
                </text>
                <text class="art-comment__reply-more">共 {{ c.reply.replies }} 条回复 &gt;</text>
              </view>
            </view>
          </view>

          <view class="art-comments__all" @tap="toast('查看全部评论')">
            <text class="art-comments__all-text">查看全部 1,842 条评论 &gt;</text>
          </view>
        </view>

        <!-- 相关推荐 -->
        <view class="art-recs">
          <view class="art-recs__head">
            <view class="art-recs__title-row">
              <view class="art-recs__title-bar" />
              <text class="art-recs__title">相关推荐</text>
            </view>
            <view class="art-recs__shuffle" @tap="shuffleRecs">
              <SnIcon :icon="RefreshCw" size="30rpx" color="#8e706e" />
              <text class="art-recs__shuffle-text">换一换</text>
            </view>
          </view>

          <SnCard
            v-for="r in visibleRecs"
            :key="r.id"
            custom-style="background-color: #ffffff; --sn-mp-card-padding: 20rpx; --sn-mp-card-radius: 20rpx; gap: 14rpx; box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03); margin-bottom: 20rpx;"
            @click="toast('打开推荐内容')"
          >
            <template v-if="r.kind === 'triple'">
              <text class="art-rec__title">{{ r.title }}</text>
              <view class="art-rec__triple">
                <view v-for="img in r.images" :key="img" class="art-rec__triple-item">
                  <SnImg :src="img" mode="aspectFill" width="100%" height="100%" radius="8" />
                </view>
              </view>
              <view class="art-rec__foot">
                <view class="art-rec__foot-left">
                  <view class="art-rec__hot">
                    <text class="art-rec__hot-text">{{ r.badge }}</text>
                  </view>
                  <text class="art-rec__source">{{ r.source }}</text>
                  <text class="art-rec__dot">·</text>
                  <text class="art-rec__meta">{{ r.meta }}</text>
                </view>
              </view>
            </template>

            <template v-else>
              <view class="art-rec__side">
                <view class="art-rec__side-main">
                  <text class="art-rec__title art-rec__title--clamp">{{ r.title }}</text>
                  <view class="art-rec__foot-left">
                    <view v-if="r.badge" class="art-rec__video-badge">
                      <text class="art-rec__video-badge-text">{{ r.badge }}</text>
                    </view>
                    <text class="art-rec__source">{{ r.source }}</text>
                    <text class="art-rec__dot">·</text>
                    <text class="art-rec__meta">{{ r.meta }}</text>
                  </view>
                </view>
                <view class="art-rec__side-thumb">
                  <SnImg
                    :src="r.images[0]"
                    mode="aspectFill"
                    width="100%"
                    height="100%"
                    radius="8"
                  />
                  <view v-if="r.kind === 'video'" class="art-rec__play">
                    <SnIcon :icon="Play" size="32rpx" color="#1b1c1c" />
                  </view>
                  <text v-if="r.duration" class="art-rec__duration">{{ r.duration }}</text>
                </view>
              </view>
            </template>
          </SnCard>
        </view>

        <!-- 页末水印 -->
        <SnDivider
          content-position="center"
          color="#e5e2e1"
          custom-style="margin: 24rpx 0; --sn-mp-color-text-secondary: #8e706e; --sn-mp-color-background-surface: #fcf9f8;"
          >今日头条 · 智能推荐已就绪</SnDivider
        >
      </view>

      <!-- ═══ #bottom：评论操作栏 ═══ -->
      <template #bottom>
        <view class="art-actionbar">
          <view class="art-actionbar__input" @tap="toast('写评论')">
            <SnIcon :icon="PenLineIcon" size="34rpx" color="#8e706e" />
            <text class="art-actionbar__placeholder">写评论...</text>
          </view>
          <view class="art-actionbar__acts">
            <view
              class="art-actionbar__act"
              role="button"
              aria-label="评论区"
              @tap="toast('评论区')"
            >
              <SnBadge
                :value="48"
                type="danger"
                bg-color="#b0242b"
                shape="circle"
                top="-6rpx"
                right="-14rpx"
              >
                <SnIcon :icon="MessageCircle" size="46rpx" color="#5a413f" />
              </SnBadge>
            </view>
            <view
              class="art-actionbar__act"
              role="button"
              :aria-label="liked ? '取消点赞' : '点赞'"
              @tap="toggleLike"
            >
              <SnIcon :icon="ThumbsUp" size="46rpx" :color="liked ? '#b0242b' : '#5a413f'" />
            </view>
            <view
              class="art-actionbar__act"
              role="button"
              :aria-label="starred ? '取消收藏' : '收藏'"
              @tap="starred = !starred"
            >
              <SnIcon :icon="Star" size="46rpx" :color="starred ? '#b0242b' : '#5a413f'" />
            </view>
            <view
              class="art-actionbar__act"
              role="button"
              aria-label="分享到外部"
              @tap="toast('分享到外部')"
            >
              <SnIcon :icon="Share2" size="46rpx" color="#5a413f" />
            </view>
          </view>
        </view>
      </template>
    </SnPaging>
  </view>
</template>

<style scoped>
.art-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fcf9f8;
}

/* ── 顶部导航 ─────────────────────────────────────────────────────────── */
.art-chrome {
  flex-shrink: 0;
  background: rgba(252, 249, 248, 0.94);
  box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.04);
}
.art-status {
  background: rgba(252, 249, 248, 0.94);
}
.art-nav__row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-left: 8rpx;
  box-sizing: border-box;
}
.art-nav__back {
  width: 80rpx;
  height: 80rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-nav__brand {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.art-nav__logo {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #d33e41;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.art-nav__logo-text {
  color: #fffbff;
  font-size: 24rpx;
  font-weight: 700;
}
.art-nav__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #1b1c1c;
  font-size: 28rpx;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.art-nav__acts {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}
.art-nav__follow {
  height: 56rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: #b0242b;
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-nav__follow-text {
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 600;
}
.art-nav__act {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-nav__avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: #b0242b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── 正文 ─────────────────────────────────────────────────────────────── */
.art-body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding: 16rpx 32rpx 48rpx;
}
.art-headline {
  color: #1b1c1c;
  font-family: Georgia, 'Times New Roman', 'Songti SC', STSong, serif;
  font-size: 52rpx;
  font-weight: 700;
  line-height: 1.38;
  letter-spacing: -0.01em;
}

/* 署名行 */
.art-byline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}
.art-byline__author {
  display: flex;
  align-items: center;
  gap: 16rpx;
  min-width: 0;
}
.art-byline__avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.art-byline__v {
  position: absolute;
  right: -2rpx;
  bottom: -2rpx;
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  background: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-byline__v-text {
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 700;
}
.art-byline__meta {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  min-width: 0;
}
.art-byline__name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.art-byline__name {
  color: #1b1c1c;
  font-size: 28rpx;
  font-weight: 700;
}
.art-byline__verified {
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: #d3e4ff;
}
.art-byline__verified-text {
  color: #004881;
  font-size: 18rpx;
}
.art-byline__info-text {
  color: #8e706e;
  font-size: 22rpx;
}
.art-byline__follow {
  flex-shrink: 0;
  height: 60rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #b0242b;
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-byline__follow-text {
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 600;
}

/* 核心导读 */

/* 配图 */
.art-figure__caption {
  padding: 0 12rpx;
  color: #8e706e;
  font-size: 22rpx;
  line-height: 1.5;
  text-align: center;
}

/* 视频块 */
.art-video {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.art-video__stage {
  position: relative;
  width: 100%;
  height: 420rpx;
  border-radius: 20rpx;
  background: #303030;
  overflow: hidden;
}
.art-video__overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}
.art-video__play {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: rgba(176, 36, 43, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-video__top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
  padding: 16rpx;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
}
.art-video__top-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #ffffff;
  font-size: 22rpx;
  font-weight: 500;
}
.art-video__quality {
  flex-shrink: 0;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  background: rgba(255, 255, 255, 0.24);
}
.art-video__quality-text {
  color: #ffffff;
  font-size: 18rpx;
  font-weight: 700;
}
.art-video__bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
}
.art-video__controls-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.art-video__controls-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.art-video__time {
  color: #ffffff;
  font-size: 20rpx;
}

/* 数据对比 */
.art-stats {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  background: #f0eded;
}
.art-stats__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}
.art-stats__title {
  color: #1b1c1c;
  font-size: 28rpx;
  font-weight: 600;
}
.art-stats__badge {
  flex-shrink: 0;
  padding: 2rpx 14rpx;
  border-radius: 999rpx;
  background: #b5d0fd;
}
.art-stats__badge-text {
  color: #2d486d;
  font-size: 18rpx;
}
.art-metric {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.art-metric__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.art-metric__label {
  color: #5a413f;
  font-size: 22rpx;
}
.art-metric__delta {
  color: #b0242b;
  font-size: 22rpx;
  font-weight: 700;
}
.art-metric__delta--blue {
  color: #005ea4;
}
.art-metric__legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.art-metric__legend-text {
  color: #8e706e;
  font-size: 18rpx;
}
.art-metric__freq {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding-top: 4rpx;
}
.art-freq-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  padding: 14rpx 0;
  border-radius: 12rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}
.art-freq-card__label {
  color: #8e706e;
  font-size: 18rpx;
}
.art-freq-card__label--accent {
  color: #b0242b;
}
.art-freq-card__value {
  color: #1b1c1c;
  font-size: 26rpx;
  font-weight: 600;
}
.art-freq-card__value--accent {
  color: #b0242b;
  font-weight: 700;
}
.art-freq-arrow {
  color: #8e706e;
  font-size: 28rpx;
  font-weight: 700;
}

/* 版权声明 */

/* 话题标签 */
.art-tags {
  display: flex;
  flex-wrap: wrap;
}

/* 互动栏 */
.art-engage {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 24rpx 0;
  border-radius: 20rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.04);
}
.art-engage__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.art-engage__circle {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #f0eded;
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-engage__circle--on {
  background: #ffdad7;
}
.art-engage__circle--muted {
  opacity: 0.45;
}
.art-engage__circle--reward {
  background: #ffedd5;
}
.art-engage__reward-text {
  color: #d97706;
  font-size: 34rpx;
  font-weight: 700;
}
.art-engage__label {
  color: #5a413f;
  font-size: 22rpx;
  font-weight: 700;
}
.art-engage__label--on {
  color: #b0242b;
}
.art-engage__label--muted {
  color: #8e706e;
  font-weight: 500;
}

/* 评论 */
.art-comments {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.art-comments__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.art-comments__title-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.art-comments__title {
  color: #1b1c1c;
  font-size: 28rpx;
  font-weight: 700;
}
.art-comments__count {
  color: #8e706e;
  font-size: 22rpx;
}
.art-comment {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}
.art-comment__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.art-comment__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.art-comment__name-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}
.art-comment__name {
  color: #1b1c1c;
  font-size: 22rpx;
  font-weight: 700;
}
.art-comment__badge {
  padding: 0 8rpx;
  border-radius: 4rpx;
  background: #ffdad8;
  flex-shrink: 0;
}
.art-comment__badge-text {
  color: #410006;
  font-size: 16rpx;
}
.art-comment__like {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}
.art-comment__like-count {
  color: #8e706e;
  font-size: 20rpx;
}
.art-comment__like-count.is-on {
  color: #b0242b;
}
.art-comment__meta {
  color: #8e706e;
  font-size: 18rpx;
}
.art-comment__text {
  margin-top: 4rpx;
  color: #1b1c1c;
  font-size: 24rpx;
  line-height: 1.6;
}
.art-comment__reply {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 8rpx;
  padding: 14rpx;
  border-radius: 12rpx;
  background: #f6f3f2;
}
.art-comment__reply-text {
  color: #5a413f;
  font-size: 22rpx;
  line-height: 1.6;
}
.art-comment__reply-author {
  color: #b0242b;
  font-weight: 700;
}
.art-comment__reply-badge {
  margin: 0 6rpx;
  padding: 0 6rpx;
  border-radius: 4rpx;
  background: #d33e41;
  color: #fffbff;
  font-size: 16rpx;
}
.art-comment__reply-more {
  color: #005ea4;
  font-size: 18rpx;
}
.art-comments__all {
  padding: 20rpx 0;
  border-radius: 20rpx;
  background: #f0eded;
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-comments__all-text {
  color: #1b1c1c;
  font-size: 22rpx;
  font-weight: 600;
}

/* 相关推荐 */
.art-recs {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.art-recs__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.art-recs__title-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.art-recs__title-bar {
  width: 8rpx;
  height: 30rpx;
  border-radius: 999rpx;
  background: #b0242b;
}
.art-recs__title {
  color: #1b1c1c;
  font-size: 28rpx;
  font-weight: 700;
}
.art-recs__shuffle {
  display: flex;
  align-items: center;
  gap: 6rpx;
}
.art-recs__shuffle-text {
  color: #8e706e;
  font-size: 20rpx;
}
.art-rec__title {
  color: #1b1c1c;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.art-rec__title--clamp {
  -webkit-line-clamp: 2;
}
.art-rec__triple {
  display: flex;
  gap: 8rpx;
}
.art-rec__triple-item {
  flex: 1;
  height: 150rpx;
  border-radius: 8rpx;
  background: #f0eded;
  overflow: hidden;
}
.art-rec__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.art-rec__foot-left {
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}
.art-rec__hot {
  padding: 0 8rpx;
  border-radius: 4rpx;
  background: #ffdad6;
}
.art-rec__hot-text {
  color: #93000a;
  font-size: 18rpx;
}
.art-rec__video-badge {
  padding: 0 8rpx;
  border-radius: 4rpx;
  background: #d3e4ff;
}
.art-rec__video-badge-text {
  color: #005ea4;
  font-size: 18rpx;
  font-weight: 500;
}
.art-rec__source {
  color: #8e706e;
  font-size: 20rpx;
}
.art-rec__dot {
  color: #8e706e;
  font-size: 20rpx;
}
.art-rec__meta {
  color: #8e706e;
  font-size: 20rpx;
}
.art-rec__side {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.art-rec__side-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14rpx;
  min-height: 150rpx;
}
.art-rec__side-thumb {
  position: relative;
  width: 210rpx;
  height: 150rpx;
  flex-shrink: 0;
  border-radius: 8rpx;
  background: #f0eded;
  overflow: hidden;
}
.art-rec__play {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 48rpx;
  height: 48rpx;
  margin: -24rpx 0 0 -24rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.art-rec__duration {
  position: absolute;
  right: 6rpx;
  bottom: 6rpx;
  padding: 0 8rpx;
  border-radius: 4rpx;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-size: 18rpx;
}

/* 页末水印由 sn-divider 承载（见模板）。 */

/* ── 底部评论栏 ───────────────────────────────────────────────────────── */
.art-actionbar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx 32rpx calc(12rpx + env(safe-area-inset-bottom));
  background: rgba(252, 249, 248, 0.96);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}
.art-actionbar__input {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8rpx;
  height: 68rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: #f0eded;
}
.art-actionbar__placeholder {
  color: #8e706e;
  font-size: 22rpx;
}
.art-actionbar__acts {
  display: flex;
  align-items: center;
  gap: 4rpx;
  flex-shrink: 0;
}
.art-actionbar__act {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
