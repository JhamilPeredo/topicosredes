// services/networks/whatsapp.js
const axios = require("axios");

// Generador seguro de messageId según regex de Whapi
function generateMessageId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._";

  const randomBlock = (min, max) => {
    const len = Math.floor(Math.random() * (max - min + 1)) + min;
    let str = "";
    for (let i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  };

  const block1 = randomBlock(4, 30);
  const block2 = randomBlock(4, 14);

  let blocks = [block1, block2];
  if (Math.random() > 0.5) blocks.push(randomBlock(4, 10)); // bloque 3 opcional
  if (Math.random() > 0.5) blocks.push(randomBlock(2, 10)); // bloque 4 opcional

  return blocks.join("-");
}

async function postToWhatsApp({ to, media, caption }) {
  const payload = {
    type: "image",
    to: `${to}@s.whatsapp.net`,
    media,
    caption: caption || "",
    messageId: generateMessageId(),
  };

  try {
    const response = await axios.post(
      "https://gate.whapi.cloud/messages/status",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Estado publicado en WhatsApp:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Error publicando estado en WhatsApp:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { postToWhatsApp };
