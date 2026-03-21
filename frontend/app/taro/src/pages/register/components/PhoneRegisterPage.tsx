import {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Input, Button, Text} from '@tarojs/components';

import '../register.scss';

export default function PhoneRegisterPage() {
  const {t} = useTranslation();

  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);

  useEffect(() => {
    let codeTimer: number | null = null;

    if (codeSent && codeCountdown > 0) {
      codeTimer = window.setInterval(() => {
        setCodeCountdown((prev) => {
          if (prev <= 1) {
            setCodeSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (codeTimer !== null) {
        clearInterval(codeTimer);
      }
    };
  }, [codeSent, codeCountdown]);

  // 手机号简单校验
  const isValidPhone = () => {
    if (!phone) return false;
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  /**
   * 发送验证码
   */
  const handleButtonSendVerifyCode = () => {
    if (!phone) {
      return;
    }

    setCodeSent(true);
    setCodeCountdown(60);
  };

  /**
   * 登录或者注册
   */
  const handleButtonRegisterOrLogin = () => {
    if (!phone || !verificationCode) {
      return;
    }
    console.log('手机号注册/登录:', {phone, verificationCode});
  };

  return (
    <View className='register-form'>
      {/* Phone Number Group */}
      <View className='form-group'>
        <Text className='form-label'>手机号</Text>
        <Input
          type='text'
          value={phone}
          onInput={(e) => setPhone(e.detail.value)}
          placeholder='请输入手机号'
          className='input-field'
          maxlength={11}
        />
      </View>

      {/* Verification Code Group */}
      <View className='form-group'>
        <Text className='form-label'>验证码</Text>
        <View className='code-input-row'>
          <Input
            type='text'
            value={verificationCode}
            onInput={(e) => setVerificationCode(e.detail.value)}
            placeholder='请输入验证码'
            className='input-field'
            maxlength={6}
          />
          <Button
            className='send-code-btn'
            disabled={codeSent || !isValidPhone()}
            onClick={handleButtonSendVerifyCode}
          >
            {codeSent
              ? `${codeCountdown}秒后重试`
              : '发送验证码'}
          </Button>
        </View>
      </View>

      {/* Register/Login Button */}
      <Button
        className='register-button'
        disabled={
          !isValidPhone() ||
          !verificationCode ||
          verificationCode.length !== 6
        }
        onClick={handleButtonRegisterOrLogin}
      >
        注册/登录
      </Button>
    </View>
  );
}
