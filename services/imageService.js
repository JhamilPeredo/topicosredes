/*const fs = require('fs');
const path = require('path');
const { getNgrokUrl } = require('./ngrokService');
require('dotenv').config();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateImage(prompt) {
  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: prompt,
    size: "1024x1024",
    n: 1
  });

  const base64Data = response.data[0].b64_json;

  const fileName = `image_${Date.now()}.png`;
  const filePath = path.join(__dirname, '../public', fileName);
  fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

  // Obtener automáticamente la URL pública de ngrok
  const ngrokUrl = await getNgrokUrl();
  const baseUrl = ngrokUrl || `http://localhost:3001`; // fallback si ngrok no está corriendo

  const imageUrl = `${baseUrl}/public/${fileName}`;
  console.log("URL generada por OpenAI:", imageUrl);

  return imageUrl;
}

module.exports = { generateImage };*/

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { getNgrokUrl } = require('./ngrokService');
require('dotenv').config();

async function generateImage(prompt) {
  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "png");
    formData.append("width", 1024);
    formData.append("height", 1024);

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          ...formData.getHeaders()
        }
      }
    );

    // La API devuelve la imagen en base64
    const base64Data = response.data.image;

    const fileName = `image_${Date.now()}.png`;
    const filePath = path.join(__dirname, '../public', fileName);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    // Obtener automáticamente la URL pública de ngrok
    const ngrokUrl = await getNgrokUrl();
    const baseUrl = ngrokUrl || `http://localhost:3001`;

    const imageUrl = `${baseUrl}/public/${fileName}`;
    console.log("URL generada por Stability AI:", imageUrl);

    return imageUrl;
  } catch (err) {
    console.error("Error generando imagen con Stability AI:", err.response?.data || err.message);
    throw new Error("No se pudo generar la imagen");
  }
}

module.exports = { generateImage };