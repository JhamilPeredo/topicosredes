require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateContent } = require('./services/llmService');
const { generateImage } = require('./services/imageService');
const { postToFacebookInstagram, postToLinkedIn, postToTikTok, postToWhatsApp } = require('./services/socialApis');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generar', async (req, res) => {
    const { titulo, contenido, target_networks } = req.body;
    try {
        const results = {};

        for (let network of target_networks) {
            const content = await generateContent(titulo, contenido, network);

            // Generar imagen
            if (network !== 'tiktok') {
                const prompt = content.suggested_image_prompt || `${titulo} ${contenido}`;
                const imageUrl = await generateImage(prompt);
                content.image_url = imageUrl;
            }

            results[network] = content;
        }

        // Publicar en redes
        if (target_networks.includes('facebook') || target_networks.includes('instagram')) {
            await postToFacebookInstagram(results.facebook, results.instagram);
        }
        if (target_networks.includes('linkedin')) {
            await postToLinkedIn(results.linkedin);
        }
        if (target_networks.includes('tiktok')) {
            await postToTikTok(results.tiktok);
        }
        if (target_networks.includes('whatsapp')) {
            await postToWhatsApp(results.whatsapp);
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
