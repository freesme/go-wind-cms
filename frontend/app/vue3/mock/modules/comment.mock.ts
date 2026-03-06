import { defineMock } from 'vite-plugin-mock-dev-server'

// 生成随机的 RFC 3339 格式时间戳
function generateRandomTimestamp(daysAgo: number = 0, hoursOffset: number = 0): string {
  const date = new Date(Date.now() - daysAgo * 86400000 - hoursOffset * 3600000)
  return date.toISOString()
}

const comments = [
  {
    id: 1,
    contentType: 'CONTENT_TYPE_POST',
    objectId: 1,
    content: '非常好的文章，学到了很多！',
    authorId: 0,
    authorName: '王五',
    authorEmail: 'wangwu@example.com',
    authorUrl: '',
    authorType: 'AUTHOR_TYPE_GUEST',
    status: 'STATUS_APPROVED',
    likeCount: 5,
    dislikeCount: 0,
    replyCount: 0,
    ipAddress: '192.168.1.1',
    location: '北京',
    createdAt: generateRandomTimestamp(2, 4),
    updatedAt: generateRandomTimestamp(2, 4),
  },
  {
    id: 2,
    contentType: 'CONTENT_TYPE_POST',
    objectId: 1,
    content: 'Composition API 确实很强大，感谢分享！',
    authorId: 0,
    authorName: '赵六',
    authorEmail: 'zhaoliu@example.com',
    authorUrl: '',
    authorType: 'AUTHOR_TYPE_GUEST',
    status: 'STATUS_APPROVED',
    likeCount: 3,
    dislikeCount: 0,
    replyCount: 0,
    ipAddress: '192.168.1.2',
    location: '上海',
    createdAt: generateRandomTimestamp(2, 2),
    updatedAt: generateRandomTimestamp(2, 2),
  },
  {
    id: 3,
    contentType: 'CONTENT_TYPE_POST',
    objectId: 1,
    content: '期待更多关于 Vue 3 的文章',
    authorId: 0,
    authorName: '孙七',
    authorEmail: 'sunqi@example.com',
    authorUrl: '',
    authorType: 'AUTHOR_TYPE_GUEST',
    status: 'STATUS_APPROVED',
    likeCount: 2,
    dislikeCount: 0,
    replyCount: 0,
    ipAddress: '192.168.1.3',
    location: '深圳',
    createdAt: generateRandomTimestamp(1, 12),
    updatedAt: generateRandomTimestamp(1, 12),
  },
  {
    id: 4,
    contentType: 'CONTENT_TYPE_POST',
    objectId: 2,
    content: 'TypeScript 的类型系统真的很强大',
    authorId: 0,
    authorName: '周八',
    authorEmail: 'zhouba@example.com',
    authorUrl: '',
    authorType: 'AUTHOR_TYPE_GUEST',
    status: 'STATUS_APPROVED',
    likeCount: 8,
    dislikeCount: 0,
    replyCount: 0,
    ipAddress: '192.168.1.4',
    location: '杭州',
    createdAt: generateRandomTimestamp(5, 6),
    updatedAt: generateRandomTimestamp(5, 6),
  },
  {
    id: 5,
    contentType: 'CONTENT_TYPE_POST',
    objectId: 2,
    content: '条件类型的部分能再详细讲讲吗？',
    authorId: 0,
    authorName: '吴九',
    authorEmail: 'wujiu@example.com',
    authorUrl: '',
    authorType: 'AUTHOR_TYPE_GUEST',
    status: 'STATUS_APPROVED',
    likeCount: 1,
    dislikeCount: 0,
    replyCount: 0,
    ipAddress: '192.168.1.5',
    location: '成都',
    createdAt: generateRandomTimestamp(4, 8),
    updatedAt: generateRandomTimestamp(4, 8),
  },
  {
    id: 6,
    contentType: 'CONTENT_TYPE_POST',
    objectId: 3,
    content: 'Headless CMS 是未来的趋势',
    authorId: 0,
    authorName: '郑十',
    authorEmail: 'zhengshi@example.com',
    authorUrl: '',
    authorType: 'AUTHOR_TYPE_GUEST',
    status: 'STATUS_APPROVED',
    likeCount: 6,
    dislikeCount: 0,
    replyCount: 0,
    ipAddress: '192.168.1.6',
    location: '西安',
    createdAt: generateRandomTimestamp(7, 3),
    updatedAt: generateRandomTimestamp(7, 3),
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

      // 按对象 ID 和内容类型筛选
      if (query.query) {
        try {
          const queryObj = JSON.parse(query.query)
          if (queryObj.objectId) {
            filteredComments = filteredComments.filter(c => c.objectId === queryObj.objectId)
          }
          if (queryObj.contentType) {
            filteredComments = filteredComments.filter(c => c.contentType === queryObj.contentType)
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
        createdAt: generateRandomTimestamp(0, 0),
        updatedAt: generateRandomTimestamp(0, 0),
      }
      comments.push(newComment)
      return newComment
    },
  },
])

