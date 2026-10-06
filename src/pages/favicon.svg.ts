import site from '../../site.config';

// サイト名の1文字目をアイコンにする
export function GET() {
  const char = [...site.name][0] ?? '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#2563eb"/><text x="16" y="23" font-size="18" text-anchor="middle" fill="#fff" font-family="sans-serif">${char}</text></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
}
