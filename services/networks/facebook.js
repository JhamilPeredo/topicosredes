const axios = require('axios');
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

async function postToFacebook(content) {
  try {
    const message = content.hashtags?.length > 0
      ? `${content.text}\n\n${content.hashtags.join(" ")}`
      : content.text;

    if (content.image_url) {
      const resp = await axios.post(
        `https://graph.facebook.com/v24.0/${FACEBOOK_PAGE_ID}/photos`,
        {
          url: content.image_url,
          caption: message,
          access_token: FACEBOOK_ACCESS_TOKEN
        }
      );
      console.log("Imagen publicada en Facebook correctamente:", resp.data);
    } else {
      const resp = await axios.post(
        `https://graph.facebook.com/v24.0/${FACEBOOK_PAGE_ID}/feed`,
        {
          message: message,
          access_token: FACEBOOK_ACCESS_TOKEN
        }
      );
      console.log("Texto publicado en Facebook correctamente:", resp.data);
    }
  } catch (err) {
    console.error("Error posting to Facebook:", err.response?.data || err.message);
  }
}

module.exports = { postToFacebook };