import { defineMock } from 'vite-plugin-mock-dev-server'

const comments = [
  {
    id: 1,
    postId: 1,
    content: '非常好的文章，学到了很多！',
    authorName: '王五',
    email: 'wangwu@example.com',
    status: 'COMMENT_STATUS_APPROVED',
    createdAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 2,
    postId: 1,
    content: 'Composition API 确实很强大，感谢分享！',
    authorName: '赵六',
    email: 'zhaoliu@example.com',
    status: 'COMMENT_STATUS_APPROVED',
    createdAt: '2026-03-01T14:30:00Z',
  },
  {
    id: 3,
    postId: 1,
    content: '期待更多关于 Vue 3 的文章',
    authorName: '孙七',
    email: 'sunqi@example.com',
    status: 'COMMENT_STATUS_APPROVED',
    createdAt: '2026-03-02T09:15:00Z',
  },
  {
    id: 4,
    postId: 2,
    content: 'TypeScript 的类型系统真的很强大',
    authorName: '周八',
    email: 'zhouba@example.com',
    status: 'COMMENT_STATUS_APPROVED',
    createdAt: '2026-02-26T10:00:00Z',
  },
  {
    id: 5,
    postId: 2,
    content: '条件类型的部分能再详细讲讲吗？',
    authorName: '吴九',
    email: 'wujiu@example.com',
    status: 'COMMENT_STATUS_APPROVED',
    createdAt: '2026-02-27T15:20:00Z',
  },
  {
    id: 6,
    postId: 3,
    content: 'Headless CMS 是未来的趋势',
    authorName: '郑十',
    email: 'zhengshi@example.com',
    status: 'COMMENT_STATUS_APPROVED',
    createdAt: '2026-02-21T11:00:00Z',
  },
]

export default defineMock([
  {
    url: '/app/v1/comments',
    method: 'GET',
    body: ({ query }: any) => {
      const page = parseInt(query.page || '1')
      const pageSize = parseInt(query.pageSize || '10')

      let filteredComments = [...comments]

      // 按文章 ID 筛选
      if (query.query) {
        try {
          const queryObj = JSON.parse(query.query)
          if (queryObj.postId) {
            filteredComments = filteredComments.filter(c => c.postId === queryObj.postId)
          }
          if (queryObj.status) {
            filteredComments = filteredComments.filter(c => c.status === queryObj.status)
          }
        } catch (e) {
          console.error('Parse query error:', e)
        }
      }

      const start = (page - 1) * pageSize
      const end = start + pageSize

      return {
        items: filteredComments.slice(start, end),
        total: filteredComments.length,
      }
    },
  },
  {
    url: '/app/v1/comments',
    method: 'POST',
    body: ({ body }: any) => {
      const newComment = {
        id: comments.length + 1,
        ...body.data,
        createdAt: new Date().toISOString(),
      }
      comments.push(newComment)
      return newComment
    },
  },
])

