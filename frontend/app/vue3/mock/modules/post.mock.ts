import { defineMock } from 'vite-plugin-mock-dev-server'

const posts = [
  {
    id: 1,
    status: 'POST_STATUS_PUBLISHED',
    editorType: 'EDITOR_TYPE_MARKDOWN',
    slug: 'vue3-best-practices',
    disallowComment: false,
    isFeatured: true,
    sortOrder: 1,
    visits: 1234,
    likes: 89,
    commentCount: 15,
    authorId: 1,
    authorName: '张三',
    customFields: {},
    translations: [
      {
        id: 1,
        postId: 1,
        languageCode: 'zh-CN',
        title: 'Vue 3 最佳实践指南',
        slug: 'vue3-best-practices',
        summary: '深入探讨 Vue 3 开发中的最佳实践，包括 Composition API、响应式系统、性能优化等内容。',
        content: `# Vue 3 最佳实践指南

Vue 3 带来了许多令人兴奋的新特性，本文将介绍一些最佳实践。

## Composition API

Composition API 是 Vue 3 最重要的特性之一，它提供了更好的逻辑复用和代码组织方式。

\`\`\`typescript
import { ref, computed } from 'vue'

export function useCounter() {
  const count = ref(0)
  const double = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  return { count, double, increment }
}
\`\`\`

## 性能优化

1. 使用 v-memo 减少重渲染
2. 合理使用 computed 和 watch
3. 懒加载组件

更多内容请关注后续文章...`,
        thumbnail: 'https://picsum.photos/800/450?random=11',
        fullPath: '/post/1',
        wordCount: 500,
        metaKeywords: 'Vue3,最佳实践,前端开发',
        metaDescription: 'Vue 3 开发最佳实践完整指南',
        seoTitle: 'Vue 3 最佳实践指南 - 技术博客',
      },
    ],
    availableLanguages: ['zh-CN'],
    categoryIds: [1],
    tagIds: [1, 2],
    createdAt: '2026-02-28T10:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    publishTime: '2026-02-28T10:00:00Z',
  },
  {
    id: 2,
    status: 'POST_STATUS_PUBLISHED',
    editorType: 'EDITOR_TYPE_MARKDOWN',
    slug: 'typescript-advanced',
    disallowComment: false,
    isFeatured: true,
    sortOrder: 2,
    visits: 987,
    likes: 65,
    commentCount: 12,
    authorId: 1,
    authorName: '张三',
    customFields: {},
    translations: [
      {
        id: 2,
        postId: 2,
        languageCode: 'zh-CN',
        title: 'TypeScript 高级技巧',
        slug: 'typescript-advanced',
        summary: '掌握 TypeScript 的高级特性，包括泛型、类型推导、条件类型等，提升代码质量。',
        content: `# TypeScript 高级技巧

TypeScript 提供了强大的类型系统，本文将介绍一些高级用法。

## 泛型约束

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
\`\`\`

## 条件类型

条件类型可以根据类型关系进行类型选择。

## 工具类型

TypeScript 内置了许多实用的工具类型，如 Partial、Required、Pick 等。`,
        thumbnail: 'https://picsum.photos/800/450?random=12',
        fullPath: '/post/2',
        wordCount: 800,
        metaKeywords: 'TypeScript,类型系统,高级技巧',
        metaDescription: 'TypeScript 高级特性完全指南',
        seoTitle: 'TypeScript 高级技巧 - 技术博客',
      },
    ],
    availableLanguages: ['zh-CN'],
    categoryIds: [1],
    tagIds: [1, 3],
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-26T10:00:00Z',
    publishTime: '2026-02-25T10:00:00Z',
  },
  {
    id: 3,
    status: 'POST_STATUS_PUBLISHED',
    editorType: 'EDITOR_TYPE_MARKDOWN',
    slug: 'headless-cms-intro',
    disallowComment: false,
    isFeatured: true,
    sortOrder: 3,
    visits: 756,
    likes: 45,
    commentCount: 8,
    authorId: 2,
    authorName: '李四',
    customFields: {},
    translations: [
      {
        id: 3,
        postId: 3,
        languageCode: 'zh-CN',
        title: 'Headless CMS 架构设计',
        slug: 'headless-cms-intro',
        summary: '深入了解 Headless CMS 的架构设计理念，以及如何构建一个高性能、可扩展的内容管理系统。',
        content: `# Headless CMS 架构设计

Headless CMS 是现代内容管理的趋势。

## 什么是 Headless CMS

Headless CMS 将内容管理后端与前端展示解耦，通过 API 提供内容服务。

## 核心优势

1. 多渠道内容分发
2. 技术栈灵活
3. 更好的性能
4. 易于扩展

## 架构组件

- RESTful API
- GraphQL 支持
- 多租户隔离
- 缓存策略`,
        thumbnail: 'https://picsum.photos/800/450?random=13',
        fullPath: '/post/3',
        wordCount: 1200,
        metaKeywords: 'Headless CMS,架构设计,内容管理',
        metaDescription: 'Headless CMS 架构设计完整指南',
        seoTitle: 'Headless CMS 架构设计 - 技术博客',
      },
    ],
    availableLanguages: ['zh-CN'],
    categoryIds: [1],
    tagIds: [4, 5],
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-21T10:00:00Z',
    publishTime: '2026-02-20T10:00:00Z',
  },
  {
    id: 4,
    status: 'POST_STATUS_PUBLISHED',
    editorType: 'EDITOR_TYPE_MARKDOWN',
    slug: 'work-life-balance',
    disallowComment: false,
    isFeatured: false,
    sortOrder: 4,
    visits: 543,
    likes: 32,
    commentCount: 6,
    authorId: 1,
    authorName: '张三',
    customFields: {},
    translations: [
      {
        id: 4,
        postId: 4,
        languageCode: 'zh-CN',
        title: '工作与生活的平衡之道',
        slug: 'work-life-balance',
        summary: '作为程序员，如何在高强度的工作中保持生活的平衡？分享我的一些经验和思考。',
        content: `# 工作与生活的平衡之道

程序员的工作往往很繁忙，但生活同样重要。

## 时间管理

合理安排工作和休息时间，提高效率。

## 健康第一

1. 定期运动
2. 充足睡眠
3. 健康饮食

## 兴趣爱好

培养工作之外的兴趣爱好，让生活更加丰富多彩。`,
        thumbnail: 'https://picsum.photos/800/450?random=14',
        fullPath: '/post/4',
        wordCount: 600,
        metaKeywords: '工作生活平衡,程序员,健康',
        metaDescription: '程序员如何平衡工作与生活',
        seoTitle: '工作与生活的平衡之道 - 生活随笔',
      },
    ],
    availableLanguages: ['zh-CN'],
    categoryIds: [2],
    tagIds: [6],
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-16T10:00:00Z',
    publishTime: '2026-02-15T10:00:00Z',
  },
  {
    id: 5,
    status: 'POST_STATUS_PUBLISHED',
    editorType: 'EDITOR_TYPE_MARKDOWN',
    slug: 'ui-design-principles',
    disallowComment: false,
    isFeatured: false,
    sortOrder: 5,
    visits: 678,
    likes: 48,
    commentCount: 10,
    authorId: 2,
    authorName: '李四',
    customFields: {},
    translations: [
      {
        id: 5,
        postId: 5,
        languageCode: 'zh-CN',
        title: 'UI 设计的基本原则',
        slug: 'ui-design-principles',
        summary: '好的 UI 设计需要遵循一些基本原则，本文将介绍设计中的关键要素。',
        content: `# UI 设计的基本原则

优秀的 UI 设计能够提升用户体验。

## 一致性

保持设计元素的一致性，包括颜色、字体、间距等。

## 可用性

1. 清晰的信息层级
2. 直观的操作反馈
3. 符合用户习惯

## 美观性

在功能的基础上追求视觉美感。

## 响应式设计

适配不同设备和屏幕尺寸。`,
        thumbnail: 'https://picsum.photos/800/450?random=15',
        fullPath: '/post/5',
        wordCount: 700,
        metaKeywords: 'UI设计,用户体验,设计原则',
        metaDescription: 'UI 设计基本原则完整指南',
        seoTitle: 'UI 设计的基本原则 - 产品设计',
      },
    ],
    availableLanguages: ['zh-CN'],
    categoryIds: [3],
    tagIds: [7, 8],
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-11T10:00:00Z',
    publishTime: '2026-02-10T10:00:00Z',
  },
  {
    id: 6,
    status: 'POST_STATUS_PUBLISHED',
    editorType: 'EDITOR_TYPE_MARKDOWN',
    slug: 'startup-lessons',
    disallowComment: false,
    isFeatured: false,
    sortOrder: 6,
    visits: 892,
    likes: 56,
    commentCount: 14,
    authorId: 1,
    authorName: '张三',
    customFields: {},
    translations: [
      {
        id: 6,
        postId: 6,
        languageCode: 'zh-CN',
        title: '创业一年的经验总结',
        slug: 'startup-lessons',
        summary: '从零到一，创业路上的经验和教训，希望能给其他创业者一些启发。',
        content: `# 创业一年的经验总结

创业一年，收获颇多。

## 产品为王

好的产品是成功的基础，要深入了解用户需求。

## 团队建设

1. 找到志同道合的伙伴
2. 明确分工
3. 保持沟通

## 资金管理

合理规划资金使用，控制成本。

## 持续学习

市场在变化，要不断学习和调整。`,
        thumbnail: 'https://picsum.photos/800/450?random=16',
        fullPath: '/post/6',
        wordCount: 950,
        metaKeywords: '创业经验,团队建设,产品开发',
        metaDescription: '创业一年的经验和教训总结',
        seoTitle: '创业一年的经验总结 - 创业思考',
      },
    ],
    availableLanguages: ['zh-CN'],
    categoryIds: [4],
    tagIds: [9, 10],
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-06T10:00:00Z',
    publishTime: '2026-02-05T10:00:00Z',
  },
]

