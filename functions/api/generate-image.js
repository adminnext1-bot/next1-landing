export async function onRequestPost(context) {
  const openaiKey   = context.env.OPENAI_API_KEY;
  const sanityToken = context.env.SANITY_TOKEN;
  const projectId   = context.env.SANITY_PROJECT_ID;
  const dataset     = context.env.SANITY_DATASET || 'production';

  if (!openaiKey) {
    return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });
  }

  const { prompt } = await context.request.json();
  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 });
  }

  // 1. Generate image with DALL-E 3
  const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model:           'dall-e-3',
      prompt,
      n:               1,
      size:            '1792x1024',
      quality:         'standard',
      response_format: 'url',
    }),
  });

  if (!dalleRes.ok) {
    const err = await dalleRes.text();
    return new Response(JSON.stringify({ error: `DALL-E error: ${err}` }), { status: 500 });
  }

  const dalleData = await dalleRes.json();
  const imageUrl  = dalleData.data?.[0]?.url;
  if (!imageUrl) {
    return new Response(JSON.stringify({ error: 'No image URL returned from DALL-E' }), { status: 500 });
  }

  // 2. Fetch the generated image bytes
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    // Return temp URL as fallback — client will show it but can't save to Sanity
    return new Response(JSON.stringify({ url: imageUrl, assetId: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const imgBuffer   = await imgRes.arrayBuffer();
  const contentType = imgRes.headers.get('Content-Type') || 'image/png';

  // 3. Upload to Sanity Assets so the URL is permanent
  if (sanityToken && projectId) {
    const uploadRes = await fetch(
      `https://${projectId}.api.sanity.io/v2024-01-01/assets/images/${dataset}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sanityToken}`,
          'Content-Type':  contentType,
        },
        body: imgBuffer,
      }
    );

    if (uploadRes.ok) {
      const uploadData = await uploadRes.json();
      const assetId    = uploadData.document._id;
      const assetUrl   = uploadData.document.url;
      return new Response(JSON.stringify({ assetId, url: assetUrl }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Fallback: return the temporary DALL-E URL (expires in ~1h)
  return new Response(JSON.stringify({ url: imageUrl, assetId: null }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
