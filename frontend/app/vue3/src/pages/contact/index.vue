<script setup lang="ts">
import {definePage} from 'unplugin-vue-router/runtime'
import {$t} from '@/locales'

definePage({
  name: 'contact',
  meta: {
    level: 2,
  },
})
</script>

<template>
  <div class="info-page">
    <div class="info-card stick-content section-shell">
      <h1 class="title">{{ $t('ui.button.contact_us') }}</h1>
      <p class="desc">{{ $t('page.legal.contact.description') }}</p>
      <ul class="list">
        <li>{{ $t('page.legal.contact.item_1') }}</li>
        <li>{{ $t('page.legal.contact.item_2') }}</li>
        <li>{{ $t('page.legal.contact.item_3') }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
.info-page {
  min-height: calc(100vh - var(--layout-header-height));
  background: var(--color-bg);
  padding: 24px 0;
}

.info-card {
  padding: 28px;
}

.title {
  margin: 0 0 12px;
  color: var(--color-text-primary);
}

.desc {
  margin: 0 0 12px;
  color: var(--color-text-secondary);
}

.list {
  margin: 0;
  padding-left: 18px;
  color: var(--color-text-primary);
  line-height: 1.8;
}
</style>
