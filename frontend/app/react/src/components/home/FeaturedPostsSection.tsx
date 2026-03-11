import React from 'react';
import {Button} from 'antd';
import {useTranslations} from 'next-intl';

import styles from './home.module.css';

export default function FeaturedPostsSection() {
    const t = useTranslations('page.home');
    return (
        <section className={styles.featuredSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{t('featured_posts')}</h2>
                <Button type="link" onClick={() => window.location.href = '/post'}>{t('view_all')} →</Button>
            </div>
             <div className={styles.postList}>
                 {/* 示例数据，可替换为实际数据 */}
                 {[{
                     id: 1,
                     title: 'GoWind CMS 性能优化指南：从5万QPS到10万的实战经验',
                     desc: '分享GoWind CMS性能优化、缓存策略、数据库优化、硬件升级等，QPS提升到10万。',
                     author: '王五',
                     date: '2026/3/11 23:20:25',
                     views: 5660,
                     likes: 789,
                     img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
                 }, {
                     id: 2,
                     title: 'GoWind CMS v2.0 正式发布：新增多租户，性能提升100%',
                     desc: 'GoWind CMS 2.0发布，支持多租户、性能优化、UI重构，QPS突破10万。',
                     author: 'GoWind官方',
                     date: '2026/2/12 23:20:25',
                     views: 9870,
                     likes: 654,
                     img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
                 }, {
                     id: 3,
                     title: 'GoWind CMS 快速上手：5分钟搭建你的第一个CMS站点',
                     desc: 'GoWind CMS快速上手，通用模块、初始安装流程，初级实战全流程。',
                     author: 'GoWind官方',
                     date: '2026/2/27 23:20:25',
                     views: 1589,
                     likes: 892,
                     img: 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36b?auto=format&fit=crop&w=400&q=80'
                 }].map(post => (
                     <div key={post.id} className={styles.postCard}>
                         <img src={post.img} alt={post.title} className={styles.postImage}/>
                         <div className={styles.postContent}>
                             <h3 className={styles.postTitle}>{post.title}</h3>
                             <p className={styles.postDesc}>{post.desc}</p>
                             <div className={styles.postMeta}>
                                 <span>{post.author}</span>
                                 <span>{post.date}</span>
                             </div>
                             <div className={styles.postStats}>
                                 <span>👁️ {post.views}</span>
                                 <span>👍 {post.likes}</span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
            <div className={styles.scrollIndicator}>
                <span className={styles.scrollIndicatorText}>{t('explore_more_categories')}</span>
                <Button shape="circle" onClick={() => {
                    const section = document.querySelector('.categories-section');
                    if (section) section.scrollIntoView({behavior: 'smooth', block: 'start'});
                }}>↓</Button>
            </div>
        </section>
    );
}
