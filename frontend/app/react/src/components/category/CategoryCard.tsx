'use client';

import React from 'react';
import {useTranslations} from 'next-intl';

import {XIcon} from '@/plugins/xicon';
import {useCategoryStore} from '@/store/slices/category/hooks';
import type {contentservicev1_Category} from '@/api/generated/app/service/v1';

import styles from './CategoryCard.module.css';

interface CategoryCardProps {
    category: contentservicev1_Category | null;
    clickable?: boolean;
    onClick?: (id: number) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
                                                       category,
                                                       clickable = true,
                                                       onClick
                                                   }) => {
    const t = useTranslations('page.categories');
    const categoryStore = useCategoryStore();

    const handleClick = () => {
        if (!category?.id || !clickable) return;
        onClick?.(category.id);
    };

    if (!category) return null;

    return (
        <div
            className={`${styles.categoryCard} ${clickable ? styles.clickable : ''}`}
            onClick={handleClick}
        >
            <div className={styles.categoryCardImage}>
                <img
                    src={categoryStore.getCategoryThumbnail(category)}
                    alt={categoryStore.getCategoryName(category, t)}
                />
                <div className={styles.imageOverlay}/>
            </div>
            <div className={styles.categoryCardContent}>
                <h3>{categoryStore.getCategoryName(category, t)}</h3>
                <p>{categoryStore.getCategoryDescription(category)}</p>
                <div className={styles.categoryCardMeta}>
                    <span className={styles.metaIcon}>
                        <XIcon name="carbon:document" size={14}/>
                    </span>
                    <span className={styles.metaText}>
                        {category.postCount || 0} {t('articles_count')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
