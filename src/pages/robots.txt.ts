export async function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: https://next1hub.com/sitemap.xml
`;
  return new Response(content, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
