import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {allMessages, defaultLocale, DEFAULT_LANGUAGE, locales, validateLocale, getFlattenedMessages} from './config';

// 获取扁平化后的消息
const flattenedMessages = getFlattenedMessages();

// 初始化 i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': {
        translation: flattenedMessages['zh-CN'],
      },
      'en-US': {
        translation: flattenedMessages['en-US'],
      },
    },
    lng: defaultLocale,
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
    // 支持嵌套的命名空间（如 page.home）
    nsSeparator: '.',
    keySeparator: '.',
  });

// 显式导出 config 中的内容
export {allMessages, defaultLocale, DEFAULT_LANGUAGE, locales, validateLocale};
export type {Locale} from './config';

// 导出 useI18n hook
export {useI18n} from './helpers/useI18n';


// 获取当前语言代码（如 zh-CN、en-US）
export function useCurrentLocaleLanguageCode(): string {
  return i18n.language || 'zh-CN';
}

// 获取当前语言代码（如 zh-CN、en-US）
export function currentLocaleLanguageCode(): string {
  if (typeof window !== 'undefined') {
    // 从 localStorage 获取
    let locale = localStorage.getItem('locale');
    // fallback 到浏览器语言
    if (!locale) locale = navigator.language || 'zh-CN';
    if (locale.startsWith('zh')) return 'zh-CN';
    if (locale.startsWith('en')) return 'en-US';
    return locale;
  }
  return 'zh-CN';
}
