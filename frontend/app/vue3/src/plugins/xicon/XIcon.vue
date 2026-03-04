<template>
  <Icon class="icon" v-bind="$attrs" tag="span" :size="size" :color="iconColor">
    <IconComponent/>
  </Icon>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import type {Component} from 'vue'
import {Icon} from '@vicons/utils'
import {Help} from '@vicons/carbon'
import icons from './icons'
import {preferences} from "@/preferences";

const props = withDefaults(
  defineProps<{
    name: string
    size?: number
    color?: string
  }>(),
  {
    size: 25,
    color: ''
  }
)

const iconColor = computed<string>(() => (props.color ? props.color : preferences.theme.colorPrimary))
const IconComponent = computed<Component>(() => {
  return icons[props.name] ? icons[props.name] : Help
})
</script>

<style lang="less" scoped>
.icon {
@apply h-full inline-flex justify-center items-center;
}
</style>
