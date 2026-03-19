import {useTranslation} from 'react-i18next';
import {View, Text, Image} from '@tarojs/components';

import './about.scss';

export default function AboutPage() {
  const {t} = useTranslation();

  const features = [
    {
      icon: 'carbon:document-add',
      title: t('about.feature_content'),
      description: t('about.feature_content_desc'),
    },
    {
      icon: 'carbon:cloud-upload',
      title: t('about.feature_multi_tenant'),
      description: t('about.feature_multi_tenant_desc'),
    },
    {
      icon: 'carbon:security',
      title: t('about.feature_security'),
      description: t('about.feature_security_desc'),
    },
    {
      icon: 'carbon:api',
      title: t('about.feature_api'),
      description: t('about.feature_api_desc'),
    },
    {
      icon: 'carbon:collaborate',
      title: t('about.feature_collaboration'),
      description: t('about.feature_collaboration_desc'),
    },
    {
      icon: 'carbon:analytics',
      title: t('about.feature_analytics'),
      description: t('about.feature_analytics_desc'),
    },
  ];

  const teamMembers = [
    {
      name: t('about.team_member_1'),
      role: t('about.team_role_1'),
      avatar: '/logo.png',
    },
    {
      name: t('about.team_member_2'),
      role: t('about.team_role_2'),
      avatar: '/logo.png',
    },
    {
      name: t('about.team_member_3'),
      role: t('about.team_role_3'),
      avatar: '/logo.png',
    },
  ];

  return (
    <View className="about-page">
      {/* Hero Section */}
      <View className="hero">
        <View className="hero-content">
          <Text className="hero-title">{t('about.title')}</Text>
          <Text className="hero-subtitle">{t('about.subtitle')}</Text>
          <Text className="hero-description">{t('about.description')}</Text>
        </View>
      </View>

      {/* About Section */}
      <View className="about-section">
        <View className="section-container">
          <View className="about-content">
            <Text>{t('about.about_us')}</Text>
            <Text>{t('about.about_us_desc_1')}</Text>
            <Text>{t('about.about_us_desc_2')}</Text>
            <Text>{t('about.about_us_desc_3')}</Text>
          </View>
          <View className="about-stats">
            <View className="stat-card">
              <Text className="stat-number">10K+</Text>
              <Text className="stat-label">{t('about.stat_users')}</Text>
            </View>
            <View className="stat-card">
              <Text className="stat-number">500+</Text>
              <Text className="stat-label">{t('about.stat_projects')}</Text>
            </View>
            <View className="stat-card">
              <Text className="stat-number">99.9%</Text>
              <Text className="stat-label">{t('about.stat_uptime')}</Text>
            </View>
            <View className="stat-card">
              <Text className="stat-number">24/7</Text>
              <Text className="stat-label">{t('about.stat_support')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View className="features-section">
        <View className="section-container">
          <View className="section-header">
            <Text>{t('about.features')}</Text>
            <Text>{t('about.features_desc')}</Text>
          </View>
          <View className="features-grid">
            {features.map((feature) => (
              <View key={feature.title} className="feature-card">
                <View className="feature-icon">
                  <Text>{feature.icon}</Text>
                </View>
                <Text>{feature.title}</Text>
                <Text>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Team Section */}
      <View className="team-section">
        <View className="section-container">
          <View className="section-header">
            <Text>{t('about.team')}</Text>
            <Text>{t('about.team_desc')}</Text>
          </View>
          <View className="team-grid">
            {teamMembers.map((member) => (
              <View key={member.name} className="team-card">
                <View className="team-avatar">
                  <Image
                    src={member.avatar}
                    style={{width: 120, height: 120}}
                  />
                </View>
                <Text>{member.name}</Text>
                <Text>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Values Section */}
      <View className="values-section">
        <View className="section-container">
          <View className="section-header">
            <Text>{t('about.values')}</Text>
            <Text>{t('about.values_desc')}</Text>
          </View>
          <View className="values-grid">
            <View className="value-card">
              <Text>{t('about.value_innovation')}</Text>
              <Text>{t('about.value_innovation_desc')}</Text>
            </View>
            <View className="value-card">
              <Text>{t('about.value_reliability')}</Text>
              <Text>{t('about.value_reliability_desc')}</Text>
            </View>
            <View className="value-card">
              <Text>{t('about.value_customer')}</Text>
              <Text>{t('about.value_customer_desc')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View className="cta-section">
        <View className="section-container">
          <Text>{t('about.cta_title')}</Text>
          <Text>{t('about.cta_desc')}</Text>
          <View className="cta-buttons">
            <View className="button-primary">
              <Text>{t('about.cta_explore')}</Text>
            </View>
            <View className="button-default">
              <Text>{t('about.cta_contact')}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
