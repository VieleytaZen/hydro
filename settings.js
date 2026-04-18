const chalk = require("chalk")
const fs = require("fs")

// ======================== Setting Menu & Media ===================== \\

global.prefix = ['','!','.','#','&']

// ======================== Info Owner ===================== \\
global.ownername = 'Viel'
global.owner = ['6285161444491']
global.ownernomer = '6285161444491'
global.ownernumber = '6285161444491'
global.ownerNumber = ["6285161444491@s.whatsapp.net"]
global.creator = "6285161444491@s.whatsapp.net"
global.ig = '@vieleyta_zen'
global.tele = 'viel'
global.ttowner = '@viel'
global.socialm = 'GitHub: -'
global.location = 'Indonesia' 
global.ownerweb = "https://viel.web.id"

// ======================== Info Bot ===================== \\
global.botname = "Hydro-MD"
global.botnumber = '6283867608750'
global.websitex = "https://viel.web.id"
global.wagc = "https://chat.whatsapp.com/FvSBEz1UezQ4G7Xwfrr9sF"
global.saluran = "https://whatsapp.com/channel/0029VbAYRBf4o7qSa74h2m0t"
global.themeemoji = '🏞️'
global.wm = "Hydro-MD ||| WhatsApps Bots"
global.botscript = 'https://viel.web.id'
global.packname = "HYDRO"
global.author = "Viel"
global.sessionName = 'furina'
global.hituet = 0

// ======================== API Keys ===================== \\
global.nz = [
    'nz-e98e71fd41',
    'nz-f0ccb09fe1',
    'nz-d7f75016a2',
    'nz-97bf45bd87',
    'nz-4ce5fb3be3'
]
global.frch = [
    "29015f61cbaa2b36f26bcd61c0b087c0421e4f8f16c67809d4b67091863bf483",
    "3b00b2f1d5201dee96ed46eca909ef4be8abdbad1bc876fe6384bc42256ed24f"
] 
// ======================== Respon Bot ===================== \\
global.mess = {
   wait: "*_Tunggu Sebentar.. Bot lagi berenang... 🏊_*",
   success: "Yay! Bot berhasil 🎉",
   on: "Yay! Nyala nih! 😝",
   off: "Ahh! Mati deh.. 😴",
   query: {
       text: "Teksnya mana? Aku kan gabisa baca pikiran kaka 😉",
       link: "Linknya dongg.. Aku gabisa tanpa link 😖",
       image: "Gambarnya mana nih? jahat banget engga ngasi:<",
   },
   error: {
       fitur: "Whoops! Eror nih.. laporkan ke owner agar diperbaiki 6285187063723 🙏",
   },
   only: {
       group: "Eh, Kak! Fitur ini bisanya buat grup nihh 🫂",
       private: "Eh, Kak! Fitur ini cuman bisa dipake chat pribadi! 🌚",
       owner: "Hanya untuk sang *Raja* 👑",
       admin: "Fitur ini cuman bisa dipake admin grup yah! 🥳",
       badmin: "Waduh! Aku butuh jadi admin agar bisa menggunakan fitur ini 🤯",
       premium: "Kak, ini fitur premium loh! Biar bisa jadi premium beli di 6285187063723 agar bisa menggunakan fitur ini 🤫",
   }
}

// ======================== Auto Reload File ===================== \\
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update '${__filename}'`))
	delete require.cache[file]
	require(file)
})
