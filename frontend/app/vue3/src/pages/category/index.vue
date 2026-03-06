<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/modules/app'
import { $t } from '@/locales'
import {useLanguageChangeEffect} from '@/hooks/useLanguageChangeEffect';

definePage({
  name: 'category-list',
  meta: {
    title: 'Categories',
    level: 2,
  },
})

const router = useRouter()
const categoryStore = useCategoryStore()

const loading = ref(false)
const categories = ref<any[]>([])

async function loadCategories() {
  loading.value = true
  try {
    const res = await categoryStore.listCategory(
      undefined,
      { status: 'CATEGORY_STATUS_ACTIVE' }
    )
    categories.value = res.items || []
  } catch (error) {
    console.error('Load categories failed:', error)
  } finally {
    loading.value = false
  }
}

function getCategoryName(category: any) {
  return category.translations?.[0]?.name || $t('page.home.category_default')
}

function getCategoryDescription(category: any) {
  return category.translations?.[0]?.description || ''
}

function getCategoryThumbnail(category: any) {
  return category.translations?.[0]?.thumbnail || '/placeholder.jpg'
}

function handleViewCategory(id: number) {
  router.push({
    path: '/post',
    query: { category: id }
  })
}

onMounted(() => {
  loadCategories()
})

// 监听语言切换，自动重新加载数据
useLanguageChangeEffect(loadCategories, {
  immediate: false,    // 已经在 onMounted 中加载，不需要立即执行
  autoCleanup: true,   // 组件卸载时自动取消订阅
});
</script>

<template>
  <div class="category-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>{{ $t('page.categories.categories') }}</h1>
        <p>{{ $t('page.categories.browse_all') }}</p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="page-container">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="categories-grid">
        <div v-for="i in 8" :key="i" class="category-card">
          <n-skeleton height="280px" />
        </div>
      </div>
      <!-- Loaded Content -->
      <div v-else>
        <div v-if="categories.length > 0" class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            @click="handleViewCategory(category.id)"
          >
            <div class="category-image">
              <img :src="getCategoryThumbnail(category)" :alt="getCategoryName(category)" />
              <div class="image-overlay" />
              <div class="view-button">
                <span>{{ $t('page.home.browse_posts') }}</span>
                <span class="i-carbon:arrow-right" />
              </div>
            </div>
            <div class="category-content">
              <h3>{{ getCategoryName(category) }}</h3>
              <p>{{ getCategoryDescription(category) }}</p>
              <div class="category-meta">
                <span class="meta-icon">
                  <span class="i-carbon:document" />
                </span>
                <span class="meta-text">{{ category.postCount || 0 }} {{ $t('page.posts.articles') }}</span>
              </div>
            </div>
          </div>
        </div>

        <n-empty v-else :description="$t('page.categories.no_categories')" style="margin: 80px 0;">
          <template #icon>
            <span class="i-carbon:folder-blank" style="font-size: 64px;" />
          </template>
        </n-empty>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.category-page {
  min-height: 100vh;
  background: var(--color-bg);
}

// Hero Section
.hero-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  padding: 3rem 2rem;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  min-height: 350px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;

  // 背景装饰：渐变和网格
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(100, 200, 255, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(200, 100, 255, 0.12) 0%, transparent 50%),
      linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
    animation: gradientShift 15s ease-in-out infinite;
    z-index: 0;
  }

  // 网格背景
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: gridMove 20s linear infinite;
    opacity: 0.6;
    z-index: 1;
  }

  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    position: relative;
    z-index: 2;
    animation: fadeInUp 0.8s ease-out;

    h1 {
      font-size: 48px;
      font-weight: 800;
      margin: 0 0 16px 0;
      color: #ffffff;
      letter-spacing: -1px;
      line-height: 1.1;

      // 添加发光效果
      background: linear-gradient(
        135deg,
        #ffffff 0%,
        #f0f0ff 25%,
        #e0e0ff 50%,
        #f0f0ff 75%,
        #ffffff 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;

      text-shadow:
        0 0 40px rgba(255, 255, 255, 0.9),
        0 0 80px rgba(var(--color-primary-purple-rgb), 0.7),
        0 0 120px rgba(99, 102, 241, 0.5),
        0 6px 24px rgba(0, 0, 0, 0.5),
        0 3px 12px rgba(0, 0, 0, 0.4);

      filter:
        drop-shadow(0 0 30px rgba(var(--color-primary-purple-rgb), 0.6))
        drop-shadow(0 0 60px rgba(99, 102, 241, 0.4))
        drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));

      animation-name: slideDown, glowPulseTitle, gradientShine;
      animation-duration: 0.8s, 3s, 6s;
      animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1), ease-in-out, linear;
      animation-iteration-count: 1, infinite, infinite;
      animation-delay: 0s, 0.5s, 0s;
    }

    p {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.95);
      margin: 0;
      font-weight: 500;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }
  }
}

