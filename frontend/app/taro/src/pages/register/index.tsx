import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, Image} from '@tarojs/components';

import {useI18nRouter} from '@/i18n/helpers';
import XIcon from '@/plugins/xicon';
import ControlPanel from '@/components/layout/ControlPanel';

import AccountRegisterPage from './components/AccountRegisterPage';
import EmailRegisterPage from './components/EmailRegisterPage';
import PhoneRegisterPage from './components/PhoneRegisterPage';
import OtherRegisterPage from './components/OtherRegisterPage';

import './register.scss';

export default function RegisterPage() {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'account' | 'email' | 'phone' | 'other'>('account');

  const router = useI18nRouter();

  // 登录
  const handleLoginClick = () => {
    router.push('pages/login');
  };

  // 返回首页
  const handleBackHome = () => {
    router.push('pages/index');
  };

  // 服务条款
  const handleTermsClick = () => {
    router.push('pages/terms');
  };

  // 隐私政策
  const handlePrivacyClick = () => {
    router.push('pages/privacy');
  };

  return (
    <View className='register-page'>
      {/* 顶部控制按钮 */}
      <ControlPanel />

      {/* 左侧品牌区 */}
      <View className='register-left'>
        <View className='brand'>
          <Image src='/assets/images/logo.png' className='brand-logo' />
          <Text className='brand-title'>风行内容中台</Text>
          <Text className='brand-subtitle'>内容一次创作，全域高效分发</Text>
        </View>
        
        <View className='benefits-list'>
          <View className='benefit-item'>
            <XIcon name='carbon:checkmark' size={20} className='benefit-icon' />
            <Text>海量优质内容</Text>
          </View>
          <View className='benefit-item'>
            <XIcon name='carbon:checkmark' size={20} className='benefit-icon' />
            <Text>个性化推荐</Text>
          </View>
          <View className='benefit-item'>
            <XIcon name='carbon:checkmark' size={20} className='benefit-icon' />
            <Text>多端同步体验</Text>
          </View>
          <View className='benefit-item'>
            <XIcon name='carbon:checkmark' size={20} className='benefit-icon' />
            <Text>智能内容发现</Text>
          </View>
        </View>
      </View>

      {/* 右侧注册卡片 */}
      <View className='register-right'>
        <View className='register-card'>
          <View className='card-header'>
            <Text className='card-title'>欢迎注册账号</Text>
            <Text className='card-subtitle'>使用以下账号注册</Text>
          </View>

          {/* Tab 切换 */}
          <View className='register-tabs'>
            <View
              className={`tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              账号
            </View>
            <View
              className={`tab ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
            >
              邮箱
            </View>
            <View
              className={`tab ${activeTab === 'phone' ? 'active' : ''}`}
              onClick={() => setActiveTab('phone')}
            >
              手机
            </View>
            <View
              className={`tab ${activeTab === 'other' ? 'active' : ''}`}
              onClick={() => setActiveTab('other')}
            >
              其他
            </View>
          </View>

          {/* 注册表单内容 */}
          <View className='register-content'>
            {activeTab === 'account' && <AccountRegisterPage />}
            {activeTab === 'email' && <EmailRegisterPage />}
            {activeTab === 'phone' && <PhoneRegisterPage />}
            {activeTab === 'other' && <OtherRegisterPage />}
          </View>

          {/* 登录链接 */}
          <View className='login-section'>
            <Text>
              已有账号？
              <Text className='text-btn' onClick={handleLoginClick}>
                立即登录
              </Text>
            </Text>
          </View>

          {/* 返回首页 */}
          <View className='back-home'>
            <Text className='text-btn' onClick={handleBackHome}>
              ← 返回首页
            </Text>
          </View>

          {/* 服务条款 */}
          <View className='terms'>
            <Text className='terms-text'>
              登录即表示你同意我们的
              <Text className='terms-link' onClick={handleTermsClick}>
                服务条款
              </Text>
              和
              <Text className='terms-link' onClick={handlePrivacyClick}>
                隐私政策
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