// 生成更多文章
for (let i = 7; i <= 20; i++) {
  const categoryId = (i % 4) + 1
  posts.push({
    id: i,
    status: 'POST_STATUS_PUBLISHED',
    editorType: 'EDITOR_TYPE_MARKDOWN',
    slug: `post-${i}`,
    disallowComment: false,
    isFeatured: false,
    sortOrder: i,
    visits: Math.floor(Math.random() * 1000) + 100,
    likes: Math.floor(Math.random() * 50) + 10,
    commentCount: Math.floor(Math.random() * 15) + 1,
    authorId: (i % 2) + 1,
    authorName: i % 2 === 0 ? '张三' : '李四',
    customFields: {},
    translations: [
      {
        id: i,
        postId: i,
        languageCode: 'zh-CN',
        title: `文章标题 ${i}`,
        slug: `post-${i}`,
        summary: `这是第 ${i} 篇文章的摘要，介绍了一些有趣的内容和观点。`,
        content: `# 文章标题 ${i}\n\n这是第 ${i} 篇文章的正文内容。\n\n## 章节 1\n\n一些有趣的内容...\n\n## 章节 2\n\n更多精彩内容...`,
        thumbnail: `https://picsum.photos/800/450?random=${i + 20}`,
        fullPath: `/post/${i}`,
        wordCount: Math.floor(Math.random() * 1000) + 300,
        metaKeywords: `关键词${i},博客,文章`,
        metaDescription: `文章 ${i} 的描述信息`,
        seoTitle: `文章标题 ${i} - 博客`,
      },
    ],
    availableLanguages: ['zh-CN'],
    categoryIds: [categoryId],
    tagIds: [categoryId, categoryId + 1],
    createdAt: `2026-01-${(i % 28) + 1}T10:00:00Z`,
    updatedAt: `2026-02-${(i % 28) + 1}T10:00:00Z`,
    publishTime: `2026-01-${(i % 28) + 1}T10:00:00Z`,
  })
}

