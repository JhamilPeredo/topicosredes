const axios = require('axios');

async function getNgrokUrl() {
  try {
    const res = await axios.get('http://127.0.0.1:4040/api/tunnels');
    const tunnels = res.data.tunnels;
    const httpsTunnel = tunnels.find(t => t.proto === 'https');
    return httpsTunnel?.public_url || null;
  } catch (err) {
    console.error("Error obteniendo URL de ngrok:", err.message);
    return null;
  }
}

module.exports = { getNgrokUrl };