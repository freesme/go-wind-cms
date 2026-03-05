<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'

import {marked} from 'marked'
import hljs from 'highlight.js'
import DOMPurify from 'dompurify'
import katex from 'katex'
import mermaid from 'mermaid'

import type {Props} from './types'

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
})

const containerRef = ref<HTMLDivElement>()
const mermaidReady = ref(false)

const props = withDefaults(defineProps<Props>(), {
  content: '',
  type: 'markdown',
  class: '',
})

// Configure marked with custom renderer for better code handling
marked.setOptions({
  breaks: true,
  gfm: true,
  pedantic: false,
})

// Custom renderer for better code block handling
const renderer = new marked.Renderer()

// Override code block rendering
renderer.codespan = (code) => {
  return `<code class="inline-code">${escapeHtml(code.text)}</code>`
}

renderer.code = (code) => {
  const lang = code.lang || 'plaintext'
  let highlighted: string

  // Check if it's a mermaid diagram
  if (lang === 'mermaid') {
    try {
      return `<div class="mermaid">${escapeHtml(code.text)}</div>`
    } catch (error) {
      console.warn('Failed to render mermaid diagram:', error)
      return `<pre class="code-block mermaid-error" data-lang="mermaid"><code>${escapeHtml(code.text)}</code></pre>`
    }
  }

  // Try to highlight the code
  try {
    if (hljs.getLanguage(lang)) {
      highlighted = hljs.highlight(code.text, {language: lang, ignoreIllegals: true}).value
    } else {
      highlighted = escapeHtml(code.text)
    }
  } catch (error) {
    console.warn(`Failed to highlight code with language ${lang}:`, error)
    highlighted = escapeHtml(code.text)
  }

  return `<pre class="code-block" data-lang="${lang}"><code class="hljs language-${lang}">${highlighted}</code></pre>`
}

// Override heading rendering
renderer.heading = (heading) => {
  const inlineHtml = marked.parseInline(heading.text)
  const id = heading.text.toLowerCase().replace(/\s+/g, '-')
  return `<h${heading.depth} id="${id}" class="heading-anchor">${inlineHtml}</h${heading.depth}>`
}

// Override link rendering
renderer.link = (link) => {
  const isExternal = link.href.startsWith('http') || link.href.startsWith('//')
  const inlineHtml = marked.parseInline(link.text)
  return `<a href="${link.href}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="markdown-link">${inlineHtml}</a>`
}

// Override image rendering
renderer.image = (image) => {
  return `<figure class="markdown-image">
    <img src="${image.href}" alt="${image.text}" class="md-img" />
    ${image.text ? `<figcaption>${image.text}</figcaption>` : ''}
  </figure>`
}

// Override table rendering
renderer.table = (token) => {
  let html = '<thead>\n<tr>\n'

  // Render table header
  for (const header of token.header) {
    const align = header.align ? ` style="text-align:${header.align}"` : ''
    const cellHtml = marked.parseInline(header.text)
    html += `<th${align}>${cellHtml}</th>\n`
  }

  html += '</tr>\n</thead>\n<tbody>\n'

  // Render table rows
  for (const row of token.rows) {
    html += '<tr>\n'
    for (const cell of row) {
      const align = cell.align ? ` style="text-align:${cell.align}"` : ''
      const cellHtml = marked.parseInline(cell.text)
      html += `<td${align}>${cellHtml}</td>\n`
    }
    html += '</tr>\n'
  }

  html += '</tbody>'
  return `<div class="table-wrapper"><table class="markdown-table">${html}</table></div>`
}

// Override paragraph rendering
renderer.paragraph = (token) => {
  return `<p>${marked.parseInline(token.text)}</p>\n`
}


// Set custom renderer
marked.setOptions({renderer})

