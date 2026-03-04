import {defineStore} from 'pinia';

import {
  createTagServiceClient,
} from '@/api/generated/app/service/v1';
import {requestClientRequestHandler,} from "@/transport/rpc/request";
import {makeUpdateMask} from "@/transport/rpc";

export const useTagStore = defineStore('tag', () => {
  const service = createTagServiceClient(requestClientRequestHandler);

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
    getTag,
    createTag,
    updateTag,
    deleteTag,
  };
});
