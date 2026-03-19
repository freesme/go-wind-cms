import {useState, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, Image} from '@tarojs/components';

import {
  type contentservicev1_ListPostResponse,
  type contentservicev1_Post,
  identityservicev1_User
} from "@/api/generated/app/service/v1";
import {usePostStore} from "@/store/slices/post/hooks";
import {useUserProfileStore} from "@/store/slices/userProfile/hooks";

import styles from './user.scss';
import {formatDateTime} from "@/utils";

export default function UserProfilePage() {
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'posts' | 'activities' | 'collections'>('posts');

  const [user, setUser] = useState<identityservicev1_User | null>(null);
  const [posts, setPosts] = useState<contentservicev1_Post[]>([]);

  const postStore = usePostStore();
  const userProfileStore = useUserProfileStore();

  // 统计数据
  const stats = useMemo(() => ({
    followers: user?.followers ?? 0,
    following: user?.following ?? 0,
    posts: user?.postCount ?? 0,
    likes: user?.likeCount ?? 0,
  }), [user]);

  // 格式化性别
  const formatGender = (gender?: string) => {
    if (!gender) return t('page.user.gender_secret');
    const genderMap: Record<string, string> = {
      'SECRET': t('page.user.gender_secret'),
      'MALE': t('page.user.gender_male'),
      'FEMALE': t('page.user.gender_female'),
    };
    return genderMap[gender] || gender;
  };

  // 格式化状态
  const formatStatus = (status?: string) => {
    if (!status) return '-';
    const statusMap: Record<string, string> = {
      'NORMAL': t('page.status_normal'),
      'DISABLED': t('page.status_disabled'),
      'PENDING': t('page.status_pending'),
      'LOCKED': t('page.status_locked'),
      'EXPIRED': t('page.status_expired'),
      'CLOSED': t('page.status_closed'),
    };
    return statusMap[status] || status;
  };

  // 获取用户信息
  async function loadUserProfile() {
    setLoading(true);
    try {
      const result = await userProfileStore.fetchUserProfile({}) as identityservicev1_User;
      setUser(result || null);

      if (activeTab === 'posts') {
        await loadUserPosts();
      }
    } catch (error) {
      console.error('Load user profile failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // 加载用户的帖子列表
  async function loadUserPosts() {
    if (!user?.id) return;

    setPostsLoading(true);
    try {
      const result = await postStore.listPost({
        paging: {page: 1, pageSize: 10},
        formValues: {author_id: user.id},
        fieldMask: undefined,
        orderBy: ['-createdAt']
      }) as unknown as contentservicev1_ListPostResponse;

      setPosts(result.items || []);
    } catch (error) {
      console.error('Load user posts failed:', error);
    } finally {
      setPostsLoading(false);
    }
  }

  // 监听 activeTab 变化
  useEffect(() => {
    if (activeTab === 'posts' && posts.length === 0 && user) {
      loadUserPosts();
    }
  }, [activeTab, user]);

  // 初始加载
  useEffect(() => {
    loadUserProfile();
  }, []);

  // 渲染 Loading Skeleton
  if (loading) {
    return (
      <View className={styles.userProfilePage}>
        <View className={styles.profileHeader}>
          <View className={styles.headerSkeleton}></View>
        </View>
        <View className={styles.profileMain}>
          <View className={styles.profileSidebar}>
            <View className={styles.infoCard}>
              <View className={styles.skeletonText}></View>
              <View className={styles.skeletonText}></View>
              <View className={styles.skeletonText}></View>
            </View>
          </View>
          <View className={styles.profileContentArea}>
            <View className={styles.contentCard}>
              <View className={styles.skeletonText}></View>
              <View className={styles.skeletonText}></View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 用户未登录
  if (!user) {
    return (
      <View className={styles.emptyState}>
         <Text className={styles.emptyText}>{t('page.user.please_login')}</Text>
      </View>
    );
  }

  return (
    <View className={styles.userProfilePage}>
      {/* 顶部背景和基本信息 */}
      <View className={styles.profileHeader}>
        <View className={styles.headerBg}></View>
        <View className={styles.profileContent}>
          {/* 用户基本信息 */}
          <View className={styles.userBasicInfo}>
            <View className={styles.avatarSection}>
              <View className={styles.avatarWrapper}>
                <View className={styles.userAvatar}>
                  {user?.avatar ? (
                    <Image src={user.avatar}/>
                  ) : (
                    <Text>{user?.nickname?.charAt(0) || user?.username?.charAt(0) || 'U'}</Text>
                  )}
                </View>
              </View>
            </View>

            <View className={styles.infoSection}>
              <View className={styles.userHeader}>
                <View className={styles.userTitle}>
                  <Text className={styles.userName}>{user?.nickname || user?.username}</Text>
                  {user?.gender && (
                    <Text className={`${styles.genderTag} ${styles[user.gender.toLowerCase()]}`}>
                      {formatGender(user.gender)}
                    </Text>
                  )}
                </View>
                       <View className={styles.editBtn}>{t('page.user.edit_profile')}</View>
              </View>

              {user?.description && (
                <Text className={styles.userBio}>{user.description}</Text>
              )}

              <View className={styles.userMeta}>
                {user?.region && (
                  <Text className={styles.metaItem}>
                    {user.region.replace(/\d+/g, '').trim()}
                  </Text>
                )}
                {user?.tenantName && <Text className={styles.metaItem}>{user.tenantName}</Text>}
              </View>
            </View>
          </View>
        </View>

        {/* 统计数据 */}
        <View className={styles.userStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.following}</Text>
            <Text className={styles.statLabel}>{t('page.user.following')}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.followers}</Text>
            <Text className={styles.statLabel}>{t('page.user.followers')}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.posts}</Text>
            <Text className={styles.statLabel}>{t('page.user.posts')}</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{stats.likes}</Text>
            <Text className={styles.statLabel}>{t('page.user.likes_received')}</Text>
          </View>
        </View>
      </View>

      {/* 内容区域 */}
      <View className={styles.profileMain}>
        {/* 左侧面板 */}
        <View className={styles.profileSidebar}>
          <View className={styles.infoCard}>
            <View className={styles.cardSection}>
              <Text className={styles.sectionTitle}>{t('page.user.basic_info')}</Text>
              <View className={styles.infoList}>
                {user?.username && (
                  <View className={styles.infoRow}>
                    <Text className={styles.infoKey}>{t('page.user.username')}:</Text>
                    <Text className={styles.infoVal}>{user.username}</Text>
                  </View>
                )}
                {user?.realname && (
                  <View className={styles.infoRow}>
                    <Text className={styles.infoKey}>{t('page.user.realname')}:</Text>
                    <Text className={styles.infoVal}>{user.realname}</Text>
                  </View>
                )}
                {user?.email && (
                  <View className={styles.infoRow}>
                    <Text className={styles.infoKey}>{t('page.user.email')}:</Text>
                    <Text className={styles.infoVal}>{user.email}</Text>
                  </View>
                )}
                {user?.mobile && (
                  <View className={styles.infoRow}>
                    <Text className={styles.infoKey}>{t('page.user.mobile')}:</Text>
                    <Text className={styles.infoVal}>{user.mobile}</Text>
                  </View>
                )}
              </View>
            </View>

            <View className={styles.divider}></View>

            <View className={styles.cardSection}>
               <Text className={styles.sectionTitle}>{t('page.user.account_info')}</Text>
              <View className={styles.infoList}>
                <View className={styles.infoRow}>
                   <Text className={styles.infoKey}>{t('page.user.status')}:</Text>
                  <Text className={`${styles.statusTag} ${styles[`status${user?.status}`]}`}>
                    {formatStatus(user?.status)}
                  </Text>
                </View>
                {user?.roleNames?.length && (
                  <View className={styles.infoRow}>
                     <Text className={styles.infoKey}>{t('page.user.roles')}:</Text>
                    <Text className={styles.infoVal}>{user.roleNames.join(', ')}</Text>
                  </View>
                )}
                {user?.createdAt && (
                  <View className={styles.infoRow}>
                     <Text className={styles.infoKey}>{t('page.user.created_at')}:</Text>
                    <Text className={styles.infoVal}>{formatDateTime(user.createdAt)}</Text>
                  </View>
                )}
                {user?.lastLoginAt && (
                  <View className={styles.infoRow}>
                     <Text className={styles.infoKey}>{t('page.user.last_login_at')}:</Text>
                    <Text className={styles.infoVal}>{formatDateTime(user.lastLoginAt)}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* 主内容区 */}
        <View className={styles.profileContentArea}>
          <View className={styles.contentCard}>
            <View className={styles.tabs}>
              <View
                className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                <Text>{t('page.user.tab_posts')}</Text>
              </View>
              <View
                className={`${styles.tab} ${activeTab === 'activities' ? styles.active : ''}`}
                onClick={() => setActiveTab('activities')}
              >
                <Text>{t('page.user.tab_activities')}</Text>
              </View>
              <View
                className={`${styles.tab} ${activeTab === 'collections' ? styles.active : ''}`}
                onClick={() => setActiveTab('collections')}
              >
                <Text>{t('page.user.tab_collections')}</Text>
              </View>
            </View>

            <View className={styles.tabContent}>
              {activeTab === 'posts' && (
                <>
                  {postsLoading ? (
                    <View className={styles.postsListLoading}>
                      <View className={styles.skeletonText}></View>
                      <View className={styles.skeletonText}></View>
                    </View>
                  ) : posts.length > 0 ? (
                    <View className={styles.postsList}>
                      {posts.map((post) => (
                        <View key={post.id} className={styles.postItem}>
                          <View className={styles.postContent}>
                            <Text className={styles.postTitle}>{postStore.getPostTitle(post)}</Text>
                            <Text className={styles.postSummary}>{postStore.getPostSummary(post)}</Text>
                            <View className={styles.postMeta}>
                              <View className={styles.metaInfo}>
                                <Text>👁️</Text>
                                 <Text>{post.visits || 0} {t('page.views')}</Text>
                              </View>
                              <View className={styles.metaInfo}>
                                <Text>👍</Text>
                                 <Text>{post.likes || 0} {t('page.likes')}</Text>
                              </View>
                              <View className={styles.metaInfo}>
                                <Text>💬</Text>
                                 <Text>{post.commentCount || 0} {t('page.comments')}</Text>
                              </View>
                              <View className={styles.metaInfo}>
                                <Text>🕐</Text>
                                <Text>{formatDateTime(post.createdAt)}</Text>
                              </View>
                            </View>
                          </View>
                          <View className={styles.viewPostBtn}>
                             <Text>{t('page.view_post')} →</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View className={styles.empty}>
                      <Text className={styles.emptyIcon}>📄</Text>
                       <Text className={styles.emptyText}>{t('page.user.no_posts')}</Text>
                    </View>
                  )}
                </>
              )}

              {activeTab === 'activities' && (
                <View className={styles.empty}>
                  <Text className={styles.emptyIcon}>🎯</Text>
                   <Text className={styles.emptyText}>{t('page.user.no_activities')}</Text>
                </View>
              )}

              {activeTab === 'collections' && (
                <View className={styles.empty}>
                  <Text className={styles.emptyIcon}>🔖</Text>
                   <Text className={styles.emptyText}>{t('page.user.no_collections')}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
