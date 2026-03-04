<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/modules/app'
import { $t } from '@/locales'

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
  router.push(`/post?category=${id}`)
}

onMounted(() => {
  loadCategories()
})
</script>

<template>
  <div class="category-page">
    <div class="page-header">
      <h1>{{ $t('page.categories.categories') }}</h1>
      <p>{{ $t('page.categories.browse_all') }}</p>
    </div>

    <n-spin :show="loading">
      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          @click="handleViewCategory(category.id)"
        >
          <div class="category-image">
            <img :src="getCategoryThumbnail(category)" :alt="getCategoryName(category)" />
          </div>
          <div class="category-content">
            <h3>{{ getCategoryName(category) }}</h3>
            <p>{{ getCategoryDescription(category) }}</p>
            <div class="category-meta">
              <span>{{ category.postCount || 0 }} {{ $t('page.posts.articles') }}</span>
            </div>
          </div>
        </div>
      </div>

      <n-empty v-if="!loading && categories.length === 0" :description="$t('page.categories.no_categories')" />
    </n-spin>
  </div>
</template>

<style scoped lang="less">
.category-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--color-text-primary);
  }

  p {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    margin: 0;
  }
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.category-card {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--color-border);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .category-image {
    width: 100%;
    height: 200px;
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

  .category-content {
    padding: 1.5rem;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: var(--color-text-primary);
    }

    p {
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .category-meta {
      font-size: 0.85rem;
      color: var(--color-text-secondary);
    }
  }
}

@media (max-width: 768px) {
  .category-page {
    padding: 1rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>

