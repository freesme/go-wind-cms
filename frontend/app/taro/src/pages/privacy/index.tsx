import {useTranslation} from 'react-i18next';
import {View, Text} from '@tarojs/components';

import './privacy.scss';

export default function PrivacyPage() {
  const {t} = useTranslation('page.legal.privacy');

  return (
    <View className="info-page">
      {/* Hero Section */}
      <View className="hero">
        <View className="hero-content">
          <Text className="hero-title">{t('title')}</Text>
          <Text className="hero-subtitle">{t('description')}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View className="info-card">
        <View className="list">
          <Text>{t('item_1')}</Text>
          <Text>{t('item_2')}</Text>
          <Text>{t('item_3')}</Text>
        </View>
      </View>
    </View>
  );
}
