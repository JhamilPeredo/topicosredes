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

  return response.data[0].url;
}

module.exports = { generateImage };
