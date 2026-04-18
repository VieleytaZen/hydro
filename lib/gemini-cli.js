
const axios = require('axios');
const { systemPrompt } = require('./instructions');

/**
 * Get response from Gemini Web Services (Multiple Fallbacks)
 * @param {string} prompt - User message
 * @returns {Promise<string>}
 */
async function getGeminiCLIResponse(prompt) {
    // List of reliable public AI APIs
    const apis = [
        {
            url: `https://api.vreden.web.id/api/gemini?query=${encodeURIComponent(prompt)}&system=${encodeURIComponent(systemPrompt)}`,
            method: 'GET',
            parse: (res) => res.data.result || res.data.message
        },
        {
            url: `https://bk9.fun/ai/gemini?q=${encodeURIComponent(prompt)}`,
            method: 'GET',
            parse: (res) => res.data.BK9 || res.data.result
        },
        {
            url: `https://api.agatz.xyz/api/gemini?message=${encodeURIComponent(prompt)}`,
            method: 'GET',
            parse: (res) => res.data.data || res.data.result
        }
    ];

    for (const api of apis) {
        try {
            console.log(`[DEBUG] Trying AI API: ${api.url.split('?')[0]}`);
            const response = await axios({
                method: api.method,
                url: api.url,
                timeout: 15000 // 15 seconds timeout
            });
            
            const result = api.parse(response);
            if (result) return result;
        } catch (error) {
            console.error(`[DEBUG] API Failed: ${api.url.split('?')[0]} - ${error.message}`);
            continue; // Try next API
        }
    }

    throw new Error("All Gemini Web Services failed to respond.");
}

module.exports = { getGeminiCLIResponse };
