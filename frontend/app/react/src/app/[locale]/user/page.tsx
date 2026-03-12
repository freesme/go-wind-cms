'use client';

import {useState, useEffect, useMemo} from 'react';
import {useTranslations} from 'next-intl';
import XIcon from '@/plugins/xicon';

import '../../globals.css';
import styles from './user.module.css';

export default function UserProfilePage() {
    const t = useTranslations('page.user');
    
    const [loading, setLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'posts' | 'activities' | 'collections'>('posts');
    const [posts, setPosts] = useState<any[]>([]);
    const [postsTotal, setPostsTotal] = useState(0);

    // 统计数据
    const stats = useMemo(() => ({
        followers: user?.followers ?? 0,
        following: user?.following ?? 0,
        posts: user?.postCount ?? 0,
        likes: user?.likeCount ?? 0,
    }), [user]);

    // 格式化性别
    const formatGender = (gender?: string) => {
        if (!gender) return t('gender_secret');
        const genderMap: Record<string, string> = {
            'SECRET': t('gender_secret'),
            'MALE': t('gender_male'),
            'FEMALE': t('gender_female'),
        };
        return genderMap[gender] || gender;
    };

    // 格式化状态
    const formatStatus = (status?: string) => {
        if (!status) return '-';
        const statusMap: Record<string, string> = {
            'NORMAL': t('status_normal'),
            'DISABLED': t('status_disabled'),
            'PENDING': t('status_pending'),
            'LOCKED': t('status_locked'),
            'EXPIRED': t('status_expired'),
            'CLOSED': t('status_closed'),
        };
        return statusMap[status] || status;
    };

    // 格式化日期时间
    const formatDateTime = (timestamp?: any) => {
        if (!timestamp) return '-';
        try {
            let date: Date;
            if (timestamp.seconds) {
                date = new Date(timestamp.seconds * 1000);
            } else if (typeof timestamp === 'string') {
                date = new Date(timestamp);
            } else {
                return '-';
            }
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return '-';
        }
    };

    // 获取用户信息
    async function loadUserProfile() {
        setLoading(true);
        try {
            // TODO: 调用实际 API 获取用户信息
            // const result = await userProfileStore.getMe();
            // setUser(result || null);
            
            // Mock data for demo
            setUser({
                id: 1,
                username: 'testuser',
                nickname: '测试用户',
                realname: '张三',
                gender: 'MALE',
                email: 'test@example.com',
                mobile: '138****8888',
                region: '北京市朝阳区',
                tenantName: '示例公司',
                positionNames: ['产品经理'],
                description: '这是一个测试用户的个人简介',
                status: 'NORMAL',
                roleNames: ['user', 'author'],
                createdAt: {seconds: Date.now() / 1000 - 86400 * 30},
                lastLoginAt: {seconds: Date.now() / 1000 - 3600},
                followers: 128,
                following: 56,
                postCount: 12,
                likeCount: 340,
                avatar: undefined,
            });

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
            // TODO: 调用实际 API 获取帖子列表
            // const result = await postStore.listPost(
            //     {page: 1, pageSize: 10},
            //     {author_id: user.id},
            //     null,
            //     ['-createdAt']
            // );
            
            // Mock data for demo
            setPosts([
                {
                    id: 1,
                    title: 'React Hooks 最佳实践',
                    summary: '本文介绍了 React Hooks 的使用技巧和最佳实践...',
                    visits: 1234,
                    likes: 56,
                    commentCount: 23,
                    createdAt: {seconds: Date.now() / 1000 - 86400 * 7},
                },
                {
                    id: 2,
                    title: 'TypeScript 高级类型技巧',
                    summary: '深入理解 TypeScript 的类型系统，掌握高级类型技巧...',
                    visits: 890,
                    likes: 42,
                    commentCount: 15,
                    createdAt: {seconds: Date.now() / 1000 - 86400 * 3},
                },
            ]);
            setPostsTotal(2);
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
            <div className={styles.userProfilePage}>
                <div className={styles.profileHeader}>
                    <div className={styles.headerSkeleton}></div>
                </div>
                <div className={styles.profileMain}>
                    <aside className={styles.profileSidebar}>
                        <div className={styles.infoCard}>
                            <div className={styles.skeletonText}></div>
                            <div className={styles.skeletonText}></div>
                            <div className={styles.skeletonText}></div>
                        </div>
                    </aside>
                    <main className={styles.profileContentArea}>
                        <div className={styles.contentCard}>
                            <div className={styles.skeletonText}></div>
                            <div className={styles.skeletonText}></div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // 用户未登录
    if (!user) {
        return (
            <div className={styles.emptyState}>
                <div className={styles.emptyText}>{t('please_login')}</div>
            </div>
        );
    }

    return (
        <div className={styles.userProfilePage}>
            {/* 顶部背景和基本信息 */}
            <div className={styles.profileHeader}>
                <div className={styles.headerBg}></div>
                <div className={styles.profileContent}>
                    {/* 用户基本信息 */}
                    <div className={styles.userBasicInfo}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarWrapper}>
                                <div className={styles.userAvatar}>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.nickname}/>
                                    ) : (
                                        (user?.nickname?.charAt(0) || user?.username?.charAt(0) || 'U')
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.infoSection}>
                            <div className={styles.userHeader}>
                                <div className={styles.userTitle}>
                                    <h1 className={styles.userName}>{user?.nickname || user?.username}</h1>
                                    {user?.gender && (
                                        <span className={`${styles.genderTag} ${styles[user.gender.toLowerCase()]}`}>
                                            {formatGender(user.gender)}
                                        </span>
                                    )}
                                </div>
                                <button className={styles.editBtn}>{t('edit_profile')}</button>
                            </div>

                            {user?.description && (
                                <p className={styles.userBio}>{user.description}</p>
                            )}

                            <div className={styles.userMeta}>
                                {user?.region && <span className={styles.metaItem}>{user.region}</span>}
                                {user?.tenantName && <span className={styles.metaItem}>{user.tenantName}</span>}
                                {user?.positionNames?.length && (
                                    <span className={styles.metaItem}>{user.positionNames.join(', ')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 统计数据 */}
                    <div className={styles.userStats}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{stats.following}</div>
                            <div className={styles.statLabel}>{t('following')}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{stats.followers}</div>
                            <div className={styles.statLabel}>{t('followers')}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{stats.posts}</div>
                            <div className={styles.statLabel}>{t('posts')}</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{stats.likes}</div>
                            <div className={styles.statLabel}>{t('likes_received')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 内容区域 */}
            <div className={styles.profileMain}>
                {/* 左侧面板 */}
                <aside className={styles.profileSidebar}>
                    <div className={styles.infoCard}>
                        <div className={styles.cardSection}>
                            <h3 className={styles.sectionTitle}>{t('basic_info')}</h3>
                            <div className={styles.infoList}>
                                {user?.username && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoKey}>{t('username')}:</span>
                                        <span className={styles.infoVal}>{user.username}</span>
                                    </div>
                                )}
                                {user?.realname && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoKey}>{t('realname')}:</span>
                                        <span className={styles.infoVal}>{user.realname}</span>
                                    </div>
                                )}
                                {user?.email && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoKey}>{t('email')}:</span>
                                        <span className={styles.infoVal}>{user.email}</span>
                                    </div>
                                )}
                                {user?.mobile && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoKey}>{t('mobile')}:</span>
                                        <span className={styles.infoVal}>{user.mobile}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.divider}></div>

                        <div className={styles.cardSection}>
                            <h3 className={styles.sectionTitle}>{t('account_info')}</h3>
                            <div className={styles.infoList}>
                                <div className={styles.infoRow}>
                                    <span className={styles.infoKey}>{t('status')}:</span>
                                    <span className={`${styles.statusTag} ${styles[`status${user?.status}`]}`}>
                                        {formatStatus(user?.status)}
                                    </span>
                                </div>
                                {user?.roleNames?.length && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoKey}>{t('roles')}:</span>
                                        <span className={styles.infoVal}>{user.roleNames.join(', ')}</span>
                                    </div>
                                )}
                                {user?.createdAt && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoKey}>{t('created_at')}:</span>
                                        <span className={styles.infoVal}>{formatDateTime(user.createdAt)}</span>
                                    </div>
                                )}
                                {user?.lastLoginAt && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoKey}>{t('last_login_at')}:</span>
                                        <span className={styles.infoVal}>{formatDateTime(user.lastLoginAt)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 主内容区 */}
                <main className={styles.profileContentArea}>
                    <div className={styles.contentCard}>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
                                onClick={() => setActiveTab('posts')}
                            >
                                {t('tab_posts')}
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'activities' ? styles.active : ''}`}
                                onClick={() => setActiveTab('activities')}
                            >
                                {t('tab_activities')}
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'collections' ? styles.active : ''}`}
                                onClick={() => setActiveTab('collections')}
                            >
                                {t('tab_collections')}
                            </button>
                        </div>

                        <div className={styles.tabContent}>
                            {activeTab === 'posts' && (
                                <>
                                    {postsLoading ? (
                                        <div className={styles.postsListLoading}>
                                            <div className={styles.skeletonText}></div>
                                            <div className={styles.skeletonText}></div>
                                        </div>
                                    ) : posts.length > 0 ? (
                                        <div className={styles.postsList}>
                                            {posts.map((post) => (
                                                <div key={post.id} className={styles.postItem}>
                                                    <div className={styles.postContent}>
                                                        <h3 className={styles.postTitle}>{post.title}</h3>
                                                        <p className={styles.postSummary}>{post.summary}</p>
                                                        <div className={styles.postMeta}>
                                                            <span className={styles.metaInfo}>
                                                                <XIcon name="carbon:view" size={16}/>
                                                                {post.visits || 0} {t('views')}
                                                            </span>
                                                            <span className={styles.metaInfo}>
                                                                <XIcon name="carbon:thumbs-up" size={16}/>
                                                                {post.likes || 0} {t('likes')}
                                                            </span>
                                                            <span className={styles.metaInfo}>
                                                                <XIcon name="carbon:chat" size={16}/>
                                                                {post.commentCount || 0} {t('comments')}
                                                            </span>
                                                            <span className={styles.metaInfo}>
                                                                <XIcon name="carbon:time" size={16}/>
                                                                {formatDateTime(post.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button className={styles.viewPostBtn}>
                                                        {t('view_post')} →
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className={styles.empty}>
                                            <div className={styles.emptyIcon}>📄</div>
                                            <div className={styles.emptyText}>{t('no_posts')}</div>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'activities' && (
                                <div className={styles.empty}>
                                    <div className={styles.emptyIcon}>🎯</div>
                                    <div className={styles.emptyText}>{t('no_activities')}</div>
                                </div>
                            )}

                            {activeTab === 'collections' && (
                                <div className={styles.empty}>
                                    <div className={styles.emptyIcon}>🔖</div>
                                    <div className={styles.emptyText}>{t('no_collections')}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
