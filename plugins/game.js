
const handler = async (hydro, m, { text, command, prefix }) => {
    if (command === 'tebakangka') {
        const angka = Math.floor(Math.random() * 10) + 1;
        m.reply('Aku sudah memikirkan angka dari 1 sampai 10. Coba tebak!');
        // Sederhana saja untuk sekarang
    }
};

handler.tags = ['game'];
handler.command = ['tebakangka'];
handler.who = 'all';

module.exports = handler;
