export async function onRequestPost(context) {
  const apiKey = context.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 });
  }

  const { topic, category, length } = await context.request.json();
  if (!topic) {
    return new Response(JSON.stringify({ error: 'Missing topic' }), { status: 400 });
  }

  const lengthGuide = {
    short:  'khoảng 300-400 từ, ngắn gọn súc tích',
    medium: 'khoảng 600-800 từ, đầy đủ các ý chính',
    long:   'khoảng 1200-1500 từ, phân tích chuyên sâu',
  }[length] || 'khoảng 600-800 từ';

  const prompt = `Bạn là chuyên gia tài chính và giao dịch của NEXT 1 — cộng đồng đầu tư chuyên nghiệp tại Việt Nam.

Viết một bài blog hoàn chỉnh về chủ đề: "${topic}"
Danh mục: ${category || 'Tư duy đầu tư'}
Độ dài: ${lengthGuide}

Phong cách viết:
- Chuyên nghiệp, thực chiến, có chiều sâu
- Ngôn ngữ tiếng Việt tự nhiên, không cứng nhắc
- Có góc nhìn riêng, không chung chung
- Phù hợp với nhà đầu tư Việt Nam thế hệ mới

Trả về JSON với format sau (chỉ JSON, không có text khác):
{
  "title": "Tiêu đề bài viết",
  "excerpt": "Tóm tắt 1-2 câu hấp dẫn",
  "body": "Nội dung đầy đủ dùng Markdown: ## cho tiêu đề, **text** cho in đậm, *text* cho in nghiêng, > cho trích dẫn, hai dòng trống giữa các đoạn"
}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? '';

  try {
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] ?? text);
    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Parse error', raw: text }), { status: 500 });
  }
}
