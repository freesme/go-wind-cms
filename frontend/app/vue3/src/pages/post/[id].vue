<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore, useCommentStore } from '@/stores/modules/app'
import { useMessage } from 'naive-ui'
import { $t } from '@/locales'
import { ContentViewer } from '@/components/ContentViewer'

definePage({
  name: 'post-detail',
  meta: {
    title: 'Post Detail',
    level: 3,
  },
})

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const commentStore = useCommentStore()
const message = useMessage()

const loading = ref(false)
const post = ref<any>(null)
const comments = ref<any[]>([])
const relatedPosts = ref<any[]>([])

const newComment = ref({
  content: '',
  authorName: '',
  email: '',
})

const postId = computed(() => {
  const id = route.params.id
  return id ? parseInt(id as string) : null
})

async function loadPost() {
  if (!postId.value) return

  loading.value = true
  try {
    post.value = await postStore.getPost(postId.value)
  } catch (error) {
    console.error('Load post failed:', error)
    message.error($t('page.post_detail.load_failed'))
  } finally {
    loading.value = false
  }
}

async function loadComments() {
  if (!postId.value) return

  try {
    const res = await commentStore.listComment(
      { page: 1, pageSize: 50 },
      { postId: postId.value, status: 'COMMENT_STATUS_APPROVED' }
    )
    comments.value = res.items || []
  } catch (error) {
    console.error('Load comments failed:', error)
  }
}

async function loadRelatedPosts() {
  if (!post.value) return

  try {
    const categoryIds = post.value.categoryIds || []
    if (categoryIds.length > 0) {
      const res = await postStore.listPost(
        { page: 1, pageSize: 3 },
        {
          status: 'POST_STATUS_PUBLISHED',
          categoryIds: categoryIds
        }
      )
      relatedPosts.value = (res.items || []).filter((p: any) => p.id !== postId.value)
    }
  } catch (error) {
    console.error('Load related posts failed:', error)
  }
}

function getTitle() {
  return post.value?.translations?.[0]?.title || $t('page.post_detail.untitled')
}

function getContent() {
  return post.value?.translations?.[0]?.content || ''
}

function getThumbnail() {
  return post.value?.translations?.[0]?.thumbnail || '/placeholder.jpg'
}

function formatDate(dateString: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString()
}

async function handleSubmitComment() {
  if (!newComment.value.content || !newComment.value.authorName || !newComment.value.email) {
    message.warning($t('page.post_detail.fill_form_info'))
    return
  }

  if (!postId.value) return

  try {
    await commentStore.createComment({
      postId: postId.value,
      content: newComment.value.content,
      authorName: newComment.value.authorName,
      email: newComment.value.email,
      status: 'COMMENT_STATUS_PENDING',
    })

    message.success($t('page.post_detail.comment_submitted'))

    // 重置表单
    newComment.value = {
      content: '',
      authorName: '',
      email: '',
    }
  } catch (error) {
    console.error('Submit comment failed:', error)
    message.error($t('page.post_detail.submit_comment_failed'))
  }
}

