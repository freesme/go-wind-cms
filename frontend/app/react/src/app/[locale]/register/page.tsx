'use client';

import {useState, useMemo} from 'react';
import {useTranslations} from 'next-intl';
import XIcon from '@/plugins/xicon';

import AccountRegisterPage from './components/AccountRegisterPage';
import EmailRegisterPage from './components/EmailRegisterPage';
import PhoneRegisterPage from './components/PhoneRegisterPage';
import OtherRegisterPage from './components/OtherRegisterPage';

import './register.module.css';

export default function RegisterPage() {
    const t = useTranslations('authentication');
    const [activeTab, setActiveTab] = useState<'account' | 'email' | 'phone' | 'other'>('account');

    // 语言选项
    const languageOptions = useMemo(() => [
        {key: 'zh-CN', label: '中文'},
        {key: 'en-US', label: 'English'}
    ], []);

    // 切换语言
    const handleSelectLanguage = (key: string) => {
        console.log('Switch language to:', key);
        // TODO: 实现语言切换逻辑
    };

    // 切换主题
    const handleToggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    };

    // 登录
    const handleLoginClick = () => {
        window.location.href = '/login';
    };

    // 返回首页
    const handleBackHome = () => {
        window.location.href = '/';
    };

    // 服务条款
    const handleTermsClick = () => {
        window.location.href = '/terms';
    };

    // 隐私政策
    const handlePrivacyClick = () => {
        window.location.href = '/privacy';
    };

    return (
        <div className="register-page">
            {/* 顶部控制按钮 */}
            <div className="register-controls">
                <select
                    className="language-select"
                    value="zh-CN"
                    onChange={(e) => handleSelectLanguage(e.target.value)}
                >
                    {languageOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <button
                    className="control-btn theme-toggle"
                    onClick={handleToggleTheme}
                    aria-label="Toggle theme"
                >
                    <XIcon name={document.documentElement.classList.contains('dark') ? 'carbon:sun' : 'carbon:moon'} size={18}/>
                </button>
            </div>

            {/* 左侧品牌区 */}
            <div className="register-left">
                <div className="brand">
                    <img src="/logo.png" alt={t('login.logo_alt')} className="brand-logo"/>
                    <h1 className="brand-title">{t('login.brand_title')}</h1>
                    <p className="brand-subtitle">{t('login.brand_subtitle')}</p>
                </div>

                <div className="benefits-list">
                    <div className="benefit-item">
                        <span>✓</span>
                        <span>{t('login.feature_projects')}</span>
                    </div>
                    <div className="benefit-item">
                        <span>✓</span>
                        <span>{t('login.feature_isolation')}</span>
                    </div>
                    <div className="benefit-item">
                        <span>✓</span>
                        <span>{t('login.feature_permissions')}</span>
                    </div>
                    <div className="benefit-item">
                        <span>✓</span>
                        <span>{t('login.feature_analytics')}</span>
                    </div>
                </div>
            </div>

            {/* 右侧注册卡片 */}
            <div className="register-right">
                <div className="register-card">
                    <div className="card-header">
                        <h2>{t('register.title')}</h2>
                        <p>{t('register.register_with')}</p>
                    </div>

                    {/* Tab 切换 */}
                    <div className="register-tabs">
                        <button
                            className={`tab ${activeTab === 'account' ? 'active' : ''}`}
                            onClick={() => setActiveTab('account')}
                        >
                            {t('login.tab_account')}
                        </button>
                        <button
                            className={`tab ${activeTab === 'email' ? 'active' : ''}`}
                            onClick={() => setActiveTab('email')}
                        >
                            {t('login.tab_email')}
                        </button>
                        <button
                            className={`tab ${activeTab === 'phone' ? 'active' : ''}`}
                            onClick={() => setActiveTab('phone')}
                        >
                            {t('login.tab_phone')}
                        </button>
                        <button
                            className={`tab ${activeTab === 'other' ? 'active' : ''}`}
                            onClick={() => setActiveTab('other')}
                        >
                            {t('login.tab_other')}
                        </button>
                    </div>

                    {/* 注册表单内容 */}
                    <div className="register-content">
                        {activeTab === 'account' && <AccountRegisterPage/>}
                        {activeTab === 'email' && <EmailRegisterPage/>}
                        {activeTab === 'phone' && <PhoneRegisterPage/>}
                        {activeTab === 'other' && <OtherRegisterPage/>}
                    </div>

                    {/* 登录链接 */}
                    <div className="login-section">
                        <p>
                            {t('register.already_have_account')}
                            <button className="text-btn" onClick={handleLoginClick}>
                                {t('register.login_now')}
                            </button>
                        </p>
                    </div>

                    {/* 返回首页 */}
                    <div className="back-home">
                        <button className="text-btn" onClick={handleBackHome}>
                            ← {t('login.back_home')}
                        </button>
                    </div>

                    {/* 服务条款 */}
                    <div className="terms">
                        <small>
                            {t('login.terms_prefix')}
                            <button className="text-btn" onClick={handleTermsClick}>
                                {t('login.terms_of_service')}
                            </button>
                            {t('login.terms_and')}
                            <button className="text-btn" onClick={handlePrivacyClick}>
                                {t('login.privacy_policy')}
                            </button>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}
