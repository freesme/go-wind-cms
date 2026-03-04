<script setup lang="ts">
import {ref} from "vue";
import {$t} from '@/locales';

const phone = ref('');
const verificationCode = ref('');
const codeSent = ref(false);
const codeCountdown = ref(0);

/**
 * 发送验证码
 */
function handleButtonSendVerifyCode() {
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

/**
 * 登录或者注册
 */
function handleButtonRegisterOrLogin() {
  if (!phone.value || !verificationCode.value) {
    // TODO: 显示错误提示
    return;
  }

  // TODO: 实现注册或登录逻辑
}
</script>

<template>
  <div class="register-form">
    <!-- Phone Number Group -->
    <div class="form-group">
      <label>{{ $t('authentication.register.phone') }}</label>
      <n-input
        v-model:value="phone"
        :placeholder="$t('authentication.register.input_phone')"
        clearable
        type="text"
      />
    </div>

    <!-- Verification Code Group -->
    <div class="form-group">
      <label>{{ $t('authentication.register.code') }}</label>
      <div class="code-input-row">
        <n-input
          v-model:value="verificationCode"
          :placeholder="$t('authentication.register.input_code')"
          maxlength="6"
          type="text"
        />
        <n-button
          :disabled="codeSent"
          :type="codeSent ? 'default' : 'primary'"
          class="send-code-btn"
          @click="handleButtonSendVerifyCode"
        >
          {{ codeSent ? `${codeCountdown}s` : $t('authentication.register.send_code') }}
        </n-button>
      </div>
    </div>

    <!-- Register Button -->
    <n-button
      type="primary"
      block
      size="large"
      class="register-button"
      @click="handleButtonRegisterOrLogin"
    >
      {{ $t('authentication.register.register_or_login') }}
    </n-button>
  </div>
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

.register-button {
  font-weight: 600;
  height: 44px;
  margin-top: 0.5rem;
}
</style>
