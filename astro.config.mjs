import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import katex from 'katex';

// $...$ と $$...$$ の数式を、ビルド時に KaTeX で HTML にする
const katexPlugin = {
  name: 'katex',
  inlineMath(node, ctx) {
    ctx.replaceNode(node, { type: 'html', value: katex.renderToString(node.value, { throwOnError: false }) });
  },
  math(node, ctx) {
    ctx.replaceNode(node, { type: 'html', value: katex.renderToString(node.value, { displayMode: true, throwOnError: false }) });
  },
};

// GitHub Pages で公開する場合は site / base を設定する
// 例: site: 'https://<ユーザー名>.github.io', base: '/matenigxe'
export default defineConfig({
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({ features: { math: true }, mdastPlugins: [katexPlugin] }),
    // コードブロックもライト/ダークで色を切り替える（切り替えは Base.astro の CSS）
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
