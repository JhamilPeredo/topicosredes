import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

async function sendWhatsAppMessage() {
  try {
    const response = await fetch("https://gate.whapi.cloud/messages/text", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.WHAPI_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: "59172668722",
        body: "Mensaje de prueba desde Node.js usando Whapi 🚀"
      })
    });

    const data = await response.json();
    console.log("📨 Respuesta:", data);

  } catch (error) {
    console.error("❌ Error en el envío:", error);
  }
}

sendWhatsAppMessage();
