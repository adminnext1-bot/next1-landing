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

  const prompt = `Bạn là chuyên gia tài chính của NEXT 1 — cộng đồng đầu tư chuyên nghiệp tại Việt Nam.

Viết một bài blog về: "${topic}"
Danh mục: ${category || 'Tư duy đầu tư'}
Độ dài: ${lengthGuide}

Phong cách: chuyên nghiệp, thực chiến, tiếng Việt tự nhiên, có góc nhìn riêng.

QUAN TRỌNG: Chỉ trả về JSON thuần túy, KHÔNG có markdown, KHÔNG có \`\`\`json, KHÔNG có text khác ngoài JSON.

Format JSON:
{"title":"tiêu đề","excerpt":"tóm tắt 1-2 câu","body":"nội dung dùng markdown"}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: err }), { status: 500 });
  }

  const data = await res.json();
  let text = data.content?.[0]?.text ?? '';

  // Strip markdown code fences if present
  text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    const json = JSON.parse(text);
    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // Try extracting JSON object from text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const json = JSON.parse(match[0]);
        return new Response(JSON.stringify(json), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch {}
    }
    return new Response(JSON.stringify({ error: 'Parse error', raw: text.slice(0, 300) }), { status: 500 });
  }
}
