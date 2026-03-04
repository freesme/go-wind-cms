<template>
  <div class="footer-outer">
    <n-space class="footer-container stick-content" justify="space-between" align="center">
      <n-space>
        <n-button text class="footer-link" @click="handleButtonAboutUs">{{ $t('ui.button.about_us') }}</n-button>
        <n-button text class="footer-link" @click="handleButtonContactUs">{{ $t('ui.button.contact_us') }}</n-button>
        <n-button text class="footer-link" @click="handleButtonNonResponsibility">{{
            $t('ui.button.non_responsibility')
          }}
        </n-button>
        <n-button text class="footer-link" @click="handleButtonPrivacyAgreement">{{
            $t('ui.button.privacy_agreement')
          }}
        </n-button>
        <n-button text class="footer-link" @click="handleButtonTermsOfService">{{
            $t('ui.button.terms_of_service')
          }}
        </n-button>
      </n-space>
      <n-space align="center">
        <span class="copyright">{{ $t('ui.copyright') }}</span>
        <n-divider vertical/>
        <n-space>
          <n-button text class="social-btn" @click="handleButtonTwitter">
            <template #icon>
              <TwitterSquare/>
            </template>
          </n-button>
          <n-button text class="social-btn" @click="handleButtonFacebook">
            <template #icon>
              <FacebookSquare/>
            </template>
          </n-button>
          <n-button text class="social-btn" @click="handleButtonInstagram">
            <template #icon>
              <InstagramSquare/>
            </template>
          </n-button>
          <n-button text class="social-btn" @click="handleButtonTelegram">
            <template #icon>
              <Telegram/>
            </template>
          </n-button>
        </n-space>
      </n-space>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import {FacebookSquare, Telegram, InstagramSquare, TwitterSquare} from '@vicons/fa'

import {$t} from '@/locales'

function handleButtonAboutUs() {
  console.log('About us')
}

function handleButtonContactUs() {
  console.log('Contact us')
}

function handleButtonNonResponsibility() {
  console.log('Non responsibility')
}

function handleButtonPrivacyAgreement() {
  console.log('Privacy agreement')
}

function handleButtonTermsOfService() {
  console.log('Terms of service')
}

function handleButtonTwitter() {
  console.log('Twitter')
}

function handleButtonFacebook() {
  console.log('Facebook')
}

function handleButtonInstagram() {
  console.log('Instagram')
}

function handleButtonTelegram() {
  console.log('Telegram')
}
</script>

<style scoped lang="less">
.footer-outer {
  width: 100%;
  background: var(--color-surface);
  display: flex;
  justify-content: center;
}

.footer-container {
  min-height: 72px;
  padding: var(--space-4) 0;
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
}

.footer-link {
  --n-text-color-text: var(--color-text-secondary);
  --n-text-color-text-hover: var(--color-text-primary);
  --n-text-color-text-pressed: var(--color-text-primary);
}

.footer-link :deep(.n-button__content),
.footer-link :deep(.n-button__content span) {
  color: var(--color-text-secondary) !important;
}

.footer-link:hover :deep(.n-button__content),
.footer-link:hover :deep(.n-button__content span) {
  color: var(--color-text-primary) !important;
}

// 文字按钮样式
:deep(.n-button.n-button--text-type) {
  color: var(--color-text-secondary) !important;
  padding: 4px 8px;
}

:deep(.n-button.n-button--text-type:hover) {
  color: var(--color-text-primary) !important;
  background: rgba(102, 126, 234, 0.05);
}

// 确保按钮内容颜色正确
:deep(.n-button__content) {
  color: inherit;
}

// 图标颜色
:deep(.n-icon) {
  color: var(--color-text-secondary) !important;
}

:deep(.n-button:hover .n-icon) {
  color: var(--color-text-primary) !important;
}

// 社交媒体按钮
.social-btn {
  font-size: 28px;
  color: var(--color-text-secondary) !important;
  transition: all 0.3s;
  --n-text-color-text: var(--color-text-secondary);
  --n-text-color-text-hover: var(--color-brand);
}

// 版权文字
.copyright {
  color: var(--color-text-secondary) !important;
  font-size: 14px;
}

// 分割线
:deep(.n-divider) {
  background-color: var(--color-border);
}

// Space 组件
:deep(.n-space) {
  color: var(--color-text-secondary);
}
</style>
