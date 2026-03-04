<script setup lang="ts">
import {ref, computed} from "vue";
import {$t} from '@/locales';

import EmailRegisterEnterCodePage from "@/pages/register/components/EmailRegisterEnterCodePage.vue";

const email = ref<string>('');
const visibleEnter = ref<boolean>(false);

// 简单的邮箱格式验证
const isValidEmail = computed(() => {
  if (!email.value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

function handleButtonNext() {
  if (!isValidEmail.value) {
    // TODO: 显示错误提示
    return;
  }
  visibleEnter.value = true;
}
</script>

<template>
  <div v-show="!visibleEnter" class="register-form">
    <!-- Email Input Group -->
    <div class="form-group">
      <label>{{ $t('authentication.register.email') }}</label>
      <n-input
        v-model:value="email"
        :placeholder="$t('authentication.register.input_email')"
        clearable
        type="text"
        :status="email && !isValidEmail ? 'error' : undefined"
      />
      <span v-if="email && !isValidEmail" class="error-hint">
        {{ $t('authentication.register.invalid_email') }}
      </span>
    </div>

    <!-- Next Button -->
    <n-button
      type="primary"
      block
      size="large"
      class="register-button"
      :disabled="!isValidEmail"
      @click="handleButtonNext"
    >
      {{ $t('authentication.register.next_step') }}
    </n-button>
  </div>

  <EmailRegisterEnterCodePage v-show="visibleEnter" :email="email" />
</template>

<style scoped lang="less">
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  label {
    display: block;
    font-weight: 500;
    font-size: 0.95rem;
    color: var(--color-text-primary);
  }

  .error-hint {
    font-size: 0.85rem;
    color: #d03050;
    margin-top: -0.5rem;
  }
}

.register-button {
  font-weight: 600;
  height: 44px;
  margin-top: 0.5rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
