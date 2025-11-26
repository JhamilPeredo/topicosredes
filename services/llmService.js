require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,   // Token de Groq
  baseURL: "https://api.groq.com/openai/v1"
});

async function generateContent(titulo, contenido, network) {
  const prompt = `
Red social: ${network}
Título: "${titulo}"
Contenido: "${contenido}"

Genera SOLO un JSON válido con los siguientes campos:
- text: texto adaptado al estilo de la red
- hashtags: array de hashtags relevantes
- character_count: cantidad de caracteres (número entero)
- suggested_image_prompt: escribe SIEMPRE en inglés, incluso si el título y contenido están en español
- video_hook: solo para TikTok

⚠️ Devuelve ÚNICAMENTE JSON válido.
No incluyas notas, explicaciones, advertencias ni texto antes o después del JSON.
`;

  const response = await openai.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400
  });

  try {
    let contentStr = response.choices[0].message.content.trim();

    // 1. Eliminar cualquier bloque de código tipo ```json ... ```
    contentStr = contentStr
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2. Extraer solo el JSON entre llaves, aunque haya texto extra
    const match = contentStr.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No se encontró JSON válido en la respuesta del modelo.");
    }

    const cleanJson = match[0];

    // 3. Parsear JSON limpio
    return JSON.parse(cleanJson);

  } catch (err) {
    console.error("❌ Error parseando JSON:", err);
    console.error("➡️ Respuesta completa del modelo:", response.choices[0].message.content);
    throw new Error("Error parsing JSON from LLM: " + err.message);
  }
}

module.exports = { generateContent };
