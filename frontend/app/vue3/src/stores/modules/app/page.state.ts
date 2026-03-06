import {defineStore} from 'pinia';

import {
  createPageServiceClient,
} from '@/api/generated/app/service/v1';
import {type Paging, requestClientRequestHandler} from "@/transport/rpc/request";
import {useUserStore} from "@/stores";
import {makeOrderBy, makeQueryString, makeUpdateMask} from "@/transport/rpc";
import {currentLocaleLanguageCode} from "@/locales";

export const usePageStore = defineStore('page', () => {
  const service = createPageServiceClient(requestClientRequestHandler);
  const userStore = useUserStore();

  /**
   * 查询页面列表
   */
  async function listPage(
    paging?: Paging,
    formValues?: null | object,
    fieldMask?: null | string,
    orderBy?: null | string[],
  ) {
    const locale = currentLocaleLanguageCode();
    formValues = {
      ...formValues,
      locale,
    };

    const noPaging =
      paging?.page === undefined && paging?.pageSize === undefined;
    // @ts-ignore proto generated code is error.
    return await service.List({
      fieldMask,
      orderBy: makeOrderBy(orderBy),
      query: makeQueryString(formValues, userStore.isTenantUser()),
      page: paging?.page,
      pageSize: paging?.pageSize,
      noPaging,
    });
  }

  /**
   * 获取页面
   */
  async function getPage(id: number) {
    return await service.Get({id});
  }

  /**
   * 创建页面
   */
  async function createPage(values: Record<string, any> = {}) {
    return await service.Create({
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
    });
  }

  /**
   * 更新页面
   */
  async function updatePage(id: number, values: Record<string, any> = {}) {
    return await service.Update({
      id,
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
      updateMask: makeUpdateMask(Object.keys(values ?? [])),
    });
  }

  /**
   * 删除页面
   */
  async function deletePage(id: number) {
    return await service.Delete({id});
  }

  function $reset() {
  }

  return {
    $reset,
    listPage,
    getPage,
    createPage,
    updatePage,
    deletePage,
  };
});
