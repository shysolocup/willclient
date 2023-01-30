const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "join"}, async (ctx, cmd) => {
    let channel = client.fetchChannel("id");
    
    client.voice.join(channel);
    
    client.reply(`Joined ${channel.name}!`);
});

client.command( {name: "leave"}, async (ctx, cmd) => {
    let channel = client.fetchChannel("id");
    
    client.voice.leave(channel);
    
    client.reply(`Left ${channel.name}!`);
});

client.command( {name: "lock"}, async (ctx, cmd) => {
    let channel = client.fetchChannel(cmd.args[0]); // channel given in the message either with id or with #channel
    
    client.voice.lock(channel); // mutes and deafens everyone in the voice channel
    
    client.reply(`Locked ${channel.name}!`);
});

client.command( {name: "unlock"}, async (ctx, cmd) => {
    let channel = client.fetchChannel(cmd.args[0]);
    
    client.voice.unlock(channel); // mutes and deafens everyone in the voice channel
    
    client.reply(`Unlocked ${channel.name}!`);
});

client.login(config.token);
