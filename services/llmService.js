// services/llmService.js
require('dotenv').config(); // carga el .env primero
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Genera contenido adaptado a la red social usando LLM
 * @param {string} titulo - Título de la publicación
 * @param {string} contenido - Contenido principal
 * @param {string} network - Red social (facebook, instagram, linkedin, tiktok, whatsapp)
 * @returns {object} JSON con campos adaptados a la red social
 */
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
    // Limpiar la respuesta por si LLM devuelve ```json ... ```
    let contentStr = response.choices[0].message.content.trim();
    contentStr = contentStr.replace(/^```json/, '').replace(/```$/, '').trim();

    return JSON.parse(contentStr);
  } catch (err) {
    throw new Error(
      "Error parsing JSON from LLM: " + response.choices[0].message.content
    );
  }
}

module.exports = { generateContent };
