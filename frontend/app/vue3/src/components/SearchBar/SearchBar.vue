<script setup lang="ts">
import {ref} from 'vue';
import {SearchOutline} from "@vicons/ionicons5";

import {$t} from "@/locales";

const props = withDefaults(
  defineProps<{
    round?: boolean
  }>(),
  {
    round: false,
  }
);

const searchQuery = ref('');

function handleSearch() {
  console.log('Searching for:', searchQuery.value);
}
</script>

<template>
  <n-input
    :round="props.round"
    class="search-bar"
    v-model:value="searchQuery"
    :placeholder="$t('navbar.top.search_placeholder')"
    @keyup="handleSearch"
  >
    <template #prefix>
      <n-icon :component="SearchOutline"/>
    </template>
  </n-input>
</template>

<style scoped lang="less">
.search-bar {
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 20px;

  /* force visible input border/text in light header */
  --n-color: #ffffff;
  --n-color-focus: #ffffff;
  --n-text-color: var(--color-text-primary);
  --n-placeholder-color: var(--color-text-secondary);
  --n-border: 1px solid #cfd6e4;
  --n-border-hover: 1px solid var(--color-brand);
  --n-border-focus: 1px solid var(--color-brand);
  --n-border-radius: 8px;
  --n-box-shadow-focus: 0 0 0 2px rgba(102, 126, 234, 0.14);

  :deep(.n-input-wrapper) {
    background: #ffffff;
    border-radius: 8px !important;
    box-shadow: inset 0 0 0 1px #cfd6e4 !important;
  }

  :deep(.n-input-wrapper:hover) {
    border-radius: 8px !important;
    box-shadow: inset 0 0 0 1px var(--color-brand) !important;
  }

  :deep(.n-input.n-input--focus .n-input-wrapper) {
    border-radius: 8px !important;
    box-shadow: inset 0 0 0 1px var(--color-brand), 0 0 0 2px rgba(102, 126, 234, 0.14) !important;
  }

  :deep(.n-input__input-el) {
    color: var(--color-text-primary) !important;
  }

  :deep(.n-input__placeholder) {
    color: var(--color-text-secondary) !important;
  }

  :deep(.n-input__prefix .n-icon) {
    color: var(--color-text-secondary) !important;
  }
}
</style>
