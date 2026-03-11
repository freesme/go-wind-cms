import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {Skeleton, Carousel, Button} from 'antd';
import {useTranslations} from 'next-intl';
import {useCategoryStore} from '@/store/slices/category/hooks';
import {contentservicev1_Category} from '@/api/generated/app/service/v1';
import {XIcon} from '@/plugins/xicon';
import styles from './home.module.css';

interface CategoryListSectionProps {
    skeletonCount?: number;
    showCarousel?: boolean;
    pageSize?: number;
    page?: number;
    filter?: Record<string, unknown>;
    orderBy?: string[];
    fieldMask?: string;
    showHeader?: boolean;
}

export default function CategoryListSection({
                                                skeletonCount = 8,
                                                showCarousel = false,
                                                pageSize = 8,
                                                page = 1,
                                                filter = {status: 'CATEGORY_STATUS_ACTIVE'} as Record<string, unknown>,
                                                orderBy = ['-sortOrder', '-postCount'],
                                                fieldMask = 'id,status,sortOrder,icon,code,postCount,directPostCount,parent_id,createdAt,translations.id,translations.categoryId,translations.name,translations.languageCode,translations.description',
                                                showHeader = true
                                            }: CategoryListSectionProps) {
    const t = useTranslations('page.home');
    const categoryStore = useCategoryStore();

    // 使用 useMemo 稳定对象引用
    const stableFilter = useMemo(() => filter, [JSON.stringify(filter)]);
    const stableOrderBy = useMemo(() => orderBy, [JSON.stringify(orderBy)]);

    const [categories, setCategories] = useState<contentservicev1_Category[]>([]);
    const [loading, setLoading] = useState(false);

    // 用于取消异步操作
    const abortControllerRef = useRef<AbortController | null>(null);

    const loadCategories = useCallback(async () => {
        // 取消之前的请求
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 创建新的 AbortController
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        try {
            const res = await categoryStore.listCategory({
                paging: {page, pageSize},
                formValues: stableFilter,
                fieldMask,
                orderBy: stableOrderBy,
                signal,
            });

            if (signal.aborted) return;

            setCategories(res.items || []);
        } catch (error) {
            if (signal.aborted) return;
            console.error('Failed to load categories:', error);
            setCategories([]);
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, [page, pageSize, stableFilter, fieldMask, stableOrderBy]);

    useEffect(() => {
        loadCategories();

        // 组件卸载时取消请求
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [loadCategories]);

    const handleViewCategory = (id: number) => {
        window.location.href = `/category/${id}`;
    };

    const getIconName = (icon?: string): string => {
        if (!icon) return 'carbon:folder';
        return icon.includes(':') ? icon : `carbon:${icon}`;
    };

    return (
        <section className={`${styles.categoriesSection} scroll-reveal`}>
            {/* Section Header */}
            {showHeader && (
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        <XIcon name="carbon:folder-details" size={28} style={{color: '#6366f1', marginRight: '8px'}}/>
                        {t('categories')}
                    </h2>
                    <Button type="text" onClick={() => window.location.href = '/category'}>
                        {t('view_all')} →
                    </Button>
                </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
                <div className={`${styles.categoriesGrid} desktop-grid`}>
                    {Array.from({length: skeletonCount}).map((_, i) => (
                        <div key={i} className={styles.categoryCard}>
                            <Skeleton.Button style={{width: '100%', height: '140px'}}/>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {/* Desktop Grid - 始终渲染，由 CSS 控制显示 */}
                    <div className={`${styles.categoriesGrid} desktop-grid`}>
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className={`${styles.categoryCard} scroll-reveal-item`}
                                onClick={() => handleViewCategory(category.id)}
                            >
                                <div className={styles.categoryCardBg}/>
                                <div className={styles.categoryCardContent}>
                                    <div className={styles.categoryCardHeader}>
                                        <div className={styles.categoryIcon}>
                                            <XIcon
                                                name={getIconName(category.icon)}
                                                size={48}
                                            />
                                        </div>
                                        <div className={styles.categoryInfo}>
                                            <h3>{categoryStore.getCategoryName(category)}</h3>
                                            <span className={styles.postCount}>
                                                {t('article_count', {count: category.postCount || 0})}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles.categoryBadge}>
                                        <XIcon name="carbon:time" size={14}/>
                                        <span>{t('updated_days_ago', {days: 3})}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Carousel - 始终渲染，由 CSS 控制显示 */}
                    <div className={`${styles.categoriesCarousel} mobile-carousel`}>
                        <Carousel
                            autoplay
                            autoplaySpeed={5000}
                            arrows={false}
                            draggable
                            slidesToShow={1.5}
                            centerMode
                            dots={false}
                            className={styles.carouselContainer}
                        >
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={styles.carouselItem}
                                    onClick={() => handleViewCategory(category.id)}
                                >
                                    <div className={`${styles.categoryCard} ${styles.carouselCard}`}>
                                        <div className={styles.categoryCardBg}/>
                                        <div className={styles.categoryCardContent}>
                                            <div className={styles.categoryCardHeader}>
                                                <div className={styles.categoryIcon}>
                                                    <XIcon
                                                        name={getIconName(category.icon)}
                                                        size={48}
                                                    />
                                                </div>
                                                <div className={styles.categoryInfo}>
                                                    <h3>{categoryStore.getCategoryName(category)}</h3>
                                                    <span className={styles.postCount}>
                                                        {t('article_count', {count: category.postCount || 0})}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.categoryBadge}>
                                                <XIcon name="carbon:time" size={14}/>
                                                <span>{t('updated_days_ago', {days: 3})}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </>
            )}
        </section>
    );
}
