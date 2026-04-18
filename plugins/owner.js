
const util = require('util');
const { exec } = require('child_process');

const handler = async (hydro, m, { text, command, prefix, isCmd, isOwner }) => {
    if (!isOwner) return m.reply(global.mess.only.owner);

    if (command === 'eval' || (m.text && m.text.startsWith('>'))) {
        let code = m.text && m.text.startsWith('>') ? m.text.slice(1) : text;
        try {
            let evaled = await eval(code);
            if (typeof evaled !== 'string') evaled = util.inspect(evaled);
            return m.reply(evaled);
        } catch (e) {
            return m.reply(util.format(e));
        }
    }

    if (command === 'shell' || (m.text && m.text.startsWith('$'))) {
        let code = m.text && m.text.startsWith('$') ? m.text.slice(1) : text;
        exec(code, (err, stdout) => {
            if (err) return m.reply(err.toString());
            if (stdout) return m.reply(stdout);
        });
    }
};

handler.tags = ['owner'];
handler.command = ['eval', 'shell'];
handler.who = 'owner';

module.exports = handler;
