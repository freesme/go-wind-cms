'use client';

import {useState, useMemo} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';
import XIcon from '@/plugins/xicon';
import styles from './ControlPanel.module.css';

// 获取初始主题状态（仅在客户端调用）
function getInitialTheme(): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    return document.documentElement.classList.contains('dark');
}

export default function ControlPanel() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('authentication');
    
    const [isDark, setIsDark] = useState<boolean>(getInitialTheme);
    
    // 从 URL 中获取当前语言
    const currentLocale = pathname?.split('/')[1] || 'zh-CN';

    // 语言选项
    const languageOptions = useMemo(() => [
        {key: 'zh-CN', label: '中文'},
        {key: 'en-US', label: 'English'}
    ], []);

    // 切换语言
    const handleSelectLanguage = (key: string) => {
        const newPath = pathname?.replace(`/${currentLocale}`, `/${key}`) || `/${key}/register`;
        router.push(newPath);
    };

    // 切换主题
    const handleToggleTheme = () => {
        const newIsDark = !document.documentElement.classList.contains('dark');
        setIsDark(newIsDark);
        if (newIsDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className={styles['control-panel']}>
            <select
                className={styles['language-select']}
                value={currentLocale}
                onChange={(e) => handleSelectLanguage(e.target.value)}
            >
                {languageOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.label}
                    </option>
                ))}
            </select>
            <button
                className={`${styles['control-btn']} ${styles['theme-toggle']}`}
                onClick={handleToggleTheme}
                aria-label="Toggle theme"
            >
                <XIcon name={isDark ? 'carbon:sun' : 'carbon:moon'} size={18}/>
            </button>
        </div>
    );
}