function handleViewRelatedPost(id: number) {
  router.push(`/post/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  await loadPost()
  await Promise.all([
    loadComments(),
    loadRelatedPosts(),
  ])
})
</script>

<template>
  <div class="post-detail-page">
    <n-spin :show="loading">
      <div v-if="post" class="post-container">
        <!-- Post Header -->
        <article class="post-article">
          <header class="post-header">
            <h1>{{ getTitle() }}</h1>
            <div class="post-meta">
              <span class="author">{{ $t('page.post_detail.author') }}：{{ post.authorName }}</span>
              <span class="date">{{ $t('page.post_detail.published_at') }}：{{ formatDate(post.createdAt) }}</span>
              <span class="views">{{ $t('page.post_detail.views') }}：{{ post.visits || 0 }}</span>
              <span class="likes">{{ $t('page.post_detail.likes') }}：{{ post.likes || 0 }}</span>
            </div>
          </header>

          <!-- Post Thumbnail -->
          <div v-if="getThumbnail()" class="post-thumbnail">
            <img :src="getThumbnail()" :alt="getTitle()" />
          </div>

          <!-- Post Content -->
          <div class="post-content">
            <ContentViewer
              :content="getContent()"
              type="markdown"
            />
          </div>

          <!-- Post Footer -->
          <footer class="post-footer">
            <n-space>
              <n-button @click="router.back()">
                {{ $t('page.post_detail.back') }}
              </n-button>
            </n-space>
          </footer>
        </article>

        <!-- Comments Section -->
        <section v-if="!post.disallowComment" class="comments-section">
          <h2>{{ $t('page.post_detail.comments_count', { count: comments.length }) }}</h2>

          <!-- Comment Form -->
          <n-card class="comment-form-card">
            <n-form>
              <n-form-item :label="$t('page.post_detail.nickname')">
                <n-input v-model:value="newComment.authorName" :placeholder="$t('page.post_detail.enter_nickname')" />
              </n-form-item>
              <n-form-item :label="$t('page.post_detail.email')">
                <n-input v-model:value="newComment.email" :placeholder="$t('page.post_detail.enter_email')" type="text" />
              </n-form-item>
              <n-form-item :label="$t('page.post_detail.comment_content')">
                <n-input
                  v-model:value="newComment.content"
                  type="textarea"
                  :rows="4"
                  :placeholder="$t('page.post_detail.write_comment')"
                />
              </n-form-item>
              <n-form-item>
                <n-button type="primary" @click="handleSubmitComment">
                  {{ $t('page.post_detail.submit_comment') }}
                </n-button>
              </n-form-item>
            </n-form>
          </n-card>

          <!-- Comments List -->
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-author">
                <strong>{{ comment.authorName }}</strong>
                <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <div class="comment-content">
                <ContentViewer
                  :content="comment.content"
                  type="text"
                />
              </div>
            </div>

            <n-empty v-if="comments.length === 0" :description="$t('page.post_detail.no_comments')" />
          </div>
        </section>

        <!-- Related Posts -->
        <section v-if="relatedPosts.length > 0" class="related-section">
          <h2>{{ $t('page.post_detail.related_posts') }}</h2>
          <div class="related-grid">
            <div
              v-for="relatedPost in relatedPosts"
              :key="relatedPost.id"
              class="related-card"
              @click="handleViewRelatedPost(relatedPost.id)"
            >
              <div class="related-image">
                <img
                  :src="relatedPost.translations?.[0]?.thumbnail || '/placeholder.jpg'"
                  :alt="relatedPost.translations?.[0]?.title"
                />
              </div>
              <div class="related-content">
                <h3>{{ relatedPost.translations?.[0]?.title }}</h3>
                <p>{{ relatedPost.translations?.[0]?.summary }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <n-empty v-else :description="$t('page.post_detail.post_not_found')" />
    </n-spin>
  </div>
</template>

<style scoped lang="less">
.post-detail-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.post-article {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 2rem;
  margin-bottom: 2rem;
}

.post-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: var(--color-text-primary);
    line-height: 1.3;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }
}

.post-thumbnail {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.post-content {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--color-text-primary);
  margin-bottom: 2rem;

  :deep(h2) {
    font-size: 1.75rem;
    margin: 2rem 0 1rem;
  }

  :deep(h3) {
    font-size: 1.5rem;
    margin: 1.5rem 0 0.75rem;
  }

  :deep(p) {
    margin: 1rem 0;
  }

  :deep(img) {
    max-width: 100%;
    border-radius: var(--radius-md);
    margin: 1rem 0;
  }

  :deep(code) {
    background: var(--color-bg);
    padding: 0.2rem 0.4rem;
    border-radius: var(--radius-sm);
    font-family: 'Courier New', monospace;
  }

  :deep(pre) {
    background: var(--color-bg);
    padding: 1rem;
    border-radius: var(--radius-md);
    overflow-x: auto;
  }
}

.post-footer {
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.comments-section {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 2rem;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    color: var(--color-text-primary);
  }
}

.comment-form-card {
  margin-bottom: 2rem;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  padding: 1rem;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);

  .comment-author {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    strong {
      color: var(--color-text-primary);
    }

    .comment-date {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
    }
  }

  .comment-content {
    color: var(--color-text-primary);
    line-height: 1.6;
  }
}

.related-section {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 2rem;

  h2 {
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    color: var(--color-text-primary);
  }
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-card {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .related-image {
    width: 100%;
    height: 150px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .related-content {
    padding: 1rem;

    h3 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--color-text-primary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    p {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

@media (max-width: 768px) {
  .post-detail-page {
    padding: 1rem;
  }

  .post-article,
  .comments-section,
  .related-section {
    padding: 1rem;
  }

  .post-header h1 {
    font-size: 1.75rem;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>

