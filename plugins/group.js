
const handler = async (hydro, m, { text, command, participants, isGroup, isGroupAdmins, isBotAdmins }) => {
    if (!isGroup) return m.reply(global.mess.only.group);
    if (!isGroupAdmins) return m.reply(global.mess.only.admin);
    if (!isBotAdmins) return m.reply(global.mess.only.badmin);

    if (command === 'hidetag') {
        hydro.sendMessage(m.chat, { text: text || '', mentions: participants.map(a => a.id) }, { quoted: m });
    }
};

handler.tags = ['group'];
handler.command = ['hidetag'];
handler.who = 'group';

module.exports = handler;
