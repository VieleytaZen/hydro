
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { systemPrompt } = require("./instructions");

const chatHistory = new Map();

/**
 * Get response from Gemini
 * @param {string} sessionId - Unique session ID for history
 * @param {string} prompt - User message
 * @param {string} apiKey - Google Gemini API Key
 * @returns {Promise<string>}
 */
async function getGeminiResponse(sessionId, prompt, apiKey) {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            systemInstruction: systemPrompt
        });

        if (!chatHistory.has(sessionId)) {
            chatHistory.set(sessionId, []);
        }

        const history = chatHistory.get(sessionId);
        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        // Update local history for next turn
        // The SDK manages history inside the 'chat' instance, but we need to persist it
        chatHistory.set(sessionId, await chat.getHistory());
        
        // Keep history manageable
        if (chatHistory.get(sessionId).length > 20) {
            chatHistory.get(sessionId).splice(0, 2);
        }

        return text;
    } catch (error) {
        console.error("Gemini Error:", error);
        throw error;
    }
}

module.exports = { getGeminiResponse };
