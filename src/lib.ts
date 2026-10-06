import { getCollection } from 'astro:content';

export async function getNotes() {
  const notes = await getCollection('notes', ({ data }) => import.meta.env.DEV || !data.draft);
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

export const formatDate = (d: Date) => d.toISOString().slice(0, 10);

// 日本語は 1分あたり約500文字として概算
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.length / 500));
