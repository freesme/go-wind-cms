import {useTranslation} from 'react-i18next';
import {View, Text} from '@tarojs/components';

import './index.scss';

interface Feature {
  icon?: string;
  title: string;
  description: string;
}

export default function FeaturesSection() {
  const {t} = useTranslation();

  // 特性列表
  const features: Feature[] = [
    {
      icon: '📄',
      title: t('page.home.flexible_content_management'),
      description: t('page.home.content_management_desc'),
    },
    {
      icon: '☁️',
      title: t('page.home.multi_tenant_architecture'),
      description: t('page.home.multi_tenant_desc'),
    },
    {
      icon: '🔒',
      title: t('page.home.enterprise_security'),
      description: t('page.home.security_desc'),
    },
    {
      icon: '📊',
      title: t('page.home.advanced_analytics'),
      description: t('page.home.analytics_desc'),
    },
    {
      icon: '🔌',
      title: t('page.home.api_integration'),
      description: t('page.home.api_integration_desc'),
    },
    {
      icon: '👥',
      title: t('page.home.real_time_collaboration'),
      description: t('page.home.real_time_collaboration_desc'),
    },
  ];

  return (
    <View className='features-section'>
      <View className='section-header'>
        <Text className='section-title'>
          🚀 {t('page.home.platform_features')}
        </Text>
      </View>
      <View className='features-grid'>
        {features.map((feature, index) => (
          <View key={index} className='feature-card'>
            <View className='feature-icon'>{feature.icon}</View>
            <Text className='feature-title'>{feature.title}</Text>
            <Text className='feature-description'>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
