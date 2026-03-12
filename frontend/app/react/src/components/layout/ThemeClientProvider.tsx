'use client';

import React, {useEffect, useRef} from 'react';
import {useThemeMode} from '@/store/core/theme/hooks';

export default function ThemeClientProvider({children}: { children: React.ReactNode }) {
    const mode = useThemeMode();
    const mqRef = useRef<MediaQueryList | null>(null);

    useEffect(() => {
        const html = document.documentElement;

        // 清理之前的监听器
        if (mqRef.current) {
            mqRef.current.onchange = null;
        }

        // 移除所有主题类
        html.classList.remove('dark', 'light');

        if (mode === 'system') {
            // 跟随系统
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            mqRef.current = mq;
            const sysTheme = mq.matches ? 'dark' : 'light';
            html.classList.add(sysTheme);

            mq.onchange = (e) => {
                html.classList.remove('dark', 'light');
                html.classList.add(e.matches ? 'dark' : 'light');
            };
        } else {
            // 直接应用指定主题
            html.classList.add(mode);
        }

        // 清理函数
        return () => {
            if (mqRef.current) {
                mqRef.current.onchange = null;
            }
        };
    }, [mode]);

    return children;
}
