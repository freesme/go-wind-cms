<script setup lang="ts">
</script>

<template>
  <div class="fixed-top">
    <div class="stick-content header-inner">
      <TopSearchBar/>
      <TopNavbar/>
    </div>
  </div>
</template>

<style scoped lang="less">
.fixed-top {
  width: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.header-inner {
  padding: var(--space-4) 0 var(--space-2);

  // 确保所有子元素继承正确的文字颜色
  :deep(*) {
    color: inherit;
  }

  // Naive UI 组件覆盖
  :deep(.n-button) {
    color: var(--color-text-primary);
  }

  :deep(.n-input) {
    color: var(--color-text-primary);
  }

  :deep(.n-tabs) {
    color: var(--color-text-primary);
  }
}
</style>
