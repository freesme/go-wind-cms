<script setup lang='ts'>
import {definePage} from "unplugin-vue-router/runtime";
import { $t } from '@/locales'

definePage({
  name: 'about',
  meta: {
    level: 2,
  },
})
</script>

<template>
  <div class="pt-80 text-center text-20">
    {{ $t('page.about_page') || 'About' }}
  </div>
</template>

<style scoped lang='less'></style>
