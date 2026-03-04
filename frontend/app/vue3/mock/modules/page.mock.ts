import { defineMock } from 'vite-plugin-mock-dev-server'

const pages = [
  {
    id: 1,
    status: 'PAGE_STATUS_PUBLISHED',
    type: 'PAGE_TYPE_DEFAULT',
    editorType: 'EDITOR_TYPE_MARKDOWN',
    slug: 'about',
    showInNavigation: true,
    sortOrder: 1,
    visits: 456,
    translations: [
      {
        id: 1,
        pageId: 1,
        languageCode: 'zh-CN',
        title: '关于我们',
        slug: 'about',
        summary: '了解我们的团队和使命',
        content: `# 关于 GoWind CMS

GoWind CMS 是一个强大的多租户 Headless CMS 平台，为现代团队提供灵活的内容管理解决方案。

## 我们的使命

让内容管理变得更简单、更高效、更灵活。

## 核心特性

### 多租户架构
完整的租户隔离与共享基础设施，支持无限数量的独立项目。

### 灵活的内容管理
强大的工具用于管理所有类型的内容，支持多语言、自定义字段、版本控制等。

### 企业级安全
- 基于角色的访问控制
- 数据加密
- 审计日志
- 定期安全审查

### 高级分析
深入了解您的内容表现，包括访问统计、用户行为分析等。

## 联系我们

如果您有任何问题或建议，欢迎联系我们：

- 邮箱：support@gowindcms.com
- 电话：+86 123 4567 8900
- 地址：中国北京市朝阳区xxx路xx号`,
        thumbnail: 'https://picsum.photos/800/450?random=100',
        fullPath: '/about',
        wordCount: 200,
      },
    ],
    availableLanguages: ['zh-CN'],
    customFields: {},
    children: [],
    depth: 0,
    path: '/about',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
]

export default defineMock([
  {
    url: '/app/v1/pages',
    method: 'GET',
    body: ({ query }: any) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')

      let filteredPages = [...pages]

      // 按 slug 筛选
      if (query.query) {
        try {
          const queryObj = JSON.parse(query.query)
          if (queryObj.slug) {
            filteredPages = filteredPages.filter(p =>
              p.translations[0].slug === queryObj.slug
            )
          }
          if (queryObj.type) {
            filteredPages = filteredPages.filter(p => p.type === queryObj.type)
          }
        } catch (e) {
          console.error('Parse query error:', e)
        }
      }

      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        items: filteredPages.slice(start, end),
        total: filteredPages.length,
      }
    },
  },
  {
    url: '/app/v1/pages/:id',
    method: 'GET',
    body: ({ params }: any) => {
      const id = parseInt(params.id)
      const page = pages.find(p => p.id === id)
      return page || { error: 'Page not found' }
    },
  },
])

