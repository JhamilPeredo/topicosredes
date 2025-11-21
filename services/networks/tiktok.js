const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

async function postToTikTok(content) {
  try {
    const form = new FormData();
    form.append('video', fs.createReadStream(content.videoPath)); // ruta al video .mp4
    form.append('text', content.text);

    const response = await axios.post(
      'https://open-api.tiktok.com/share/video/upload/',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    console.log('Video subido a TikTok:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error publicando en TikTok:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { postToTikTok };