// Render content based on type
const renderedContent = computed(() => {
  if (!props.content) return ''

  try {
    let html = ''
    switch (props.type) {
      case 'markdown':
        html = marked.parse(props.content) as string
        // Process math formulas
        html = processMathFormulas(html)
        return sanitizeHtml(html)
      case 'html':
        return sanitizeHtml(props.content)
      case 'text':
        return sanitizeHtml(`<pre class="plain-text-block">${escapeHtml(props.content)}</pre>`)
      default:
        return props.content
    }
  } catch (error) {
    console.error('Error rendering content:', error)
    return `<p class="content-error">Failed to render content</p>`
  }
})

// Process math formulas (both inline and block)
function processMathFormulas(html: string): string {
  // Block math: $$...$$
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
    try {
      const rendered = katex.renderToString(formula, {displayMode: true})
      return `<div class="math-block">${rendered}</div>`
    } catch (error) {
      console.warn('Failed to render block math:', error)
      return `<div class="math-error"><code>${escapeHtml(formula)}</code></div>`
    }
  })

  // Inline math: $...$
  html = html.replace(/(?<!\$)\$([^$\n]+)\$(?!\$)/g, (_, formula) => {
    try {
      const rendered = katex.renderToString(formula, {displayMode: false})
      return `<span class="math-inline">${rendered}</span>`
    } catch (error) {
      console.warn('Failed to render inline math:', error)
      return `<code class="math-error">${escapeHtml(formula)}</code>`
    }
  })

  return html
}

// Escape HTML for text type (preserve emoji)
function sanitizeHtml(html: string): string {
  // Configure DOMPurify to allow emoji and unicode
  const config: any = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'pre', 'code',
      'strong', 'b', 'em', 'i', 'u', 'del', 's',
      'a', 'img', 'blockquote', 'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'video', 'iframe', 'figure', 'figcaption',
      'mark', 'sub', 'sup', 'span', 'div',
      // Math formula tags
      'math', 'mrow', 'mi', 'mn', 'mo', 'mfrac', 'msup', 'msub', 'mover', 'munder',
      // Mermaid diagram
      'svg', 'g', 'text', 'path', 'circle', 'line', 'polyline', 'polygon', 'rect', 'ellipse',
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'target', 'rel',
      'src', 'alt', 'width', 'height',
      'class', 'id', 'style', 'data-lang',
      'data-*',
      // SVG attributes
      'viewBox', 'xmlns', 'x', 'y', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2',
      'd', 'fill', 'stroke', 'stroke-width', 'points', 'transform',
    ],
    KEEP_CONTENT: true,
    // Don't strip whitespace or special characters that might be emoji
    ALLOW_UNKNOWN_PROTOCOLS: true,
    // Use HTML parser instead of DOM parser to preserve text nodes
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    FORCE_BODY: false,
    SANITIZE_DOM: true,
    IN_PLACE: false,
  }

  // Use DOMPurify's default sanitization with our config
  return DOMPurify.sanitize(html, config) as unknown as string
}

