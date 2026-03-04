<script setup lang="ts">
import {ref} from "vue";
import {definePage} from "unplugin-vue-router/runtime";
import {useRouter} from 'vue-router'
import {$t} from '@/locales';

import AccountRegisterPage from "./components/AccountRegisterPage.vue";
import EmailRegisterPage from "./components/EmailRegisterPage.vue";
import PhoneRegisterPage from "./components/PhoneRegisterPage.vue";
import OtherRegisterPage from "./components/OtherRegisterPage.vue";

definePage({
  name: 'register',
  meta: {
    level: 1,
    hideLayout: true, // 隐藏全局 Header 和 Footer
    forceLight: true, // 强制使用亮色主题
  },
})

const router = useRouter()
const activeTab = ref('account');

const handleLoginClick = () => {
  router.push('/login')
}

const handleBackHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="register-page">
    <!-- Left Side - Brand -->
    <div class="register-left">
      <div class="brand">
        <img src="/logo.png" :alt="$t('authentication.login.logo_alt')" class="brand-logo" />
        <h1 class="brand-title">{{ $t('authentication.login.brand_title') }}</h1>
        <p class="brand-subtitle">{{ $t('authentication.login.brand_subtitle') }}</p>
      </div>

      <div class="benefits-list">
        <div class="benefit-item">
          <span>✓</span>
          <span>{{ $t('authentication.login.feature_projects') }}</span>
        </div>
        <div class="benefit-item">
          <span>✓</span>
          <span>{{ $t('authentication.login.feature_isolation') }}</span>
        </div>
        <div class="benefit-item">
          <span>✓</span>
          <span>{{ $t('authentication.login.feature_permissions') }}</span>
        </div>
        <div class="benefit-item">
          <span>✓</span>
          <span>{{ $t('authentication.login.feature_analytics') }}</span>
        </div>
      </div>
    </div>

    <!-- Right Side - Register Form -->
    <div class="register-right">
      <n-card :bordered="false" class="register-card">
        <template #header>
          <div class="card-header">
            <h2>{{ $t('authentication.register.title') }}</h2>
            <p>{{ $t('authentication.register.register_with') }}</p>
          </div>
        </template>

        <n-tabs v-model:value="activeTab" type="segment" animated class="register-tabs">
          <n-tab-pane name="account" :tab="$t('authentication.login.tab_account')">
            <AccountRegisterPage/>
          </n-tab-pane>

          <n-tab-pane name="email" :tab="$t('authentication.login.tab_email')">
            <EmailRegisterPage/>
          </n-tab-pane>

          <n-tab-pane name="phone" :tab="$t('authentication.login.tab_phone')">
            <PhoneRegisterPage/>
          </n-tab-pane>

          <n-tab-pane name="other" :tab="$t('authentication.login.tab_other')">
            <OtherRegisterPage/>
          </n-tab-pane>
        </n-tabs>

        <!-- Login Link -->
        <div class="login-section">
          <p>{{ $t('authentication.register.already_have_account') }}
            <n-button text type="primary" @click="handleLoginClick">
              {{ $t('authentication.register.login_now') }}
            </n-button>
          </p>
        </div>

        <div class="back-home">
          <n-button text type="primary" @click="handleBackHome">
            ← {{ $t('authentication.login.back_home') }}
          </n-button>
        </div>

        <!-- Terms -->
        <div class="terms">
          <small>
            {{ $t('authentication.login.terms_prefix') }}
            <n-button text type="primary">{{ $t('authentication.login.terms_of_service') }}</n-button>
            {{ $t('authentication.login.terms_and') }}
            <n-button text type="primary">{{ $t('authentication.login.privacy_policy') }}</n-button>
          </small>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.register-page {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);

  .register-left {
    flex: 1;
    background: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-accent) 100%);
    color: #fff;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .brand {
      text-align: center;
      margin-bottom: 3rem;

      .brand-logo {
        width: 80px;
        height: 80px;
        margin-bottom: 1rem;
      }

      .brand-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .brand-subtitle {
        font-size: 1.1rem;
        opacity: 0.92;
      }
    }

    .benefits-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .benefit-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0;
        font-size: 1.05rem;
      }
    }
  }

  .register-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;

    .register-card {
      width: 100%;
      max-width: 420px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);

      .card-header {
        text-align: center;
        margin-bottom: 1.5rem;

        h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          color: var(--color-text-primary);
        }

        p {
          color: var(--color-text-secondary);
          font-size: 0.95rem;
        }
      }
    }
  }
}

.register-tabs {
  margin-bottom: 1.5rem;
}

.login-section {
  text-align: center;
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);

  p {
    margin: 0;
    font-size: 0.95rem;
    color: var(--color-text-secondary);
  }
}

.back-home {
  text-align: center;
  padding: 1rem 0;

  :deep(.n-button) {
    font-size: 0.9rem;
  }
}

.terms {
  text-align: center;
  margin-top: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;

  small {
    font-size: 0.85rem;
  }
}

@media (max-width: 1024px) {
  .register-page {
    flex-direction: column;

    .register-left {
      padding: 2rem;
      min-height: 200px;
      justify-content: flex-start;
    }

    .register-right {
      flex: 1;
      background: var(--color-surface);

      .register-card {
        max-width: 100%;
      }
    }
  }
}
</style>
