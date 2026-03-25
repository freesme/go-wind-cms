import { computed } from 'vue';

import { $t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

import {
  createNavigationServiceClient,
  type siteservicev1_Navigation_Location,
} from '#/generated/api/admin/service/v1';
import { makeOrderBy, makeQueryString, makeUpdateMask } from '#/utils/query';
import { type Paging, requestClientRequestHandler } from '#/utils/request';

export const useNavigationStore = defineStore('navigation', () => {
  const service = createNavigationServiceClient(requestClientRequestHandler);
  const userStore = useUserStore();

  /**
   * 查询导航列表
   */
  async function listNavigation(
    paging?: Paging,
    formValues?: null | object,
    fieldMask?: null | string,
    orderBy?: null | string[],
  ) {
    const noPaging =
      paging?.page === undefined && paging?.pageSize === undefined;
    return await service.List({
      // @ts-ignore proto generated code is error.
      fieldMask,
      orderBy: makeOrderBy(orderBy),
      query: makeQueryString(formValues, userStore.isTenantUser()),
      page: paging?.page,
      pageSize: paging?.pageSize,
      noPaging,
    });
  }

  /**
   * 获取导航
   */
  async function getNavigation(id: number) {
    return await service.Get({ id });
  }

  /**
   * 创建导航
   */
  async function createNavigation(values: Record<string, any> = {}) {
    return await service.Create({
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
    });
  }

  /**
   * 更新导航
   */
  async function updateNavigation(
    id: number,
    values: Record<string, any> = {},
  ) {
    return await service.Update({
      id,
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
      // @ts-ignore proto generated code is error.
      updateMask: makeUpdateMask(Object.keys(values ?? [])),
    });
  }

  /**
   * 删除导航
   */
  async function deleteNavigation(id: number) {
    return await service.Delete({ id });
  }

  function $reset() {}

  return {
    $reset,
    listNavigation,
    getNavigation,
    createNavigation,
    updateNavigation,
    deleteNavigation,
  };
});

export const navigationLocationList = computed(() => [
  {
    value: 'HEADER',
    label: $t('enum.navigation.location.HEADER'),
  },
  {
    value: 'FOOTER',
    label: $t('enum.navigation.location.FOOTER'),
  },
  {
    value: 'SIDEBAR',
    label: $t('enum.navigation.location.SIDEBAR'),
  },
  {
    value: 'MOBILE',
    label: $t('enum.navigation.location.MOBILE'),
  },
  {
    value: 'TOP_BAR',
    label: $t('enum.navigation.location.TOP_BAR'),
  },
  {
    value: 'OFFCANVAS',
    label: $t('enum.navigation.location.OFFCANVAS'),
  },
]);

export function navigationLocationToName(
  location: siteservicev1_Navigation_Location,
) {
  const values = navigationLocationList.value;
  const matchedItem = values.find((item) => item.value === location);
  return matchedItem ? matchedItem.label : '';
}

const NAVIGATION_LOCATION_COLOR_MAP = {
  HEADER: '#6366f1', // 头部：柔和紫蓝（高级、醒目不刺眼）
  FOOTER: '#059669', // 底部：沉稳绿（信任、清爽）
  SIDEBAR: '#d97706', // 侧边栏：暖金（柔和不艳）
  MOBILE: '#dc2626', // 移动端：暗红（警示、统一）
  TOP_BAR: '#dc2626', // 顶栏：同移动端
  OFFCANVAS: '#dc2626', // 抽屉：同移动端
  DEFAULT: '#94a3b8', // 默认：中性灰（保留原优质色）
} as const;

export function navigationLocationToColor(
  location: siteservicev1_Navigation_Location,
) {
  return (
    NAVIGATION_LOCATION_COLOR_MAP[
      location as keyof typeof NAVIGATION_LOCATION_COLOR_MAP
    ] || NAVIGATION_LOCATION_COLOR_MAP.DEFAULT
  );
}
