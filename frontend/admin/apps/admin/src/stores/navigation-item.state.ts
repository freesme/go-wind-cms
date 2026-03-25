import { computed } from 'vue';

import { $t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

import {
  createNavigationItemServiceClient,
  type siteservicev1_NavigationItem_LinkType,
} from '#/generated/api/admin/service/v1';
import { makeOrderBy, makeQueryString, makeUpdateMask } from '#/utils/query';
import { type Paging, requestClientRequestHandler } from '#/utils/request';

export const useNavigationItemStore = defineStore('navigation-item', () => {
  const service = createNavigationItemServiceClient(
    requestClientRequestHandler,
  );
  const userStore = useUserStore();

  /**
   * 查询导航项列表
   */
  async function listNavigationItem(
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
   * 获取导航项
   */
  async function getNavigationItem(id: number) {
    return await service.Get({ id });
  }

  /**
   * 创建导航项
   */
  async function createNavigationItem(values: Record<string, any> = {}) {
    return await service.Create({
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
    });
  }

  /**
   * 更新导航项
   */
  async function updateNavigationItem(
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
   * 删除导航项
   */
  async function deleteNavigationItem(id: number) {
    return await service.Delete({ id });
  }

  function $reset() {}

  return {
    $reset,
    listNavigationItem,
    getNavigationItem,
    createNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
  };
});

export const navigationItemLinkTypeList = computed(() => [
  {
    value: 'LINK_TYPE_CUSTOM',
    label: $t('enum.navigationItem.linkType.LINK_TYPE_CUSTOM'),
  },
  {
    value: 'LINK_TYPE_POST',
    label: $t('enum.navigationItem.linkType.LINK_TYPE_POST'),
  },
  {
    value: 'LINK_TYPE_PAGE',
    label: $t('enum.navigationItem.linkType.LINK_TYPE_PAGE'),
  },
  {
    value: 'LINK_TYPE_CATEGORY',
    label: $t('enum.navigationItem.linkType.LINK_TYPE_CATEGORY'),
  },
  {
    value: 'LINK_TYPE_EXTERNAL',
    label: $t('enum.navigationItem.linkType.LINK_TYPE_EXTERNAL'),
  },
]);

export function navigationItemLinkTypeToName(
  linkType: siteservicev1_NavigationItem_LinkType,
) {
  const values = navigationItemLinkTypeList.value;
  const matchedItem = values.find((item) => item.value === linkType);
  return matchedItem ? matchedItem.label : '';
}

const NAVIGATION_ITEM_LINK_TYPE_COLOR_MAP = {
  LINK_TYPE_CUSTOM: '#6366f1', // 头部：柔和紫蓝（高级、醒目不刺眼）
  LINK_TYPE_POST: '#059669', // 底部：沉稳绿（信任、清爽）
  LINK_TYPE_PAGE: '#d97706', // 侧边栏：暖金（柔和不艳）
  LINK_TYPE_CATEGORY: '#dc2626', // 移动端：暗红（警示、统一）
  LINK_TYPE_EXTERNAL: '#dc2626', // 顶栏：同移动端
  DEFAULT: '#94a3b8', // 默认：中性灰（保留原优质色）
} as const;

export function navigationItemLinkTypeToColor(
  linkType: siteservicev1_NavigationItem_LinkType,
) {
  return (
    NAVIGATION_ITEM_LINK_TYPE_COLOR_MAP[
      linkType as keyof typeof NAVIGATION_ITEM_LINK_TYPE_COLOR_MAP
    ] || NAVIGATION_ITEM_LINK_TYPE_COLOR_MAP.DEFAULT
  );
}
