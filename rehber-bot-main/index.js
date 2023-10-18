const { Client, Collection, MessageEmbed } = require('discord.js');
const axios = require('axios');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

const fs = require('fs');
const client = new Client({ 
    intents: [
      'GUILDS',
      'GUILD_MESSAGES',
      'GUILD_MEMBERS'
    ] 
});
const discordModals = require('discord-modals');
discordModals(client);
client.events = new Collection();
client.commands = new Collection();
client.config = require('./config.json');

fs.readdir('./cmds/', async (err, files) => {
    if (err) throw new Error(err);
    files.forEach(async (dosya) => {
        var cmd = require(`./cmds/${dosya}`);
        client.commands.set(cmd.name, cmd);
    });
});

fs.readdir('./events/', async (err, files) => {
    if (err) throw new Error(err);
    files.forEach(async (dosya) => {
        var event = require(`./events/${dosya}`);
        client.events.set(event.name, event);
    });
});

const prefix = client.config.prefix;
client.on('messageCreate', async (message) => {
    client.events.get('messageCreate').execute(client, message, prefix)
});
client.on('ready', async () => client.events.get('ready').execute(client));


client.on('interactionCreate', async (i) => {
  if (!i.isButton()) return;
  if (i.customId == "kural") {
    var embed = new MessageEmbed()
    .setColor("#2F3136")
    .setDescription(`
・Discord Topluluk Kuralları'na (https://discord.com/terms) uyun.

・Cinsel içerikler veya +18 içerikler paylaşmayınız. 

・Ölüm, yaralama ve zarar verici konuları bulundurmayın. 

・Yalan haberleri yayıp yanlış bilgiler vermeyiniz.

・Dil, din, ırk ayrımı yapmayınız ve değerlere küfür etmeyiniz.
`)  



.setImage("https://media.discordapp.net/attachments/962450064721203272/965962082027716649/kurallar.png?width=1440&height=258")


    
    i.reply({ephemeral: true, embeds: [embed] });
  
  } else if (i.customId == "support") {
    i.message.guild.channels.create(i.user.username, {
      type: "GUILD_TEXT",
      parent: "1156680934435860604",
      reason: "DESTEK TALEBİ!",
      permissionOverwrites: [
        {
          id: i.message.guild.id,
          deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"]
        },
        {
          id: i.user.id,
          allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "SEND_MESSAGES"]
        }
      ]
    }).then(async (chan) => {
      chan.send(`:sunglasses: **${i.user.tag}** destek talebinde bulundu.`);
    });
}  else if (i.customId == "tur") {
    var channel1 = "1156680934435860601"
    var channel2 = "1156680935392157871"
    var channel3 = "1156680935912255552"
    var channel4 = "1156680935912255555" // textleri kendiniz ayarlayabilirsiniz ayrıca 10000 olan silme süresinide arttırıp azaltabilirsiniz.
   i.reply({ephemeral: true, content: `Tur başlıyor ${i.user.username} lütfen bekle... :hourglass: ` })
    i.guild.channels.cache.get(channel1).send({ content: `<@${i.user.id}> bu kanal etkinlik kanalıdır, 1 davet 100k owo gibi etkinliklerden faydalanabilirsin. :kissing_closed_eyes: `, ephemeral: true }).then((msg)=> {
  setTimeout(function(){
    msg.delete()
  }, 10000)
}); 
 i.guild.channels.cache.get(channel2).send({ content: `<@${i.user.id}> bu kanal çekiliş kanalıdır, efsane çekilişlere sende katılabilirsin! <a:ghost_tadas:1159537971071033556>`, ephemeral: true }).then((msg1)=> {
  setTimeout(function(){
    msg1.delete()
  }, 10000)
}); 
 i.guild.channels.cache.get(channel3).send({ content: `<@${i.user.id}> bu kanal güvenilirlik kanalıdır, bize güvenmiyorsan bu kanala göz atabilirsin. (umarım bizi seversin) <:ghost_kalpcik:1162475700243152936>`, ephemeral: true }).then((msg2)=> {
  setTimeout(function(){
    msg2.delete()
  }, 10000)
}); 
i.guild.channels.cache.get(channel4).send({ content: `<@${i.user.id}> bu kanal sohbet kanalıdır, Eğlenerek sohbet edebilirsin iyi eğlenceler. :lizard:`, ephemeral: true }).then((msg2)=> {
  setTimeout(function(){
    msg2.delete()
  }, 10000)
}); 
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.customId == "suggest") {
    const modal = new Modal()
      .setCustomId('suggest-menu')
      .setTitle('Öneri/İstek Menüsü')
      .addComponents(
        new TextInputComponent()
        .setCustomId('suggested')
        .setLabel('İsteğinizi belirtin.')
        .setStyle('SHORT')
        .setMinLength(5)
        .setMaxLength(100)
        .setPlaceholder('Ex: Sunucuda yeni oyun kanalları açılsın.')
        .setRequired(true),
      );
      showModal(modal, { client, interaction });
    }
  })
      
client.on('modalSubmit', async (modal) => {
  if(modal.customId === 'suggest-menu') {
    const firstResponse = modal.getTextInputValue('suggested'); //elleme
    modal.reply({
      content: `:tada: Atmış olduğun istek/öneri yetkililere iletildi teşekkürler **${modal.user.username}!**`,
      ephemeral: true
    });
    const channel = modal.guild.channels.cache.get('1156680935392157869');
    const msz = await channel.send({
      content: `> <a:ghost_ates:1156683462917496862> Yeni Bir İstek Belirdi: **${firstResponse}** \n\n> <a:ghost_sagok:1156683563266211860> İsteğini Belirten Üye: **${modal.user.tag}**`
    });
    client.on('interactionCreate', async (inter) => client.__use(modal, inter, channel.id, msz.id));
  }  
});



client.login(client.config.token);
