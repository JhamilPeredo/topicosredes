const axios = require('axios');

// Facebook & Instagram
const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

// LinkedIn
const LINKEDIN_ORG_ID = process.env.LINKEDIN_ORG_ID;
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

// TikTok
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN;

// WhatsApp
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// === Facebook & Instagram ===
async function postToFacebookInstagram(facebookContent, instagramContent) {
    try {
        if (facebookContent) {
            await axios.post(`https://graph.facebook.com/${FACEBOOK_PAGE_ID}/feed`, {
                message: facebookContent.text,
                link: facebookContent.image_url,
                access_token: FACEBOOK_ACCESS_TOKEN
            });
        }
        if (instagramContent) {
            const mediaResp = await axios.post(`https://graph.facebook.com/v17.0/${INSTAGRAM_USER_ID}/media`, {
                image_url: instagramContent.image_url,
                caption: instagramContent.text,
                access_token: INSTAGRAM_ACCESS_TOKEN
            });
            const creationId = mediaResp.data.id;
            await axios.post(`https://graph.facebook.com/v17.0/${INSTAGRAM_USER_ID}/media_publish`, {
                creation_id: creationId,
                access_token: INSTAGRAM_ACCESS_TOKEN
            });
        }
    } catch (err) {
        console.error('Error posting to Facebook/Instagram:', err.response?.data || err.message);
    }
}

// === LinkedIn ===
async function postToLinkedIn(linkedinContent) {
    try {
        await axios.post('https://api.linkedin.com/v2/ugcPosts', {
            author: `urn:li:organization:${LINKEDIN_ORG_ID}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: { text: linkedinContent.text },
                    shareMediaCategory: "IMAGE",
                    media: linkedinContent.image_url ? [
                        {
                            status: 'READY',
                            description: { text: linkedinContent.text },
                            media: linkedinContent.image_url,
                            title: { text: 'Post' }
                        }
                    ] : []
                }
            },
            visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
        }, { headers: { Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}` } });
    } catch (err) {
        console.error('Error posting to LinkedIn:', err.response?.data || err.message);
    }
}


async function postToTikTok(tiktokContent) {
    try {
        
        console.log('TikTok post placeholder:', tiktokContent.text, tiktokContent.video_hook);
    } catch (err) {
        console.error('Error posting to TikTok:', err.response?.data || err.message);
    }
}


async function postToWhatsApp(whatsappContent) {
    try {
        await axios.post(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
            messaging_product: "whatsapp",
            to: "NUMERO_DEL_DESTINATARIO", // poner el numero real 
            type: "text",
            text: { body: whatsappContent.text }
        }, {
            headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}` }
        });
    } catch (err) {
        console.error('Error posting to WhatsApp:', err.response?.data || err.message);
    }
}

module.exports = { postToFacebookInstagram, postToLinkedIn, postToTikTok, postToWhatsApp };
