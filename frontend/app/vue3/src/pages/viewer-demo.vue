<script setup lang="ts">
import { ref } from 'vue'
import { ContentViewer } from '@/components/ContentViewer'

const markdownContent = ref(`# ContentViewer Demo

Welcome to the **ContentViewer** component demonstration.

## Features

This component supports various Markdown features:

### Text Formatting

- **Bold text**
- *Italic text*
- ***Bold and italic***
- ~~Strikethrough~~

### Links and Images

[Visit GitHub](https://github.com)

![Sample Image](/logo.png)

### Code

Inline code: \`const viewer = new ContentViewer()\`

Code block:
\`\`\`javascript
function renderContent(content) {
  return marked(content);
}
\`\`\`

### Quotes

> This is a blockquote.
> It can span multiple lines.

### Lists

#### Unordered List
- First item
- Second item
  - Nested item 1
  - Nested item 2
- Third item

#### Ordered List
1. First step
2. Second step
3. Third step

#### Task List
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task

### Tables

| Feature | Support | Notes |
|---------|---------|-------|
| Markdown | ✅ | Full GFM support |
| HTML | ✅ | Direct rendering |
| Text | ✅ | Preformatted display |

### Horizontal Rule

---

### Additional Content

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

#### Mathematical Expression (if supported)

E = mc²

#### Emoji (if supported)

😀 😁 😂 😃 😄 😅 😆 😇 😈 😉 😊 😍 😘 😗 😙 😚 😜 😝

👋 👍 👎 👌 ✌️ ✋ 👏 🙌 👐 🤝 💪

❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 💕 💖 💗

🎉 🎊 🎈 🎁 🎀 🎂 🎃 🎄 ✨ 🌟 ⭐ 💫 🚀 🚁 🚀
`)

const htmlContent = ref(`
<h1>HTML Content</h1>
<p>This is <strong>HTML</strong> content rendered directly.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
<p>It supports all standard HTML elements with beautiful styling.</p>
`)

const textContent = ref(`Plain Text Content

This is plain text content.
It preserves line breaks
and whitespace.

  Indentation is preserved too.

Special characters: <tag> & "quotes" 'apostrophes'`)

const activeTab = ref('markdown')

const emojiTestContent = ref(`# 🎉 Emoji 完整测试

## 😊 表情符号

😀 😁 😂 😃 😄 😅 😆 😇 😈 😉 😊 😍 😘 😗 😙 😚 😜 😝 😛 😳 😌 😔 😑 😒 😐 😓 😥 😬 😕 😟 😲 😞 😖 😢 😭 😱 😠 😡 😦 😧 😨 😬 😰 😢 😭 😱 😨 😠 😡 😤 😖 😆 😋 😷 😎 😴 😵 😲 😳 😦 😧 😨 😬 😰 😢 😭 😱

## 👋 手势符号

👋 👍 👎 👌 ✌️ ✋ 👏 🙌 👐 🤝 💪 ☝️ 👆 👇 👈 👉 🤟 ✌️ 🤘 🤞

## ❤️ 心形和爱

❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 💕 💖 💗 💘 💝 💞 💓 💞 💝 💖 💗 💓 💕 💞

## 🎉 庆祝符号

🎉 🎊 🎈 🎁 🎀 🎂 🎃 🎄 🎆 🎇 ✨ 🌟 ⭐ 💫 🌠 ⚡ 💥 🔥

## 🚀 交通工具

🚀 🚁 🚂 🚃 🚄 🚅 🚆 🚇 🚈 🚉 🚊 🚝 🚞 🚋 🚌 🚎 🚐 🚑 🚒 🚓 🚔 🚕 🚖 🚗 🚘 🚙 🚚 🚛 🚜

## 🏠 物体符号

🏠 🏡 🏢 🏣 🏤 🏥 🏦 🏧 🏨 🏩 🏪 🏫 🏬 🏭 🏯 🏰 💒 🗼 🗽 🗿 ⛪ 🕌 🕍 ⛩️

## 🌍 自然符号

🌍 🌎 🌏 🌐 🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌙 🌚 🌝 🌛 🌜 ⭐ 🌟 💫 ✨ ⚡ ☄️ 💥 🔥

## 🍎 食物符号

🍎 🍊 🍋 🍌 🍉 🍇 🍓 🍈 🍒 🍑 🍍 🥭 🍅 🍆 🥑 🥦 🥬 🥒 🌶️ 🌽 🥕 🍞 🥐 🥯

## ⚽ 运动符号

⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🥏 🎳 🏓 🏸 🏒 🏑 🥍 🏏 ⛳ 🪃 🥅 ⛸️ 🎣 🎽 🎿 ⛷️

## 音乐和艺术 🎵

🎵 🎶 🎼 🎹 🎸 🎺 🎷 🎸 🎻 🎲 🎯 🎳 🎮 🎰

## 完成测试 ✅

所有 emoji 都应该在上面正确显示！😊✨🚀
`)

const basicUsageCode = `<script setup>
// import { ContentViewer } from '@/components/ContentViewer'

const content = \`# Hello World
This is **Markdown** content.\`
<\/script>

<template>
  <ContentViewer :content="content" type="markdown" />
</template>`

const htmlUsageCode = `<template>
  <ContentViewer
    :content="htmlContent"
    type="html"
  />
</template>

<script setup>
const htmlContent = '<h1>Title</h1><p>Content</p>'
<\/script>`

const blogUsageCode = `<template>
  <div class="blog-post">
    <h1>{{ post.title }}</h1>
    <ContentViewer
      :content="post.content"
      type="markdown"
    />
  </div>
</template>

<script setup>
// import { ContentViewer } from '@/components/ContentViewer'

const post = {
  title: 'My Blog Post',
  content: '# Hello\\n\\nThis is my post content.'
}
<\/script>`
</script>

<template>
  <div class="viewer-demo">
    <n-card title="ContentViewer Component Demo">
      <n-tabs v-model:value="activeTab" type="segment">
        <n-tab-pane name="markdown" tab="Markdown">
          <n-card :bordered="false" class="content-card">
            <ContentViewer :content="markdownContent" type="markdown" />
          </n-card>
        </n-tab-pane>

        <n-tab-pane name="emoji" tab="Emoji Test 😊">
          <n-card :bordered="false" class="content-card">
            <ContentViewer :content="emojiTestContent" type="markdown" />
          </n-card>
        </n-tab-pane>

        <n-tab-pane name="html" tab="HTML">
          <n-card :bordered="false" class="content-card">
            <ContentViewer :content="htmlContent" type="html" />
          </n-card>
        </n-tab-pane>

        <n-tab-pane name="text" tab="Plain Text">
          <n-card :bordered="false" class="content-card">
            <ContentViewer :content="textContent" type="text" />
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </n-card>

    <!-- Usage Examples -->
    <n-card title="Usage Examples" style="margin-top: 2rem">
      <n-space vertical :size="24">
        <div>
          <h3>Basic Usage</h3>
          <n-code language="vue" :code="basicUsageCode" />
        </div>

        <div>
          <h3>With HTML Content</h3>
          <n-code language="vue" :code="htmlUsageCode" />
        </div>

        <div>
          <h3>In a Blog Post</h3>
          <n-code language="vue" :code="blogUsageCode" />
        </div>
      </n-space>
    </n-card>
  </div>
</template>


<style scoped lang="less">
.viewer-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  .content-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    margin-top: 1rem;
  }

  h3 {
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }
}
</style>