export default defineMock([
  {
    url: '/app/v1/posts',
    method: 'GET',
    body: ({ query }: any) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')

      let filteredPosts = [...posts]

      // 按状态筛选
      if (query.query) {
        try {
          const queryObj = JSON.parse(query.query)

          // 按分类筛选
          if (queryObj.categoryIds) {
            const categoryIds = Array.isArray(queryObj.categoryIds) ? queryObj.categoryIds : [queryObj.categoryIds]
            filteredPosts = filteredPosts.filter(post =>
              post.categoryIds.some(id => categoryIds.includes(id))
            )
          }

          // 按推荐筛选
          if (queryObj.isFeatured !== undefined) {
            filteredPosts = filteredPosts.filter(post => post.isFeatured === queryObj.isFeatured)
          }

          // 按标题搜索
          if (queryObj.title___icontains) {
            const keyword = queryObj.title___icontains.toLowerCase()
            filteredPosts = filteredPosts.filter(post =>
              post.translations[0].title.toLowerCase().includes(keyword)
            )
          }
        } catch (e) {
          console.error('Parse query error:', e)
        }
      }

      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        items: filteredPosts.slice(start, end),
        total: filteredPosts.length,
      }
    },
  },
  {
    url: '/app/v1/posts/:id',
    method: 'GET',
    body: ({ params }: any) => {
      const id = parseInt(params.id)
      const post = posts.find(p => p.id === id)
      return post || { error: 'Post not found' }
    },
  },
])

