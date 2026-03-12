'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

export default function EmailRegisterPage() {
    const t = useTranslations('authentication');
    
    const [email, setEmail] = useState('');
    const [visibleEnter, setVisibleEnter] = useState(false);

    // 简单的邮箱格式验证
    const isValidEmail = () => {
        if (!email) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleButtonNext = () => {
        if (!isValidEmail()) {
            return;
        }
        setVisibleEnter(true);
    };

    return (
        <div>
            {!visibleEnter ? (
                <div className="register-form">
                    {/* Email Input Group */}
                    <div className="form-group">
                        <label htmlFor="register-email-address">
                            {t('register.email')}
                        </label>
                        <input
                            id="register-email-address"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('register.input_email')}
                            autoComplete="email"
                            className={`input-field ${email && !isValidEmail() ? 'error' : ''}`}
                        />
                        {email && !isValidEmail() && (
                            <span className="error-hint">{t('register.invalid_email')}</span>
                        )}
                    </div>

                    {/* Next Button */}
                    <button
                        type="button"
                        className="register-button"
                        disabled={!isValidEmail()}
                        onClick={handleButtonNext}
                    >
                        {t('register.next_step')}
                    </button>
                </div>
            ) : (
                <EmailRegisterEnterCodePage email={email}/>
            )}
        </div>
    );
}

function EmailRegisterEnterCodePage({email}: { email: string }) {
    const t = useTranslations('authentication');
    const [code, setCode] = useState(Array(6).fill(''));
    const [isCodeComplete, setIsCodeComplete] = useState(false);
    const [codeSent, setCodeSent] = useState(true);
    const [codeCountdown, setCodeCountdown] = useState(60);

    // 启动倒计时
    const startCountdown = () => {
        setCodeSent(true);
        setCodeCountdown(60);

        const timer = setInterval(() => {
            setCodeCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCodeSent(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleInputComplete = (value: string) => {
        console.log('验证码输入完成：', value);
        setIsCodeComplete(true);
    };

    const handleButtonResend = () => {
        if (codeSent) return;
        startCountdown();
    };

    const handleButtonConfirm = () => {
        if (!isCodeComplete) return;
        console.log('确认注册');
    };

    return (
        <div className="code-container">
            {/* Email Hint */}
            <div className="email-sent-info">
                <p className="hint-title">{t('register.code_sent_title')}</p>
                <p className="email-display">{email}</p>
                <p className="hint-subtitle">{t('register.code_sent_subtitle')}</p>
            </div>

            {/* Verification Code Input */}
            <div className="code-input-wrapper">
                <input
                    type="text"
                    maxLength={6}
                    value={code.join('')}
                    onChange={(e) => {
                        const value = e.target.value.split('').slice(0, 6);
                        setCode(value);
                        if (value.length === 6) {
                            handleInputComplete(value.join(''));
                        }
                    }}
                    className="verification-code-input"
                    placeholder="请输入验证码"
                />
            </div>

            {/* Resend Button */}
            <div className="resend-section">
                <button
                    className="text-btn"
                    disabled={codeSent}
                    onClick={handleButtonResend}
                >
                    {codeSent ? `${codeCountdown}s ${t('register.resend_after')}` : t('register.resend')}
                </button>
            </div>

            {/* Confirm Button */}
            <button
                type="button"
                className="register-button"
                disabled={!isCodeComplete}
                onClick={handleButtonConfirm}
            >
                {t('register.confirm')}
            </button>
        </div>
    );
}
