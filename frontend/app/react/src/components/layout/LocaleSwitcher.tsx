import React from 'react';
import {useI18n} from '@/i18n';
import {Select} from 'antd';

/**
 * 语言切换选择器组件
 *
 * 通常用于 Header 或导航栏中，供用户切换界面语言
 *
 * @example
 * ```tsx
 * import {LocaleSwitcher} from '@/components/layout/LocaleSwitcher';
 *
 * // 在 Header 组件中使用
 * <header>
 *   <Logo />
 *   <nav>...</nav>
 *   <LocaleSwitcher />
 * </header>
 * ```
 */
export const LocaleSwitcher: React.FC = () => {
    const {t, locale, changeLocale} = useI18n('menu');

    const localeOptions = [
        {value: 'zh-CN', label: '简体中文'},
        {value: 'en-US', label: 'English'},
    ];

    return (
        <Select
            value={locale}
            onChange={changeLocale}
            options={localeOptions}
            size="small"
            style={{width: 100}}
            aria-label="Language switcher"
        />
    );
};
