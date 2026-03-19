import {useTranslation} from 'react-i18next';
import {View, Text, Image} from '@tarojs/components';


import styles from './about.scss';

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
    <View className={styles.aboutPage}>
      {/* Hero Section */}
      <View className={styles.hero}>
        <View className={styles.heroContent}>
          <Text className={styles.heroTitle}>{t('about.title')}</Text>
          <Text className={styles.heroSubtitle}>{t('about.subtitle')}</Text>
          <Text className={styles.heroDescription}>{t('about.description')}</Text>
        </View>
      </View>

      {/* About Section */}
      <View className={styles.aboutSection}>
        <View className={styles.sectionContainer}>
          <View className={styles.aboutContent}>
            <Text>{t('about.about_us')}</Text>
            <Text>{t('about.about_us_desc_1')}</Text>
            <Text>{t('about.about_us_desc_2')}</Text>
            <Text>{t('about.about_us_desc_3')}</Text>
          </View>
          <View className={styles.aboutStats}>
            <View className={styles.statCard}>
              <Text className={styles.statNumber}>10K+</Text>
              <Text className={styles.statLabel}>{t('about.stat_users')}</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={styles.statNumber}>500+</Text>
              <Text className={styles.statLabel}>{t('about.stat_projects')}</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={styles.statNumber}>99.9%</Text>
              <Text className={styles.statLabel}>{t('about.stat_uptime')}</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={styles.statNumber}>24/7</Text>
              <Text className={styles.statLabel}>{t('about.stat_support')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View className={styles.featuresSection}>
        <View className={styles.sectionContainer}>
          <View className={styles.sectionHeader}>
            <Text>{t('about.features')}</Text>
            <Text>{t('about.features_desc')}</Text>
          </View>
          <View className={styles.featuresGrid}>
            {features.map((feature) => (
              <View key={feature.title} className={styles.featureCard}>
                <View className={styles.featureIcon}>
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
      <View className={styles.teamSection}>
        <View className={styles.sectionContainer}>
          <View className={styles.sectionHeader}>
            <Text>{t('about.team')}</Text>
            <Text>{t('about.team_desc')}</Text>
          </View>
          <View className={styles.teamGrid}>
            {teamMembers.map((member) => (
              <View key={member.name} className={styles.teamCard}>
                <View className={styles.teamAvatar}>
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
      <View className={styles.valuesSection}>
        <View className={styles.sectionContainer}>
          <View className={styles.sectionHeader}>
            <Text>{t('about.values')}</Text>
            <Text>{t('about.values_desc')}</Text>
          </View>
          <View className={styles.valuesGrid}>
            <View className={styles.valueCard}>
              <Text>{t('about.value_innovation')}</Text>
              <Text>{t('about.value_innovation_desc')}</Text>
            </View>
            <View className={styles.valueCard}>
              <Text>{t('about.value_reliability')}</Text>
              <Text>{t('about.value_reliability_desc')}</Text>
            </View>
            <View className={styles.valueCard}>
              <Text>{t('about.value_customer')}</Text>
              <Text>{t('about.value_customer_desc')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View className={styles.ctaSection}>
        <View className={styles.sectionContainer}>
          <Text>{t('about.cta_title')}</Text>
          <Text>{t('about.cta_desc')}</Text>
          <View className={styles.ctaButtons}>
            <View className={styles.buttonPrimary}>
              <Text>{t('about.cta_explore')}</Text>
            </View>
            <View className={styles.buttonDefault}>
              <Text>{t('about.cta_contact')}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
