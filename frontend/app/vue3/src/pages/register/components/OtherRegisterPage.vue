<script setup lang="ts">
import {
  LogoGoogle,
  LogoGithub
} from '@vicons/ionicons5'
import {$t} from '@/locales';

function handleButtonGoogleRegister() {
  // TODO: 实现 Google 登录逻辑
}

function handleButtonGithubRegister() {
  // TODO: 实现 GitHub 登录逻辑
}
</script>

<template>
  <div class="other-register">

    <!-- Social Buttons -->
    <n-button
      block
      size="large"
      class="social-button"
      @click="handleButtonGoogleRegister"
    >
      <template #icon>
        <n-icon :component="LogoGoogle"/>
      </template>
      {{ $t('authentication.login.social_google') }}
    </n-button>

    <n-button
      block
      size="large"
      class="social-button"
      @click="handleButtonGithubRegister"
    >
      <template #icon>
        <n-icon :component="LogoGithub"/>
      </template>
      {{ $t('authentication.login.social_github') }}
    </n-button>
  </div>
</template>

<style scoped lang="less">
.other-register {
  display: flex;
  flex-direction: column;
 gap: 1rem;
}

.social-button {
  font-weight: 500;
  height: 44px;
  background: #ffffff;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;

  :deep(.n-icon) {
    font-size: 18px;
  }

  &:hover {
    border-color: var(--color-brand);
    color: var(--color-brand);
    background: rgba(102, 126, 234, 0.05);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.12);
  }

  &:active {
    transform: scale(0.98);
  }
}
</style>
