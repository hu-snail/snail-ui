---
outline: false
aside: false
prev: false
next: false
---

<script setup lang="ts">
import SnDocPage from '../../.vitepress/components/doc-page/SnDocPage.vue';
import { selectPickerDocPage } from '../../.vitepress/utils/doc-pages/uni/select-picker';
</script>

<SnDocPage :doc="selectPickerDocPage" />
