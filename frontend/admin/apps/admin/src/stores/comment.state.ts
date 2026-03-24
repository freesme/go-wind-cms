import { computed } from 'vue';

import { $t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

import {
  type commentservicev1_Comment_AuthorType as Comment_AuthorType,
  type commentservicev1_Comment_ContentType as Comment_ContentType,
  type commentservicev1_Comment_Status as Comment_Status,
  createCommentServiceClient,
} from '#/generated/api/admin/service/v1';
import { makeOrderBy, makeQueryString, makeUpdateMask } from '#/utils/query';
import { type Paging, requestClientRequestHandler } from '#/utils/request';

export const useCommentStore = defineStore('comment', () => {
  const service = createCommentServiceClient(requestClientRequestHandler);
  const userStore = useUserStore();

  /**
   * 查询评论列表
   */
  async function listComment(
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
   * 获取评论
   */
  async function getComment(id: number) {
    return await service.Get({ id });
  }

  /**
   * 创建评论
   */
  async function createComment(values: Record<string, any> = {}) {
    return await service.Create({
      // @ts-ignore proto generated code is error.
      data: {
        ...values,
      },
    });
  }

  /**
   * 更新评论
   */
  async function updateComment(id: number, values: Record<string, any> = {}) {
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
   * 删除评论
   */
  async function deleteComment(id: number) {
    return await service.Delete({ id });
  }

  function $reset() {}

  return {
    $reset,
    listComment,
    getComment,
    createComment,
    updateComment,
    deleteComment,
  };
});

export const commentStatusList = computed(() => [
  { value: 'STATUS_PENDING', label: $t('enum.comment.status.STATUS_PENDING') },
  {
    value: 'STATUS_APPROVED',
    label: $t('enum.comment.status.STATUS_APPROVED'),
  },
  {
    value: 'STATUS_REJECTED',
    label: $t('enum.comment.status.STATUS_REJECTED'),
  },
  {
    value: 'STATUS_SPAM',
    label: $t('enum.comment.status.STATUS_SPAM'),
  },
]);

export function commentStatusToName(status: Comment_Status) {
  const values = commentStatusList.value;
  const matchedItem = values.find((item) => item.value === status);
  return matchedItem ? matchedItem.label : '';
}

const COMMENT_STATUS_COLOR_MAP = {
  // 待审核 - 中性蓝（代表等待、处理中，无情绪倾向）
  STATUS_PENDING: '#60a5fa',
  // 已通过 - 健康绿（代表成功、确认、正常）
  STATUS_APPROVED: '#22c55e',
  // 已拒绝 - 警示橙（代表提醒、拒绝，强度低于错误）
  STATUS_REJECTED: '#f97316',
  // 垃圾评论 - 警示红（代表错误、危险、需注意）
  STATUS_SPAM: '#ef4444',
  // 默认值 - 中性灰（无明确状态时的兜底色，避免情绪倾向）
  DEFAULT: '#94a3b8',
} as const;

export function commentStatusToColor(status: Comment_Status) {
  return (
    COMMENT_STATUS_COLOR_MAP[status as keyof typeof COMMENT_STATUS_COLOR_MAP] ||
    COMMENT_STATUS_COLOR_MAP.DEFAULT
  );
}

export const commentContentTypeList = computed(() => [
  {
    value: 'CONTENT_TYPE_POST',
    label: $t('enum.comment.contentType.CONTENT_TYPE_POST'),
  },
  {
    value: 'CONTENT_TYPE_PAGE',
    label: $t('enum.comment.contentType.CONTENT_TYPE_PAGE'),
  },
  {
    value: 'CONTENT_TYPE_PRODUCT',
    label: $t('enum.comment.contentType.CONTENT_TYPE_PRODUCT'),
  },
]);

export function commentContentTypeToName(
  commentContentType: Comment_ContentType,
) {
  const values = commentContentTypeList.value;
  const matchedItem = values.find((item) => item.value === commentContentType);
  return matchedItem ? matchedItem.label : '';
}

const COMMENT_CONTENT_TYPE_COLOR_THEME = {
  light: {
    // 帖子 - 专业沉稳蓝（文本内容主色，辨识度高）
    CONTENT_TYPE_POST: '#2563eb',
    // 页面 - 雅致柔和紫（静态页面，优雅不艳俗）
    CONTENT_TYPE_PAGE: '#7c3aed',
    // 产品 - 温暖活力橙（商品实物，醒目不刺眼）
    CONTENT_TYPE_PRODUCT: '#ea580c',
  },
  dark: {
    // 深色模式-帖子：柔和明亮蓝，深色背景清晰舒适
    CONTENT_TYPE_POST: '#3b82f6',
    // 深色模式-页面：低饱和柔紫，护眼不突兀
    CONTENT_TYPE_PAGE: '#8b5cf6',
    // 深色模式-产品：暖调柔橙，融合度更高
    CONTENT_TYPE_PRODUCT: '#fdba74',
  },
} as const;

export function commentContentTypeToColor(
  commentContentType: Comment_ContentType,
  theme: 'dark' | 'light' = 'light',
): string {
  const colorMap = COMMENT_CONTENT_TYPE_COLOR_THEME[theme];
  return (
    colorMap[commentContentType as keyof typeof colorMap] ||
    colorMap.CONTENT_TYPE_POST
  );
}

export const commentAuthorTypeList = computed(() => [
  {
    value: 'AUTHOR_TYPE_GUEST',
    label: $t('enum.comment.authorType.AUTHOR_TYPE_GUEST'),
  },
  {
    value: 'AUTHOR_TYPE_USER',
    label: $t('enum.comment.authorType.AUTHOR_TYPE_USER'),
  },
  {
    value: 'AUTHOR_TYPE_ADMIN',
    label: $t('enum.comment.authorType.AUTHOR_TYPE_ADMIN'),
  },
  {
    value: 'AUTHOR_TYPE_MODERATOR',
    label: $t('enum.comment.authorType.AUTHOR_TYPE_MODERATOR'),
  },
]);

export function commentAuthorTypeToName(authorType: Comment_AuthorType) {
  const values = commentAuthorTypeList.value;
  const matchedItem = values.find((item) => item.value === authorType);
  return matchedItem ? matchedItem.label : '';
}

const COMMENT_AUTHOR_TYPE_COLOR_MAP = {
  // 访客 - 友好的浅蓝色（偏中性，不刺眼）
  AUTHOR_TYPE_GUEST: '#64748b',
  // 普通用户 - 品牌主色调/友好的绿色（代表常规、安全）
  AUTHOR_TYPE_USER: '#10b981',
  // 管理员 - 醒目的深蓝色（代表权威、管理）
  AUTHOR_TYPE_ADMIN: '#3b82f6',
  // 版主/版务 - 暖橙色（介于管理员和警告色之间，代表管理但非最高权限）
  AUTHOR_TYPE_MODERATOR: '#f97316',
  // 默认值 - 中性灰色（避免使用警示色作为默认）
  DEFAULT: '#94a3b8',
} as const;

export function commentAuthorTypeToColor(authorType: Comment_AuthorType) {
  return (
    COMMENT_AUTHOR_TYPE_COLOR_MAP[
      authorType as keyof typeof COMMENT_AUTHOR_TYPE_COLOR_MAP
    ] || COMMENT_AUTHOR_TYPE_COLOR_MAP.DEFAULT
  );
}
