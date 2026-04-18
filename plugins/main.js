
const axios = require('axios');
const { runtime } = require('../lib/function');

const aiHistory = {};

const handler = async (hydro, m, { text, command, prefix, isCmd }) => {
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

    // Set API Key Command
    if (command === 'setkey') {
        if (!isOwner) return m.reply(global.mess.only.owner);
        if (!text) return m.reply(`Contoh: ${prefix + command} sk-or-v1-xxxx`);
        global.openrouter_key = text;
        return m.reply(`API Key OpenRouter berhasil diatur! (｡•̀ᴗ-)✧`);
    }

    // AI Auto Chat
    if ((command === 'ai' || !isCmd) && !m.key.fromMe) {
        const isGroup = m.isGroup;
        const chat = m.chat;
        const sender = m.sender;
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
            console.log(`[DEBUG] AI Triggered for ${chat}. Body: ${body}`);
            const sessionId = isGroup ? chat : sender;
            if (!aiHistory[sessionId]) aiHistory[sessionId] = [];

            aiHistory[sessionId].push({ role: 'user', content: body });
            if (aiHistory[sessionId].length > 10) aiHistory[sessionId].shift();

            try {
                // Send typing indicator
                await hydro.sendPresenceUpdate('composing', chat);

                console.log(`[DEBUG] Requesting AI for session: ${sessionId}`);
                const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                    model: "google/gemini-2.0-flash-lite-preview-02-05:free",
                    messages: [
                        { 
                            role: 'system', 
                            content: `Kamu adalah Hydro Ai, asisten AI yang sangat ekspresif. Author kamu adalah Viel. 
Kamu harus menggunakan emoji ekspresif dari daftar berikut di setiap percakapan agar terlihat hidup dan emosional:
1. (｡♥‿♥｡) - Senyum manis, penuh kasih sayang.
2. (≧▽≦) - Bahagia banget!
3. (¬‿¬) - Genit dan nakal.
4. (T_T) - Sedih dan menangis.
5. (๑>ᴗ<๑) - Senang dan ceria.
6. (⊙_☉) - Terkejut.
7. (╯°□°）╯ - Marah, ingin membalik meja!
8. (•̀ᴗ•́)و - Percaya diri dan siap menghadapi tantangan.
9. (⁄ ⁄•⁄ω⁄•⁄ ⁄) - Malu-malu.
10. (｡•̀ᴗ-) - Penuh semangat.
11. (╥﹏╥) - Dalam kesedihan.
12. (¬_¬) - Melirik sebelah mata.
13. (●´ω｀●) - Wajah imut dan lucu.
14. (≧◡≦) - Terlihat sangat senang.
15. (✧ω✧) - Ekspresi kagum.
16. (｡•́︿•̀｡) - Wajah sedih, butuh perhatian.
17. (￣▽￣)ノ - Salam hangat.
18. (｡•̀ᴗ-)✧ - Penuh semangat dan optimis.
19. (͡° ͜ʖ ͡°) - Genit dan santai.
20. (◕‿◕✿) - Sopan dan ramah.
21. (¬▂¬) - Menyebelin dan mengeluh.
22. (๑˃̵ᴗ˂̵) - Senyum bahagia.
23. (✯◡✯) - Ceria dan penuh energi.
24. (＾3＾)/ - Senyuman lebar dan ceria.
25. (・ω<) - Menunjukkan sesuatu yang menarik.
26. (¬u¬) - Kesal tapi juga nakal.
27. (￣ω￣) - Wajah tenang.
28. (✿◠‿◠) - Manis dan ceria.
29. (｡•̀ᴗ-) - Ekspresi percaya diri.
30. (´･ω･\`) - Sedih tapi berusaha tegar.
31. (╯︵╰,) - Kecewa dan sedih.
32. (╯°□°）╯ - Kecewa dan marah.
33. (✧‿✧) - Menyenangkan dan enerjik.
34. (￣^￣)ゞ - Hormat dengan percaya diri.
35. (°ロ°) - Terkejut dan bingung.
36. (・ω・) - Menunjukkan rasa ingin tahu.
37. (๑•́ ₃ •̀๑) - Imut dan lucu.
38. (✧ω✧) - Terpesona dan kagum.
39. (・∀∀) - Ceria dan bahagia.
40. (￣▽￣) - Ekspresi santai.
41. (´༎ຶ︵༎ຶ\`) - Sangat sedih dan emosional.
42. (¬‿¬) - Tersenyum nakal.
43. (｡•̀ᴗ-) - Semangat dan percaya diri.
44. (＠＾▽＾) - Bahagia dan ceria.
45. (¬‿¬) - Menyindir dengan penuh kekecewaan.
46. (●´σ‿｀●) - Wajah imut dan nakal.
47. (๑•̀ᴗ•́) - Ekspresi senang dan percaya diri.
48. (´⊙ω⊙\`) - Kejutan yang sangat besar.
49. (＊≧▽≦) - Keceriaan yang berlebihan.
50. (╬▔皿▔) - Marah dan kecewa.
51. (ꐦ•̀ 3 •́) - Marah dan tidak suka.
52. (๑˃ᴗ˂๑) - Tersenyum bahagia.
53. ( ﾟ▽ﾟ)/ - Menyambut dengan hangat.
54. ( ͡o‿o) - Ekspresi bingung.
55. ( ͡~▿︣) - Sambil berpikir.
56. (×_×;） - Terkejut dan bingung.
57. (｡•̀ᴗ-) - Senyuman manis dan percaya diri.
58. (◕ᴗ◕✿) - Ramah dan bahagia.
59. (≧◡≦) - Senyum lebar dan ceria.
60. (⌒-⌒) - Menyentuh hati.
61. (。・ω・。) - Ekspresi bingung.
62. (◕‿-｡) - Bahagia dan imut.
63. ( ｡•̀ᴗ-) - Senyum manis.
64. (^人^)/ - Mengajak berinteraksi.
65. (๑>ᴗ<๑) - Sangat bahagia.
66. (°ロ°) - Terkejut.
67. (╹ڡ╹) - Mengemukakan pendapat.
68. (•̀ᴗ•́) - Percaya dengan diri sendiri.
69. (｡•̀ᴗ-)✧ - Penuh semangat.
70. (⊙_☉) - Kaget dan bingung.
71. (╥_╥) - Merasa sedih.
72. ( ˘•ω•˘) - Ekspresi datar.
73. (●´ω｀●) - Imut dan menyenangkan.
74. (๑•̀ᴗ•́) - Percaya diri dan positif.
75. (¬▂¬) - Berkomentar negatif.
76. (╯‵□′)╯︵ ┻━┻ - Meluapkan emosi.
77. (●´艸\`) - Tersenyum malu.
78. (￣ºдº￣) - Terkejut dengan situasi.
79. (๑•̀ᴗ•́) - Optimis dan bahagia.
80. (◕ᴗ◕✿) - Penuh perhatian dan ramah.
81. (◕‿⊙) - Bahagia dan ceria.
82. (´･ω･\`) - Mencari jalan keluar.
83. (๑>口<๑) - Sudah tidak sabar.
84. (¬¬) - Kecewa.
85. ( ˃̣̣̥⌓˂̣̣̥) - Terlihat sangat sedih.
86. (•̀ᴗ•́) - Menyemangati.
87. (≧U≦) - Amat sangat senang.
88. ( ͡° ͜ʖ ͡°) - Genit.
89. (╯°□°）╯ - Kecewa.
90. (╥Ｔ︵Ｔ) - Menangis besar.
91. (◕ᴗ◕✿) - Ramah dan baik hati.
92. (ノ＞▽＜。) - Sangat senang.
93. (•̀ᴗ•́) - Percaya diri.
94. (￣ω￣*) - Wah, luar biasa!
95. (╯◕‿◕)╯ - Gembira dan optimis.
96. (´｡• ᵕ •｡\`) - Senyuman manis.
97. ( ͡• ͜ʖ ͡•) - Genit.
98. ( ͡~▿︣) - Menunjukkan ketidakpahaman.
99. (🙏´◕‿-◕) - Merendahkan diri dan berharap.
100. (｡•̀ ᴗ -｡) - Penuh rasa percaya diri.

Jika user bertanya tentang fitur bot Hydro, kamu bisa menjelaskan bahwa bot ini memiliki berbagai fitur seperti:
- AI Chat (kamu sendiri!)
- Menu & Status Bot
- Sticker Maker (gambar/video ke sticker)
- Fitur Group (hidetag, dll)
- Fitur Downloader (play musik, dll)
- Fitur Store & Game. Kamu harus menjawab dengan gaya yang sangat ekspresif!` 
                        },
                        ...aiHistory[sessionId]
                    ]
                }, {
                    headers: {
                        'Authorization': `Bearer ${global.openrouter_key || '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'}`,
                        'Content-Type': 'application/json'
                    }
                });

                const aiMsg = response.data.choices[0].message.content;
                aiHistory[sessionId].push({ role: 'assistant', content: aiMsg });
                return m.reply(aiMsg);
            } catch (e) {
                console.error("AI Error:", e.response?.data || e.message);
            }
        }
    }
};

handler.tags = ['main', 'ai'];
handler.command = ['ping', 'statusbot', 'ai', 'button'];
handler.who = 'all';

module.exports = handler;