// Escape HTML for text type (preserve emoji)
function escapeHtml(text: string): string {
  // Create a temporary element and use textContent to properly escape HTML
  // while preserving emoji and unicode characters
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  // Only escape HTML special characters, NOT unicode/emoji
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// Initialize mermaid diagrams after content is rendered
onMounted(() => {
  if (containerRef.value) {
    try {
      mermaid.contentLoaded()
      mermaidReady.value = true
    } catch (error) {
      console.warn('Failed to initialize mermaid:', error)
    }
  }
})
</script>

<template>
  <div ref="containerRef" :class="['content-viewer', props.class]" v-html="renderedContent"/>
</template>

<style scoped lang="less">
.content-viewer {
  color: var(--color-text-primary);
  line-height: 1.8;
  word-wrap: break-word;

  // Typography - Headings
  :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
    margin-top: 1.5em;
    margin-bottom: 0.75em;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-text-primary);

    &:first-child {
      margin-top: 0;
    }
  }

  :deep(h1) {
    font-size: 2rem;
    border-bottom: 2px solid var(--color-border);
    padding-bottom: 0.5rem;
  }

  :deep(h2) {
    font-size: 1.5rem;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.5rem;
  }

  :deep(h3) {
    font-size: 1.25rem;
  }

  :deep(h4) {
    font-size: 1.1rem;
  }

  :deep(h5), :deep(h6) {
    font-size: 1rem;
  }

  // Paragraphs
  :deep(p) {
    margin: 1em 0;
    line-height: 1.8;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  // Links
  :deep(a.markdown-link) {
    color: var(--color-brand);
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
  }

  // Strong and emphasis
  :deep(strong), :deep(b) {
    font-weight: 600;
    color: var(--color-text-primary);
  }

  :deep(em), :deep(i) {
    font-style: italic;
  }

  // Inline code
  :deep(code.inline-code) {
    background: rgba(150, 150, 150, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    font-size: 0.9em;
    color: var(--color-text-primary);
  }

  // Code blocks with syntax highlighting
  :deep(pre.code-block) {
    background: #282c34;
    color: #abb2bf;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5em 0;
    border: 1px solid #3e4451;
    position: relative;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;

    &::before {
      content: attr(data-lang);
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      font-size: 0.75rem;
      color: #7a818e;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    code {
      background: none;
      padding: 0;
      border-radius: 0;
      font-size: 0.875rem;
      line-height: 1.6;
      color: #abb2bf;

      // Syntax highlighting colors (One Dark theme)
      .hljs-attr {
        color: #e06c75;
      }

      .hljs-attr-value {
        color: #98c379;
      }

      .hljs-number {
        color: #d19a66;
      }

      .hljs-literal {
        color: #56b6c2;
      }

      .hljs-string {
        color: #98c379;
      }

      .hljs-string .hljs-emphasis {
        color: #e06c75;
      }

      .hljs-section {
        color: #e06c75;
      }

      .hljs-link {
        color: #d19a66;
      }

      .hljs-operator {
        color: #56b6c2;
      }

      .hljs-keyword {
        color: #c678dd;
      }

      .hljs-type {
        color: #56b6c2;
      }

      .hljs-name {
        color: #e06c75;
      }

      .hljs-selector-class {
        color: #e06c75;
      }

      .hljs-selector-id {
        color: #e06c75;
      }

      .hljs-variable {
        color: #e06c75;
      }

      .hljs-template-variable {
        color: #e06c75;
      }

      .hljs-title {
        color: #61afef;
      }

      .hljs-title.class_ {
        color: #e5c07b;
      }

      .hljs-title.class_.inherited__ {
        color: #98c379;
      }

      .hljs-title.function_ {
        color: #61afef;
      }

      .hljs-params {
        color: #abb2bf;
      }

      .hljs-class {
        color: #e5c07b;
      }

      .hljs-function {
        color: #61afef;
      }

      .hljs-comment {
        color: #5c6370;
      }

      .hljs-doctag {
        color: #5c6370;
      }

      .hljs-meta {
        color: #5c6370;
      }

      .hljs-meta .hljs-keyword {
        color: #5c6370;
      }

      .hljs-meta .hljs-string {
        color: #98c379;
      }

      .hljs-builtin-name {
        color: #e5c07b;
      }

      .hljs-code {
        color: #98c379;
      }

      .hljs-tag {
        color: #e06c75;
      }

      .hljs-tag .hljs-attr {
        color: #e5c07b;
      }

      .hljs-tag .hljs-title {
        color: #e06c75;
      }

      .hljs-tag .hljs-literal {
        color: #abb2bf;
      }

      .hljs-name {
        color: #e06c75;
      }

      .hljs-attr {
        color: #e5c07b;
      }

      .hljs-bullet {
        color: #56b6c2;
      }

      .hljs-quote {
        color: #5c6370;
      }

      .hljs-punctuation {
        color: #abb2bf;
      }
    }
  }

  // Plain text blocks
  :deep(pre.plain-text-block) {
    background: rgba(150, 150, 150, 0.1);
    color: var(--color-text-primary);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5em 0;
    border: 1px solid var(--color-border);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  // Blockquotes
  :deep(blockquote) {
    border-left: 4px solid var(--color-brand);
    padding: 0.5em 1em;
    margin: 1.5em 0;
    background: rgba(150, 150, 150, 0.05);
    color: var(--color-text-secondary);
    border-radius: 4px;

    p {
      margin: 0.5em 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  // Lists
  :deep(ul), :deep(ol) {
    padding-left: 2em;
    margin: 1em 0;

    li {
      margin: 0.5em 0;
      line-height: 1.8;

      p {
        margin: 0.5em 0;
      }
    }
  }

  :deep(ul) {
    list-style-type: disc;

    ul {
      list-style-type: circle;

      ul {
        list-style-type: square;
      }
    }
  }

  :deep(ol) {
    list-style-type: decimal;
  }

  // Images
  :deep(figure.markdown-image) {
    margin: 1.5em 0;
    text-align: center;

    :deep(img.md-img) {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      display: inline-block;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    :deep(figcaption) {
      margin-top: 0.5em;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      text-align: center;
    }
  }

  // Tables
  :deep(.table-wrapper) {
    overflow-x: auto;
    margin: 1.5em 0;
    border-radius: 8px;
    border: 1px solid var(--color-border);
  }

  :deep(table.markdown-table) {
    width: 100%;
    border-collapse: collapse;
    background: var(--color-surface);

    th, td {
      padding: 0.75em 1em;
      border: 1px solid var(--color-border);
      text-align: left;
    }

    th {
      background: rgba(150, 150, 150, 0.1);
      font-weight: 600;
      color: var(--color-text-primary);
    }

    tr:nth-child(even) {
      background: rgba(150, 150, 150, 0.05);
    }

    tr:hover {
      background: rgba(150, 150, 150, 0.08);
    }
  }

  // Horizontal rule
  :deep(hr) {
    border: none;
    border-top: 2px solid var(--color-border);
    margin: 2em 0;
  }

  // Video
  :deep(video) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1.5em 0;
    display: block;
  }

  // Iframe (for embedded content)
  :deep(iframe) {
    max-width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    margin: 1.5em 0;
  }

  // Error state
  :deep(.content-error) {
    color: #ff6b6b;
    padding: 1em;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid #ff6b6b;
    border-radius: 8px;
    margin: 1.5em 0;
  }

  // Math formulas
  :deep(.math-block) {
    display: flex;
    justify-content: center;
    margin: 1.5em 0;
    padding: 1em;
    background: rgba(150, 150, 150, 0.05);
    border-radius: 8px;
    overflow-x: auto;
  }

  :deep(.math-inline) {
    display: inline;
    font-size: 0.95em;
  }

  :deep(.math-error) {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
    padding: 0.25em 0.5em;
    border-radius: 4px;
  }

  // Mermaid diagrams
  :deep(.mermaid) {
    display: flex;
    justify-content: center;
    margin: 1.5em 0;
    padding: 1em;
    background: rgba(150, 150, 150, 0.05);
    border-radius: 8px;
    border: 1px solid var(--color-border);
    overflow-x: auto;

    svg {
      max-width: 100%;
      height: auto;
    }
  }

  :deep(.mermaid-error) {
    color: #ff6b6b;
    background: rgba(255, 107, 107, 0.1);
    border-color: #ff6b6b;
  }

  // KaTeX CSS (imported from katex package)
  :deep(.katex) {
    font: normal 1.21em KaTeX_Main, 'Times New Roman', serif;
    line-height: 1.2;
    text-indent: 0;
  }

  :deep(.katex-display) {
    display: block;
    margin: 1em 0;
    text-align: center;
  }

  :deep(.katex-html) {
    display: none;
  }

  :deep(.katex-mathml) {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0;
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
  }
}
</style>

