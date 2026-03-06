/**
 * 语言切换效果 - 使用 API 参数方式（方案 1）
 * 这是最简单、最快的实现方式
 *
 * @example
 * const { refreshLanguageDependentData } = useLanguageSwitchEffect();
 * await refreshLanguageDependentData();
 */

import {currentLocaleLanguageCode} from '@/locales';
import {usePostStore, useCategoryStore, useTagStore, useNavigationStore} from '@/stores';

export function useLanguageSwitchEffect() {
  const postStore = usePostStore();
  const categoryStore = useCategoryStore();
  const tagStore = useTagStore();
  const navigationStore = useNavigationStore();

  /**
   * 刷新所有语言相关的数据
   * 使用新的 languageCode 重新从 API 获取数据
   */
  async function refreshLanguageDependentData() {
    const languageCode = currentLocaleLanguageCode();

    console.log('[Language Switch] Refreshing data with languageCode:', languageCode);

    try {
      // ✅ 并行请求所有语言相关的数据
      // 这些请求会立即返回新语言的数据，UI 会自动更新
      await Promise.all([
        // 获取文章列表
        postStore.listPost({page: 1, pageSize: 10}, {}, languageCode),

        // 获取分类列表
        categoryStore.listCategory({page: 1, pageSize: 10}, {}, languageCode),

        // 获取标签列表
        tagStore.listTag({page: 1, pageSize: 10}, {}, languageCode),

        // 获取导航数据
        navigationStore.listNavigation(
          {page: 1, pageSize: 10},
          {locale: languageCode === 'zh-CN' ? 'zhCN' : 'enUS'}
        ),
      ]);

      console.log('[Language Switch] ✅ Data refreshed successfully');
      return true;
    } catch (error) {
      console.error('[Language Switch] ❌ Failed to refresh data:', error);

      // 可选：显示错误提示
      // $message.error('Failed to load translations. Please try again.');

      return false;
    }
  }

  /**
   * 仅刷新当前页面所需的数据（性能优化）
   * @param pageType - 页面类型：'home' | 'post' | 'category' | 'tag'
   */
  async function refreshDataForPage(pageType: 'home' | 'post' | 'category' | 'tag' | 'navigation') {
    const languageCode = currentLocaleLanguageCode();

    console.log(`[Language Switch] Refreshing ${pageType} data`);

    try {
      const refreshMap: Record<string, () => Promise<any>> = {
        home: () => Promise.all([
          postStore.listPost({page: 1, pageSize: 10}, {}, languageCode),
          categoryStore.listCategory({page: 1, pageSize: 10}, {}, languageCode),
          tagStore.listTag({page: 1, pageSize: 10}, {}, languageCode),
        ]),
        post: () => postStore.listPost({page: 1, pageSize: 20}, {}, languageCode),
        category: () => categoryStore.listCategory({page: 1, pageSize: 10}, {}, languageCode),
        tag: () => tagStore.listTag({page: 1, pageSize: 20}, {}, languageCode),
        navigation: () => navigationStore.listNavigation(
          {page: 1, pageSize: 10},
          {locale: languageCode === 'zh-CN' ? 'zhCN' : 'enUS'}
        ),
      };

      const refreshFn = refreshMap[pageType];
      if (refreshFn) {
        await refreshFn();
        console.log(`[Language Switch] ✅ ${pageType} data refreshed`);
        return true;
      }

      return false;
    } catch (error) {
      console.error(`[Language Switch] ❌ Failed to refresh ${pageType} data:`, error);
      return false;
    }
  }

  return {
    refreshLanguageDependentData,
    refreshDataForPage,
  };
}

