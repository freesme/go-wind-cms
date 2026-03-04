<script setup lang="ts">
import {ref, computed} from 'vue';
import {
  AlbumsOutline,
  CardOutline,
  HomeOutline,
  LayersOutline,
  LogOutOutline,
  PersonCircleOutline,
  ShieldCheckmarkOutline,
} from '@vicons/ionicons5';
import {CrownOutlined} from '@vicons/antd';
import {UserCircle} from '@vicons/fa';

import {
  languageColumns,
  languageShorts,
  i18n,
  $t,
  loadLocaleMessages,
  type SupportedLanguagesType
} from '@/locales';

import {navigateTo} from '@/router';
import {renderIcon} from '@/utils';
import {updatePreferences} from "@/preferences";

import logoImage from '@/assets/images/logo.png';

const isLogin = ref(false);

const userOptions = computed(() => {
  return [
    {
      label: $t('menu.my_profile'),
      key: 'profile',
      icon: renderIcon(PersonCircleOutline),
    },
    {
      label: $t('menu.my_business'),
      key: 'business',
      icon: renderIcon(LayersOutline),
    },
    {
      label: $t('menu.my_cards'),
      key: 'cards',
      icon: renderIcon(CardOutline),
    },
    {
      label: $t('menu.my_events'),
      key: 'events',
      icon: renderIcon(AlbumsOutline),
    },
    {
      label: $t('menu.my_account_security'),
      key: 'accountSecurity',
      icon: renderIcon(ShieldCheckmarkOutline),
    },
    {
      label: $t('menu.homepage'),
      key: 'homepage',
      icon: renderIcon(HomeOutline),
    },
    {
      type: 'divider',
      key: 'd1',
    },
    {
      label: $t('menu.logout'),
      key: 'logout',
      icon: renderIcon(LogOutOutline),
    },
  ]
});

function getLanguageLabel() {
  const lang = i18n.global.locale.value;
  const ret = languageShorts.find((item) => item.key === lang);
  return ret?.label ?? lang;
}

async function handleSelectLanguage(key: string | number) {
  console.log('handleSelectLanguage:', key)

  const locale = key as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });

  await loadLocaleMessages(locale);
}

function handleSelectUserItem(key: string | number) {
  console.log('handleSelectUserItem:', key)
}

function handleClickButtonVip() {
  console.log('handleClickButtonVip:')
}
</script>

<template>
  <div class="top-bar">
    <n-image :src="logoImage" class="logo" alt="Logo" preview-disabled/>
    <SearchBar />
    <div class="actions">
      <n-space>
        <n-popover trigger="hover">
          <template #trigger>
            <n-button
              v-show="isLogin"
              class="vip-btn"
              @click="handleClickButtonVip"
            >
              <template #icon>
                <CrownOutlined/>
              </template>
              VIP
            </n-button>
          </template>
        </n-popover>
        <n-dropdown
          trigger="hover" size="huge"
          :options="userOptions" @select="handleSelectUserItem"
        >
          <n-button v-show="isLogin" text class="icon-btn" @click="navigateTo('/user')">
            <n-icon>
              <UserCircle/>
            </n-icon>
          </n-button>
        </n-dropdown>
        <n-divider :vertical="true"/>
        <n-button v-show="isLogin" text class="icon-btn" @click="navigateTo('/notifications')">
          1
        </n-button>
        <n-button v-show="!isLogin" type="info" class="header-login-btn" @click="navigateTo('/login')">
          {{ $t('navbar.top.login') }}
        </n-button>
        <n-button v-show="!isLogin" type="primary" class="header-register-btn" @click="navigateTo('/register')">
          {{ $t('navbar.top.register') }}
        </n-button>
        <n-dropdown trigger="hover" size="huge" :options="languageColumns"
                    @select="handleSelectLanguage">
          <n-button round class="lang-btn">
            {{ getLanguageLabel() }}
          </n-button>
        </n-dropdown>
      </n-space>
    </div>
  </div>
</template>

<style scoped lang="less">
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 0;
  color: var(--color-text-primary);
}

.logo {
  height: 40px;
}

.actions {
  display: flex;
  align-items: center;

  // 所有按钮默认深色文字
  :deep(.n-button) {
    color: var(--color-text-primary);
  }

  // 普通按钮（非 primary/info）
  :deep(.n-button:not(.n-button--primary):not(.n-button--info):not(.vip-btn)) {
    color: var(--color-text-primary) !important;
    border-color: var(--color-border);
    background: #ffffff;
  }

  :deep(.n-button:not(.n-button--primary):not(.n-button--info):not(.vip-btn):hover) {
    border-color: var(--color-brand);
    color: var(--color-brand) !important;
  }

  // 文字按钮
  :deep(.n-button.n-button--text-type) {
    color: var(--color-text-secondary) !important;
  }

  :deep(.n-button.n-button--text-type:hover) {
    color: var(--color-text-primary) !important;
  }

  // Dropdown 下拉菜单
  :deep(.n-dropdown) {
    background: #ffffff;
    color: var(--color-text-primary);
  }

  // 分割线
  :deep(.n-divider) {
    background-color: var(--color-border);
  }
}

.vip-btn {
  background: linear-gradient(90deg, #ffd700, #ffa500) !important;
  color: #111 !important;
  border: none !important;
}

.vip-btn:hover {
  opacity: 0.9;
}

.icon-btn {
  font-size: 28px;
  color: var(--color-text-secondary) !important;
}

.icon-btn:hover {
  color: var(--color-text-primary) !important;
  background: rgba(102, 126, 234, 0.1) !important;
}

.lang-btn {
  background: #ffffff !important;
  color: var(--color-text-primary) !important;
  border: 1px solid var(--color-border) !important;
}

.lang-btn:hover {
  border-color: var(--color-brand) !important;
  color: var(--color-brand) !important;
}

.header-login-btn,
.header-register-btn {
  border: 1px solid transparent;
}

.header-login-btn {
  background: #e9f4ff !important;
  color: #0f5c8c !important;
  border-color: #b7dcf7 !important;
}

.header-register-btn {
  background: #dff8f0 !important;
  color: #0f6b4e !important;
  border-color: #b7efde !important;
}

:deep(.lang-btn .n-button__content),
:deep(.header-login-btn .n-button__content),
:deep(.header-register-btn .n-button__content) {
  color: inherit !important;
}

// 确保图标颜色正确
:deep(.n-icon) {
  color: currentColor;
}
</style>
