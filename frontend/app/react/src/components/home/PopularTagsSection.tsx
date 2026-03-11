import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Skeleton, Button} from 'antd';
import {useTranslations} from 'next-intl';

import {XIcon} from '@/plugins/xicon';
import {useTagStore} from '@/store/slices/tag/hooks';
import {contentservicev1_Tag} from '@/api/generated/app/service/v1';

import styles from './home.module.css';

interface TagItem {
    id: number;
    name: string;
    color: string;
}

export default function PopularTagsSection() {
    const t = useTranslations('page.tags');
    const tagStore = useTagStore();

    const [tags, setTags] = useState<contentservicev1_Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [displayTags, setDisplayTags] = useState<TagItem[]>([]);

    // 用于取消异步操作
    const abortControllerRef = useRef<AbortController | null>(null);

    const loadPopularTags = useCallback(async () => {
        // 取消之前的请求
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 创建新的 AbortController
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        try {
            const res = await tagStore.listTag({
                paging: {page: 1, pageSize: 6},
                formValues: {status: 'TAG_STATUS_ACTIVE', isFeatured: true},
                fieldMask: null,
                orderBy: null,
                signal
            });

            if (signal.aborted) return;

            const tagItems = res.items || [];
            setTags(tagItems);

            // 生成带颜色的标签
            const taggedItems: TagItem[] = tagItems.map((tag, index) => ({
                id: tag.id,
                name: tag.translations?.[0]?.name || t('tag_untitled'),
                color: tag.color || `hsl(${index * 60}, 100%, 50%)`,
            }));

            setDisplayTags(taggedItems);
        } catch (error) {
            if (signal.aborted) return;
            console.error('Failed to load tags:', error);
            setTags([]);
            setDisplayTags([]);
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, [t]);

    useEffect(() => {
        loadPopularTags();

        // 组件卸载时取消请求
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [loadPopularTags]);

    const handleViewTag = (tag: TagItem) => {
        window.location.href = `/tag/${tag.id}`;
    };

    return (
        <section className={styles.popularSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    <XIcon name="carbon:fire" size={28} style={{color: '#6366f1', marginRight: '8px'}}/>
                    {t('popular_tags')}
                </h2>
                <Button type="text" onClick={() => window.location.href = '/tag'}>
                    {t('view_all')} →
                </Button>
            </div>
            <div className={styles.tagsContent}>
                {loading ? (
                    <div className={styles.tagsGrid}>
                        {Array.from({length: 6}).map((_, i) => (
                            <div key={i} className={styles.tagItem}>
                                <Skeleton.Button style={{width: '100%', height: '44px'}} active/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.tagsGrid}>
                        {displayTags.map((tag) => (
                            <div
                                key={tag.id}
                                className={styles.tagItem}
                                style={{'--tag-color': tag.color} as React.CSSProperties}
                                onClick={() => handleViewTag(tag)}
                            >
                                <span className={styles.tagLabel}>{tag.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
