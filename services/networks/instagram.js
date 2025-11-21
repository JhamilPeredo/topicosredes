const axios = require('axios');
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

async function postToInstagram(content) {
  try {
    const mediaResp = await axios.post(`https://graph.facebook.com/v17.0/${INSTAGRAM_USER_ID}/media`, {
      image_url: content.image_url,
      caption: content.text,
      access_token: INSTAGRAM_ACCESS_TOKEN
    });

    const creationId = mediaResp.data.id;

    await axios.post(`https://graph.facebook.com/v17.0/${INSTAGRAM_USER_ID}/media_publish`, {
      creation_id: creationId,
      access_token: INSTAGRAM_ACCESS_TOKEN
    });
  } catch (err) {
    console.error('Error posting to Instagram:', err.response?.data || err.message);
  }
}

module.exports = { postToInstagram };
