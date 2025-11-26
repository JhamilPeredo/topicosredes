/*require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const qs = require('querystring'); // para TikTok

// Servicios de contenido e imagen
const { generateContent } = require('./services/llmService');
const { generateImage } = require('./services/imageService');

// Servicios de publicación en redes
const { postToFacebook } = require('./services/networks/facebook');
const { postToInstagram } = require('./services/networks/instagram');
const { postToLinkedIn } = require('./services/networks/linkedin');
const { postToTikTok } = require('./services/networks/tiktok');
const { postToWhatsApp } = require('./services/networks/whatsapp');

const app = express();
app.use(cors());
app.use(express.json());

// Carpeta de videos públicos
const VIDEOS_FOLDER = path.join(__dirname, 'public/videos');
if (!fs.existsSync(VIDEOS_FOLDER)) fs.mkdirSync(VIDEOS_FOLDER);

// Servir archivos públicos
app.use('/public', express.static(path.join(__dirname, 'public')));

// ---------------- TikTok OAuth Sandbox ----------------
app.get('/auth/tiktok/callback', async (req, res) => {
  const { code } = req.query;
  console.log('Code recibido de TikTok:', code);

  if (!code) return res.status(400).send('No se recibió el code de TikTok');

  try {
    const resp = await axios.post(
      'https://sandbox.tiktokapis.com/v2/oauth/token',
      qs.stringify({
        client_key: process.env.CLIENT_KEY,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token } = resp.data.data;

    console.log('✅ Access Token (Sandbox):', access_token);
    console.log('✅ Refresh Token (Sandbox):', refresh_token);

    res.send('¡Autorización de Sandbox completada! Revisa la consola para los tokens.');
  } catch (err) {
    console.error('❌ Error intercambiando el code:', err.response?.data || err.message);
    res.status(500).send('Error al obtener el token de TikTok');
  }
});

// ---------------- Endpoint principal ----------------
app.post('/generar', async (req, res) => {
  const { titulo, contenido, target_networks } = req.body;
  const results = {};

  try {
    for (let network of target_networks) {
      // Generar contenido usando LLM seguro
      const content = await generateContent(titulo, contenido, network);

      // Generar imagen si la red la requiere
      if (network !== 'tiktok') {
        const prompt = content.suggested_image_prompt || `${titulo} ${contenido}`;
        content.image_url = await generateImage(prompt);
      }

      // Publicar en cada red
      switch (network) {
        case 'facebook':
          await postToFacebook(content);
          break;
        case 'instagram':
          await postToInstagram(content);
          break;
        case 'linkedin':
          await postToLinkedIn(content);
          break;
        case 'tiktok':
          if (!content.videoPath) {
            console.warn('⚠️ No se proporcionó videoPath para TikTok, saltando publicación');
          } else {
            await postToTikTok(content);
          }
          break;
        case 'whatsapp':
          // ✅ Usa endpoint /status correcto
          await postToWhatsApp(content);
          break;
      }

      results[network] = content;
    }

    res.json(results);
  } catch (err) {
    console.error('❌ Error en /generar:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Iniciar servidor ----------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Social Publisher API corriendo en puerto ${PORT}`);
});
*/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const qs = require('querystring'); // para TikTok

// Servicios de contenido e imagen
const { generateContent } = require('./services/llmService');
const { generateImage } = require('./services/imageService');

// Servicios de publicación en redes
const { postToFacebook } = require('./services/networks/facebook');
const { postToInstagram } = require('./services/networks/instagram');
const { postToLinkedIn } = require('./services/networks/linkedin');
const { postToTikTok } = require('./services/networks/tiktok');
const { postToWhatsApp } = require('./services/networks/whatsapp');

const app = express();
app.use(cors());
app.use(express.json());

// Carpeta de videos públicos
const VIDEOS_FOLDER = path.join(__dirname, 'public/videos');
if (!fs.existsSync(VIDEOS_FOLDER)) fs.mkdirSync(VIDEOS_FOLDER);

// Servir archivos públicos
app.use('/public', express.static(path.join(__dirname, 'public')));

// ---------------- TikTok OAuth Sandbox ----------------
app.get('/auth/tiktok/callback', async (req, res) => {
  const { code } = req.query;
  console.log('Code recibido de TikTok:', code);

  if (!code) return res.status(400).send('No se recibió el code de TikTok');

  try {
    const resp = await axios.post(
      'https://sandbox.tiktokapis.com/v2/oauth/token',
      qs.stringify({
        client_key: process.env.CLIENT_KEY,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token } = resp.data.data;

    console.log('✅ Access Token (Sandbox):', access_token);
    console.log('✅ Refresh Token (Sandbox):', refresh_token);

    res.send('¡Autorización de Sandbox completada! Revisa la consola para los tokens.');
  } catch (err) {
    console.error('❌ Error intercambiando el code:', err.response?.data || err.message);
    res.status(500).send('Error al obtener el token de TikTok');
  }
});

// ---------------- Endpoint principal ----------------
app.post('/generar', async (req, res) => {
  const { titulo, contenido, target_networks } = req.body;
  const results = {};

  try {
    for (let network of target_networks) {
      // Generar contenido usando LLM seguro
      const content = await generateContent(titulo, contenido, network);

      // Generar imagen si la red la requiere
      if (network !== 'tiktok') {
        const prompt = content.suggested_image_prompt || `${titulo} ${contenido}`;
        // content.image_url = await generateImage(prompt);
      }

      // Publicar en cada red
      switch (network) {
        case 'facebook':
          await postToFacebook(content);
          break;
        case 'instagram':
          await postToInstagram(content);
          break;
        case 'linkedin':
          await postToLinkedIn(content);
          break;
        case 'tiktok':
          if (!content.videoPath) {
            console.warn('⚠️ No se proporcionó videoPath para TikTok, saltando publicación');
          } else {
            await postToTikTok(content);
          }
          break;
        case 'whatsapp':
          // ✅ Usa endpoint /status correcto
          await postToWhatsApp(content);
          break;
      }

      results[network] = content;
    }

    res.json(results);
  } catch (err) {
    console.error('❌ Error en /generar:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Iniciar servidor ----------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Social Publisher API corriendo en puerto ${PORT}`);
});
