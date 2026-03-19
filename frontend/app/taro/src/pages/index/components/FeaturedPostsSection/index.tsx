import {useTranslation} from 'react-i18next';
import {View, Text} from '@tarojs/components';
import PostList from '@/components/post/PostList';
import {useMemo} from 'react';
import './index.scss';

export default function FeaturedPostsSection() {
  const {t} = useTranslation('page.home');
  // 用 useMemo 缓存 queryParams 和 orderBy，避免重复请求
  const queryParams = useMemo(() => ({status: 'POST_STATUS_PUBLISHED', isFeatured: true}), []);
  const orderBy = useMemo(() => ['-sortOrder'], []);

  return (
    <View className='featured-section scroll-reveal'>
      <View className='section-header'>
        <Text className='section-title'>
          ⭐ {t('featured_posts')}
        </Text>
        <View className='view-all-btn' onClick={() => console.log('Navigate to /post')}>
          <Text>{t('view_all')} →</Text>
        </View>
      </View>
      <View className='featured-grid'>
        <PostList
          queryParams={queryParams}
          fieldMask='id,status,sortOrder,isFeatured,visits,likes,commentCount,authorName,availableLanguages,createdAt,translations.id,translations.postId,translations.languageCode,translations.title,translations.summary,translations.thumbnail'
          orderBy={orderBy}
          page={1}
          pageSize={3}
          columns={3}
          showSkeleton={true}
          from='home'
          showPagination={false}
        />
      </View>
    </View>
  );
}
