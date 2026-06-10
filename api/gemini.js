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
    const { imageBase64, mimeType, systemPrompt, brandLabel, subbrand, objectiveLabel, brief, isNT, isTrafico, hasWhatsApp } = body

    const geminiKey = process.env.GEMINI_API_KEY
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY no configurada' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const subbrandContext = subbrand ? `\nSUBMARCA ACTIVA: ${subbrand}` : ''

    const jsonSchema = `{
  "texto_primario": ["variante 1", "variante 2", "variante 3"],
  "titular": ["variante 1", "variante 2", "variante 3"],
  "descripcion": ["variante 1", "variante 2"]${!isNT ? `,
  "cta": ["variante 1", "variante 2", "variante 3"]` : ''}${isTrafico && hasWhatsApp ? `,
  "whatsapp_bienvenida": "mensaje de bienvenida de la empresa",
  "whatsapp_predefinido": "mensaje predefinido del usuario"` : ''},
  "hashtags": "string con todos los hashtags al final"
}`

    const textPrompt = `${systemPrompt}

---

Genera copys para Meta Ads${isNT ? ' y LinkedIn' : ''} con los siguientes datos:

MARCA: ${brandLabel}${subbrandContext}
OBJETIVO: ${objectiveLabel}
${brief ? `BRIEF ADICIONAL:\n${brief}` : ''}
${imageBase64 ? 'Se adjunta el creativo publicitario. Analiza las prendas, colores, mood, ocasión de uso y público objetivo que transmite la imagen para enriquecer los copys.' : ''}

Responde ÚNICAMENTE con un JSON válido, sin texto adicional, sin markdown, sin bloques de código. Solo el JSON:
${jsonSchema}

REGLAS CRÍTICAS:
- Las primeras 125 caracteres del texto_primario deben contener el gancho + info clave antes del "ver más"
${!isNT ? '- Máximo 2 emojis por copy (solo los aprobados por la marca)' : '- SIN emojis. SIN CTA.'}
- CTA máximo 3 palabras, sin puntuación
- Hashtags relevantes a la campaña al final
- Respetar estrictamente el tono y vocabulario de la marca`

    const parts = []
    if (imageBase64) {
      parts.push({ inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } })
    }
    parts.push({ text: textPrompt })

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
        }),
      }
    )

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}))
      throw new Error(errData?.error?.message || `Gemini error ${geminiRes.status}`)
    }

    const data = await geminiRes.json()
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const clean = rawText.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return new Response(JSON.stringify({ result: parsed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
