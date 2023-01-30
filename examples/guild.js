const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "membercount"}, async (ctx, cmd) => {
    client.reply(`${client.guild.memberCount}`);
});

client.command( {name: "rolecount"}, async (ctx, cmd) => {
    client.reply(`${client.guild.roleCount}`);
});

client.command( {name: "channelcount"}, async (ctx, cmd) => {
    client.reply(`${client.guild.channelCount}`);
});

client.command( {name: "emojicount"}, async (ctx, cmd) => {
    client.reply(`${client.guild.emojiCount}`);
});

client.command( {name: "stickercount"}, async (ctx, cmd) => {
    client.reply(`${client.guild.stickerCount}`);
});

client.command( {name: "members"}, async (ctx, cmd) => {
    client.guild.members( (members) => {
        members.forEach( (member) => {
            console.log(member.tag);
        });
    });
});

client.command( {name: "roles"}, async (ctx, cmd) => {
    client.guild.roles( (roles) => {
        roles.forEach( (role) => {
            console.log(role.name);
        });
    });
});

client.command( {name: "channels"}, async (ctx, cmd) => {
    client.guild.channels( (channels) => {
        channels.forEach( (channel) => {
            console.log(channel.name);
        });
    });
});

client.command( {name: "emojis"}, async (ctx, cmd) => {
    client.guild.emojis( (emojis) => {
        emojis.forEach( (emoji) => {
            console.log(emoji.name);
        });
    });
});

client.command( {name: "stickers"}, async (ctx, cmd) => {
    client.guild.stickers( (stickers) => {
        stickers.forEach( (sticker) => {
            console.log(sticker.name);
        });
    });
});


client.login(config.token);
