require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateContent(titulo, contenido, network) {
  const prompt = `
Red social: ${network}
Título: "${titulo}"
Contenido: "${contenido}"

Genera un JSON con los siguientes campos:
- text: texto adaptado al estilo de la red
- hashtags: array de hashtags relevantes
- character_count: cantidad de caracteres (devuelve un número, NO palabras)
- suggested_image_prompt: solo para Facebook, Instagram, LinkedIn, WhatsApp
- video_hook: solo para TikTok, una frase llamativa de apertura

⚠️ Devuelve solo JSON válido. NO uses palabras para números.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400
  });

  try {
    let contentStr = response.choices[0].message.content.trim();
    contentStr = contentStr.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(contentStr);
  } catch (err) {
    throw new Error("Error parsing JSON from LLM: " + response.choices[0].message.content);
  }
}

module.exports = { generateContent };
