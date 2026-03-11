'use client';

import {ConfigProvider, Layout, theme} from 'antd';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {NextIntlClientProvider} from 'next-intl';

import store from '@/store';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {useThemeStore} from "@/store/core/theme/hooks";

const {Content} = Layout;

/**
 * 主题感知配置提供者
 */
function ThemeAwareConfigProvider({children}: { children: React.ReactNode }) {
    const themeStore = useThemeStore();
    const [actualTheme, setActualTheme] = React.useState<'dark' | 'light'>('light');

    // 监听主题模式变化（包括系统主题）
    useEffect(() => {
        const updateTheme = () => {
            if (themeStore.theme.mode === 'system') {
                const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setActualTheme(isDark ? 'dark' : 'light');
            } else {
                setActualTheme(themeStore.theme.mode as 'dark' | 'light');
            }
        };

        updateTheme();

        if (themeStore.theme.mode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent) => {
                setActualTheme(e.matches ? 'dark' : 'light');
            };
            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        }
    }, [themeStore.theme.mode]);

    // 同步到 HTML data-theme 属性（用于 CSS 变量）
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', actualTheme);
    }, [actualTheme]);

    return (
        <ConfigProvider
            theme={{
                algorithm: actualTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#722ED1',
                    fontSize: 14,
                    colorBgContainer: 'transparent',
                },
                components: {
                    Layout: {
                        headerBg: 'transparent',
                        bodyBg: 'transparent',
                        footerBg: 'transparent',
                    },
                    Menu: {
                        darkItemBg: 'transparent',
                        itemBg: 'transparent',
                        darkSubMenuItemBg: 'transparent',
                        subMenuItemBg: 'transparent',
                    }
                }
            }}
        >
            {children}
        </ConfigProvider>
    );
}

export default function ClientLayout({children, messages, locale}: {
    children: React.ReactNode;
    messages: never;
    locale: string;
}) {
    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <Provider store={store}>
                <ThemeAwareConfigProvider>
                    <Layout style={{minHeight: '100vh', background: 'transparent'}}>
                        <Header/>
                        <Content style={{
                            padding: '0 24px',
                            maxWidth: 1200,
                            margin: '0 auto',
                            flex: 1,
                            background: 'transparent'
                        }}>
                            {children}
                        </Content>
                        <Footer/>
                    </Layout>
                </ThemeAwareConfigProvider>
            </Provider>
        </NextIntlClientProvider>
    );
}
