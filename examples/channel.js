const { Client } = require('discord.js');
const discordClient = new Client({ /* your stuff here */ });

const { PSClient } = require('discord.ps');
const client = new PSClient({ client: discordClient, prefix: "." });

const config = require('./config.json');


client.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

client.command( {name: "purge"}, async (ctx, cmd) => {
    let amount = parseInt(cmd.args[0]);
    
    client.channel.purge(amount, ctx.channel); // channel is optional and defautls to ctx.channel
    
    client.channel.send(`Purged ${amount} messages!`);
});

client.command( {name: "lock", aliases: ["lockdown"]}, async (ctx, cmd) => {
    let channel = (cmd.args.length > 0) ? client.fetchChannel(cmd.args[0]) : ctx.channel;
    
    client.channel.lock(channel);
    
    client.channel.send(`Locked ${channel.name}!`);
});

client.command( {name: "unlock", aliases: ["unlockdown"]}, async (ctx, cmd) => {
    let channel = (cmd.args.length > 0) ? client.fetchChannel(cmd.args[0]) : ctx.channel;
    
    client.channel.unlock(channel);
    
    client.channel.send(`Unlocked ${channel.name}!`);
});

client.login(config.token);
