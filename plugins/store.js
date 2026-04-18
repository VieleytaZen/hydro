
const handler = async (hydro, m, { text, command, prefix }) => {
    if (command === 'listproduk' || command === 'store') {
        const response = `
Daftar Produk Hydro Store:
1. Panel Run Bot
2. Sewa Bot
3. Jadi Owner Bot

Gunakan ${prefix}order <nomor> untuk memesan.
`.trim();
        return m.reply(response);
    }
};

handler.tags = ['store'];
handler.command = ['store', 'listproduk', 'order'];
handler.who = 'all';

module.exports = handler;
