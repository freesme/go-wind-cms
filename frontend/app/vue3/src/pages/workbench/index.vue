<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTenantStore } from '@/stores/modules/app'
import { $t } from '@/locales'

definePage({
  name: 'workbench',
  meta: {
    level: 1,
    hideLayout: true, // 隐藏全局 Header 和 Footer
  },
})

const router = useRouter()
const tenantStore = useTenantStore()

const collapsed = ref(false)
const activeMenu = ref('dashboard')

// Load tenants on mount
onMounted(() => {
  tenantStore.fetchTenants()
})

// Computed tenant options for select
const tenantOptions = computed(() =>
  tenantStore.tenants.map(t => ({
    label: t.name,
    value: t.id,
  }))
)

const currentTenantId = computed({
  get: () => tenantStore.currentTenantId || '',
  set: (value: string) => {
    tenantStore.switchTenant(value)
  },
})

// Mock data
const stats = ref([
  { labelKey: 'page.workbench.total_projects', value: '12', icon: 'carbon:project', trendKey: 'page.workbench.trend_projects' },
  { labelKey: 'page.workbench.content_items', value: '2,543', icon: 'carbon:document', trendKey: 'page.workbench.trend_content' },
  { labelKey: 'page.workbench.active_users', value: '145', icon: 'carbon:user', trendKey: 'page.workbench.trend_users' },
  { labelKey: 'page.workbench.page_views', value: '84.5K', icon: 'carbon:chart-line', trendKey: 'page.workbench.trend_views' },
])

const recentActivities = ref([
  { id: 1, actionKey: 'page.workbench.activity_created_post', timestamp: '2 hours ago', user: 'John Doe' },
  { id: 2, actionKey: 'page.workbench.activity_updated_settings', timestamp: '5 hours ago', user: 'Jane Smith' },
  { id: 3, actionKey: 'page.workbench.activity_published_pages', timestamp: '1 day ago', user: 'Bob Johnson' },
  { id: 4, actionKey: 'page.workbench.activity_added_member', timestamp: '2 days ago', user: 'Admin' },
])

const menuItems = ref([
  { labelKey: 'page.workbench.menu_dashboard', key: 'dashboard', icon: 'carbon:dashboard' },
  { labelKey: 'page.workbench.menu_content', key: 'content', icon: 'carbon:document-add' },
  { labelKey: 'page.workbench.menu_pages', key: 'pages', icon: 'carbon:page' },
  { labelKey: 'page.workbench.menu_categories', key: 'categories', icon: 'carbon:category' },
  { labelKey: 'page.workbench.menu_tags', key: 'tags', icon: 'carbon:tag' },
  { labelKey: 'page.workbench.menu_analytics', key: 'analytics', icon: 'carbon:chart-area' },
  { labelKey: 'page.workbench.menu_settings', key: 'settings', icon: 'carbon:settings' },
])

const handleMenuClick = (key: string) => {
  activeMenu.value = key
}

const handleLogout = () => {
  localStorage.removeItem('access_token')
  router.push('/login')
}
</script>

<template>
  <div class="workbench">
    <!-- Header -->
    <header class="workbench-header">
      <div class="header-left">
        <button class="toggle-sidebar" @click="collapsed = !collapsed">
          {{ collapsed ? '☰' : '✕' }}
        </button>
        <div class="logo-mini" v-if="collapsed">GoWind</div>
      </div>

      <div class="header-center">
        <n-input
          type="text"
          :placeholder="$t('page.workbench.search_placeholder')"
          clearable
          style="width: 300px"
        >
          <template #prefix>
            🔍
          </template>
        </n-input>
      </div>

      <div class="header-right">
        <n-button circle quaternary>
          🔔
        </n-button>
        <n-button circle quaternary>
          🌙
        </n-button>
        <n-dropdown
          :options="[
            { label: $t('page.workbench.menu_profile'), key: 'profile' },
            { label: $t('page.workbench.menu_settings_profile'), key: 'settings' },
            { type: 'divider', key: 'd1' },
            { label: $t('page.workbench.menu_logout'), key: 'logout' },
          ]"
          @select="(key) => key === 'logout' && handleLogout()"
        >
          <n-avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=workbench" />
        </n-dropdown>
      </div>
    </header>

    <div class="workbench-body">
      <!-- Sidebar -->
      <aside class="sidebar" :class="{ collapsed }">
        <div class="sidebar-header">
          <img src="/logo.png" alt="Logo" class="logo" v-if="!collapsed" />
          <h3 v-if="!collapsed" class="sidebar-title">GoWind CMS</h3>
        </div>

        <div class="tenant-selector" v-if="!collapsed">
          <n-select
            v-model:value="currentTenantId"
            :options="tenantOptions"
            :loading="tenantStore.isLoading"
            :placeholder="$t('page.workbench.select_tenant')"
          />
        </div>

        <nav class="sidebar-menu">
          <div
            v-for="item in menuItems"
            :key="item.key"
            class="menu-item"
            :class="{ active: activeMenu === item.key }"
            @click="handleMenuClick(item.key)"
          >
            <div :class="`i-${item.icon}`" class="menu-icon" />
            <span v-if="!collapsed" class="menu-label">{{ $t(item.labelKey) }}</span>
          </div>
        </nav>

        <div class="sidebar-footer" v-if="!collapsed">
          <n-button type="primary" block>
            ➕ {{ $t('page.workbench.new_project') }}
          </n-button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <n-breadcrumb>
            <n-breadcrumb-item>{{ $t('page.workbench.breadcrumb_home') }}</n-breadcrumb-item>
            <n-breadcrumb-item>{{ $t('page.workbench.menu_dashboard') }}</n-breadcrumb-item>
          </n-breadcrumb>
        </div>

        <!-- Page Title -->
        <div class="page-header">
          <div>
            <h1>{{ $t('page.workbench.menu_dashboard') }}</h1>
            <p>{{ $t('page.workbench.dashboard_subtitle') }}</p>
          </div>
          <div class="page-actions">
            <n-button>
              ⬇️ {{ $t('page.workbench.export_btn') }}
            </n-button>
            <n-button type="primary">
              ➕ {{ $t('page.workbench.new_content_btn') }}
            </n-button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.labelKey" class="stat-card">
            <div class="stat-header">
              <span class="stat-label">{{ $t(stat.labelKey) }}</span>
              <div :class="`i-${stat.icon}`" class="stat-icon" />
            </div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-trend">{{ $t(stat.trendKey) }}</div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-row">
          <div class="chart-card">
            <h3>{{ $t('page.workbench.content_performance') }}</h3>
            <div class="chart-placeholder">
              📊
              <p>{{ $t('page.workbench.performance_data') }}</p>
            </div>
          </div>
          <div class="chart-card">
            <h3>{{ $t('page.workbench.user_activity') }}</h3>
            <div class="chart-placeholder">
              📈
              <p>{{ $t('page.workbench.activity_metrics') }}</p>
            </div>
          </div>
        </div>

        <!-- Recent Activities -->
        <div class="recent-activities">
          <div class="section-header">
            <h3>{{ $t('page.workbench.recent_activities') }}</h3>
            <n-button text>{{ $t('page.workbench.view_all') }}</n-button>
          </div>
          <n-list :items="recentActivities">
            <template #default="{ item }">
              <n-list-item>
                <template #header>{{ $t(item.actionKey) }}</template>
                <template #description>
                  <div class="activity-meta">
                    <span>{{ item.user }}</span>
                    <span class="divider">•</span>
                    <span>{{ item.timestamp }}</span>
                  </div>
                </template>
              </n-list-item>
            </template>
          </n-list>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped lang="less">
