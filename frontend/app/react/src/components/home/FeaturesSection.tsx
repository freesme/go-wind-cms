import React from 'react';
import {useTranslations} from 'next-intl';

import {XIcon} from '@/plugins/xicon';

import styles from './home.module.css';

interface Feature {
    icon?: string;
    title: string;
    description: string;
}

export default function FeaturesSection() {
    const t = useTranslations('page.home');

    // 特性列表
    const features: Feature[] = [
        {
            icon: 'carbon:document',
            title: t('flexible_content_management'),
            description: t('content_management_desc'),
        },
        {
            icon: 'carbon:cloud',
            title: t('multi_tenant_architecture'),
            description: t('multi_tenant_desc'),
        },
        {
            icon: 'carbon:security',
            title: t('enterprise_security'),
            description: t('security_desc'),
        },
        {
            icon: 'carbon:analytics',
            title: t('advanced_analytics'),
            description: t('analytics_desc'),
        },
        {
            icon: 'carbon:api',
            title: t('api_integration'),
            description: t('api_integration_desc'),
        },
        {
            icon: 'carbon:collaborate',
            title: t('real_time_collaboration'),
            description: t('real_time_collaboration_desc'),
        },
    ];

    return (
        <section className={styles.featuresSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    <XIcon name="carbon:rocket" size={28} style={{color: '#6366f1', marginRight: '8px'}}/>
                    {t('platform_features')}
                </h2>
            </div>
            <div className={styles.featuresGrid}>
                {features.map((feature, index) => (
                    <div key={index} className={styles.featureCard}>
                        <div className={styles.featureIcon}>
                            <XIcon name={feature.icon || ''} size={48}/>
                        </div>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