// Page Container
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px 80px;
}

// Categories Grid
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
}

.category-card {
  background: var(--color-surface);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--color-border);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: var(--color-brand);

    .category-image {
      .image-overlay {
        opacity: 0.6;
      }

      .view-button {
        opacity: 1;
        transform: translateY(0);
      }

      img {
        transform: scale(1.1);
      }
    }

    h3 {
      color: var(--color-brand);
    }
  }

  .category-image {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: var(--color-bg);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
      transition: opacity 0.3s;
      opacity: 0;
    }

    .view-button {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
      color: white;
      padding: 24px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 15px;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      span[class^="i-"] {
        font-size: 18px;
      }
    }
  }

  .category-content {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;

    h3 {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 12px 0;
      color: var(--color-text-primary);
      line-height: 1.4;
      transition: color 0.3s;
      letter-spacing: 0.5px;
    }

    p {
      color: var(--color-text-secondary);
      font-size: 15px;
      line-height: 1.7;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }

    .category-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border);
      font-size: 14px;
      color: var(--color-text-secondary);
      font-weight: 500;

      .meta-icon {
        display: flex;
        align-items: center;
        font-size: 18px;
        opacity: 0.8;
      }

      .meta-text {
        display: flex;
        align-items: center;
      }
    }
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .hero-section {
    padding: 3rem 1.5rem 2.5rem;
    min-height: 300px;
    margin-bottom: 36px;

    .hero-content {
      h1 {
        font-size: 40px;
        letter-spacing: -0.8px;
        margin-bottom: 14px;
      }

      p {
        font-size: 18px;
      }
    }
  }

  .page-container {
    padding: 0 24px 60px;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .category-card {
    &:hover {
      transform: translateY(-10px);
    }

    .category-image {
      height: 220px;
    }
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2.5rem 1.5rem 2rem;
    min-height: 280px;
    margin-bottom: 32px;

    &::after {
      background-size: 30px 30px;
    }

    .hero-content {
      h1 {
        font-size: 34px;
        margin-bottom: 12px;
        letter-spacing: -0.6px;
        line-height: 1.2;
      }

      p {
        font-size: 17px;
        line-height: 1.5;
      }
    }
  }

  .page-container {
    padding: 0 20px 50px;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
  }

  .category-card {
    &:hover {
      transform: translateY(-8px);
    }

    .category-image {
      height: 200px;

      .view-button {
        padding: 20px 16px;
        font-size: 14px;

        span[class^="i-"] {
          font-size: 16px;
        }
      }
    }

    .category-content {
      padding: 20px;

      h3 {
        font-size: 18px;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 14px;
      }

      .category-meta {
        padding-top: 14px;
      }
    }
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 2rem 1rem;
    min-height: 240px;
    margin-bottom: 28px;

    &::after {
      background-size: 25px 25px;
    }

    .hero-content {
      h1 {
        font-size: 28px;
        margin-bottom: 10px;
        letter-spacing: -0.4px;
      }

      p {
        font-size: 16px;
      }
    }
  }

  .page-container {
    padding: 0 16px 40px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .category-card {
    border-radius: 14px;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
    }

    .category-image {
      height: 200px;

      img {
        &:hover {
          transform: scale(1.08);
        }
      }

      .view-button {
        padding: 18px 14px;
        font-size: 14px;

        span[class^="i-"] {
          font-size: 16px;
        }
      }
    }

    .category-content {
      padding: 18px;

      h3 {
        font-size: 17px;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 12px;
        -webkit-line-clamp: 2;
      }

      .category-meta {
        padding-top: 12px;
        font-size: 13px;

        .meta-icon {
          font-size: 17px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1.75rem 1rem 1.5rem;
    min-height: 220px;
    margin-bottom: 24px;

    &::before {
      animation: gradientShift 20s ease-in-out infinite;
    }

    &::after {
      background-size: 20px 20px;
      animation: gridMove 30s linear infinite;
    }

    .hero-content {
      padding: 0;

      h1 {
        font-size: 24px;
        margin-bottom: 8px;
        letter-spacing: -0.3px;
        line-height: 1.3;

        // 移动端简化发光效果
        text-shadow:
          0 0 30px rgba(255, 255, 255, 0.8),
          0 0 60px rgba(var(--color-primary-purple-rgb), 0.6),
          0 4px 16px rgba(0, 0, 0, 0.4);

        filter:
          drop-shadow(0 0 20px rgba(var(--color-primary-purple-rgb), 0.5))
          drop-shadow(0 3px 10px rgba(0, 0, 0, 0.3));
      }

      p {
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }

  .page-container {
    padding: 0 12px 32px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .category-card {
    border-radius: 12px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .category-image {
      height: 180px;

      img {
        &:hover {
          transform: scale(1.05);
        }
      }

      .view-button {
        padding: 16px 12px;
        font-size: 13px;

        span[class^="i-"] {
          font-size: 15px;
        }
      }
    }

    .category-content {
      padding: 16px;

      h3 {
        font-size: 16px;
        margin-bottom: 8px;
        line-height: 1.4;
      }

      p {
        font-size: 13px;
        line-height: 1.6;
        margin-bottom: 10px;
        -webkit-line-clamp: 2;
      }

      .category-meta {
        padding-top: 10px;
        font-size: 12px;
        gap: 6px;

        .meta-icon {
          font-size: 16px;
        }
      }
    }
  }

  // Empty state 优化
  :deep(.n-empty) {
    margin: 50px 0 !important;

    .n-empty__icon {
      span[class^="i-"] {
        font-size: 48px !important;
      }
    }

    .n-empty__description {
      font-size: 13px;
    }
  }

  // Spin 加载优化
  :deep(.n-spin-container) {
    min-height: 300px;
  }
}

// 动画关键帧定义
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientShift {
  0%, 100% {
    background:
      radial-gradient(ellipse at 20% 50%, rgba(100, 200, 255, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, rgba(200, 100, 255, 0.12) 0%, transparent 50%),
      linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  }
  50% {
    background:
      radial-gradient(ellipse at 80% 50%, rgba(100, 200, 255, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 20% 80%, rgba(200, 100, 255, 0.12) 0%, transparent 50%),
      linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #6366f1 100%);
  }
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

@keyframes glowPulseTitle {
  0%, 100% {
    filter:
      drop-shadow(0 0 25px rgba(var(--color-primary-purple-rgb), 0.5))
      drop-shadow(0 0 50px rgba(99, 102, 241, 0.3))
      drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
  }
  50% {
    filter:
      drop-shadow(0 0 40px rgba(var(--color-primary-purple-rgb), 0.8))
      drop-shadow(0 0 80px rgba(99, 102, 241, 0.6))
      drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4));
  }
}

@keyframes gradientShine {
  0% {
    background-position: 0 center;
  }
  100% {
    background-position: 200% center;
  }
}

// Dark Mode Enhancements
html.dark {
  .hero-section {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
    box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3);

    &::before {
      opacity: 1;
    }

    .hero-content {
      h1 {
        background: linear-gradient(
          135deg,
          #ffffff 0%,
          #f5f5ff 25%,
          #ebebff 50%,
          #f5f5ff 75%,
          #ffffff 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        text-shadow:
          0 0 50px rgba(255, 255, 255, 1),
          0 0 100px rgba(var(--color-primary-purple-rgb), 0.8),
          0 0 150px rgba(99, 102, 241, 0.6),
          0 8px 30px rgba(0, 0, 0, 0.6),
          0 4px 15px rgba(0, 0, 0, 0.4);

        filter:
          drop-shadow(0 0 35px rgba(var(--color-primary-purple-rgb), 0.7))
          drop-shadow(0 0 70px rgba(99, 102, 241, 0.5))
          drop-shadow(0 6px 20px rgba(0, 0, 0, 0.4));
      }
    }
  }
}
</style>

