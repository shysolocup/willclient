const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { PSClient } = require('discord.ps');
const psc = new PSClient({ client: client, prefix: "." });

const config = require('./config.json');

psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "join"}, async (ctx, cmd) => {
    let channel = psc.fetchChannel("id");
    
    psc.voice.join(channel);
    
    ctx.reply(`Joined ${channel.name}!`);
});

psc.command( {name: "leave"}, async (ctx, cmd) => {
    let channel = psc.fetchChannel("id");
    
    psc.voice.leave(channel);
    
    ctx.reply(`Left ${channel.name}!`);
});

psc.command( {name: "lock"}, async (ctx, cmd) => {
    let channel = psc.fetchChannel(cmd.args[0]); // channel given in the message either with id or with #channel
    
    psc.voice.lock(channel); // mutes and deafens everyone in the voice channel
    
    ctx.reply(`Locked ${channel.name}!`);
});

psc.command( {name: "unlock"}, async (ctx, cmd) => {
    let channel = psc.fetchChannel(cmd.args[0]);
    
    psc.voice.unlock(channel); // mutes and deafens everyone in the voice channel
    
    ctx.reply(`Unlocked ${channel.name}!`);
});

client.login(config.token);
