const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { WillClient } = require('willclient');
const wc = new PSClient({ client: client, prefix: "." });

const config = require('./config.json');

wc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

wc.command( {name: "join"}, async (ctx, cmd) => {
    let channel = await wc.voice.fetch(ctx.author, ctx.guild)
    
    wc.voice.join(channel);
    
    ctx.reply(`Joined ${channel.name}!`);
});

wc.command( {name: "leave"}, async (ctx, cmd) => {
    let channel = await wc.voice.fetch(client.user, ctx.guild)
    
    wc.voice.leave(channel);
    
    ctx.reply(`Left ${channel.name}!`);
});

wc.command( {name: "lock"}, async (ctx, cmd) => {
    let channel = wc.fetchChannel(cmd.args[0]); // channel given in the message either with id or with #channel
    
    wc.voice.lock(channel); // mutes and deafens everyone in the voice channel
    
    ctx.reply(`Locked ${channel.name}!`);
});

wc.command( {name: "unlock"}, async (ctx, cmd) => {
    let channel = wc.fetchChannel(cmd.args[0]);
    
    wc.voice.unlock(channel); // mutes and deafens everyone in the voice channel
    
    ctx.reply(`Unlocked ${channel.name}!`);
});

client.login(config.token);
