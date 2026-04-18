
const { runtime } = require('../lib/function');
const { getGeminiCLIResponse } = require('../lib/gemini-cli');

const handler = async (hydro, m, { text, command, prefix, isCmd, isOwner }) => {
    // Ping Command
    if (command === 'ping' || command === 'statusbot') {
        const timestamp = m.messageTimestamp ? (typeof m.messageTimestamp === 'number' ? m.messageTimestamp : m.messageTimestamp.low) : (Date.now() / 1000);
        const latensi = Date.now() - (timestamp * 1000);
        return m.reply(`*Ping:* ${latensi.toFixed(0)} ms\n*Runtime:* ${runtime(process.uptime())}`);
    }

    // Button Example
    if (command === 'button') {
        const buttons = [
            { buttonId: `${prefix}ping`, buttonText: { displayText: 'Ping' }, type: 1 },
            { buttonId: `${prefix}owner`, buttonText: { displayText: 'Owner' }, type: 1 }
        ];
        const buttonMessage = {
            text: "Ini adalah contoh tombol",
            footer: global.botname,
            buttons: buttons,
            headerType: 1
        };
        return hydro.sendMessage(m.chat, buttonMessage, { quoted: m });
    }

    // AI Auto Chat
    if ((command === 'ai' || !isCmd) && !m.key.fromMe) {
        const isGroup = m.isGroup;
        const chat = m.chat;
        const body = text || m.text || m.caption || '';
        
        if (!body && command === 'ai') return m.reply("Mau nanya apa sama Hydro AI? (｡•̀ᴗ-)");
        if (!body) return;

        let shouldReply = false;
        if (command === 'ai') {
            shouldReply = true;
        } else if (!isGroup) {
            shouldReply = true;
        } else {
            const botNumber = hydro.user.id.split(':')[0] + '@s.whatsapp.net';
            const isTagged = m.mentionedJid && m.mentionedJid.includes(botNumber);
            const isReply = m.quoted && m.quoted.sender === botNumber;
            if (isTagged || isReply) shouldReply = true;
        }

        if (shouldReply) {
            try {
                // Send typing indicator
                await hydro.sendPresenceUpdate('composing', chat);

                const response = await getGeminiCLIResponse(body);
                return m.reply(response);
            } catch (e) {
                console.error("Gemini CLI Error:", e);
                if (command === 'ai') m.reply("*Error:* Gagal mendapatkan respon dari Gemini CLI Web Service.");
            }
        }
    }
};

handler.tags = ['main', 'ai'];
handler.command = ['ping', 'statusbot', 'ai', 'button'];
handler.who = 'all';

module.exports = handler;
