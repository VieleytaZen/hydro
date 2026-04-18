
const axios = require('axios');
const { systemPrompt } = require('./instructions');

/**
 * Get response from Gemini CLI Web Service
 * @param {string} prompt - User message
 * @returns {Promise<string>}
 */
async function getGeminiCLIResponse(prompt) {
    try {
        // We use a public web-based endpoint that provides Gemini responses
        // This mimics the 'cli' behavior of fetching from a web source
        const response = await axios.post('https://api.paxsenix.biz.id/ai/gemini', {
            text: prompt,
            system: systemPrompt
        });

        if (response.data && response.data.status && response.data.message) {
            return response.data.message;
        } else if (response.data && response.data.result) {
            return response.data.result;
        } else {
            throw new Error("Invalid response format from Gemini Web Service");
        }
    } catch (error) {
        console.error("Gemini CLI Web Error:", error.message);
        // Fallback to another web provider if the first one fails
        try {
            const fallback = await axios.get(`https://bk9.fun/ai/gemini?q=${encodeURIComponent(prompt)}`);
            return fallback.data.BK9 || fallback.data.result;
        } catch (e) {
            throw new Error("All Gemini Web Services failed.");
        }
    }
}

module.exports = { getGeminiCLIResponse };
