import { computed } from 'vue';

import { $t } from '@vben/locales';

export const enableList = computed(() => [
  { value: 'true', label: $t('enum.enable.true') },
  { value: 'false', label: $t('enum.enable.false') },
]);

export const enableBoolList = computed(() => [
  { value: true, label: $t('enum.enable.true') },
  { value: false, label: $t('enum.enable.false') },
]);

export const successStatusList = computed(() => [
  { value: true, label: $t('enum.successStatus.success') },
  { value: false, label: $t('enum.successStatus.failed') },
]);

/**
 * 状态转颜色值
 * @param enable 状态值
 */
export function enableBoolToColor(
  enable: 'false' | 'FALSE' | 'False' | 'true' | 'TRUE' | 'True' | boolean,
) {
  switch (enable) {
    case false:
    case 'false':
    case 'FALSE':
    case 'False': {
      // 停用 → 标准红色（更醒目、语义更强）
      return '#F53F3F';
    }
    case true:
    case 'true':
    case 'TRUE':
    case 'True': {
      // 启用 → 标准成功绿（柔和、高级）
      return '#00B42A';
    }
    default: {
      // 未定义 → 中性灰
      return '#86909C';
    }
  }
}

export function enableBoolToName(
  enable: 'false' | 'FALSE' | 'False' | 'true' | 'TRUE' | 'True' | boolean,
) {
  switch (enable) {
    case true:
    case 'true':
    case 'TRUE':
    case 'True': {
      return $t('enum.enable.true');
    }

    default: {
      return $t('enum.enable.false');
    }
  }
}

export const statusList = computed(() => [
  { value: 'ON', label: $t('enum.status.ON') },
  { value: 'OFF', label: $t('enum.status.OFF') },
]);

/**
 * 状态转名称
 * @param status 状态值
 */
export function statusToName(status: 'OFF' | 'ON' | undefined) {
  const values = statusList.value;
  const matchedItem = values.find((item) => item.value === status);
  return matchedItem ? matchedItem.label : '';
}

/**
 * 状态转颜色值
 * @param status 状态值
 */
export function statusToColor(status: 'OFF' | 'ON' | undefined) {
  switch (status) {
    case 'OFF': {
      // 关闭 / 停用 → 标准红色（行业通用，一眼识别）
      return '#F53F3F';
    }
    case 'ON': {
      // 开启 / 正常 → 标准成功绿（柔和、专业）
      return '#00B42A';
    }
    default: {
      // 未定义 / 异常 → 中性灰
      return '#86909C';
    }
  }
}

export const methodList = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'PATCH', label: 'PATCH' },
  { value: 'DELETE', label: 'DELETE' },
];
