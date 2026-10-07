import { defineConfig } from 'astro/config';

// GitHub Pages で公開する場合は site / base を設定する
// 例: site: 'https://<ユーザー名>.github.io', base: '/matenigxe'
export default defineConfig({
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  markdown: {
    // コードブロックもライト/ダークで色を切り替える（切り替えは Base.astro の CSS）
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
