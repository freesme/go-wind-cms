'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

import {useI18nRouter} from "@/i18n/helpers";

import ControlPanel from '@/components/layout/ControlPanel';

import '../../globals.css'; // 导入全局 CSS，确保 CSS 变量可用
import styles from './login.module.css';

import AccountLoginPage from './components/AccountLoginPage';
import EmailLoginPage from './components/EmailLoginPage';
import PhoneLoginPage from './components/PhoneLoginPage';
import OtherLoginPage from './components/OtherLoginPage';

export default function LoginPage() {
    const t = useTranslations('authentication');
    const [activeTab, setActiveTab] = useState<'account' | 'email' | 'phone' | 'other'>('account');

    const router = useI18nRouter();

    return (
        <div className={styles['login-page']}>
            {/* 顶部控制按钮 */}
            <ControlPanel/>

            {/* 左侧品牌区 */}
            <div className={styles['login-left']}>
                <div className={styles.brand}>
                    <img src="/logo.png" alt={t('login.logo_alt')} className={styles['brand-logo']}/>
                    <h1 className={styles['brand-title']}>{t('login.brand_title')}</h1>
                    <p className={styles['brand-subtitle']}>{t('login.brand_subtitle')}</p>
                </div>

                <div className={styles['features-list']}>
                    <div className={styles['feature-item']}>
                        <span>✓</span>
                        <span>{t('login.feature_projects')}</span>
                    </div>
                    <div className={styles['feature-item']}>
                        <span>✓</span>
                        <span>{t('login.feature_isolation')}</span>
                    </div>
                    <div className={styles['feature-item']}>
                        <span>✓</span>
                        <span>{t('login.feature_permissions')}</span>
                    </div>
                    <div className={styles['feature-item']}>
                        <span>✓</span>
                        <span>{t('login.feature_analytics')}</span>
                    </div>
                </div>
            </div>

            {/* 右侧登录卡片 */}
            <div className={styles['login-right']}>
                <div className={styles['login-card']}>
                    <div className={styles['card-header']}>
                        <h2>{t('login.title')}</h2>
                        <p>{t('login.login_with')}</p>
                    </div>

                    {/* Tab 切换 */}
                    <div className={styles['login-tabs']}>
                        <button
                            className={`${styles.tab} ${activeTab === 'account' ? styles.active : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            {t('login.tab_account')}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'email' ? styles.active : ''}`}
                            onClick={() => setActiveTab('email')}
                        >
                            {t('login.tab_email')}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'phone' ? styles.active : ''}`}
                            onClick={() => setActiveTab('phone')}
                        >
                            {t('login.tab_phone')}
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'other' ? styles.active : ''}`}
                            onClick={() => setActiveTab('other')}
                        >
                            {t('login.tab_other')}
                        </button>
                    </div>

                    {/* 登录表单内容 */}
                    <div className={styles['login-content']}>
                        {activeTab === 'account' && <AccountLoginPage/>}
                        {activeTab === 'email' && <EmailLoginPage/>}
                        {activeTab === 'phone' && <PhoneLoginPage/>}
                        {activeTab === 'other' && <OtherLoginPage/>}
                    </div>

                    {/* 注册链接 */}
                    <div className={styles['register-section']}>
                        <p>
                            {t('login.no_account')}
                            <button className={styles['text-btn']} onClick={() => router.push('/register')}>
                                {t('login.register_now')}
                            </button>
                        </p>
                    </div>

                    {/* 返回首页 */}
                    <div className={styles['back-home']}>
                        <button className={styles['text-btn']} onClick={() => router.push('/')}>
                            ← {t('login.back_home')}
                        </button>
                    </div>

                    {/* 服务条款 */}
                    <div className={styles.terms}>
                        <small>
                            {t('login.terms_prefix')}
                            <button className={styles['text-btn']} onClick={() => router.push('/terms')}>
                                {t('login.terms_of_service')}
                            </button>
                            {t('login.terms_and')}
                            <button className={styles['text-btn']} onClick={() => router.push('/privacy')}>
                                {t('login.privacy_policy')}
                            </button>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
