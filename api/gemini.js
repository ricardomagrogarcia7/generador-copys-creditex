export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await req.json()
    const { imageBase64, mimeType } = body

    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY no configurada' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Analiza esta imagen de un creativo publicitario de moda/ropa. Describe en español de forma detallada y comercialmente útil:
1. Prendas visibles (tipo, color, tejido aparente, fit/entalle)
2. Paleta de colores dominante
3. Mood o atmósfera general (formal, casual, aspiracional, etc.)
4. Ocasión de uso implícita
5. Público objetivo que transmite
6. Cualquier texto, precio o descuento visible
Sé específico y conciso. Esta descripción alimentará un generador de copys publicitarios.`
              },
              {
                inline_data: {
                  mime_type: mimeType || 'image/jpeg',
                  data: imageBase64,
                },
              },
            ],
          }],
        }),
      }
    )

    const data = await geminiRes.json()
    const description = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return new Response(JSON.stringify({ description }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
