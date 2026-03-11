'use client';

import React, {useEffect, useRef} from 'react';
import {marked} from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import katex from 'katex';
import mermaid from 'mermaid';

import type {ContentViewerProps} from './types';
import styles from './ContentViewer.module.css';

// Initialize Mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'default',
    securityLevel: 'loose',
});

// Configure marked with custom renderer
const renderer = new marked.Renderer();

// Override code block rendering
renderer.codespan = (code) => {
    return `<code class="inline-code">${escapeHtml(code.text)}</code>`;
};

renderer.code = (code) => {
    const lang = code.lang || 'plaintext';
    let highlighted: string;

    // Check if it's a mermaid diagram
    if (lang === 'mermaid') {
        try {
            return `<div class="mermaid">${escapeHtml(code.text)}</div>`;
        } catch (error) {
            console.warn('Failed to render mermaid diagram:', error);
            return `<pre class="code-block mermaid-error" data-lang="mermaid"><code>${escapeHtml(code.text)}</code></pre>`;
        }
    }

    // Try to highlight the code
    try {
        if (hljs.getLanguage(lang)) {
            highlighted = hljs.highlight(code.text, {language: lang, ignoreIllegals: true}).value;
        } else {
            highlighted = escapeHtml(code.text);
        }
    } catch (error) {
        console.warn(`Failed to highlight code with language ${lang}:`, error);
        highlighted = escapeHtml(code.text);
    }

    return `<pre class="code-block" data-lang="${lang}"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
};

// Override heading rendering
renderer.heading = (heading) => {
    const inlineHtml = marked.parseInline(heading.text);
    return `<h${heading.depth} class="heading-anchor">${inlineHtml}</h${heading.depth}>`;
};

function splitUrlAndText(content: string): string {
    return content.replace(/(https?:\/\/[^\s，]+)(，[^ \n]+)/g, (_match, url, desc) => {
        return `[${url}](${url})${desc}`;
    });
}

// Override link rendering
renderer.link = (link) => {
    const isExternal = link.href.startsWith('http') || link.href.startsWith('//');
    if (link.href === link.text) {
        return `<a href="${link.href}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="markdown-link">${escapeHtml(link.text)}</a>`;
    } else {
        return `<a href="${link.href}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} class="markdown-link">${escapeHtml(link.href)}</a>${escapeHtml(link.text.replace(link.href, ''))}`;
    }
};

// Override image rendering
renderer.image = (image) => {
    return `<figure class="markdown-image">
    <img src="${image.href}" alt="${image.text}" class="md-img" />
    ${image.text ? `<figcaption>${image.text}</figcaption>` : ''}
  </figure>`;
};

// Override table rendering
renderer.table = (token) => {
    let html = '<thead>\n<tr>\n';

    for (const header of token.header) {
        const align = header.align ? ` style="text-align:${header.align}"` : '';
        const cellHtml = marked.parseInline(header.text);
        html += `<th${align}>${cellHtml}</th>\n`;
    }

    html += '</tr>\n</thead>\n<tbody>\n';

    for (const row of token.rows) {
        html += '<tr>\n';
        for (const cell of row) {
            const align = cell.align ? ` style="text-align:${cell.align}"` : '';
            const cellHtml = marked.parseInline(cell.text);
            html += `<td${align}>${cellHtml}</td>\n`;
        }
        html += '</tr>\n';
    }

    html += '</tbody>';
    return `<div class="table-wrapper"><table class="markdown-table">${html}</table></div>`;
};

// Override paragraph rendering
renderer.paragraph = (token) => {
    return `<p>${marked.parseInline(token.text)}</p>\n`;
};

// Set custom renderer
marked.setOptions({renderer});

// Process math formulas
function processMathFormulas(html: string): string {
    // Block math: $$...$$
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
        try {
            const rendered = katex.renderToString(formula, {displayMode: true});
            return `<div class="math-block">${rendered}</div>`;
        } catch (error) {
            console.warn('Failed to render block math:', error);
            return `<div class="math-error"><code>${escapeHtml(formula)}</code></div>`;
        }
    });

    // Inline math: $...$
    html = html.replace(/(?<!\$)\$([^$\n]+)\$(?!\$)/g, (_, formula) => {
        try {
            const rendered = katex.renderToString(formula, {displayMode: false});
            return `<span class="math-inline">${rendered}</span>`;
        } catch (error) {
            console.warn('Failed to render inline math:', error);
            return `<code class="math-error">${escapeHtml(formula)}</code>`;
        }
    });

    return html;
}

// Escape HTML for text type (preserve emoji)
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Sanitize HTML
function sanitizeHtml(html: string): string {
    const config: any = {
        ALLOWED_TAGS: [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'hr', 'pre', 'code',
            'strong', 'b', 'em', 'i', 'u', 'del', 's',
            'a', 'img', 'blockquote', 'ul', 'ol', 'li',
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
            'video', 'iframe', 'figure', 'figcaption',
            'mark', 'sub', 'sup', 'span', 'div',
            'math', 'mrow', 'mi', 'mn', 'mo', 'mfrac', 'msup', 'msub', 'mover', 'munder',
            'svg', 'g', 'text', 'path', 'circle', 'line', 'polyline', 'polygon', 'rect', 'ellipse',
        ],
        ALLOWED_ATTR: [
            'href', 'title', 'target', 'rel',
            'src', 'alt', 'width', 'height',
            'class', 'id', 'style', 'data-lang',
            'data-*',
            'viewBox', 'xmlns', 'x', 'y', 'cx', 'cy', 'r', 'x1', 'y1', 'x2', 'y2',
            'd', 'fill', 'stroke', 'stroke-width', 'points', 'transform',
        ],
        KEEP_CONTENT: true,
        ALLOW_UNKNOWN_PROTOCOLS: true,
        RETURN_DOM: false,
        RETURN_DOM_FRAGMENT: false,
        RETURN_DOM_IMPORT: false,
        FORCE_BODY: false,
        SANITIZE_DOM: true,
        IN_PLACE: false,
    };

    return DOMPurify.sanitize(html, config) as unknown as string;
}

const ContentViewer: React.FC<ContentViewerProps> = ({
                                                         content = '',
                                                         type = 'markdown',
                                                         className = ''
                                                     }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Render content based on type
    const getRenderedContent = () => {
        if (!content) return '';

        try {
            let html = '';
            switch (type) {
                case 'markdown':
                    let md = content;
                    md = splitUrlAndText(md);
                    html = marked.parse(md) as string;
                    html = processMathFormulas(html);
                    return sanitizeHtml(html);
                case 'html':
                    return sanitizeHtml(content);
                case 'text':
                    return sanitizeHtml(`<pre class="plain-text-block">${escapeHtml(content)}</pre>`);
                default:
                    return content;
            }
        } catch (error) {
            console.error('Error rendering content:', error);
            return `<p class="content-error">Failed to render content</p>`;
        }
    };

    // Initialize mermaid diagrams after content is rendered
    useEffect(() => {
        if (containerRef.current) {
            try {
                mermaid.contentLoaded();
            } catch (error) {
                console.warn('Failed to initialize mermaid:', error);
            }
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${styles.contentViewer} ${className}`}
            dangerouslySetInnerHTML={{__html: getRenderedContent()}}
        />
    );
};

export default ContentViewer;
