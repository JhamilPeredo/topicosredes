require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateContent } = require('./services/llmService');
const { generateImage } = require('./services/imageService');

const { postToFacebook } = require('./services/networks/facebook');
const { postToInstagram } = require('./services/networks/instagram');
const { postToLinkedIn } = require('./services/networks/linkedin');
const { postToTikTok } = require('./services/networks/tiktok');
const { postToWhatsApp } = require('./services/networks/whatsapp');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generar', async (req, res) => {
  const { titulo, contenido, target_networks } = req.body;
  const results = {};

  try {
    for (let network of target_networks) {
      const content = await generateContent(titulo, contenido, network);

      // Generar imagen solo para las redes que usan imágenes
      if (network !== 'tiktok') {
        const prompt = content.suggested_image_prompt || `${titulo} ${contenido}`;
        content.image_url = await generateImage(prompt);
      }

      // Publicar en la red correspondiente
      if (network === 'facebook') await postToFacebook(content);
      if (network === 'instagram') await postToInstagram(content);
      if (network === 'linkedin') await postToLinkedIn(content);
      if (network === 'tiktok') await postToTikTok(content);
      if (network === 'whatsapp') await postToWhatsApp(content);

      results[network] = content;
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Social Publisher API running on port ${process.env.PORT || 3001}`);
});
