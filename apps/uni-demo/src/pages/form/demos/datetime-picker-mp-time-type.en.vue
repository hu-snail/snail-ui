<script setup lang="ts">
/** Demo: sn-datetime-picker — time type (`type="time"`): writes back an `HH:mm` string. */
import { ref } from 'vue';
import SnDatetimePicker from '@snui/uni-src/components/sn-datetime-picker/sn-datetime-picker.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import { Clock } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const time = ref<string | number | undefined>('10:30');
const open = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCellGroup insert>
      <SnCell
        title="Time"
        label="type=time writes back an HH:mm string"
        :prefix-icon-data="Clock"
        placeholder="Select"
        :value="time ? String(time) : ''"
        is-link
        @click="open = true"
      />
    </SnCellGroup>

    <SnDatetimePicker v-model="time" v-model:visible="open" type="time" title="Pick a time" />
  </view>
</template>
