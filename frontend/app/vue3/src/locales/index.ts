import {
  i18n,
  languageColumns,
  languageShorts,
  loadLocaleMessages,
  loadLocalesMap,
  loadLocalesMapFromDir,
  setupI18n,
  setI18nLanguage,
} from './i18n';

const $t = i18n.global.t;

export {
  $t,
  i18n,
  languageColumns,
  languageShorts,
  loadLocaleMessages,
  loadLocalesMap,
  loadLocalesMapFromDir,
  setupI18n,
  setI18nLanguage,
};

export {
  type ImportLocaleFn,
  type LocaleSetupOptions,
  type SupportedLanguagesType,
} from './typing';

export type {CompileError} from '@intlify/core-base';

