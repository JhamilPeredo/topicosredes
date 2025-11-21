const axios = require('axios');
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function postToWhatsApp(content) {
  try {
    await axios.post(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp",
      to: "68806306",
      type: "text",
      text: { body: content.text }
    }, {
      headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` }
    });
  } catch (err) {
    console.error('Error posting to WhatsApp:', err.response?.data || err.message);
  }
}

module.exports = { postToWhatsApp };
