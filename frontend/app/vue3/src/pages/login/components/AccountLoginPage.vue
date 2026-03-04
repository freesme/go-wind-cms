<script setup lang="ts">
import {ref} from 'vue';
import {$t} from '@/locales';

const username = ref('');
const password = ref('');
const rememberMe = ref(false);

function handleLogin() {
  if (!username.value || !password.value) {
    // TODO: 显示错误提示
    return;
  }

  // TODO: 实现登录逻辑
  console.log('登录信息：', {
    username: username.value,
    password: password.value,
    rememberMe: rememberMe.value,
  });
}

function handleForgotPassword() {
  // TODO: 跳转到忘记密码页面
  console.log('忘记密码');
}
</script>

<template>
  <div class="login-form">
    <div class="form-group">
      <label>{{ $t('authentication.login.username') }}</label>
      <n-input
        v-model:value="username"
        :placeholder="$t('authentication.register.input_username')"
        type="text"
        clearable
      />
    </div>
    <div class="form-group">
      <label>{{ $t('authentication.login.password') }}</label>
      <n-input
        v-model:value="password"
        type="password"
        :placeholder="$t('authentication.login.placeholder_password')"
        clearable
        show-password-on="click"
        @keyup.enter="handleLogin"
      />
    </div>
    <div class="form-options">
      <n-checkbox v-model:checked="rememberMe">{{ $t('authentication.login.remember_me') }}</n-checkbox>
      <n-button text type="primary" @click="handleForgotPassword">
        {{ $t('authentication.login.forgot_password') }}
      </n-button>
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.login-button {
  font-weight: 600;
  height: 44px;
  margin-bottom: 1.5rem;
}
</style>