.workbench {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

// Header
.workbench-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  gap: 2rem;
  position: sticky;
  top: 0;
  z-index: 50;

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 200px;

    .toggle-sidebar {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.5rem;
      padding: 0.5rem;
      color: #333;

      &:hover {
        color: #667eea;
      }
    }

    .logo-mini {
      font-weight: 700;
      color: #667eea;
      white-space: nowrap;
    }
  }

  .header-center {
    flex: 1;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

// Workbench Body
.workbench-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

// Sidebar
.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: all 0.3s ease;

  &.collapsed {
    width: 80px;
  }

  .sidebar-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid #f0f0f0;

    .logo {
      width: 40px;
      height: 40px;
    }

    .sidebar-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .tenant-selector {
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .sidebar-menu {
    flex: 1;
    padding: 1rem 0.5rem;

    .menu-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      color: #666;

      &:hover {
        background: #f5f5f5;
        color: #667eea;
      }

      &.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        color: #667eea;
        font-weight: 600;
      }

      .menu-icon {
        font-size: 1.25rem;
        min-width: 1.25rem;
      }

      .menu-label {
        white-space: nowrap;
      }
    }
  }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid #f0f0f0;
  }
}

// Main Content
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;

  .breadcrumb {
    margin-bottom: 1.5rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;

    h1 {
      font-size: 1.75rem;
      margin: 0 0 0.5rem 0;
    }

    p {
      color: #999;
      margin: 0;
      font-size: 0.95rem;
    }

    .page-actions {
      display: flex;
      gap: 1rem;
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #f0f0f0;

      .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .stat-label {
          color: #999;
          font-size: 0.9rem;
        }

        .stat-icon {
          font-size: 1.5rem;
          color: #667eea;
        }
      }

      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .stat-trend {
        color: #667eea;
        font-size: 0.85rem;
      }
    }
  }

  .charts-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;

    .chart-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #f0f0f0;

      h3 {
        margin: 0 0 1rem 0;
        font-size: 1.1rem;
      }

      .chart-placeholder {
        min-height: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #ccc;
      }
    }
  }

  .recent-activities {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid #f0f0f0;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        margin: 0;
        font-size: 1.1rem;
      }
    }

    .activity-meta {
      display: flex;
      gap: 0.5rem;
      color: #999;
      font-size: 0.85rem;

      .divider {
        opacity: 0.5;
      }
    }
  }
}

// Responsive
@media (max-width: 1024px) {
  .sidebar {
    &.collapsed {
      transform: translateX(-100%);
      position: absolute;
      height: 100%;
      z-index: 40;
    }
  }
}

@media (max-width: 768px) {
  .workbench-header {
    padding: 0 1rem;
    gap: 1rem;

    .header-center {
      display: none;
    }
  }

  .sidebar {
    width: 240px;
    position: absolute;
    height: 100%;
    z-index: 40;

    &.collapsed {
      transform: translateX(-100%);
    }
  }

  .main-content {
    padding: 1rem;

    .page-header {
      flex-direction: column;
      gap: 1rem;

      .page-actions {
        width: 100%;
      }
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .charts-row {
      grid-template-columns: 1fr;

      .chart-card {
        min-height: 300px;
      }
    }
  }
}
</style>
