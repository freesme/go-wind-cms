import { defineMock } from 'vite-plugin-mock-dev-server'

const tags = [
  {
    id: 1,
    name: 'Vue.js',
    slug: 'vuejs',
    description: 'Vue.js 相关内容',
    postCount: 5,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '前端开发',
    slug: 'frontend',
    description: '前端开发技术',
    postCount: 8,
    createdAt: '2026-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript 编程语言',
    postCount: 6,
    createdAt: '2026-01-03T00:00:00Z',
  },
  {
    id: 4,
    name: 'CMS',
    slug: 'cms',
    description: '内容管理系统',
    postCount: 4,
    createdAt: '2026-01-04T00:00:00Z',
  },
  {
    id: 5,
    name: '架构设计',
    slug: 'architecture',
    description: '软件架构设计',
    postCount: 3,
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 6,
    name: '生活',
    slug: 'life',
    description: '生活相关',
    postCount: 7,
    createdAt: '2026-01-06T00:00:00Z',
  },
  {
    id: 7,
    name: 'UI设计',
    slug: 'ui-design',
    description: 'UI 界面设计',
    postCount: 5,
    createdAt: '2026-01-07T00:00:00Z',
  },
  {
    id: 8,
    name: 'UX',
    slug: 'ux',
    description: '用户体验',
    postCount: 4,
    createdAt: '2026-01-08T00:00:00Z',
  },
  {
    id: 9,
    name: '创业',
    slug: 'startup',
    description: '创业相关',
    postCount: 6,
    createdAt: '2026-01-09T00:00:00Z',
  },
  {
    id: 10,
    name: '团队管理',
    slug: 'team-management',
    description: '团队建设与管理',
    postCount: 3,
    createdAt: '2026-01-10T00:00:00Z',
  },
]

export default defineMock([
  {
    url: '/app/v1/tags',
    method: 'GET',
    body: ({ query }: any) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')
      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        items: tags.slice(start, end),
        total: tags.length,
      }
    },
  },
  {
    url: '/app/v1/tags/:id',
    method: 'GET',
    body: ({ params }: any) => {
      const id = parseInt(params.id)
      const tag = tags.find(t => t.id === id)
      return tag || { error: 'Tag not found' }
    },
  },
])

