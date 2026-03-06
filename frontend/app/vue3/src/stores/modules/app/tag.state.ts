import {defineStore} from 'pinia';

import {
  createTagServiceClient,
} from '@/api/generated/app/service/v1';
import {type Paging, requestClientRequestHandler,} from "@/transport/rpc/request";
import {makeOrderBy, makeQueryString, makeUpdateMask} from "@/transport/rpc";
import {useUserStore} from "@/stores";
import {currentLocaleLanguageCode} from "@/locales";

export const useTagStore = defineStore('tag', () => {
  const service = createTagServiceClient(requestClientRequestHandler);
  const userStore = useUserStore();

  /**
   * 查询标签列表
   */
  async function listTag(
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
    return await service.ListTag({
      fieldMask,
      orderBy: makeOrderBy(orderBy),
      query: makeQueryString(formValues, userStore.isTenantUser()),
      page: paging?.page,
      pageSize: paging?.pageSize,
      noPaging,
    });
  }

  /**
   * 获取标签
   */
  async function getTag(id: number) {
    return await service.GetTag({id});
  }

  /**
   * 创建标签
   */
  async function createTag(values: Record<string, any> = {}) {
    return await service.CreateTag({
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
    });
  }

  /**
   * 更新标签
   */
  async function updateTag(id: number, values: Record<string, any> = {}) {
    return await service.UpdateTag({
      id,
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
      updateMask: makeUpdateMask(Object.keys(values ?? [])),
    });
  }

  /**
   * 删除标签
   */
  async function deleteTag(id: number) {
    return await service.DeleteTag({id});
  }

  function $reset() {
  }

  return {
    $reset,
    listTag,
    getTag,
    createTag,
    updateTag,
    deleteTag,
  };
});
