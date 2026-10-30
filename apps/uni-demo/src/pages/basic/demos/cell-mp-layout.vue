<script setup lang="ts">
/**
 * Demo: sn-cell — 布局形态（多行标题 / 列宽对齐 / 纵向排布 / 分组差异）。
 *
 * 与 basic 的信息行不同，这里聚焦几何：长标题折行不挤压右侧值、
 * title-width 固定标题列、layout=vertical 把内容换到标题下方、
 * insert / border=false 两种分组外观对比。
 */
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">多行标题（长标题自动折行，右侧值保持一行）</text>
    <SnCellGroup border>
      <SnCell title="是否允许在移动网络下自动播放视频与动图" value="仅 Wi-Fi" />
      <SnCell title="深色模式跟随系统" value="开启" />
    </SnCellGroup>

    <text class="sn-demo__label">列宽对齐（title-width 固定标题列，value 靠左对齐）</text>
    <SnCellGroup border :title-width="140" value-align="left">
      <SnCell title="昵称" value="Ada" />
      <SnCell title="生日" value="1990-08-15" />
      <SnCell title="所在城市" value="杭州" />
    </SnCellGroup>

    <text class="sn-demo__label">纵向排布（layout=vertical，内容换到标题下方并允许换行）</text>
    <SnCellGroup border layout="vertical">
      <SnCell title="详细地址" value="浙江省杭州市西湖区文三路 100 号 A 座 2001 室" />
      <SnCell title="备注" placeholder="选填，收货前请电联" value-align="left" />
    </SnCellGroup>

    <text class="sn-demo__label">分组差异（insert 圆角卡片 vs 无边框通栏）</text>
    <SnCellGroup title="圆角卡片" insert>
      <SnCell title="消息通知" value="已开启" />
      <SnCell title="免打扰" value="关闭" />
    </SnCellGroup>
    <SnCellGroup title="无边框" :border="false">
      <SnCell title="消息通知" value="已开启" />
      <SnCell title="免打扰" value="关闭" />
    </SnCellGroup>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
