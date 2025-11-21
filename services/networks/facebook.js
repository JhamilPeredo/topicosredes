const axios = require('axios');
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

async function postToFacebook(content) {
  try {
    await axios.post(`https://graph.facebook.com/${FACEBOOK_PAGE_ID}/feed`, {
      message: content.text,
      link: content.image_url,
      access_token: FACEBOOK_ACCESS_TOKEN
    });
  } catch (err) {
    console.error('Error posting to Facebook:', err.response?.data || err.message);
  }
}

module.exports = { postToFacebook };
