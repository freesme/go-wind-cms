<script setup lang="ts">
import {ref} from 'vue';
import {$t} from '@/locales';

const phone = ref('');
const verificationCode = ref('');
const codeSent = ref(false);
const codeCountdown = ref(0);

function handleSendCode() {
  if (!phone.value) {
    // TODO: 显示错误提示
    return;
  }

  codeSent.value = true;
  codeCountdown.value = 60;

  // TODO: 实现发送验证码逻辑

  // 倒计时
  const timer = setInterval(() => {
    codeCountdown.value--;
    if (codeCountdown.value <= 0) {
      clearInterval(timer);
      codeSent.value = false;
    }
  }, 1000);
}

function handleLogin() {
  if (!phone.value || !verificationCode.value) {
    // TODO: 显示错误提示
    return;
  }

  // TODO: 实现登录逻辑
  console.log('登录信息：', {
    phone: phone.value,
    code: verificationCode.value,
  });
}
</script>

<template>
  <div class="login-form">
    <div class="form-group">
      <label>{{ $t('authentication.register.phone') }}</label>
      <n-input
        v-model:value="phone"
        :placeholder="$t('authentication.login.placeholder_phone')"
        clearable
        type="text"
      />
    </div>
    <div class="form-group">
      <label>{{ $t('authentication.register.code') }}</label>
      <div class="code-input-row">
        <n-input
          v-model:value="verificationCode"
          :placeholder="$t('authentication.login.placeholder_code')"
          maxlength="6"
          type="text"
          @keyup.enter="handleLogin"
        />
        <n-button
          :disabled="codeSent"
          :type="codeSent ? 'default' : 'primary'"
          class="send-code-btn"
          @click="handleSendCode"
        >
          {{ codeSent ? `${codeCountdown}s` : $t('authentication.register.send_code') }}
        </n-button>
      </div>
    </div>
    <n-button type="primary" block size="large" class="login-button" @click="handleLogin">
      {{ $t('authentication.login.login') }}
    </n-button>
  </div>
</template>

<style scoped lang="less">
.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    color: var(--color-text-primary);
  }
}

.code-input-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;

  :deep(.n-input) {
    flex: 1;
  }

  .send-code-btn {
    flex-shrink: 0;
    width: 120px;
    height: 40px;
    font-size: 0.9rem;
    white-space: nowrap;
  }
}

.login-button {
  font-weight: 600;
  height: 44px;
  margin-bottom: 1.5rem;
}
</style>

