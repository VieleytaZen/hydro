
require('./settings');
const { modul } = require('./lib/module');
const { runtime, formatp } = require('./lib/function');
const { downloadContentFromMessage } = require('socketon');
const util = require('util');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');

const { baileys, os, speed, moment } = modul;
const { proto } = baileys;

const plugins = {};

// Load Plugins
const loadPlugins = () => {
    const pluginDir = path.join(__dirname, 'plugins');
    const pluginFiles = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));
    for (let file of pluginFiles) {
        const pluginPath = path.join(pluginDir, file);
        delete require.cache[require.resolve(pluginPath)];
        plugins[file] = require(pluginPath);
    }
    console.log(chalk.green(`Loaded ${Object.keys(plugins).length} plugins`));
};

loadPlugins();

module.exports = hydro = async (hydro, m, chatUpdate, store) => {
    try {
        if (!m || !m.message) return;

        // Mini Serializer
        m.chat = m.key.remoteJid || '';
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = m.key.fromMe ? (hydro.user.id.split(':')[0] + '@s.whatsapp.net' || hydro.user.id) : (m.key.participant || m.key.remoteJid || '');
        m.pushName = m.pushName || "User";
        m.mtype = Object.keys(m.message)[0];
        if (m.mtype === 'ephemeralMessage' || m.mtype === 'viewOnceMessage') {
            m.message = m.message[m.mtype].message;
            m.mtype = Object.keys(m.message)[0];
        }

        const msgHelper = require('./lib/src/message')(hydro, m, chatUpdate, store);
        m = msgHelper.m;
        const reply = msgHelper.reply;

        const type = m.mtype;
        let body = (m.mtype === 'conversation') ? m.message.conversation : 
             (m.mtype === 'imageMessage') ? m.message.imageMessage?.caption : 
             (m.mtype === 'videoMessage') ? m.message.videoMessage?.caption : 
             (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage?.text : 
             (m.mtype === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage?.selectedButtonId : 
             (m.mtype === 'listResponseMessage') ? m.message.listResponseMessage?.singleSelectReply?.selectedRowId : 
             (m.mtype === 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage?.selectedId : 
             m.text || '';

        body = (typeof body === 'string') ? body : '';
        const prefix = global.prefix ? (Array.isArray(global.prefix) ? (global.prefix.slice().sort((a, b) => b.length - a.length).find(p => body.startsWith(p)) || global.prefix[0]) : global.prefix) : "";
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase() : "";
        const args = body.trim().split(/ +/).slice(1);
        const text = args.join(" ");
        const pushname = m.pushName;
        const botNumber = await hydro.decodeJid(hydro.user.id);
        const isOwner = [...(global.owner || []), global.ownernomer, global.botnumber]
            .map(v => v ? v.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : '')
            .includes(m.sender);

        const groupMetadata = m.isGroup ? store.groupMetadata[m.chat] || (store.groupMetadata[m.chat] = await hydro.groupMetadata(m.chat).catch(e => {})) : '';
        const participants = m.isGroup ? await groupMetadata.participants : [];
        const groupAdmins = m.isGroup ? participants.filter((v) => v.admin !== null).map((i) => i.jid || i.id) : [];
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
        const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;

        // Logging
        if (m.message && !m.key.fromMe) {
            console.log(chalk.blue(`[ ${new Date().toLocaleTimeString()} ]`), chalk.green(command || 'Chat'), 'from', chalk.yellow(pushname), 'in', chalk.cyan(m.isGroup ? 'Group' : 'Private'));
        }

        // Special command: Menu
        if (command === 'menu' || command === 'help') {
            let menuText = `Halo ${pushname}! 👋\n\nSelamat datang di *${global.botname}*\n\n`;
            const tags = {};
            for (let file in plugins) {
                const plugin = plugins[file];
                if (plugin.tags) {
                    for (let tag of plugin.tags) {
                        if (!tags[tag]) tags[tag] = [];
                        tags[tag].push(...plugin.command);
                    }
                }
            }

            for (let tag in tags) {
                menuText += `*── [ ${tag.toUpperCase()} ] ──*\n`;
                menuText += [...new Set(tags[tag])].map(cmd => `│ ◦ ${prefix}${cmd}`).join('\n') + '\n\n';
            }
            
            menuText += `Power by OpenRouter AI`;

            return hydro.sendMessage(m.chat, {
                text: menuText,
                contextInfo: {
                    externalAdReply: {
                        title: global.botname,
                        body: 'Viel AI Assistance',
                        thumbnailUrl: 'https://viel.web.id/logo.png',
                        sourceUrl: global.ownerweb,
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });
        }

        // Sticker logic (moved here for convenience or keep in plugins)
        if (['sticker', 's', 'stiker'].includes(command)) {
            const isQuotedMedia = type === 'extendedTextMessage' && m.message.extendedTextMessage.contextInfo?.quotedMessage;
            const targetMessage = isQuotedMedia ? m.message.extendedTextMessage.contextInfo.quotedMessage : m.message;
            const targetType = Object.keys(targetMessage)[0];
            
            if (!['imageMessage', 'videoMessage', 'stickerMessage'].includes(targetType)) {
                return reply(`Kirim atau balas gambar/video/gif dengan caption ${prefix + command}`);
            }

            const mediaObj = targetMessage[targetType];
            const stream = await downloadContentFromMessage(mediaObj, targetType.replace('Message', ''));
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            let pack = text.split('|')[0] || global.packname;
            let auth = text.split('|')[1] || global.author;
            return await hydro.sendAsSticker(m.chat, buffer, m, { packname: pack, author: auth });
        }

        // Execute Plugins
        const pluginContext = { text, command, prefix, isCmd, isOwner, participants, isGroup: m.isGroup, isGroupAdmins, isBotAdmins, pushname };
        for (let file in plugins) {
            const plugin = plugins[file];
            try {
                // If it's a command, only run if command matches
                if (isCmd && plugin.command && plugin.command.includes(command)) {
                    await plugin(hydro, m, pluginContext);
                    return; // Stop after first match for commands
                }
                // If not a command (like AI auto chat), run anyway
                if (!isCmd) {
                    await plugin(hydro, m, pluginContext);
                }
            } catch (e) {
                console.error(`Error in plugin ${file}:`, e);
            }
        }

    } catch (err) {
        console.log(util.format(err));
    }
};

// Auto Reload Plugins
fs.watch(path.join(__dirname, 'plugins'), (event, filename) => {
    if (filename && filename.endsWith('.js')) {
        console.log(chalk.redBright(`[ UPDATE ] Plugin '${filename}' changed`));
        loadPlugins();
    }
});
