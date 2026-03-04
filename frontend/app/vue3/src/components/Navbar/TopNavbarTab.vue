<script setup lang="ts">

import {$t} from "@/locales";

import type {TopNavBarTabItem} from "./types";
import {navigateTo} from "@/router";
import {useNavbarStore} from "@/stores";

const navbarStore = useNavbarStore();

const props = defineProps<{ data: TopNavBarTabItem }>();

/**
 * 隐藏所有的悬浮层
 */
function hideOverlay() {
  navbarStore.setActiveOverlay(null);
}

/**
 * 点击Tab
 * @param path
 */
function handleClickTab(path: string) {
  console.log('handleClickTab', path);

  navigateTo(path);

  hideOverlay();
}
</script>

<template>
  <div class="tab-title" style="align-items: center; display: flex;"
       @click="() => handleClickTab(props.data.path)">
    <n-icon v-show="props.data.icon != null" class="icon" style="margin-right: 4px;" size="16">
      <component :is="props.data.icon"/>
    </n-icon>
    <span>{{ $t(props.data.name) }}</span>
  </div>
</template>

<style scoped lang="less">

</style>
