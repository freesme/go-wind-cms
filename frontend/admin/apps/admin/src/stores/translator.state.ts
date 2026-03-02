import { defineStore } from 'pinia';

import { createTranslatorServiceClient } from '#/generated/api/admin/service/v1';
import { requestClientRequestHandler } from '#/utils/request';

export const useTranslatorStore = defineStore('translator', () => {
  const service = createTranslatorServiceClient(requestClientRequestHandler);

  /**
   * 翻译
   */
  async function translate(targetLanguage: string, content: string) {
    return await service.Translate({
      sourceLanguage: 'auto',
      targetLanguage,
      content,
    });
  }

  function $reset() {}

  return {
    $reset,
    translate,
  };
});
