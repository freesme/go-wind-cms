<script setup lang="ts">
import {h} from 'vue';

import {useNavbarStore} from "@/stores";

import type {TopNavBarTabItem} from "./types";
import TopNavbarTab from './TopNavbarTab.vue';

const navbarStore = useNavbarStore();

const leftTabList: TopNavBarTabItem[] = []
const rightTabList: TopNavBarTabItem[] = [];

/**
 * 隐藏所有的悬浮层
 */
function hideOverlay() {
  navbarStore.setActiveOverlay(null);
}

</script>

<template>
  <n-space justify="space-between">
    <n-space align="center">
      <n-tabs
        v-model:value="navbarStore.activeOverlay"
        type="bar"
        trigger="hover"
        animated
        @mouseleave="hideOverlay"
      >
        <n-tab-pane
          v-for="item in leftTabList" :key="item.key" :name="item.key"
          :tab="() => h(TopNavbarTab, { data: item })"
        >
          <div class="overlay-mask">
            <div class="overlay">
              <component :is="item.component" class="stick-content"/>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-space>

    <n-space align="center">
      <n-tabs
        v-model:value="navbarStore.activeOverlay"
        type="bar"
        trigger="hover"
        animated
        @mouseleave="hideOverlay"
      >
        <n-tab-pane
          v-for="item in rightTabList" :key="item.key" :name="item.key"
          :tab="() => h(TopNavbarTab, { data: item })"
        >
          <div class="overlay-mask">
            <div class="overlay">
              <transition name="fade" mode="out-in">
                <component :is="item.component" class="stick-content"/>
              </transition>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </n-space>
</template>

<style scoped lang="less">
@import '@/styles/app.less';

.overlay {
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  z-index: 9999;
  pointer-events: auto;
  min-height: 15vh;
  color: var(--color-text-primary);
}

.overlay-mask {
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 9998;
  pointer-events: none;
}

// Tabs 样式
:deep(.n-tabs) {
  color: var(--color-text-primary);
}

// Tab 项样式
:deep(.n-tabs-tab) {
  color: var(--color-text-primary) !important;
  padding: 8px 16px;
}

:deep(.n-tabs-tab:hover) {
  color: var(--color-brand) !important;
  background: rgba(102, 126, 234, 0.05);
}

// 激活的 Tab
:deep(.n-tabs-tab--active) {
  color: var(--color-brand) !important;
}

// Tab 下划线
:deep(.n-tabs-bar) {
  background-color: var(--color-brand);
}

// Tab 内容
:deep(.n-tabs-tab__label) {
  color: inherit;
}

// Space 组件
:deep(.n-space) {
  color: var(--color-text-primary);
}

.default-enter-active {
  transition: all 0.3s ease-in;
}

.default-leave-active {
  transition: all 0.3s ease-out;
}

.default-enter,
.default-leave-to {
  max-height: 0;
}
</style>
