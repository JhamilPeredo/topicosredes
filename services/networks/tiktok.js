const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getNgrokUrl } = require('../ngrokService'); // ngrok helper
require('dotenv').config();

const VIDEOS_FOLDER = path.join(__dirname, '../../public/videos');
if (!fs.existsSync(VIDEOS_FOLDER)) fs.mkdirSync(VIDEOS_FOLDER);

async function postToTikTok(content) {
  try {
    if (!content.videoPath) throw new Error("No se proporcionó videoPath para TikTok");

    // Guardar video en /public/videos
    const videoBuffer = fs.readFileSync(content.videoPath);
    const fileName = `video_${Date.now()}.mp4`;
    const filePath = path.join(VIDEOS_FOLDER, fileName);
    fs.writeFileSync(filePath, videoBuffer);

    // Obtener URL pública mediante ngrok o localhost
    const ngrokUrl = await getNgrokUrl();
    const baseUrl = ngrokUrl || `http://localhost:${process.env.PORT || 3001}`;
    //const videoUrl = `${baseUrl}/public/videos/${fileName}`;
    const videoUrl = `${process.env.NGROK_URL}/public/videos/${fileName}`;

    // Payload para TikTok
    const payload = {
      post_info: {
        title: content.titulo || "Video",
        description: content.text || "",
        disable_comment: false,
        privacy_level: "SELF_ONLY",
        auto_add_music: true
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: videoUrl
      },
      post_mode: "DIRECT_POST",
      media_type: "VIDEO"
    };

    const headers = {
      Authorization: `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    };

    const resp = await axios.post(
      "https://open.tiktokapis.com/v2/post/publish/content/init/",
      payload,
      { headers }
    );

    console.log("Video subido a TikTok:", resp.data);
    return resp.data;

  } catch (err) {
    console.error("Error publicando en TikTok:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { postToTikTok };
