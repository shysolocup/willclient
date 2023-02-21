const { Client } = require('discord.js');
const client = new Client({ /* your stuff here */ });
const { PSClient } = require('discord.ps');
const psc = new PSClient({ client: client, prefix: "." });

const config = require('./config.json');

psc.event("ready", (ctx) => {
    console.log(`Logged in as ${ctx.user.tag}`);
});

/* commands */

psc.command( {name: "purge"}, async (ctx, cmd) => {
    let amount = parseInt(cmd.args[0]);
    
    if (psc.user.hasPermissions(["manageMessages"]) {
        psc.channel.purge(amount, ctx.channel); // channel is optional and defautls to ctx.channel
    
        ctx.channel.send(`Purged ${amount} messages!`);
    }
});

psc.command( {name: "lock", aliases: ["lockdown"]}, async (ctx, cmd) => {
    let channel = (cmd.args.length > 0) ? psc.fetchChannel(cmd.args[0]) : ctx.channel;
    
    if (psc.user.hasPermissions(["manageChannels"]) {
        psc.channel.lock(channel);
    
        ctx.channel.send(`Locked ${channel.name}!`);
    }
});

psc.command( {name: "unlock", aliases: ["unlockdown"]}, async (ctx, cmd) => {
    let channel = (cmd.args.length > 0) ? psc.fetchChannel(cmd.args[0]) : ctx.channel;
    
    if (psc.user.hasPermissions(["manageMessages"]) {
        psc.channel.unlock(channel);
    
        ctx.channel.send(`Unlocked ${channel.name}!`);
});

client.login(config.token);
