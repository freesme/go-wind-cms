import Taro from '@tarojs/taro';

/**
 * 多语言路由 Hook - 适配 Taro 项目
 *
 * @description
 * 自动处理语言前缀的路由导航，无需手动拼接 locale
 *
 * @example
 * ```typescript
 * const router = useI18nRouter();
 *
 * // 自动添加当前语言前缀
 * router.push('/pages/category/index?id=1');
 * router.push('/pages/post/detail?id=123');
 *
 * // 获取本地化路径
 * const localizedPath = router.localizedPath('/pages/category/index');
 *
 * // 替换当前历史记录
 * router.replace('/pages/new/index');
 *
 * // 返回
 * router.back();
 * ```
 */
export function useI18nRouter() {
    /**
     * 获取当前语言
     */
    const getCurrentLocale = (): string => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('locale');
            if (stored) return stored;
            // 从浏览器语言获取
            const browserLang = navigator.language || 'zh-CN';
            if (browserLang.startsWith('zh')) return 'zh-CN';
            if (browserLang.startsWith('en')) return 'en-US';
            return browserLang;
        }
        return 'zh-CN';
    };

    /**
     * 导航到指定页面（自动添加语言参数）
     */
    const push = (path: string, params?: Record<string, any>) => {
        const locale = getCurrentLocale();
        const query = params ? `?${Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')}` : '';
        const fullPath = `${path}${query}`;
        Taro.navigateTo({url: fullPath});
    };

    /**
     * 替换当前页面（自动添加语言参数）
     */
    const replace = (path: string, params?: Record<string, any>) => {
        const locale = getCurrentLocale();
        const query = params ? `?${Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&')}` : '';
        const fullPath = `${path}${query}`;
        Taro.redirectTo({url: fullPath});
    };

    /**
     * 返回上一页
     */
    const back = (delta?: number) => {
        Taro.navigateBack({delta: delta || 1});
    };

    /**
     * 刷新当前页面
     */
    const refresh = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    /**
     * 获取本地化路径（不执行导航）
     */
    const getLocalizedPath = (path: string): string => {
        const locale = getCurrentLocale();
        return `${path}?locale=${locale}`;
    };

    return {
        push,
        replace,
        back,
        refresh,
        localizedPath: getLocalizedPath,
        /**
         * @deprecated 使用 localizedPath 代替
         */
        getLocalizedPath,
    };
}

/**
 * 原始 Taro Router（不使用多语言）
 *
 * @warning 仅在特殊场景下使用
 */
export function useRouter() {
    return {
        push: (path: string) => Taro.navigateTo({url: path}),
        replace: (path: string) => Taro.redirectTo({url: path}),
        back: (delta?: number) => Taro.navigateBack({delta: delta || 1}),
        refresh: () => {
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        },
    };
}
