'use client';

import React from 'react';
import {Empty, Skeleton} from 'antd';
import {useTranslations} from 'next-intl';

import type {contentservicev1_Category} from '@/api/generated/app/service/v1';

import styles from './CategoryList.module.css';
import CategoryCard from './CategoryCard';


interface CategoryListProps {
    categories: contentservicev1_Category[];
    loading?: boolean;
    showSkeleton?: boolean;
    columns?: number;
    gap?: number;
    onCategoryClick?: (id: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
                                                       categories = [],
                                                       loading = false,
                                                       showSkeleton = true,
                                                       columns = 3,
                                                       gap = 20,
                                                       onCategoryClick
                                                   }) => {
    const t = useTranslations('page.categories');

    const handleCategoryClick = (id: number) => {
        onCategoryClick?.(id);
    };

    return (
        <div className={styles.categoryListContainer}>
            {/* Loading Skeleton */}
            {loading && showSkeleton && (
                <div
                    className={styles.categoryGrid}
                    style={{
                        gridTemplateColumns: `repeat(${columns}, 1fr)`,
                        gap: `${gap}px`
                    }}
                >
                    {Array.from({length: columns}).map((_, index) => (
                        <div key={index} className={styles.categoryCardSkeleton}>
                            <Skeleton.Image style={{height: 160}}/>
                            <div className={styles.skeletonContent}>
                                <Skeleton paragraph={{rows: 2}} title={false}/>
                                <Skeleton.Button size="small" style={{width: 60}}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Loaded Content */}
            {!loading && categories.length > 0 && (
                <div
                    className={styles.categoryGrid}
                    style={{
                        gridTemplateColumns: `repeat(auto-fill, minmax(280px, 1fr))`,
                        gap: `${gap}px`
                    }}
                >
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onClick={handleCategoryClick}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && categories.length === 0 && (
                <div className={styles.emptyState}>
                    <Empty description={t('no_categories')}/>
                </div>
            )}
        </div>
    );
};

export default CategoryList;
