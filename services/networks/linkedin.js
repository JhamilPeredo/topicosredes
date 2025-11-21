const axios = require('axios');
const LINKEDIN_ORG_ID = process.env.LINKEDIN_ORG_ID;
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

async function postToLinkedIn(content) {
  try {
    await axios.post('https://api.linkedin.com/v2/ugcPosts', {
      author: `urn:li:organization:${LINKEDIN_ORG_ID}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content.text },
          shareMediaCategory: "IMAGE",
          media: content.image_url ? [
            {
              status: 'READY',
              description: { text: content.text },
              media: content.image_url,
              title: { text: 'Post' }
            }
          ] : []
        }
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
    }, {
      headers: { Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}` }
    });
  } catch (err) {
    console.error('Error posting to LinkedIn:', err.response?.data || err.message);
  }
}

module.exports = { postToLinkedIn };
